import os
import json
from config import PROJECTS_DIR

def project_folder(project_id):
    p = os.path.join(PROJECTS_DIR, project_id)
    os.makedirs(os.path.join(p, "annotations"), exist_ok=True)
    os.makedirs(os.path.join(p, "reports"), exist_ok=True)
    os.makedirs(os.path.join(p, "discussions"), exist_ok=True)
    os.makedirs(os.path.join(p, "uploads"), exist_ok=True)
    return p

def save_upload(project_id, filename, file_stream):
    p = project_folder(project_id)
    dest = os.path.join(p, "uploads", filename)
    with open(dest, "wb") as f:
        f.write(file_stream.read())
    return dest

def save_json(path, data):
    with open(path, "w", encoding="utf8") as f:
        json.dump(data, f, indent=2)
