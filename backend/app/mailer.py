import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv

from .schemas import QuoteRequest

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)


def _bool_env(name: str, default: bool = True) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def send_quote_email(quote: QuoteRequest) -> tuple[str, str | None]:
    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", "587"))
    username = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    notify_email = os.getenv("QUOTE_NOTIFY_EMAIL")
    from_email = os.getenv("SMTP_FROM_EMAIL") or username
    use_tls = _bool_env("SMTP_STARTTLS", True)

    missing = [
        name
        for name, value in {
            "SMTP_HOST": host,
            "SMTP_USER": username,
            "SMTP_PASSWORD": password,
            "QUOTE_NOTIFY_EMAIL": notify_email,
            "SMTP_FROM_EMAIL or SMTP_USER": from_email,
        }.items()
        if not value
    ]
    if missing:
        return "not_configured", f"Missing email settings: {', '.join(missing)}"

    message = EmailMessage()
    message["Subject"] = f"New Mana Mirchi quote request #{quote.id}"
    message["From"] = from_email
    message["To"] = notify_email
    message["Reply-To"] = quote.email
    message.set_content(
        "\n".join(
            [
                "New quote request received from Mana Mirchi website.",
                "",
                f"Request ID: {quote.id}",
                f"Name: {quote.full_name}",
                f"Email: {quote.email}",
                f"Created At: {quote.created_at}",
                "",
                "Message:",
                quote.message,
            ]
        )
    )

    try:
        with smtplib.SMTP(host, port, timeout=20) as server:
            if use_tls:
                server.starttls()
            server.login(username, password)
            server.send_message(message)
    except Exception as exc:
        return "failed", str(exc)

    return "sent", None
