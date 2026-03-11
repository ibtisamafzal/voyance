"""
Contact form endpoint — sends email via Gmail SMTP.
Requires CONTACT_EMAIL and CONTACT_EMAIL_APP_PASSWORD (Gmail App Password) on the server.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str


@router.post("/contact")
async def send_contact_email(req: ContactRequest):
    """Receive contact form and send via Gmail SMTP."""
    recipient = os.getenv("CONTACT_EMAIL", "").strip()
    password = (
        os.getenv("CONTACT_EMAIL_APP_PASSWORD", "")
        or os.getenv("CONTACT_EMAIL_PASSWORD", "")  # Backward compatibility
    ).strip()
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com").strip() or "smtp.gmail.com"
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    name = req.name.strip()
    sender_email = req.email.strip()
    subject = req.subject.strip() or "Voyance Contact Form"
    message = req.message.strip()

    if not name or not sender_email or not message:
        raise HTTPException(status_code=422, detail="Name, email, and message are required.")
    if "\n" in sender_email or "\r" in sender_email:
        raise HTTPException(status_code=422, detail="Invalid sender email.")

    if not recipient:
        raise HTTPException(
            status_code=503,
            detail="Gmail SMTP is not configured. Set CONTACT_EMAIL.",
        )

    if not password:
        raise HTTPException(
            status_code=503,
            detail="Gmail SMTP is not configured. Set CONTACT_EMAIL_APP_PASSWORD.",
        )

    msg = MIMEMultipart("alternative")
    msg["From"] = formataddr(("Voyance Contact", recipient))
    msg["To"] = recipient
    msg["Subject"] = f"[Voyance] {subject}"
    msg["Reply-To"] = sender_email

    body = (
        f"Name: {name}\n"
        f"Email: {sender_email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}"
    )
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(recipient, password)
            server.sendmail(recipient, [recipient], msg.as_string())
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=503,
            detail="SMTP authentication failed. Verify Gmail App Password and 2-Step Verification.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

    return {"status": "sent", "message": "Your message has been sent successfully."}
