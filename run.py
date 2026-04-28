from fastapi import FastAPI
from backend.main import app

# This allows running the app directly if needed, or by uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
