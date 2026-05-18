import uvicorn
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models.predictor import calculate_threshold

app = FastAPI(title="Curator ML Engine")

class AccuracyBoundaries(BaseModel):
    targetMAPE: float
    fallbackOnFailure: bool
    staticFallbackThreshold: str

class AnomalyDetection(BaseModel):
    enabled: bool
    algorithm: str
    sensitivity: float

class MLConfig(BaseModel):
    strategy: str
    trainingWindowDays: int
    retrainIntervalHours: int
    accuracyBoundaries: AccuracyBoundaries
    anomalyDetection: AnomalyDetection

class AnalyzeRequest(BaseModel):
    query: str
    serverAddress: str
    targetNamespace: Optional[str] = None
    mlConfig: Optional[MLConfig] = None

class AnalyzeResponse(BaseModel):
    predicted_threshold: str
    anomaly_detected: bool = False

@app.post("/analyze-threshold", response_model=AnalyzeResponse)
async def analyze_threshold(req: AnalyzeRequest):
    try:
        threshold, anomaly_detected = calculate_threshold(
            query=req.query, 
            server_address=req.serverAddress, 
            target_namespace=req.targetNamespace or "", 
            ml_config=req.mlConfig
        )
        return AnalyzeResponse(predicted_threshold=str(threshold), anomaly_detected=anomaly_detected)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
