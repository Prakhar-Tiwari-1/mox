from rest_framework import serializers

import copy

from django.utils import timezone

from .models import Club, ClubMember, ClubSection, ClubSectionImage, ContactMessage, Event, EventAsset, FAQItem, LeadershipMember


class ClubMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClubMember
        fields = [
            "id",
            "name",
            "role",
            "description",
            "image_url",
            "email",
            "phone",
            "display_order",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""


class ClubSectionImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClubSectionImage
        fields = ["id", "image_url", "caption", "display_order"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""


class ClubSectionSerializer(serializers.ModelSerializer):
    images = ClubSectionImageSerializer(many=True, read_only=True)

    class Meta:
        model = ClubSection
        fields = ["id", "title", "slug", "kind", "content", "display_order", "images"]


class EventAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = EventAsset
        fields = ["id", "title", "kind", "file_url", "display_order"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else ""


class ClubEventSummarySerializer(serializers.ModelSerializer):
    temporal_status = serializers.SerializerMethodField()
    instance_id = serializers.SerializerMethodField()
    start_at = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ["id", "instance_id", "slug", "title", "start_at", "location", "temporal_status"]

    def get_instance_id(self, obj):
        occurrence_start = getattr(obj, "occurrence_start_at", None)
        if occurrence_start:
            return f"{obj.pk}::{occurrence_start.isoformat()}"
        return str(obj.pk)

    def get_start_at(self, obj):
        return getattr(obj, "occurrence_start_at", obj.start_at)

    def get_temporal_status(self, obj):
        effective_start = getattr(obj, "occurrence_start_at", obj.start_at)
        return "past" if effective_start < timezone.now() else "upcoming"


class ClubSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    members = ClubMemberSerializer(many=True, read_only=True)
    events = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = [
            "id",
            "name",
            "slug",
            "tagline",
            "description",
            "image_url",
            "contact_email",
            "contact_phone",
            "members",
            "events",
            "sections",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""

    def get_events(self, obj):
        published_events = obj.events.filter(status="published").order_by("start_at")
        now = timezone.now()
        expanded_events = []
        for event in published_events:
            for occurrence_start in event.get_occurrence_starts(
                window_start=now - timezone.timedelta(days=180),
                window_end=now + timezone.timedelta(days=365),
            ):
                event_instance = copy.copy(event)
                event_instance.occurrence_start_at = occurrence_start
                expanded_events.append(event_instance)
        expanded_events.sort(key=lambda item: getattr(item, "occurrence_start_at", item.start_at))
        return ClubEventSummarySerializer(
            expanded_events,
            many=True,
            context=self.context,
        ).data

    def get_sections(self, obj):
        published_sections = obj.sections.filter(status="published").prefetch_related("images")
        return ClubSectionSerializer(published_sections, many=True, context=self.context).data


class LeadershipMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = LeadershipMember
        fields = [
            "id",
            "name",
            "slug",
            "role",
            "summary",
            "description",
            "responsibilities",
            "image_focus_x",
            "image_focus_y",
            "image_url",
            "email",
            "phone",
            "display_order",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""


class EventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    club_name = serializers.CharField(source="club.name", read_only=True)
    temporal_status = serializers.SerializerMethodField()
    instance_id = serializers.SerializerMethodField()
    start_at = serializers.SerializerMethodField()
    end_at = serializers.SerializerMethodField()
    assets = EventAssetSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "instance_id",
            "title",
            "slug",
            "description",
            "location",
            "start_at",
            "end_at",
            "recurrence_frequency",
            "recurrence_interval",
            "recurrence_until",
            "max_attendees",
            "image_url",
            "registration_url",
            "tags",
            "is_featured",
            "temporal_status",
            "club",
            "club_name",
            "assets",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""

    def get_instance_id(self, obj):
        occurrence_start = getattr(obj, "occurrence_start_at", None)
        if occurrence_start:
            return f"{obj.pk}::{occurrence_start.isoformat()}"
        return str(obj.pk)

    def get_start_at(self, obj):
        return getattr(obj, "occurrence_start_at", obj.start_at)

    def get_end_at(self, obj):
        occurrence_end = getattr(obj, "occurrence_end_at", None)
        if occurrence_end:
            return occurrence_end
        return obj.end_at

    def get_temporal_status(self, obj):
        effective_start = getattr(obj, "occurrence_start_at", obj.start_at)
        return "past" if effective_start < timezone.now() else "upcoming"


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "website", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected.")
        return value

    def create(self, validated_data):
        validated_data.pop("website", "")
        return super().create(validated_data)


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ["id", "question", "answer", "display_order"]
