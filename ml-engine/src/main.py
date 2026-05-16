import logging
import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from models.predictor import predict_replicas

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ml-engine")

app = FastAPI(title="Curator ML Engine")

class PredictRequest(BaseModel):
    promql_query: Optional[str] = None
    promQLQuery: Optional[str] = None
    metric_type: Optional[str] = None
    metricType: Optional[str] = None
    current_replicas: Optional[int] = None
    currentReplicas: Optional[int] = None

class PredictResponse(BaseModel):
    # Output both formats to strictly satisfy the prompt requirements 
    # while maintaining compatibility with the Go controller's json unmarshaling.
    recommended_replicas: int
    predicted_threshold: float
    anomaly_detected: bool
    recommendedReplicas: int
    predictedThreshold: float
    anomalyDetected: bool

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {process_time:.4f}s")
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(f"Method: {request.method} Path: {request.url.path} Error: {str(e)} Duration: {process_time:.4f}s")
        raise e

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

@app.post("/predict", response_model=PredictResponse)
async def predict_endpoint(request: PredictRequest):
    # Support both snake_case and camelCase payloads safely
    query = request.promql_query or request.promQLQuery
    m_type = request.metric_type or request.metricType
    replicas = request.current_replicas if request.current_replicas is not None else request.currentReplicas
    
    if query is None or m_type is None or replicas is None:
        raise HTTPException(status_code=400, detail="Missing required parameters: promql_query, metric_type, current_replicas")

    logger.info(f"Received prediction request for metricType: {m_type}, currentReplicas: {replicas}")
    try:
        recommended_replicas, predicted_threshold, anomaly_detected = predict_replicas(
            promql_query=query,
            metric_type=m_type,
            current_replicas=replicas
        )
        return PredictResponse(
            recommended_replicas=recommended_replicas,
            recommendedReplicas=recommended_replicas,
            predicted_threshold=predicted_threshold,
            predictedThreshold=predicted_threshold,
            anomaly_detected=anomaly_detected,
            anomalyDetected=anomaly_detected
        )
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
