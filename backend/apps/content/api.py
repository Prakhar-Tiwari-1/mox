import logging

from django.db import transaction
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.utils import timezone

from .mailers import send_contact_confirmation
from .models import Club, ContactMessage, Event, FAQItem, LeadershipMember, PublishStatus
from .serializers import (
    ClubSerializer,
    ContactMessageCreateSerializer,
    EventSerializer,
    FAQItemSerializer,
    LeadershipMemberSerializer,
)

logger = logging.getLogger(__name__)


class ContactMessageRateThrottle(AnonRateThrottle):
    scope = "contact_messages"


class PublishedOnlyMixin:
    def get_queryset(self):
        return super().get_queryset().filter(status=PublishStatus.PUBLISHED)


class ClubViewSet(PublishedOnlyMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Club.objects.prefetch_related("members", "events").all()
    serializer_class = ClubSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class LeadershipMemberViewSet(PublishedOnlyMixin, viewsets.ReadOnlyModelViewSet):
    queryset = LeadershipMember.objects.all()
    serializer_class = LeadershipMemberSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class FAQItemViewSet(PublishedOnlyMixin, viewsets.ReadOnlyModelViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer
    permission_classes = [AllowAny]


class EventViewSet(PublishedOnlyMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.select_related("club").prefetch_related("assets").all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = super().get_queryset()
        featured = self.request.query_params.get("featured")
        if featured == "true":
            queryset = queryset.filter(is_featured=True)
        temporal_status = self.request.query_params.get("temporal_status")
        if temporal_status == "upcoming":
            return queryset.filter(start_at__gte=timezone.now())
        if temporal_status == "past":
            return queryset.filter(start_at__lt=timezone.now())
        return queryset


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ContactMessageRateThrottle]

    @transaction.atomic
    def perform_create(self, serializer):
        message = serializer.save()
        try:
            send_contact_confirmation(message)
        except Exception:
            logger.exception("Failed to send MoX contact confirmation email", extra={"contact_message_id": message.pk})
            # Keep the submission even if outbound email fails.
            pass
