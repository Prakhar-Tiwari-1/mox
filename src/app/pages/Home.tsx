import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Users, Calendar, Award, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../../lib/supabase';
import { Skeleton } from '../components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string;
  description: string;
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, image_url, description')
        .eq('status', 'upcoming')
        .order('date', { ascending: true })
        .limit(2);

      if (error || !data || data.length === 0) {
        setFeaturedEvents(getSampleFeaturedEvents());
      } else {
        setFeaturedEvents(data);
      }
    } catch (err) {
      console.error('Error loading featured events:', err);
      setFeaturedEvents(getSampleFeaturedEvents());
    } finally {
      setLoading(false);
    }
  };

  const getSampleFeaturedEvents = (): Event[] => [
    {
      id: '1',
      title: 'Annual Business Summit 2026',
      date: '2026-04-15',
      image_url: '/images/events/event-1.jpg',
      description: 'Join industry leaders for our flagship annual event.'
    },
    {
      id: '2',
      title: 'Professional Development Workshop',
      date: '2026-04-22',
      image_url: '/images/events/event-2.jpg',
      description: 'Enhance your skills with expert-led training sessions.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f3d5f] to-[#1a5a7f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Building Excellence Together
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                A professional community dedicated to innovation, collaboration, and continuous growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/membership">
                  <Button size="lg" variant="secondary" className="group">
                    Become a Member
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="/images/hero-team.png"
                  alt="Professional team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are committed to fostering a vibrant community of professionals who strive for excellence, 
            embrace innovation, and support one another's growth. Through networking events, educational 
            programs, and collaborative initiatives, we empower our members to achieve their full potential 
            and make meaningful contributions to their fields.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Why Join Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0f3d5f] rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with like-minded professionals and expand your network across industries.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0f3d5f] rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access exclusive events, workshops, and conferences designed for professional growth.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0f3d5f] rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gain recognition and credibility through our prestigious membership program.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#0f3d5f] rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access valuable resources, publications, and industry insights exclusively for members.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
            <Link to="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
             <div className="grid md:grid-cols-2 gap-8">
               <Skeleton className="aspect-[16/9] w-full" />
               <Skeleton className="aspect-[16/9] w-full" />
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
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
                    <div className="text-sm text-[#0f3d5f] font-semibold mb-2">
                       {new Date(event.date).toLocaleDateString('en-GB', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="link" className="p-0 h-auto text-[#0f3d5f]">
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

      {/* CTA Section */}
      <section className="py-16 bg-[#0f3d5f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join our growing community of professionals committed to excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/membership">
              <Button size="lg" variant="secondary">
                Become a Member
              </Button>
            </Link>
            <Link to="/partnership">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#0f3d5f]">
                Download Brochure
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#0f3d5f]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}