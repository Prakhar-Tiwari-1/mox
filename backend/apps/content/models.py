from __future__ import annotations

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

User = get_user_model()


SAFE_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]
SAFE_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"]


def validate_file_size(file_obj):
    max_bytes = getattr(settings, "MOX_MAX_UPLOAD_SIZE_BYTES", 5 * 1024 * 1024)
    if file_obj and file_obj.size > max_bytes:
        raise ValidationError(f"File size must be <= {max_bytes // (1024 * 1024)} MB.")


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"


class MessageStatus(models.TextChoices):
    UNREAD = "unread", "Unread"
    READ = "read", "Read"
    REPLIED = "replied", "Replied"


class Club(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    image = models.ImageField(
        upload_to="clubs/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=SAFE_IMAGE_EXTENSIONS), validate_file_size],
    )
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class ClubMember(TimeStampedModel):
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="members")
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="club_members/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=SAFE_IMAGE_EXTENSIONS), validate_file_size],
    )
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self) -> str:
        return f"{self.club.name} - {self.name}"


class LeadershipMember(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    role = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    image_focus_x = models.PositiveSmallIntegerField(default=50)
    image_focus_y = models.PositiveSmallIntegerField(default=18)
    image = models.ImageField(
        upload_to="leadership/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=SAFE_IMAGE_EXTENSIONS), validate_file_size],
    )
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)

    class Meta:
        ordering = ["display_order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Event(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, null=True, blank=True, related_name="events")
    location = models.CharField(max_length=255)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField(blank=True, null=True)
    image = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=SAFE_IMAGE_EXTENSIONS), validate_file_size],
    )
    registration_url = models.URLField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)

    class Meta:
        ordering = ["start_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def temporal_status(self) -> str:
        return "past" if self.start_at < timezone.now() else "upcoming"

    def __str__(self) -> str:
        return self.title


class EventAssetKind(models.TextChoices):
    IMAGE = "image", "Image"
    FILE = "file", "File / Flyer"


class EventAsset(TimeStampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="assets")
    title = models.CharField(max_length=200)
    kind = models.CharField(max_length=20, choices=EventAssetKind.choices, default=EventAssetKind.IMAGE)
    file = models.FileField(
        upload_to="events/assets/",
        validators=[FileExtensionValidator(allowed_extensions=SAFE_FILE_EXTENSIONS), validate_file_size],
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self) -> str:
        return f"{self.event.title} - {self.title}"


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=MessageStatus.choices, default=MessageStatus.UNREAD)
    admin_reply = models.TextField(blank=True)
    replied_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.subject} ({self.email})"


class FAQItem(TimeStampedModel):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)

    class Meta:
        ordering = ["display_order", "question"]

    def __str__(self) -> str:
        return self.question


class AuditLog(TimeStampedModel):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    action = models.CharField(max_length=100)
    object_type = models.CharField(max_length=100)
    object_id = models.CharField(max_length=64, blank=True)
    object_repr = models.CharField(max_length=255)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.action} - {self.object_type} - {self.object_repr}"
