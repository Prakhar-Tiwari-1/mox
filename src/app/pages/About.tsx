import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../../lib/supabase';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  order: number;
}

export default function About() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCommitteeMembers();
  }, []);

  const loadCommitteeMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('committee_members')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) {
        console.error('Error fetching committee members:', fetchError);
        // Use sample data as fallback
        setMembers(getSampleMembers());
      } else {
        setMembers(data || getSampleMembers());
      }
    } catch (err) {
      console.error('Error loading committee members:', err);
      setError('Unable to load committee members. Showing sample data.');
      setMembers(getSampleMembers());
    } finally {
      setLoading(false);
    }
  };

  const getSampleMembers = (): CommitteeMember[] => [
    {
      id: '1',
      name: 'Prakhar Tiwari',
      role: 'Ai-Vic',
      bio: 'Sponsorship & External Relations Lead',
      image_url: 'images/team/member-1.jpeg',
      order: 1
    },
    {
      id: '2',
      name: 'George EL KERR',
      role: 'EESM-Vic',
      bio: 'Secretary General',
      image_url: '/images/team/member-2.jpeg',
      order: 2
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      role: 'Treasurer',
      bio: 'Ensuring financial sustainability and transparency.',
      image_url: '/images/team/member-3.jpeg',
      order: 3
    },
    {
      id: '4',
      name: 'David Okonkwo',
      role: 'Secretary',
      bio: 'Committed to clear communication and member support.',
      image_url: '/images/team/member-4.jpeg',
      order: 4
    }
  ];

  const coreValues = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do.'
    },
    {
      title: 'Integrity',
      description: 'We maintain transparency and ethical conduct in all our operations.'
    },
    {
      title: 'Innovation',
      description: 'We embrace new ideas and encourage creative problem-solving.'
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of working together to achieve common goals.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f3d5f] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Learn more about our mission, values, and the dedicated team behind our association.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2010, our association has grown from a small group of dedicated professionals 
                  into a thriving community of industry leaders, innovators, and change-makers. We are 
                  committed to fostering excellence and supporting the professional development of our members.
                </p>
                <p>
                  Over the years, we have organized hundreds of events, facilitated countless networking 
                  opportunities, and provided invaluable resources to help our members succeed in their careers.
                </p>
                <p>
                  Today, we are proud to serve over 5,000 members across Europe, offering a platform for 
                  collaboration, learning, and growth that continues to evolve with the changing needs of 
                  our professional community.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="/images/about-office.jpg"
                  alt="Our office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#0f3d5f]">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Leadership Team</h2>
          
          {error && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="w-full h-48 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member) => (
                <Card key={member.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="aspect-square overflow-hidden rounded-lg mb-4">
                      <ImageWithFallback
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-[#0f3d5f] font-semibold">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Find Us</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#0f3d5f] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">
                        123 Professional Avenue<br />
                        Brussels, 1000<br />
                        Belgium
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-[#0f3d5f] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href="tel:+32123456789" className="text-gray-600 hover:text-[#0f3d5f]">
                        +32 1 234 567 89
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-[#0f3d5f] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:info@association.eu" className="text-gray-600 hover:text-[#0f3d5f]">
                        info@association.eu
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#0f3d5f] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Office Hours</p>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="h-full">
                <CardContent className="p-0 h-full min-h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.1983449613245!2d4.3515!3d50.8465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDUwJzQ3LjQiTiA0wrAyMScwNS40IkU!5e0!3m2!1sen!2sbe!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office location map"
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}