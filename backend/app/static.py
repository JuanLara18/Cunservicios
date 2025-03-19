# backend/app/static.py
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


def setup_static_files(app: FastAPI) -> None:
    # Servir archivos estáticos de React desde /
    app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")