import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, Megaphone, Briefcase, Handshake } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { fetchFeaturedEvents, type PublicEvent } from '../../lib/moxApi';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setLoading(true);
        setEventsError(null);

        const data = await fetchFeaturedEvents();
        if (!data || data.length === 0) {
          setFeaturedEvents(getSampleFeaturedEvents());
          setEventsError('Featured events are temporarily showing fallback content.');
          return;
        }

        setFeaturedEvents(data);
      } catch (error) {
        console.error('Error loading featured events:', error);
        setFeaturedEvents(getSampleFeaturedEvents());
        setEventsError('Featured events are temporarily showing fallback content.');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedEvents();
  }, []);

  const getSampleFeaturedEvents = (): PublicEvent[] => [
    {
      id: '1',
      title: 'MX Bloom',
      date: '2026-03-20',
      image_url: '/images/events/event-1.jpg',
      description: 'A flagship social moment for the MScT community, bringing students together through celebration, music, and shared experience.',
      time: '19:00',
      location: 'École Polytechnique',
      category: 'Event',
      status: 'upcoming',
      max_attendees: 200,
    },
    {
      id: '2',
      title: 'Park Astérix Trip',
      date: '2026-05-15',
      image_url: '/images/events/event-2.jpg',
      description: 'A day outside campus designed to create stronger connections across the Masters community.',
      time: '09:00',
      location: 'Île-de-France',
      category: 'Event',
      status: 'upcoming',
      max_attendees: 120,
    },
    {
      id: '3',
      title: 'MScT Gala',
      date: '2026-06-20',
      image_url: '/images/events/event-1.jpg',
      description: 'The annual gala evening for MScT students, combining celebration, elegance, and community visibility.',
      time: '20:00',
      location: 'Paris',
      category: 'Event',
      status: 'upcoming',
      max_attendees: 300,
    },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/hero-team.png')" }}
      >
        <div className="absolute inset-0 bg-[#0a203c]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            The Voice of Masters Students at École Polytechnique
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            MoX represents the MScT community, supports student clubs, organises key events, and acts as the bridge between Masters students and the school administration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-[#0a203c] hover:bg-white/90">
              <Link to="/about">Meet the team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white bg-transparent hover:bg-white hover:text-[#0a203c]">
              <Link to="/contact">Contact MoX</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">What MoX Does</h2>
          <p className="text-lg text-gray-700 leading-8 max-w-3xl mx-auto">
            MoX is the official student body for Masters of Science and Technology students at École Polytechnique. We represent the MScT community, support student clubs, organise flagship events, and help create a stronger academic and social experience throughout the year.
          </p>
        </div>
      </section>

      <section className="py-16 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0a203c] rounded-full flex items-center justify-center mb-4">
                  <Megaphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Represent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We act as the student voice of the MScT community in conversations with the administration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0a203c] rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Organise</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We deliver the key community moments that shape MScT student life across the year.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0a203c] rounded-full flex items-center justify-center mb-4">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We support student clubs and help them build activities, visibility, and community on campus.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0a203c] rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We create bridges between students, alumni, partners, and future opportunities for the community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              <p className="text-gray-600 mt-2">
                This section is designed to become fully backend-managed, including featured toggles and event status handling.
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {eventsError && (
            <Alert className="mb-8">
              <AlertDescription>{eventsError}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="aspect-[16/9] w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[16/9] overflow-hidden">
                    <ImageWithFallback
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="text-sm text-[#0a203c] font-semibold mb-2">
                      {new Date(event.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/events/${event.slug || event.id}`}>
                      <Button variant="link" className="p-0 h-auto text-[#0a203c]">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Work with MoX</h2>
          <p className="text-lg text-gray-700 mb-8">
            Whether you want to support the MScT community, partner on an event, or get in touch with the student body, we would love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/partnership">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Partner With Us
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact MoX
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
