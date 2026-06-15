from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Camera, Capture
from app.schemas import CaptureCreate, CaptureRead


router = APIRouter(
    prefix="/captures",
    tags=["captures"],
)


@router.get("/", response_model=list[CaptureRead])
def list_captures(db: Session = Depends(get_db)):
    return db.query(Capture).order_by(Capture.id.desc()).all()
    

@router.get("/camera/{camera_id}", response_model=list[CaptureRead])
def list_captures_by_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.get(Camera, camera_id)

    if camera is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    return (
        db.query(Capture)
        .filter(Capture.camera_id == camera_id)
        .order_by(Capture.id.desc())
        .all()
    )


@router.get("/{capture_id}", response_model=CaptureRead)
def get_capture(capture_id: int, db: Session = Depends(get_db)):
    capture = db.get(Capture, capture_id)

    if capture is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capture not found",
        )

    return capture


@router.post("/", response_model=CaptureRead, status_code=status.HTTP_201_CREATED)
def create_capture(payload: CaptureCreate, db: Session = Depends(get_db)):
    camera = db.get(Camera, payload.camera_id)

    if camera is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    capture = Capture(
        camera_id=payload.camera_id,
        url=payload.url,
    )

    db.add(capture)
    db.commit()
    db.refresh(capture)

    return capture


@router.delete("/{capture_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_capture(capture_id: int, db: Session = Depends(get_db)):
    capture = db.get(Capture, capture_id)

    if capture is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capture not found",
        )

    db.delete(capture)
    db.commit()

    return None