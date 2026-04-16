import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, Megaphone, Briefcase, Handshake, MapPin, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../../lib/supabase';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';

interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string;
  description: string;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  order: number;
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedEvents();
    loadCommitteeMembers();
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
      title: 'MX Bloom',
      date: '2026-03-20',
      image_url: '/images/events/event-1.jpg',
      description: 'The annual celebration of the blooming MX community, featuring music, food, and incredible networking.'
    },
    {
      id: '2',
      title: 'Park Asterisk Trip',
      date: '2026-05-15',
      image_url: '/images/events/event-2.jpg',
      description: 'A thrilling day out for students to take a break from studies and enjoy the iconic Park Asterisk.'
    },
    {
      id: '3',
      title: 'Park Asterisk Trip',
      date: '2026-05-15',
      image_url: '/images/events/event-2.jpg',
      description: 'A thrilling day out for students to take a break from studies and enjoy the iconic Park Asterisk.'
    }
  ];

  const getSampleMembers = (): CommitteeMember[] => [
  {
    id: '1',
    name: 'George El Kerr',
    role: 'Secretary General',
    bio: 'Leading organizational strategy and coordination at EESM.',
    image_url: '/images/team/member-1.jpeg',
    order: 1
  },
  {
    id: '2',
    name: 'Jude Abou Daher',
    role: 'Communications',
    bio: 'Handles communications and outreach for EESM.',
    image_url: '/images/team/member-2.jpeg',
    order: 2
  },
  {
    id: '3',
    name: 'Vaughn Janes',
    role: 'Events',
    bio: 'Responsible for organizing cybersecurity and event initiatives.',
    image_url: '/images/team/member-3.jpeg',
    order: 3
  },
  {
    id: '4',
    name: 'Nader Al Masri',
    role: 'Pedagogical Affairs',
    bio: 'Works on IoT and pedagogical affairs within the committee.',
    image_url: '/images/team/member-4.jpeg',
    order: 4
  },
  {
    id: '5',
    name: 'Eliott Hawley',
    role: 'Treasurer',
    bio: 'Manages financial planning and budgeting for EDACF.',
    image_url: '/images/team/member-5.jpeg',
    order: 5
  },
  {
    id: '6',
    name: 'Alonso Hunter',
    role: 'Clubs',
    bio: 'Coordinates STEEM clubs and student activities.',
    image_url: '/images/team/member-6.jpeg',
    order: 6
  },
  {
    id: '7',
    name: 'Gabriel Halpin',
    role: 'Welcoming',
    bio: 'Leads welcoming and onboarding activities for STEEM.',
    image_url: '/images/team/member-7.jpeg',
    order: 7
  },
  {
    id: '8',
    name: 'Prakhar Tiwari',
    role: 'Sponsorship & External Relations',
    bio: 'Handles sponsorships and external partnerships for AI-VIC.',
    image_url: '/images/team/member-8.jpeg',
    order: 8
  },
  {
    id: '9',
    name: 'Abed El Rahman El Khatib',
    role: 'Academic & Internal Relations',
    bio: 'Manages academic and internal relations within EESM.',
    image_url: '/images/team/member-9.jpeg',
    order: 9
  },
  {
    id: '10',
    name: 'Jamil Jaber',
    role: 'Sports',
    bio: 'Responsible for sports activities under EDACF.',
    image_url: '/images/team/member-10.jpeg',
    order: 10
  },
  {
    id: '11',
    name: 'Aditya Krishnan',
    role: 'Infrastructure',
    bio: 'Oversees infrastructure and technical support for TRAI.',
    image_url: '/images/team/member-11.jpeg',
    order: 11
  }
];


  const coreValues = [
    {
      title: 'Excellence',
      description: 'Our students are selected from a global pool through one of the most rigorous academic selection processes in the world. We hold ourselves to the same standard in everything MoX does.'
    },
    {
      title: 'Integrity',
      description: 'We act as the trusted voice between Masters students and the school administration, always representing our community with full transparency and honesty.'
    },
    {
      title: 'Innovation',
      description: 'With programmes like ViCAI and DSAIB, our students are building the future of AI and data science. MoX reflects that same spirit of creative ambition.'
    },
    {
      title: 'Community',
      description: 'With 40+ nationalities in one cohort, MoX is one of the most internationally diverse student bodies in France. We celebrate and build on that richness every day.'
    }
  ];

  const loadCommitteeMembers = async () => {
    try {
      setLoadingMembers(true);
      setMembersError(null);

      const { data, error: fetchError } = await supabase
        .from('committee_members')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) {
        console.error('Error fetching committee members:', fetchError);
        setMembers(getSampleMembers());
      } else {
        setMembers((data as CommitteeMember[]) || getSampleMembers());
      }
    } catch (err) {
      console.error('Error loading committee members:', err);
      setMembersError('Unable to load committee members. Showing sample data.');
      setMembers(getSampleMembers());
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/hero-team.png')" }}
      >
        {/* Overlay to ensure text visibility */}
        <div className="absolute inset-0 bg-[#0a203c]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            The Voice of Masters Students at École Polytechnique
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            MoX represents 350+ graduate students across AI, data science, finance, energy, and beyond - one of the world's most selective and internationally diverse academic communities.
          </p>
        </div>
      </section>

      {/* What is MoX? (text-only, centered) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="max-w-3xl text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">What is MoX?</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  MoX is the official student body for all Masters of Science and Technology (MScT) students at École Polytechnique or l'X. We represent ~350 students from over 40 countries, studying across specialised programmes in AI, data science, energy transition, visual computing, and more.
                </p>
                <p>
                  We oversee all Masters student clubs (binets), manage their budgets, and organise major events like MX Bloom, Trip to Park Asterisk and much more. Throughout the year, we also serve as the institutional bridge between students and the school administration - including regular engagement with the Directrice Générale of École Polytechnique.
                </p>
                <p className="text-gray-900 font-medium">
                  MoX is not a club. We are the student body for the entire MX community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">What MoX Does</h2>
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
                  We are the official institutional voice of all Masters students, engaging directly with school leadership on social and pedagogical matters.
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
                  From X Got Talent and the MScT Gala to hiking trips, company cocktails, career events, and Bloom X - we create the social and cultural life of the MX community.
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
                  We fund and oversee all Masters student clubs (binets), giving them the resources to run their events, projects, and initiatives throughout the year.
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
                  We bridge students and companies through partnerships, sponsorships, and career events. MoX co-organises X-Forum, École Polytechnique's prestigious annual career forum.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story (from About) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  MoX - the Masters Association of École Polytechnique (l'X) - is the permanent 
                  student body representing all students in the Masters of Science and Technology (MScT) programme.
                </p>
                <p>
                  Our community of ~300 students, growing to ~400, comes from over 40 countries and studies 
                  across some of the most specialised and competitive postgraduate programmes in Europe: 
                  from Visual & Creative AI (ViCAI) and Data Science & AI for Business (DSAIB) to energy 
                  transition, economics, and beyond.
                </p>
                <p>
                  We oversee all Masters student clubs (binets), fund their activities, and serve as the 
                  institutional representative of the MX community - engaging regularly with the school 
                  administration, including the Directrice Générale of École Polytechnique. We also play 
                  a key role in co-organising X-Forum, the school's prestigious annual career forum.
                </p>
                <p>
                  MoX is more than a student association - we are the permanent institutional body for the 
                  MX community at one of the world's most historically significant and selective engineering 
                  institutions, founded in 1794 by the French Republic and shaped by Napoleon.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="/images/about-office.jpg"
                  alt="École Polytechnique campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-[#0a203c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-blue-200">Students (growing to 400+)</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">40+</div>
              <div className="text-blue-200">Nationalities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-200">Masters programmes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Top 10</div>
              <div className="text-blue-200">Global ranking (QS)</div>
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
                  <CardTitle className="text-[#0a203c]">{value.title}</CardTitle>
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
          
          {membersError && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <AlertDescription>{membersError}</AlertDescription>
            </Alert>
          )}

          {loadingMembers ? (
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
                    <CardDescription className="text-[#0a203c] font-semibold">
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
                    <div className="text-sm text-[#0a203c] font-semibold mb-2">
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

      {/* Contact Information removed — content moved into Home earlier. */}

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Partner with MoX?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Connect with 300+ of the world's most talented Masters students at École Polytechnique.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/partnership-deck.pdf" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Download Partnership Deck
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}