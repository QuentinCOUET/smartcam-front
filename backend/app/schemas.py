from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CameraBase(BaseModel):
    nom: str
    stream_url: str
    ip_cam: str | None = None


class CameraCreate(CameraBase):
    pass


class CameraUpdate(BaseModel):
    nom: str | None = None
    stream_url: str | None = None
    ip_cam: str | None = None


class CameraRead(CameraBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CaptureBase(BaseModel):
    camera_id: int
    url: str


class CaptureCreate(CaptureBase):
    pass


class CaptureRead(CaptureBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)