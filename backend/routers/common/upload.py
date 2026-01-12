from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL
        # Assuming localhost:8000 for now, but in prod this should be dynamic
        base_url = os.getenv("BASE_URL", "http://localhost:8000")
        return {"url": f"{base_url}/uploads/{new_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
