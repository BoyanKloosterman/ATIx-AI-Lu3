from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from recommender.service import initialize_recommender, get_module_recommendations
from recommender.models import RecommendRequest, RecommendResponse, RecommendItem
import pandas as pd

app = FastAPI(title="Recommender API")
CSV_PATH = "data/Uitgebreide_VKM_dataset_cleaned2.csv"

@app.on_event("startup")
async def startup_event():
    try:
        initialize_recommender(CSV_PATH)
        print("Recommender engine initialized successfully")
    except Exception as e:
        print(f"Error initializing recommender: {e}")

@app.get("/")
def root():
    return {"message": "Welcome to the Recommender API"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    try:
        # Build student profile from other fields
        profile_parts = []
        
        if req.study_program:
            profile_parts.append(f"Ik studeer {req.study_program}")
            
        if req.interests:
            profile_parts.append(f"Mijn interesses zijn: {', '.join(req.interests)}")
            
        if req.skills:
            profile_parts.append(f"Mijn vaardigheden zijn: {', '.join(req.skills)}")
            
        if req.favorites:
            profile_parts.append(f"Ik ben geïnteresseerd in: {', '.join(req.favorites)}")
        
        # If no profile can be built, use a default
        if not profile_parts:
            student_profile = "Student zoekt passende modules"
        else:
            student_profile = ". ".join(profile_parts) + "."
        
        recommendations = get_module_recommendations(
            student_profile=student_profile,
            top_n=req.k,
            location=req.study_location,
            studycredit=getattr(req, 'studycredit', None),
            level=getattr(req, 'level', None)
        )
        
        return RecommendResponse(
            recommendations=[RecommendItem(**rec) for rec in recommendations]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")