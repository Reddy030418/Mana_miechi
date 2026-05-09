from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import get_connection, init_db
from .mailer import send_quote_email
from .schemas import QuoteRequest, QuoteRequestCreate, QuoteStatusUpdate

app = FastAPI(
    title="Mana Mirchi API",
    description="Backend API for the Mana Mirchi React landing page.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1|192\.168\.1\.3):(5173|5174|5175|4173)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mana-mirchi-api"}


@app.get("/api/email/config")
def email_config() -> dict[str, bool]:
    import os

    return {
        "smtp_host": bool(os.getenv("SMTP_HOST")),
        "smtp_user": bool(os.getenv("SMTP_USER")),
        "smtp_password": bool(os.getenv("SMTP_PASSWORD")),
        "quote_notify_email": bool(os.getenv("QUOTE_NOTIFY_EMAIL")),
        "ready": all(
            bool(os.getenv(name))
            for name in ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "QUOTE_NOTIFY_EMAIL"]
        ),
    }


@app.get("/api/site")
def get_site_data() -> dict:
    return {
        "varieties": [
            "Guntur Sannam",
            "Teja S17",
            "Byadgi",
            "Kashmiri",
            "Wonder Hot",
            "Endo Suryamukhi",
            "334 Variety",
        ],
        "stats": [
            {"value": "5,000+", "label": "Farmers"},
            {"value": "18", "label": "Countries"},
            {"value": "A+", "label": "Grade Quality"},
        ],
        "products": [
            {"tag": "Best Seller", "meta": "A Grade - Stem-cut", "name": "Whole Dried Red Chili"},
            {"tag": "Export Ready", "meta": "Single-origin - Stoneground", "name": "Premium Chili Powder"},
            {"tag": "Daily Harvest", "meta": "Hand-picked - Cold chain", "name": "Fresh Green Chili"},
        ],
        "faqs": [
            {
                "question": "What chili varieties do you supply?",
                "answer": "Guntur Sannam S4, Teja S17, Byadgi, Kashmiri, Wonder Hot, 334 and Endo Suryamukhi.",
            },
            {
                "question": "What are your minimum order quantities?",
                "answer": "Minimum order is 500 kg for domestic buyers and 1 MT for international export orders.",
            },
            {
                "question": "Do you handle international shipping?",
                "answer": "Yes. We manage export documentation, phytosanitary certificates, APEDA registration and freight partners.",
            },
        ],
    }


@app.post("/api/quotes", response_model=QuoteRequest, status_code=201)
def create_quote_request(payload: QuoteRequestCreate) -> QuoteRequest:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO quote_requests (full_name, email, message)
            VALUES (?, ?, ?)
            """,
            (payload.full_name.strip(), payload.email.lower(), payload.message.strip()),
        )
        connection.commit()
        row = connection.execute(
            "SELECT * FROM quote_requests WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    quote = QuoteRequest(**dict(row))
    email_status, email_error = send_quote_email(quote)

    with get_connection() as connection:
        connection.execute(
            """
            UPDATE quote_requests
            SET email_status = ?, email_error = ?
            WHERE id = ?
            """,
            (email_status, email_error, quote.id),
        )
        connection.commit()
        row = connection.execute(
            "SELECT * FROM quote_requests WHERE id = ?",
            (quote.id,),
        ).fetchone()
    return QuoteRequest(**dict(row))


@app.get("/api/quotes", response_model=list[QuoteRequest])
def list_quote_requests() -> list[QuoteRequest]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM quote_requests ORDER BY created_at DESC, id DESC"
        ).fetchall()
    return [QuoteRequest(**dict(row)) for row in rows]


@app.get("/api/quotes/{quote_id}", response_model=QuoteRequest)
def get_quote_request(quote_id: int) -> QuoteRequest:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM quote_requests WHERE id = ?",
            (quote_id,),
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Quote request not found")
    return QuoteRequest(**dict(row))


@app.patch("/api/quotes/{quote_id}", response_model=QuoteRequest)
def update_quote_status(quote_id: int, payload: QuoteStatusUpdate) -> QuoteRequest:
    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE quote_requests SET status = ? WHERE id = ?",
            (payload.status, quote_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Quote request not found")
        connection.commit()
        row = connection.execute(
            "SELECT * FROM quote_requests WHERE id = ?",
            (quote_id,),
        ).fetchone()
    return QuoteRequest(**dict(row))


@app.delete("/api/quotes/{quote_id}", status_code=204)
def delete_quote_request(quote_id: int) -> None:
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM quote_requests WHERE id = ?",
            (quote_id,),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Quote request not found")
        connection.commit()
