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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();

    // Set up real-time subscription for events changes
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Add new event to the list
            setEvents((prevEvents) => [payload.new as Event, ...prevEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
          } else if (payload.eventType === 'UPDATE') {
            // Update existing event
            setEvents((prevEvents) =>
              prevEvents.map((e) => (e.id === payload.new.id ? (payload.new as Event) : e)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted event
            setEvents((prevEvents) => prevEvents.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      // Clean up subscription on unmount
      supabase.removeChannel(channel);
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (fetchError) {
        console.error('Error fetching events:', fetchError);
        setError('Unable to load events from database. Showing sample data.');
        setEvents(getSampleEvents());
      } else {
        setEvents(data && data.length > 0 ? data : getSampleEvents());
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Unable to load events. Showing sample data.');
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  const getSampleEvents = (): Event[] => [
    {
      id: '1',
      title: 'X Got Talent',
      description: "MoX's biggest annual showcase event — an open stage where Masters students perform in front of the entire Polytechnique community. From music and comedy to dance and spoken word, X Got Talent celebrates the creative talent of MX.",
      date: '2026-02-15',
      time: '19:00',
      location: 'Grand Hall, École Polytechnique',
      image_url: '/images/events/event-1.jpg',
      category: 'Showcase',
      status: 'upcoming',
      price: 0,
      max_attendees: 500
    },
    {
      id: '2',
      title: 'MScT Gala',
      description: 'The annual formal gala for all Masters students — an evening of celebration, networking, and elegance bringing together the MX community at the end of the year.',
      date: '2026-06-20',
      time: '20:00',
      location: 'Le Pavillon Royal, Paris',
      image_url: '/images/events/event-2.jpg',
      category: 'Social',
      status: 'upcoming',
      price: 60,
      max_attendees: 400
    },
    {
      id: '3',
      title: 'Bloom X Party',
      description: 'MoX\'s signature social event welcoming the new Masters cohort at the start of the academic year — a night to connect, celebrate, and kick off the year together.',
      date: '2026-09-10',
      time: '21:00',
      location: 'K-Fêt, École Polytechnique',
      image_url: '/images/events/event-3.jpg',
      category: 'Party',
      status: 'upcoming',
      price: 15,
      max_attendees: 300
    },
    {
      id: '4',
      title: 'Company Cocktail Evenings',
      description: 'Intimate evening events where MoX partner companies meet Masters students in a relaxed, professional setting — combining networking with genuine conversation.',
      date: '2026-03-05',
      time: '18:30',
      location: 'Drahi X-Novation Center',
      image_url: '/images/events/event-4.jpg',
      category: 'Networking',
      status: 'upcoming',
      price: 0,
      max_attendees: 80
    },
    {
      id: '5',
      title: 'Community Outings',
      description: 'From group hikes in the Chevreuse Valley to visits to Park Astérix — MoX organises regular social outings to help students step off campus and connect.',
      date: '2026-05-15',
      time: '09:00',
      location: 'Park Astérix / Chevreuse',
      image_url: '/images/events/event-5.jpg',
      category: 'Outing',
      status: 'upcoming',
      price: 35,
      max_attendees: 100
    }
  ];

  const upcomingEvents = events.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => e.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const EventCard = ({ event }: { event: Event }) => (
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
            <Calendar className="h-4 w-4 text-[#0f3d5f]" />
            <span>{new Date(event.date).toLocaleDateString('en-GB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#0f3d5f]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-[#0f3d5f]" />
            <span>Max {event.max_attendees} attendees</span>
          </div>
        </div>
        <Link to={`/events/${event.id}`}>
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f3d5f] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">MoX Events</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            From flagship celebrations to company cocktails — MoX brings the Masters community to life throughout the year.
          </p>
        </div>
      </section>

      {/* Events Content */}
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
                  <p className="text-gray-500">Check back soon for new events!</p>
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
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
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
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Past Events</h3>
                  <p className="text-gray-500">Past events will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Weekly Activities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Weekly Activities</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Beyond our major flagship events, MoX and our associated student clubs (binets) host a variety of recurring weekly activities designed to keep the community active, engaged, and connected. 
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li><strong>Professional Development:</strong> Small-group workshops on CV building, interview prep, and technical skills.</li>
              <li><strong>Sports & Wellness:</strong> Weekly football matches, running clubs, and bouldering sessions.</li>
              <li><strong>Arts & Culture:</strong> Music jam sessions, cooking classes by MXter Chef, and game nights hosted by JeuX.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Mark Your Calendar</h2>
          <p className="text-lg text-gray-700 mb-8">
            View all our upcoming activities, workshops, and flagship events in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/calendar">
              <Button size="lg">
                View Full Calendar
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}