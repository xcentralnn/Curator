import time
import os
import math
import random
import numpy as np
from prometheus_api_client import PrometheusConnect

from typing import Tuple, Optional, Any

def calculate_threshold(query: str, server_address: str, target_namespace: str = "", ml_config: Optional[Any] = None) -> Tuple[float, bool]:
    """
    Connects to Prometheus, fetches historical data, or generates mock data if DEV_MODE is true.
    Returns (predicted_threshold, anomaly_detected).
    """
    training_window_days = ml_config.trainingWindowDays if ml_config and hasattr(ml_config, 'trainingWindowDays') else 30
    anomaly_sensitivity = getattr(ml_config.anomalyDetection, 'sensitivity', 1.15) if ml_config and hasattr(ml_config, 'anomalyDetection') else 1.15
    
    try:
        anomaly_detected = False
        if os.environ.get("DEV_MODE") == "true":
            # Generate mock data (step=1h) based on trainingWindowDays
            end_time = int(time.time())
            start_time = end_time - (training_window_days * 24 * 60 * 60)
            
            all_values = []
            for ts in range(start_time, end_time + 1, 3600):
                # Simulate daily seasonality: Peak at 14:00 (2 PM) local time roughly
                hour_of_day = (ts // 3600) % 24
                # shift peak to 14:00
                shifted_hour = (hour_of_day - 14) % 24
                # cosine goes from 1 at peak to -1 at trough (at 2 AM)
                seasonality = (math.cos(shifted_hour * math.pi / 12) + 1) / 2
                base_traffic = 50 + seasonality * 50
                noise = random.uniform(-10, 10)
                traffic = max(0, base_traffic + noise)
                
                # Check for DDoS attack in the last 15 minutes (or last 1 hour since step=1h)
                if target_namespace == "auth-service" and (end_time - ts) <= 3600:
                    anomaly_enabled = getattr(ml_config.anomalyDetection, 'enabled', True) if ml_config and hasattr(ml_config, 'anomalyDetection') else True
                    if anomaly_enabled:
                        traffic += random.uniform(500, 1000)
                        anomaly_detected = True
                    
                all_values.append(traffic)
        else:
            prom = PrometheusConnect(url=server_address, disable_ssl=True)
            
            # data in steps of 1 hour to prevent overwhelming the server
            end_time = time.time()
            start_time = end_time - (training_window_days * 24 * 60 * 60)
            
            # We query the prometheus range
            metric_data = prom.custom_query_range(
                query=query,
                start_time=start_time,
                end_time=end_time,
                step="1h"
            )
            
            if not metric_data:
                raise ValueError(f"No data returned from Prometheus for the given query over the last {training_window_days} days.")
                
            all_values = []
            for result in metric_data:
                values = result.get('values', [])
                for val in values:
                    # val is [timestamp, value_string]
                    all_values.append(float(val[1]))
                    
        if not all_values:
            raise ValueError("No historical values found.")
            
        # Calculate the 95th percentile
        p95 = np.percentile(all_values, 95)
        
        # Add safety buffer (sensitivity multiplier)
        predicted_threshold = p95 * anomaly_sensitivity
        
        return round(predicted_threshold, 2), anomaly_detected
        
    except Exception as e:
        if ml_config and hasattr(ml_config, 'accuracyBoundaries') and getattr(ml_config.accuracyBoundaries, 'fallbackOnFailure', False):
            static_threshold = getattr(ml_config.accuracyBoundaries, 'staticFallbackThreshold', "0")
            try:
                return float(static_threshold), False
            except ValueError:
                pass
        raise RuntimeError(f"Failed to calculate threshold from Prometheus: {e}")
