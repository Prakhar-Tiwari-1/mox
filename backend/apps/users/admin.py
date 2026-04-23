from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User, UserRole


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("MoX permissions", {"fields": ("role", "managed_club")}),
    )
    list_display = ("username", "email", "role", "is_active", "is_staff", "last_login")
    list_filter = ("role", "is_active", "is_staff", "is_superuser")

    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return getattr(request.user, "role", None) == UserRole.ADMIN

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or getattr(request.user, "role", None) == UserRole.ADMIN:
            return qs
        return qs.none()
