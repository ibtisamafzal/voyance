"""
Contact form endpoint — sends email via Gmail SMTP.
Requires CONTACT_EMAIL and CONTACT_EMAIL_PASSWORD env vars.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str


@router.post("/contact")
async def send_contact_email(req: ContactRequest):
    """Receive contact form and send via Gmail SMTP."""
    recipient = os.getenv("CONTACT_EMAIL", "")
    password = os.getenv("CONTACT_EMAIL_PASSWORD", "")

    if not recipient or not password:
        raise HTTPException(
            status_code=503,
            detail="Contact email is not configured on the server.",
        )

    subject = req.subject.strip() or "Voyance Contact Form"

    msg = MIMEMultipart("alternative")
    msg["From"] = formataddr(("Voyance Contact", recipient))
    msg["To"] = recipient
    msg["Subject"] = f"[Voyance] {subject}"
    msg["Reply-To"] = req.email

    body = (
        f"Name: {req.name}\n"
        f"Email: {req.email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{req.message}"
    )
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(recipient, password)
            server.sendmail(recipient, [recipient], msg.as_string())
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=503,
            detail="SMTP authentication failed. Check email credentials.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

    return {"status": "sent", "message": "Your message has been sent successfully."}
