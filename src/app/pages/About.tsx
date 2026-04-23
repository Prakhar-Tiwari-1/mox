import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { leadershipFallback, type LeadershipMember } from '../../lib/siteContent';
import { Skeleton } from '../components/ui/skeleton';
import { fetchLeadership } from '../../lib/moxApi';

export default function About() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await fetchLeadership();
        if (!data || data.length === 0) {
          setMembers(leadershipFallback);
          return;
        }
        setMembers(data);
      } catch (error) {
        console.error('Error loading leadership members:', error);
        setMembers(leadershipFallback);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const orderedMembers = useMemo(
    () => [...members].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [members],
  );

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About MoX</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Meet the student team behind MoX and the people coordinating representation, clubs, events, and student life for the MScT community.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Leadership Team</h2>
            <p className="text-lg text-gray-700">
              Open each profile to see the member's role, contact information, and a fuller overview of what they do inside MoX.
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="w-full h-44 rounded-xl mb-3" />
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {orderedMembers.map((member) => (
                <Link
                  key={member.id}
                  to={`/about/${member.slug || member.id}`}
                  className="text-left block"
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/4.4] overflow-hidden bg-[#f3f8fb]">
                      <ImageWithFallback
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${member.image_focus_x ?? 50}% ${member.image_focus_y ?? 18}%`,
                        }}
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg leading-tight">{member.name}</CardTitle>
                      <CardDescription className="text-[#0c1c3b] font-semibold">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.summary || member.bio}</p>
                      <p className="text-sm font-medium text-[#0c1c3b] mt-3">View full profile</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
