import logging
import requests
import datetime
import math
from typing import Tuple

logger = logging.getLogger("ml-engine.predictor")

PROMETHEUS_URL = "http://prometheus-k8s.monitoring.svc.cluster.local:9090"

def fetch_prometheus_data(query: str, days: int = 30) -> list:
    """
    Fetch historical metric data from Prometheus via HTTP API.
    Uses a range query over the specified number of days with a 1-hour step.
    """
    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(days=days)
    
    # 1h step to avoid overwhelming the prometheus server over 30 days
    step = "1h"
    
    url = f"{PROMETHEUS_URL}/api/v1/query_range"
    params = {
        "query": query,
        "start": start_time.timestamp(),
        "end": end_time.timestamp(),
        "step": step
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") != "success":
            raise ValueError(f"Prometheus query failed: {data.get('error')}")
            
        return data.get("data", {}).get("result", [])
    except requests.RequestException as e:
        logger.error(f"Failed to fetch data from Prometheus: {e}")
        # Raising exception triggers the 500 error, activating Go K8s Operator fallback policy
        raise RuntimeError(f"Prometheus connection error: {e}")

def process_time_series(values: list) -> Tuple[float, float, float, bool]:
    """
    Processes the raw time series to calculate:
    - Mean
    - Standard Deviation 
    - Exponential Moving Average (EMA) to capture recent trends / daily seasonality
    - Anomaly Detection via 3-sigma rule
    """
    if not values:
        return 0.0, 0.0, 0.0, False
        
    float_values = [float(v[1]) for v in values]
    n = len(float_values)
    
    # Statistical Baseline
    mean = sum(float_values) / n
    variance = sum((x - mean) ** 2 for x in float_values) / n
    std_dev = math.sqrt(variance)
    
    # Calculate simple EMA over the timeseries to emphasize recency
    ema = float_values[0]
    alpha = 0.2
    for val in float_values[1:]:
        ema = alpha * val + (1 - alpha) * ema
        
    # Anomaly detection (3-sigma rule) based on the latest value
    latest_value = float_values[-1]
    anomaly_detected = False
    
    # Check if the latest value spikes higher than 3 standard deviations from the mean
    if std_dev > 0 and (latest_value - mean) > (3 * std_dev):
        anomaly_detected = True
        
    return mean, std_dev, ema, anomaly_detected

def predict_replicas(promql_query: str, metric_type: str, current_replicas: int) -> Tuple[int, float, bool]:
    """
    Core prediction logic.
    Returns: (recommended_replicas, predicted_threshold, anomaly_detected)
    """
    logger.info(f"Fetching {metric_type} metric for 30 days using query: {promql_query}")
    results = fetch_prometheus_data(promql_query, days=30)
    
    if not results:
        logger.warning("No data returned from Prometheus. Keeping current replicas.")
        return current_replicas, 0.0, False
        
    # Assume the query aggregates to a single series block
    series = results[0]
    values = series.get("values", [])
    
    if not values:
        logger.warning("No data points in the timeseries. Keeping current replicas.")
        return current_replicas, 0.0, False
        
    mean, std_dev, ema, anomaly_detected = process_time_series(values)
    
    # Our predicted threshold combines the EMA to track the current curve 
    # plus 1 standard deviation for a buffer zone. 
    predicted_threshold = ema + std_dev
    
    recommended_replicas = current_replicas
    
    if anomaly_detected:
        logger.warning("Anomaly (Spike > 3-sigma) detected! Recommending significant scale-up to absorb shock.")
        # E.g., For DDoS/spike scenarios, we multiply the current running workload by 1.5x instantly
        recommended_replicas = max(int(current_replicas * 1.5), current_replicas + 1)
    else:
        # Standard intelligent scaling logic:
        # If our predicted load requires more capacity, we scale up by 1.
        if predicted_threshold > (mean * 1.15):
            recommended_replicas += 1
        # If our predicted load is significantly lower than average, cautiously scale down.
        elif predicted_threshold < (mean * 0.85) and current_replicas > 1:
            recommended_replicas -= 1
            
    logger.info(f"Analytics | Mean: {mean:.2f}, StdDev: {std_dev:.2f}, EMA: {ema:.2f}, Latest Val: {float(values[-1][1]):.2f}")
    logger.info(f"Verdict | Replicas: {recommended_replicas}, PredictedThreshold: {predicted_threshold:.2f}, Anomaly: {anomaly_detected}")
    
    return recommended_replicas, predicted_threshold, anomaly_detected
