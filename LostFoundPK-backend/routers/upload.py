# routers/upload.py
"""
Upload router for handling image uploads to Cloudinary.
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from core.dependencies import get_current_user
import cloudinary
import cloudinary.uploader
import cloudinary.api
from config import settings

router = APIRouter(prefix="/upload", tags=["Upload"])

# Configure Cloudinary using settings (executed at import time)
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

@router.post("/", status_code=status.HTTP_201_CREATED, summary="Upload an image to Cloudinary")
async def upload_image(file: UploadFile = File(...)):
    # Validate that the uploaded file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    try:
        # Read file contents into memory (fastapi provides SpooledTemporaryFile)
        contents = await file.read()
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(contents, folder="lostfoundpk/uploads")
        url = upload_result.get("secure_url")
        if not url:
            raise HTTPException(status_code=500, detail="Failed to retrieve image URL from Cloudinary.")
        return {"url": url}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
