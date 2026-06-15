from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Camera(Base):
    __tablename__ = "camera"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nom: Mapped[str] = mapped_column(Text, nullable=False)
    stream_url: Mapped[str] = mapped_column(Text, nullable=False)
    ip_cam: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    captures: Mapped[list["Capture"]] = relationship(
        back_populates="camera",
        cascade="all, delete-orphan",
    )


class Capture(Base):
    __tablename__ = "capture"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    camera_id: Mapped[int] = mapped_column(
        ForeignKey("camera.id"),
        nullable=False,
        index=True,
    )

    url: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    camera: Mapped["Camera"] = relationship(back_populates="captures")