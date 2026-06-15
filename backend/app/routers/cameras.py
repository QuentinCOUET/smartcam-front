from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Camera
from app.schemas import CameraCreate, CameraRead, CameraUpdate


router = APIRouter(
    prefix="/cameras",
    tags=["cameras"],
)


@router.get("/", response_model=list[CameraRead])
def list_cameras(db: Session = Depends(get_db)):
    return db.query(Camera).order_by(Camera.id.desc()).all()


@router.get("/{camera_id}", response_model=CameraRead)
def get_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.get(Camera, camera_id)

    if camera is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    return camera


@router.post("/", response_model=CameraRead, status_code=status.HTTP_201_CREATED)
def create_camera(payload: CameraCreate, db: Session = Depends(get_db)):
    camera = Camera(
        nom=payload.nom,
        stream_url=payload.stream_url,
        ip_cam=payload.ip_cam,
    )

    db.add(camera)
    db.commit()
    db.refresh(camera)

    return camera


@router.patch("/{camera_id}", response_model=CameraRead)
def update_camera(
    camera_id: int,
    payload: CameraUpdate,
    db: Session = Depends(get_db),
):
    camera = db.get(Camera, camera_id)

    if camera is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)

    return camera


@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.get(Camera, camera_id)

    if camera is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    db.delete(camera)
    db.commit()

    return None