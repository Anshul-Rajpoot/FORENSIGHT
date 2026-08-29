"""Small Python worker used only for DeepFace embedding generation.
The main application is Node.js/Express; this process keeps DeepFace out of Node.
"""

import base64
import io
import json
import sys

import numpy as np
from PIL import Image
from deepface import DeepFace

MODEL = "Facenet"
DETECTOR = "opencv"
ENFORCE = False


def get_embedding(image_bytes):
    image = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    reps = DeepFace.represent(
        img_path=image,
        model_name=MODEL,
        detector_backend=DETECTOR,
        enforce_detection=ENFORCE,
    )
    if not reps:
        return None

    embedding = np.array(reps[0]["embedding"], dtype=np.float32)
    norm = np.linalg.norm(embedding)
    if norm == 0:
        return None
    return (embedding / norm).tolist()


def main():
    # Loading the model once keeps later requests much faster.
    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue

        try:
            request = json.loads(raw_line)
            image_bytes = base64.b64decode(request["image"])
            embedding = get_embedding(image_bytes)
            if embedding is None:
                response = {
                    "id": request["id"],
                    "ok": False,
                    "error": "Face not detected",
                }
            else:
                response = {"id": request["id"], "ok": True, "embedding": embedding}
        except Exception as exc:
            response = (
                {"id": request.get("id", "unknown"), "ok": False, "error": str(exc)}
                if "request" in locals()
                else {"id": "unknown", "ok": False, "error": str(exc)}
            )

        sys.stdout.write(json.dumps(response) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
