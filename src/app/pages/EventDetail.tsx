import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  category: string;
  status: 'upcoming' | 'past';
  price: number;
  max_attendees: number;
}

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
    }
  }, [eventId]);

  const loadEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !data) {
        console.log('Event not found in Supabase, checking sample data');
        const sampleEvent = getSampleEvent(id);
        if (sampleEvent) {
          setEvent(sampleEvent);
        } else {
          setError('Event not found');
        }
      } else {
        setEvent(data);
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Unable to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const getSampleEvent = (id: string): Event | null => {
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Annual Business Summit 2026',
        description: 'Join industry leaders for our flagship annual event featuring keynote speakers, panel discussions, and networking opportunities. This comprehensive summit brings together professionals from across Europe to discuss the latest trends, challenges, and opportunities in our industry.\n\nThe event will feature:\n• Keynote presentations from industry thought leaders\n• Interactive panel discussions\n• Networking sessions and workshops\n• Exhibition hall showcasing innovative solutions\n• Gala dinner and awards ceremony\n\nDon\'t miss this opportunity to connect with peers, gain valuable insights, and advance your career.',
        date: '2026-04-15',
        time: '09:00',
        location: 'Brussels Convention Center, Avenue des Arts 20, 1000 Brussels',
        image_url: '/images/events/event-1.jpg',
        category: 'Conference',
        status: 'upcoming',
        price: 150,
        max_attendees: 500
      },
      {
        id: '2',
        title: 'Professional Development Workshop',
        description: 'Enhance your skills with expert-led training sessions covering the latest industry trends and best practices. This hands-on workshop is designed for professionals looking to advance their careers and stay competitive in today\'s rapidly evolving business landscape.',
        date: '2026-04-22',
        time: '14:00',
        location: 'Association Headquarters, 123 Professional Avenue, Brussels',
        image_url: '/images/events/event-2.jpg',
        category: 'Workshop',
        status: 'upcoming',
        price: 75,
        max_attendees: 50
      },
      {
        id: '3',
        title: 'Networking Mixer',
        description: 'Connect with fellow professionals in a relaxed setting. Includes refreshments and interactive activities.',
        date: '2026-05-10',
        time: '18:00',
        location: 'The Grand Hotel Brussels',
        image_url: '/images/events/event-3.jpg',
        category: 'Networking',
        status: 'upcoming',
        price: 0,
        max_attendees: 100
      },
      {
        id: '4',
        title: 'Innovation Summit 2026',
        description: 'Explore cutting-edge innovations and technologies shaping the future of our industry.',
        date: '2026-06-05',
        time: '10:00',
        location: 'European Innovation Center',
        image_url: '/images/events/event-4.jpg',
        category: 'Conference',
        status: 'upcoming',
        price: 200,
        max_attendees: 300
      },
      {
        id: '5',
        title: 'Winter Gala 2025',
        description: 'Our annual celebration brought together members for an evening of recognition and celebration.',
        date: '2025-12-15',
        time: '19:00',
        location: 'Royal Palace Brussels',
        image_url: '/images/events/event-5.jpg',
        category: 'Social',
        status: 'past',
        price: 100,
        max_attendees: 200
      },
      {
        id: '6',
        title: 'Leadership Forum 2025',
        description: 'Past event featuring distinguished speakers sharing insights on effective leadership.',
        date: '2025-10-20',
        time: '09:00',
        location: 'Brussels Business Center',
        image_url: '/images/events/event-6.jpg',
        category: 'Conference',
        status: 'past',
        price: 125,
        max_attendees: 150
      }
    ];

    return sampleEvents.find(e => e.id === id) || null;
  };

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
                <Skeleton className="h-6 w-4/5" />
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
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/events" className="inline-flex items-center text-[#0c1c3b] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
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

            {/* Sidebar */}
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
                          day: 'numeric' 
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
                      <Link to="/contact">
                        <Button className="w-full" size="lg">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
