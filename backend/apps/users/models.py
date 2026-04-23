from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "admin", "Admin"
    EDITOR = "editor", "Editor"
    CLUB_MANAGER = "club_manager", "Club manager"


class User(AbstractUser):
    role = models.CharField(max_length=30, choices=UserRole.choices, default=UserRole.EDITOR)
    managed_club = models.ForeignKey(
        "content.Club",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managers",
    )

    def __str__(self) -> str:
        return self.username

    @property
    def is_mox_admin(self) -> bool:
        return self.is_superuser or self.role == UserRole.ADMIN

    @property
    def is_club_manager(self) -> bool:
        return self.role == UserRole.CLUB_MANAGER and self.managed_club_id is not None
