from __future__ import annotations

import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from .models import ContactMessage

logger = logging.getLogger(__name__)


def send_contact_confirmation(message: ContactMessage) -> None:
    if not settings.EMAIL_HOST_PASSWORD:
        logger.warning("Contact confirmation skipped because email password is not configured")
        return

    subject = "We received your message to MoX"
    body = (
        f"Hello {message.name},\n\n"
        "We have received your message and a member of the MoX team will get back to you soon.\n\n"
        f"Subject: {message.subject}\n\n"
        "Best regards,\n"
        "MoX"
    )
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[message.email],
        reply_to=[settings.MOX_CONTACT_REPLY_TO],
    )
    email.send(fail_silently=False)
    logger.info("Contact confirmation email sent", extra={"contact_message_id": message.pk})


def send_contact_reply(message: ContactMessage) -> None:
    if not settings.EMAIL_HOST_PASSWORD or not message.admin_reply:
        logger.warning("Contact reply skipped because email credentials or reply body are missing", extra={"contact_message_id": message.pk})
        return

    subject = f"Re: {message.subject}"
    body = (
        f"Hello {message.name},\n\n"
        f"{message.admin_reply}\n\n"
        "Best regards,\n"
        "MoX"
    )
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[message.email],
        reply_to=[settings.MOX_CONTACT_REPLY_TO],
    )
    email.send(fail_silently=False)
    logger.info("Contact reply email sent", extra={"contact_message_id": message.pk})
