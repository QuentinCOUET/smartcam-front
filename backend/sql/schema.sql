BEGIN;

CREATE TABLE IF NOT EXISTS camera (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  ip_cam TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS capture (
  id SERIAL PRIMARY KEY,
  camera_id INTEGER NOT NULL REFERENCES camera(id),
  url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_capture_camera_id
ON capture(camera_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_camera_updated_at ON camera;

CREATE TRIGGER trg_camera_updated_at
BEFORE UPDATE ON camera
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;