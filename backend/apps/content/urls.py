from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .api import ClubViewSet, ContactMessageCreateAPIView, EventViewSet, FAQItemViewSet, LeadershipMemberViewSet

router = DefaultRouter()
router.register("clubs", ClubViewSet, basename="club")
router.register("leadership", LeadershipMemberViewSet, basename="leadership")
router.register("events", EventViewSet, basename="event")
router.register("faqs", FAQItemViewSet, basename="faq")

urlpatterns = [
    path("", include(router.urls)),
    path("contact/messages/", ContactMessageCreateAPIView.as_view(), name="contact-message-create"),
]
