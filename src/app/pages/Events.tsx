import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { fetchEvents, type PublicEvent } from '../../lib/moxApi';

const sampleEvents: PublicEvent[] = [
  {
    id: '1',
    slug: 'x-got-talent',
    title: 'X Got Talent',
    description: "MoX's annual showcase event where Masters students perform in front of the Polytechnique community.",
    date: '2026-02-15',
    time: '19:00',
    location: 'Grand Hall, École Polytechnique',
    image_url: '/images/events/event-1.jpg',
    category: 'Showcase',
    status: 'upcoming',
    max_attendees: 500,
  },
  {
    id: '2',
    slug: 'msct-gala',
    title: 'MScT Gala',
    description: 'The annual formal gala for the MScT community.',
    date: '2026-06-20',
    time: '20:00',
    location: 'Le Pavillon Royal, Paris',
    image_url: '/images/events/event-2.jpg',
    category: 'Social',
    status: 'upcoming',
    max_attendees: 400,
  },
];

export default function Events() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        setEvents(data.length ? data : sampleEvents);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Unable to load events from the backend. Showing fallback content.');
        setEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const upcomingEvents = events.filter((e) => e.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter((e) => e.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const EventCard = ({ event }: { event: PublicEvent }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="aspect-[16/9] overflow-hidden">
        <ImageWithFallback
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="flex-1">
        <div className="mb-2">
          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
            {event.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-[#0c1c3b]" />
            <span>
              {new Date(event.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} at {event.time}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#0c1c3b]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-[#0c1c3b]" />
            <span>Max {event.max_attendees} attendees</span>
          </div>
        </div>
        <Link to={`/events/${event.slug || event.id}`}>
          <Button className="w-full" variant={event.status === 'upcoming' ? 'default' : 'outline'}>
            {event.status === 'upcoming' ? 'Learn More & Register' : 'View Details'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">MoX Events</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            From flagship celebrations to club-driven moments, this page is now structured to be fully backend-managed.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <Alert className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <Skeleton className="w-full aspect-[16/9]" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
                  <p className="text-gray-500">Check back soon for new events.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <Skeleton className="w-full aspect-[16/9]" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : pastEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Past Events Yet</h3>
                  <p className="text-gray-500">Past events will appear here automatically.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
