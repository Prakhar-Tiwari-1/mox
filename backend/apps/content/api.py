import copy
import logging

from django.db import transaction
from django.utils import timezone
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

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
    queryset = Club.objects.prefetch_related("members", "events", "sections__images").all()
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

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        now = timezone.now()
        temporal_status = request.query_params.get("temporal_status")

        if temporal_status == "upcoming":
            window_start = now
            window_end = now + timezone.timedelta(days=365)
        elif temporal_status == "past":
            window_start = now - timezone.timedelta(days=365)
            window_end = now
        else:
            window_start = now - timezone.timedelta(days=180)
            window_end = now + timezone.timedelta(days=365)

        expanded_events = []
        for event in queryset:
            occurrence_starts = event.get_occurrence_starts(window_start=window_start, window_end=window_end)
            if not occurrence_starts and event.recurrence_frequency == "none":
                occurrence_starts = [event.start_at]
            for occurrence_start in occurrence_starts:
                event_instance = copy.copy(event)
                event_instance.occurrence_start_at = occurrence_start
                event_instance.occurrence_end_at = (
                    occurrence_start + event.duration if event.duration else None
                )
                expanded_events.append(event_instance)

        expanded_events.sort(
            key=lambda item: getattr(item, "occurrence_start_at", item.start_at),
            reverse=temporal_status == "past",
        )
        serializer = self.get_serializer(expanded_events, many=True)
        return Response(serializer.data)


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
