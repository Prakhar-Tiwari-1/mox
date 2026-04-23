from __future__ import annotations

from datetime import datetime

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from apps.content.models import Club, ClubMember, Event, FAQItem, LeadershipMember, PublishStatus


LEADERSHIP_MEMBERS = [
    {
        "name": "Georges El Kerr",
        "role": "Secretary General",
        "summary": "Leads the strategic and operational coordination of MoX across the MScT community.",
        "description": "Leads the coordination of MoX operations, executive follow-up, and the broader association roadmap for the MScT community.",
        "responsibilities": "Coordinates executive priorities, ensures follow-up across initiatives, and helps align clubs, events, and representation efforts under the broader MoX roadmap.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Jude Abou Daher",
        "role": "Communications",
        "summary": "Shapes MoX communications, messaging, and visibility across student-facing channels.",
        "description": "Oversees communications, messaging, and visibility across student channels, event promotion, and community updates.",
        "responsibilities": "Leads communication planning, event promotion, social visibility, and the consistency of MoX messaging across outreach channels.",
        "image_focus_x": 44,
        "image_focus_y": 15,
        "display_order": 2,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Vaughn Janes",
        "role": "Events",
        "summary": "Helps design and deliver the main student-facing events that shape the MoX experience.",
        "description": "Helps shape and deliver MoX events, coordinating logistics, planning, and student-facing experiences throughout the year.",
        "responsibilities": "Supports planning, logistics, and execution for community events, ensuring that MoX programming remains engaging and well delivered.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 4,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Nader Al Masri",
        "role": "Pedagogical Affairs",
        "summary": "Represents academic and student-life concerns linked to the MScT journey at École Polytechnique.",
        "description": "Represents academic and student-life concerns, helping connect MScT students with the administration on pedagogical matters.",
        "responsibilities": "Acts as a bridge between MScT students and the administration on pedagogical topics, student concerns, and broader academic follow-up.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 3,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Eliott Hawley",
        "role": "Treasurer",
        "summary": "Oversees financial follow-up and budget stewardship across MoX activities and operations.",
        "description": "Manages budgeting, financial follow-up, and the allocation of resources that support MoX activities and student clubs.",
        "responsibilities": "Supervises budgeting, spending priorities, and the financial coordination needed to support events, clubs, and MoX operations.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 5,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Alonso Hunter",
        "role": "Clubs",
        "summary": "Supports student initiatives and strengthens the club ecosystem across the MScT community.",
        "description": "Coordinates club relations and helps ensure student initiatives, events, and activities across the MScT community are supported.",
        "responsibilities": "Works with clubs to coordinate initiatives, support new ideas, and strengthen the role of student-led activities inside MoX.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 6,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Gabriel Halpin",
        "role": "Welcoming",
        "summary": "Focuses on welcoming initiatives and student integration within the MoX community.",
        "description": "Supports welcoming initiatives and helps new students integrate smoothly into the MoX and École Polytechnique environment.",
        "responsibilities": "Designs and supports welcoming efforts that help new students integrate into MoX, the MScT community, and campus life.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 7,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Prakhar Tiwari",
        "role": "Sponsorship & External Relations",
        "summary": "Develops external partnerships and visibility opportunities that support MoX growth.",
        "description": "Develops external partnerships and sponsorship opportunities that support events, visibility, and MoX initiatives.",
        "responsibilities": "Builds external relationships, supports sponsorship outreach, and helps position MoX with partners beyond the student association.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 8,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Abed El Rahman El Khatib",
        "role": "Academic & Internal Relations",
        "summary": "Strengthens internal coordination and academic-facing relations for the MScT student body.",
        "description": "Works on internal coordination and academic-facing matters to keep the MScT student body connected and represented.",
        "responsibilities": "Supports academic-facing coordination, student representation, and stronger internal links across the MScT community.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 9,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Jamil Jaber",
        "role": "Sports",
        "summary": "Brings a stronger sports and wellbeing dimension to MoX student life.",
        "description": "Leads sports-related initiatives and helps activate the social and wellbeing side of MScT student life.",
        "responsibilities": "Coordinates sports-related initiatives and helps expand the social, recreational, and wellbeing side of the community.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 10,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "Aditya Krishnan",
        "role": "Infrastructure",
        "summary": "Supports the operational backbone and internal infrastructure behind MoX activities.",
        "description": "Supports the operational and infrastructure needs behind MoX activities, tools, and execution.",
        "responsibilities": "Helps ensure that the tools, operational setup, and internal systems behind MoX remain reliable and effective.",
        "image_focus_x": 50,
        "image_focus_y": 18,
        "display_order": 11,
        "status": PublishStatus.PUBLISHED,
    },
]

FAQ_ITEMS = [
    {
        "question": "How long does it take to process membership applications?",
        "answer": "Membership applications are typically processed within 3 to 5 business days. You will receive a confirmation email once your application is approved.",
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "question": "Can I cancel my event registration?",
        "answer": "Event registrations can generally be cancelled up to 7 days before the event. Please contact MoX with your registration details.",
        "display_order": 2,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "question": "Do you offer corporate partnerships?",
        "answer": "Yes. MoX works with partners and organisations on events, student engagement, and visibility opportunities. Please contact us for more details.",
        "display_order": 3,
        "status": PublishStatus.PUBLISHED,
    },
]

CLUBS = [
    {
        "name": "MXter Chef",
        "tagline": "Cooking, food culture, and shared tables.",
        "description": "MXter Chef brings students together around cooking, dinners, and food-centered community moments throughout the year.",
        "contact_email": "mox@polytechnique.fr",
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "MX Arts",
        "tagline": "Creative, visual, and performing arts for MScT students.",
        "description": "MX Arts creates space for artistic expression across music, visual arts, performances, and collaborative creative projects.",
        "contact_email": "mox@polytechnique.fr",
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "PolitiX",
        "tagline": "Debate, policy, and current affairs.",
        "description": "PolitiX hosts discussions, debates, and events around politics, geopolitics, and public affairs in the MScT community.",
        "contact_email": "mox@polytechnique.fr",
        "status": PublishStatus.PUBLISHED,
    },
    {
        "name": "JeuX",
        "tagline": "Games, tabletop, and social competition.",
        "description": "JeuX brings people together through board games, tournaments, and casual game nights designed for connection and fun.",
        "contact_email": "mox@polytechnique.fr",
        "status": PublishStatus.PUBLISHED,
    },
]

CLUB_MEMBERS = [
    {
        "club": "MXter Chef",
        "name": "Jude Abou Daher",
        "role": "Club manager",
        "description": "Coordinates club activities, dinners, and collaborations for food-centered community events.",
        "email": "mox@polytechnique.fr",
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "club": "MX Arts",
        "name": "Prakhar Tiwari",
        "role": "Creative lead",
        "description": "Helps curate visual and performing arts initiatives and coordinates collaborations across the MScT community.",
        "email": "mox@polytechnique.fr",
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "club": "PolitiX",
        "name": "Abed El Rahman El Khatib",
        "role": "Debate coordinator",
        "description": "Supports discussion formats, speaker outreach, and current-affairs programming for the club.",
        "email": "mox@polytechnique.fr",
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "club": "JeuX",
        "name": "Jamil Jaber",
        "role": "Community lead",
        "description": "Organises tournaments and social game sessions that bring MScT students together in a relaxed setting.",
        "email": "mox@polytechnique.fr",
        "display_order": 1,
        "status": PublishStatus.PUBLISHED,
    },
]

EVENTS = [
    {
        "title": "X Got Talent",
        "description": "MoX's annual showcase event where Masters students perform in front of the wider Polytechnique community.",
        "location": "Grand Hall, École Polytechnique",
        "start_at": "2026-05-15T19:00:00+02:00",
        "club": "MX Arts",
        "registration_url": "https://moxpolytechnique.com/contact",
        "is_featured": True,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "title": "MScT Gala",
        "description": "A formal evening of celebration, networking, and visibility for the MScT community.",
        "location": "Paris",
        "start_at": "2026-06-20T20:00:00+02:00",
        "registration_url": "https://gala.moxpolytechnique.com",
        "is_featured": True,
        "status": PublishStatus.PUBLISHED,
    },
    {
        "title": "Bloom X Party",
        "description": "MoX's signature social event welcoming the new Masters cohort at the start of the academic year.",
        "location": "École Polytechnique",
        "start_at": "2026-09-10T21:00:00+02:00",
        "club": "JeuX",
        "registration_url": "https://moxpolytechnique.com/contact",
        "is_featured": True,
        "status": PublishStatus.PUBLISHED,
    },
]


class Command(BaseCommand):
    help = "Seed the MoX backend with initial clubs, leadership, and events."

    def add_arguments(self, parser):
        parser.add_argument(
            "--refresh-defaults",
            action="store_true",
            help="Overwrite existing seeded objects with the default dataset.",
        )

    def handle(self, *args, **options):
        refresh_defaults = options["refresh_defaults"]

        for member_data in LEADERSHIP_MEMBERS:
            member, created = LeadershipMember.objects.get_or_create(
                name=member_data["name"],
                defaults=member_data,
            )
            if not created and refresh_defaults:
                for field, value in member_data.items():
                    setattr(member, field, value)
                member.save()

        for faq_data in FAQ_ITEMS:
            faq_item, created = FAQItem.objects.get_or_create(
                question=faq_data["question"],
                defaults=faq_data,
            )
            if not created and refresh_defaults:
                for field, value in faq_data.items():
                    setattr(faq_item, field, value)
                faq_item.save()

        for club_data in CLUBS:
            club, created = Club.objects.get_or_create(
                name=club_data["name"],
                defaults=club_data,
            )
            if not created and refresh_defaults:
                for field, value in club_data.items():
                    setattr(club, field, value)
                club.save()

        for member_data in CLUB_MEMBERS:
            club = Club.objects.get(name=member_data["club"])
            defaults = {
                key: value
                for key, value in member_data.items()
                if key != "club"
            }
            defaults["club"] = club
            club_member, created = ClubMember.objects.get_or_create(
                club=club,
                name=member_data["name"],
                defaults=defaults,
            )
            if not created and refresh_defaults:
                for field, value in defaults.items():
                    setattr(club_member, field, value)
                club_member.save()

        for event_data in EVENTS:
            parsed_start = datetime.fromisoformat(event_data["start_at"])
            if timezone.is_naive(parsed_start):
                parsed_start = timezone.make_aware(parsed_start)
            club = None
            club_name = event_data.get("club")
            if club_name:
                club = Club.objects.get(name=club_name)
            slug = slugify(event_data["title"])
            defaults = {
                **event_data,
                "start_at": parsed_start,
                "club": club,
                "slug": slug,
            }
            event, created = Event.objects.get_or_create(
                slug=slug,
                defaults=defaults,
            )
            if not created and refresh_defaults:
                for field, value in defaults.items():
                    setattr(event, field, value)
                event.save()

        self.stdout.write(self.style.SUCCESS("MoX backend seed data loaded."))
