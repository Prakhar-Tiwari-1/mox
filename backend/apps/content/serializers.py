from rest_framework import serializers

from .models import Club, ClubMember, ContactMessage, Event, EventAsset, FAQItem, LeadershipMember


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
    temporal_status = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        fields = ["id", "slug", "title", "start_at", "location", "temporal_status"]


class ClubSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    members = ClubMemberSerializer(many=True, read_only=True)
    events = serializers.SerializerMethodField()

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
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else ""

    def get_events(self, obj):
        published_events = obj.events.filter(status="published").order_by("start_at")
        return ClubEventSummarySerializer(
            published_events,
            many=True,
            context=self.context,
        ).data


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
    temporal_status = serializers.CharField(read_only=True)
    assets = EventAssetSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "location",
            "start_at",
            "end_at",
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
