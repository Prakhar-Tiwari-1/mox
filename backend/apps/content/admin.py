from django.contrib import admin, messages
from django.utils import timezone
from django.utils.html import format_html

from apps.users.models import UserRole

from .mailers import send_contact_reply
from .models import AuditLog, Club, ClubMember, ContactMessage, Event, EventAsset, FAQItem, LeadershipMember


def image_preview(file_field, label="No image"):
    if not file_field:
        return format_html('<span class="mox-empty-media">{}</span>', label)
    return format_html(
        '<span class="mox-media-thumb"><img src="{}" alt="Media preview" /></span>',
        file_field.url,
    )


def asset_preview(file_field, label="No asset"):
    if not file_field:
        return format_html('<span class="mox-empty-media">{}</span>', label)
    return format_html('<a href="{}" class="mox-file-link" target="_blank">Open file</a>', file_field.url)


def status_badge(value):
    tone = {
        "published": "success",
        "draft": "muted",
        "unread": "warning",
        "read": "info",
        "replied": "success",
    }.get(str(value).lower(), "muted")
    label = str(value).replace("_", " ").title()
    return format_html('<span class="mox-status-badge mox-status-{}">{}</span>', tone, label)


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def log_audit(request, action, obj, details=None):
    AuditLog.objects.create(
        actor=request.user if request.user.is_authenticated else None,
        action=action,
        object_type=obj._meta.label,
        object_id=str(obj.pk or ""),
        object_repr=str(obj),
        details=details or {},
        ip_address=get_client_ip(request) or None,
    )


class ClubMemberInline(admin.TabularInline):
    model = ClubMember
    extra = 0
    fields = ("display_order", "name", "role", "status", "image", "member_image_preview")
    readonly_fields = ("member_image_preview",)

    def member_image_preview(self, obj):
        return image_preview(obj.image)

    member_image_preview.short_description = "Image preview"


class EventAssetInline(admin.TabularInline):
    model = EventAsset
    extra = 0
    fields = ("display_order", "title", "kind", "file", "asset_preview")
    readonly_fields = ("asset_preview",)

    def asset_preview(self, obj):
        if not obj.file:
            return format_html('<span class="mox-empty-media">No asset</span>')
        if obj.kind == "image":
            return image_preview(obj.file)
        return asset_preview(obj.file)

    asset_preview.short_description = "Current asset"


class ClubScopedAdminMixin:
    def has_add_permission(self, request):
        allowed = super().has_add_permission(request)
        if not allowed or request.user.is_superuser or getattr(request.user, "role", None) != UserRole.CLUB_MANAGER:
            return allowed
        managed_club = getattr(request.user, "managed_club", None)
        if self.model is Club:
            return False
        return managed_club is not None

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or getattr(request.user, "role", None) != UserRole.CLUB_MANAGER:
            return qs
        managed_club = getattr(request.user, "managed_club", None)
        if managed_club is None:
            return qs.none()
        if qs.model is Club:
            return qs.filter(pk=managed_club.pk)
        if hasattr(qs.model, "club_id"):
            return qs.filter(club=managed_club)
        if qs.model is Event:
            return qs.filter(club=managed_club)
        return qs

    def has_view_permission(self, request, obj=None):
        allowed = super().has_view_permission(request, obj)
        if not allowed or obj is None or request.user.is_superuser or getattr(request.user, "role", None) != UserRole.CLUB_MANAGER:
            return allowed
        managed_club = getattr(request.user, "managed_club", None)
        if isinstance(obj, Club):
            return managed_club and obj.pk == managed_club.pk
        return getattr(obj, "club_id", None) == getattr(managed_club, "id", None)

    def has_change_permission(self, request, obj=None):
        allowed = super().has_change_permission(request, obj)
        if not allowed or obj is None or request.user.is_superuser or getattr(request.user, "role", None) != UserRole.CLUB_MANAGER:
            return allowed
        managed_club = getattr(request.user, "managed_club", None)
        if isinstance(obj, Club):
            return managed_club and obj.pk == managed_club.pk
        return getattr(obj, "club_id", None) == getattr(managed_club, "id", None)

    def has_delete_permission(self, request, obj=None):
        allowed = super().has_delete_permission(request, obj)
        if not allowed or obj is None or request.user.is_superuser or getattr(request.user, "role", None) != UserRole.CLUB_MANAGER:
            return allowed
        managed_club = getattr(request.user, "managed_club", None)
        if isinstance(obj, Club):
            return False
        return getattr(obj, "club_id", None) == getattr(managed_club, "id", None)

    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return getattr(request.user, "role", None) in {UserRole.ADMIN, UserRole.CLUB_MANAGER}


@admin.register(Club)
class ClubAdmin(ClubScopedAdminMixin, admin.ModelAdmin):
    list_display = ("name", "club_image_preview", "status_badge", "contact_email", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("status",)
    search_fields = ("name", "description", "contact_email")
    readonly_fields = ("club_image_preview",)
    inlines = [ClubMemberInline]
    fieldsets = (
        ("Club basics", {"fields": ("name", "slug", "tagline", "description", "status")}),
        ("Media", {"fields": ("image", "club_image_preview")}),
        ("Contact", {"fields": ("contact_email", "contact_phone")}),
    )

    def club_image_preview(self, obj):
        return image_preview(obj.image, "No logo")

    club_image_preview.short_description = "Current image"

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        log_audit(
            request,
            "club.updated" if change else "club.created",
            obj,
            {"changed_fields": list(form.changed_data)},
        )

    def delete_model(self, request, obj):
        log_audit(request, "club.deleted", obj)
        super().delete_model(request, obj)


@admin.register(ClubMember)
class ClubMemberAdmin(ClubScopedAdminMixin, admin.ModelAdmin):
    list_display = ("name", "club", "role", "member_image_preview", "display_order", "status_badge")
    list_filter = ("status", "club")
    search_fields = ("name", "role", "description", "email")
    readonly_fields = ("member_image_preview",)
    fieldsets = (
        ("Member", {"fields": ("club", "name", "role", "description", "display_order", "status")}),
        ("Media", {"fields": ("image", "member_image_preview")}),
        ("Contact", {"fields": ("email", "phone")}),
    )

    def member_image_preview(self, obj):
        return image_preview(obj.image, "No photo")

    member_image_preview.short_description = "Current image"

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "club" and getattr(request.user, "role", None) == UserRole.CLUB_MANAGER and not request.user.is_superuser:
            managed_club = getattr(request.user, "managed_club", None)
            kwargs["queryset"] = Club.objects.filter(pk=getattr(managed_club, "pk", None))
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if getattr(request.user, "role", None) == UserRole.CLUB_MANAGER and not request.user.is_superuser and request.user.managed_club_id:
            obj.club_id = request.user.managed_club_id
        super().save_model(request, obj, form, change)
        log_audit(
            request,
            "club_member.updated" if change else "club_member.created",
            obj,
            {"changed_fields": list(form.changed_data)},
        )

    def delete_model(self, request, obj):
        log_audit(request, "club_member.deleted", obj)
        super().delete_model(request, obj)


@admin.register(LeadershipMember)
class LeadershipMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "leadership_image_preview", "display_order", "status_badge", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("status",)
    search_fields = ("name", "role", "description", "email")
    ordering = ("display_order", "name")
    readonly_fields = ("leadership_image_preview",)
    fieldsets = (
        ("Person", {"fields": ("name", "slug", "role", "summary", "description", "responsibilities", "display_order", "status")}),
        ("Media", {"fields": ("image", "leadership_image_preview", "image_focus_x", "image_focus_y")}),
        ("Contact", {"fields": ("email", "phone")}),
    )

    def leadership_image_preview(self, obj):
        return image_preview(obj.image, "No portrait")

    leadership_image_preview.short_description = "Current image"

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return getattr(request.user, "role", None) == UserRole.ADMIN

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        log_audit(
            request,
            "leadership.updated" if change else "leadership.created",
            obj,
            {"changed_fields": list(form.changed_data)},
        )

    def delete_model(self, request, obj):
        log_audit(request, "leadership.deleted", obj)
        super().delete_model(request, obj)


@admin.register(Event)
class EventAdmin(ClubScopedAdminMixin, admin.ModelAdmin):
    list_display = ("title", "club", "event_image_preview", "start_at", "temporal_status", "is_featured", "status_badge")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("status", "is_featured", "club")
    search_fields = ("title", "description", "location")
    readonly_fields = ("event_image_preview",)
    inlines = [EventAssetInline]
    fieldsets = (
        ("Event basics", {"fields": ("title", "slug", "description", "club", "status", "is_featured")}),
        ("Schedule", {"fields": ("start_at", "end_at", "location")}),
        ("Registration", {"fields": ("registration_url",)}),
        ("Media", {"fields": ("image", "event_image_preview")}),
        ("Metadata", {"fields": ("tags",)}),
    )

    def event_image_preview(self, obj):
        return image_preview(obj.image, "No cover")

    event_image_preview.short_description = "Current main image"

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "club" and getattr(request.user, "role", None) == UserRole.CLUB_MANAGER and not request.user.is_superuser:
            managed_club = getattr(request.user, "managed_club", None)
            kwargs["queryset"] = Club.objects.filter(pk=getattr(managed_club, "pk", None))
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if getattr(request.user, "role", None) == UserRole.CLUB_MANAGER and not request.user.is_superuser and request.user.managed_club_id:
            obj.club_id = request.user.managed_club_id
        super().save_model(request, obj, form, change)
        log_audit(
            request,
            "event.updated" if change else "event.created",
            obj,
            {"changed_fields": list(form.changed_data)},
        )

    def delete_model(self, request, obj):
        log_audit(request, "event.deleted", obj)
        super().delete_model(request, obj)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "email", "status_badge", "created_at", "replied_at")
    list_filter = ("status",)
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at", "replied_at")
    actions = ("mark_as_read", "mark_as_unread")
    fieldsets = (
        ("Sender", {"fields": ("name", "email", "subject", "created_at")}),
        ("Incoming message", {"fields": ("message",)}),
        ("Admin handling", {"fields": ("status", "admin_reply", "replied_at")}),
    )

    @admin.action(description="Mark selected messages as read")
    def mark_as_read(self, request, queryset):
        updated = queryset.update(status="read")
        self.message_user(request, f"Marked {updated} message(s) as read.", level=messages.SUCCESS)

    @admin.action(description="Mark selected messages as unread")
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(status="unread")
        self.message_user(request, f"Marked {updated} message(s) as unread.", level=messages.SUCCESS)

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def save_model(self, request, obj, form, change):
        previous_reply = ""
        if change:
            previous_reply = ContactMessage.objects.get(pk=obj.pk).admin_reply

        super().save_model(request, obj, form, change)

        if obj.admin_reply and obj.admin_reply != previous_reply:
            try:
                send_contact_reply(obj)
            except Exception as exc:
                self.message_user(request, f"Reply saved, but email sending failed: {exc}", level=messages.ERROR)
                return

            obj.status = "replied"
            obj.replied_at = timezone.now()
            obj.save(update_fields=["status", "replied_at", "updated_at"])
            log_audit(
                request,
                "contact.replied",
                obj,
                {"changed_fields": list(form.changed_data)},
            )
            self.message_user(request, "Reply email sent successfully.", level=messages.SUCCESS)


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ("question", "display_order", "status_badge", "updated_at")
    list_filter = ("status",)
    search_fields = ("question", "answer")
    ordering = ("display_order", "question")
    fieldsets = (
        ("FAQ", {"fields": ("question", "answer", "display_order", "status")}),
    )

    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return getattr(request.user, "role", None) == UserRole.ADMIN

    def status_badge(self, obj):
        return status_badge(obj.status)

    status_badge.short_description = "Status"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        log_audit(
            request,
            "faq.updated" if change else "faq.created",
            obj,
            {"changed_fields": list(form.changed_data)},
        )

    def delete_model(self, request, obj):
        log_audit(request, "faq.deleted", obj)
        super().delete_model(request, obj)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "actor", "action", "object_type", "object_repr", "ip_address")
    list_filter = ("action", "object_type", "actor")
    search_fields = ("object_repr", "object_type", "action", "actor__username")
    readonly_fields = ("created_at", "updated_at", "actor", "action", "object_type", "object_id", "object_repr", "details", "ip_address")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return getattr(request.user, "role", None) == UserRole.ADMIN
