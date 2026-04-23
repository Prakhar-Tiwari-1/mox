import { clubsFallback, faqFallback, leadershipFallback, type ClubProfile, type FAQItem, type LeadershipMember } from './siteContent';

const API_BASE = (import.meta.env.VITE_MOX_API_BASE_URL || '/api').replace(/\/$/, '');

export interface PublicEvent {
  id: string;
  slug?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  category: string;
  status: 'upcoming' | 'past';
  max_attendees: number;
  club_name?: string;
  is_featured?: boolean;
  registration_url?: string;
  assets?: { id: string; title: string; kind: string; file_url: string; display_order: number }[];
}

function toEvent(raw: any): PublicEvent {
  const startAt = raw.start_at ? new Date(raw.start_at) : null;
  return {
    id: raw.instance_id || raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description || '',
    date: startAt ? startAt.toISOString().slice(0, 10) : raw.date || '',
    time: startAt
      ? startAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
      : raw.time || '',
    location: raw.location || '',
    image_url: raw.image_url || '/images/events/event-1.jpg',
    category: raw.club_name || raw.category || 'Event',
    status: raw.temporal_status || raw.status || 'upcoming',
    max_attendees: raw.max_attendees ?? 100,
    club_name: raw.club_name,
    is_featured: raw.is_featured,
    registration_url: raw.registration_url || '',
    assets: Array.isArray(raw.assets) ? raw.assets : [],
  };
}

function toLeadership(raw: any): LeadershipMember {
  const fallbackByName = new Map(leadershipFallback.map((member) => [member.name, member]));
  const fallback = fallbackByName.get(raw.name);
  return {
    id: raw.id,
    slug: raw.slug || fallback?.slug,
    name: raw.name,
    role: raw.role,
    summary: raw.summary || fallback?.summary || '',
    bio: raw.description || raw.bio || fallback?.bio || '',
    responsibilities: raw.responsibilities || fallback?.responsibilities || '',
    image_focus_x: raw.image_focus_x ?? fallback?.image_focus_x ?? 50,
    image_focus_y: raw.image_focus_y ?? fallback?.image_focus_y ?? 18,
    image_url: raw.image_url || fallback?.image_url || '/images/team/member-1.jpg',
    order: raw.display_order ?? raw.order ?? fallback?.order ?? 999,
    email: raw.email || fallback?.email,
    phone: raw.phone || fallback?.phone,
  };
}

function toClub(raw: any): ClubProfile {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline || '',
    description: raw.description || '',
    image_url: raw.image_url || '/images/events/event-1.jpg',
    contact_email: raw.contact_email || '',
    contact_phone: raw.contact_phone || '',
    members: Array.isArray(raw.members)
      ? raw.members.map((member: any) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          description: member.description || '',
          image_url: member.image_url || '',
          email: member.email || '',
          phone: member.phone || '',
        }))
      : [],
    events: Array.isArray(raw.events)
      ? raw.events.map((event: any) => {
          const startAt = event.start_at ? new Date(event.start_at) : null;
          return {
            id: event.instance_id || event.id,
            slug: event.slug,
            title: event.title,
            date: startAt ? startAt.toISOString().slice(0, 10) : '',
            time: startAt
              ? startAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
              : '',
            location: event.location || '',
          };
        })
      : [],
    sections: Array.isArray(raw.sections)
      ? raw.sections.map((section: any) => ({
          id: section.id,
          title: section.title,
          slug: section.slug,
          kind: section.kind,
          content: section.content || '',
          images: Array.isArray(section.images)
            ? section.images.map((image: any) => ({
                id: image.id,
                image_url: image.image_url || '',
                caption: image.caption || '',
                display_order: image.display_order ?? 0,
              }))
            : [],
        }))
      : [],
  };
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Failed request: ${response.status}`);
  }
  return response.json();
}

export async function fetchFeaturedEvents(): Promise<PublicEvent[]> {
  try {
    const data = await getJson<any[]>(`/events/?featured=true&temporal_status=upcoming`);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No featured events');
    }
    return data.map(toEvent);
  } catch {
    return [];
  }
}

export async function fetchEvents(): Promise<PublicEvent[]> {
  const data = await getJson<any[]>(`/events/`);
  return data.map(toEvent);
}

export async function fetchEvent(slugOrId: string): Promise<PublicEvent | null> {
  try {
    const bySlug = await getJson<any>(`/events/${slugOrId}/`);
    return toEvent(bySlug);
  } catch {
    const all = await fetchEvents();
    return all.find((event) => event.id === slugOrId) || null;
  }
}

export async function fetchLeadership(): Promise<LeadershipMember[]> {
  try {
    const data = await getJson<any[]>(`/leadership/`);
    if (!Array.isArray(data) || data.length === 0) {
      return leadershipFallback;
    }
    return data.map(toLeadership);
  } catch {
    return leadershipFallback;
  }
}

export async function fetchClubs(): Promise<ClubProfile[]> {
  try {
    const data = await getJson<any[]>(`/clubs/`);
    if (!Array.isArray(data) || data.length === 0) {
      return clubsFallback;
    }
    return data.map(toClub);
  } catch {
    return clubsFallback;
  }
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  try {
    const data = await getJson<any[]>(`/faqs/`);
    if (!Array.isArray(data) || data.length === 0) {
      return faqFallback;
    }
    return data.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      display_order: item.display_order ?? 0,
    }));
  } catch {
    return faqFallback;
  }
}

export async function fetchClub(slug: string): Promise<ClubProfile | null> {
  try {
    const data = await getJson<any>(`/clubs/${slug}/`);
    return toClub(data);
  } catch {
    const fallback = clubsFallback.find((club) => club.slug === slug);
    return fallback || null;
  }
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}) {
  const response = await fetch(`${API_BASE}/contact/messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to send message');
  }

  return response.json();
}
