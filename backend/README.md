# Mana Mirchi Backend

FastAPI backend for the Mana Mirchi React app.

## Run

```powershell
cd "C:\MIRCHI app"
python -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs:

```text
http://localhost:8000/docs
```

## Endpoints

- `GET /api/health`
- `GET /api/site`
- `POST /api/quotes`
- `GET /api/quotes`
- `GET /api/quotes/{quote_id}`
- `PATCH /api/quotes/{quote_id}`
- `DELETE /api/quotes/{quote_id}`
