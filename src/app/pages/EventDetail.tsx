import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { fetchEvent, type PublicEvent } from '../../lib/moxApi';

const sampleEvents: PublicEvent[] = [
  {
    id: '1',
    slug: 'x-got-talent',
    title: 'X Got Talent',
    description: 'An open stage where Masters students perform in front of the wider Polytechnique community.',
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
    description: 'A formal evening of celebration, networking, and visibility for the MScT community.',
    date: '2026-06-20',
    time: '20:00',
    location: 'Le Pavillon Royal, Paris',
    image_url: '/images/events/event-2.jpg',
    category: 'Social',
    status: 'upcoming',
    max_attendees: 400,
  },
];

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvent(eventId);
        if (data) {
          setEvent(data);
          return;
        }
        const fallback = sampleEvents.find((item) => item.id === eventId || item.slug === eventId);
        if (fallback) {
          setEvent(fallback);
          return;
        }
        setError('Event not found');
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Unable to load event details.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-32 mb-4" />
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="w-full aspect-[16/9] mb-8" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-2" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error || 'Event not found'}</AlertDescription>
            </Alert>
            <Link to="/events">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/events" className="inline-flex items-center text-[#0c1c3b] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
                <ImageWithFallback
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                  {event.category}
                </Badge>
                <Badge variant={event.status === 'upcoming' ? 'default' : 'outline'}>
                  {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-6 text-gray-900">{event.title}</h1>

              <div className="prose max-w-none text-gray-700">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-[#0c1c3b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Date</p>
                      <p className="text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#0c1c3b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Time</p>
                      <p className="text-gray-900">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#0c1c3b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-[#0c1c3b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Capacity</p>
                      <p className="text-gray-900">Max {event.max_attendees} attendees</p>
                    </div>
                  </div>

                  {event.status === 'upcoming' && (
                    <div className="pt-4">
                      {event.registration_url ? (
                        <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full" size="lg">
                            Register
                          </Button>
                        </a>
                      ) : (
                        <Link to="/contact">
                          <Button className="w-full" size="lg">
                            Register
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {event.assets && event.assets.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event media</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {event.assets.map((asset) => (
                  <Card key={asset.id} className="overflow-hidden">
                    {asset.kind === 'image' ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <ImageWithFallback src={asset.file_url} alt={asset.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] flex items-center justify-center bg-gray-100 text-gray-600">
                        Flyer / file
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href={asset.file_url} target="_blank" rel="noopener noreferrer" className="text-[#0c1c3b] hover:underline">
                        Open asset
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
