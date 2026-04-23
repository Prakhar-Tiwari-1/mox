import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Skeleton } from '../components/ui/skeleton';
import { leadershipFallback, type LeadershipMember } from '../../lib/siteContent';
import { fetchLeadership } from '../../lib/moxApi';

export default function LeadershipDetail() {
  const { memberSlug } = useParams<{ memberSlug: string }>();
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await fetchLeadership();
        setMembers(data?.length ? data : leadershipFallback);
      } catch (error) {
        console.error('Error loading leadership members:', error);
        setMembers(leadershipFallback);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const member = useMemo(
    () => members.find((item) => (item.slug || item.id) === memberSlug) || null,
    [members, memberSlug],
  );

  const profileIntro = member?.summary || member?.bio?.split('\n')[0] || '';
  const portraitFocusX = member?.image_focus_x ?? 46;
  const portraitFocusY = member?.image_focus_y ?? 18;

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-36 mb-8" />
            <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-10">
              <Skeleton className="w-full h-[520px] rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Profile not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">This leadership profile has not been configured yet.</p>
            <Button asChild>
              <Link to="/about">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to About Us
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(135deg,#09172f_0%,#0f2748_42%,#1d5a7f_100%)] text-white py-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(90deg,transparent_0,transparent_48%,rgba(255,255,255,0.08)_48%,transparent_50%,transparent_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to About Us
          </Link>
          <div className="max-w-4xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.36em] text-[#b8d9ef] mb-5">
              MoX Leadership
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{member.name}</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">{member.role}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_45%,#fbfcfd_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[1.75rem] border border-[#e5edf3] bg-white shadow-[0_20px_60px_rgba(12,28,59,0.10)]">
                <div className="aspect-[4/4.45] sm:aspect-[4/5] max-h-[360px] bg-[#eef4f8] overflow-hidden">
                  <ImageWithFallback
                    src={member.image_url}
                    alt={member.name}
                    className="h-full w-[112%] max-w-none -translate-x-[4%] object-cover scale-[1.16] sm:w-full sm:max-w-full sm:translate-x-0 sm:scale-[1.12]"
                    style={{
                      objectPosition: `${portraitFocusX}% ${portraitFocusY}%`,
                    }}
                  />
                </div>
                <div className="px-5 py-5 space-y-5">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f8ca4]">
                      MoX Leadership
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{member.name}</h2>
                    <p className="text-sm font-medium text-[#0c1c3b]">{member.role}</p>
                  </div>

                  <div className="h-px bg-[#e8eef3]" />

                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f8ca4]">
                      Contact details
                    </p>
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-start gap-3 text-[#0c1c3b] hover:underline"
                      >
                        <Mail className="h-4 w-4 flex-shrink-0 mt-1" />
                        <span className="break-all">{member.email}</span>
                      </a>
                    ) : (
                      <p className="text-gray-600">Email not published.</p>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-start gap-3 text-[#0c1c3b] hover:underline"
                      >
                        <Phone className="h-4 w-4 flex-shrink-0 mt-1" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 rounded-[1.75rem] border border-[#e5edf3] bg-white shadow-[0_20px_60px_rgba(12,28,59,0.08)] overflow-hidden">
              <div className="px-7 py-7 md:px-10 md:py-9 border-b border-[#edf2f6] bg-[linear-gradient(180deg,#fcfdff_0%,#f7fafc_100%)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6f8ca4] mb-4">
                  Profile
                </p>
                {profileIntro && (
                  <p className="text-base md:text-lg leading-8 text-gray-700 max-w-3xl">
                    {profileIntro}
                  </p>
                )}
              </div>

              <div className="px-7 py-8 md:px-10 md:py-10">
                <div className="space-y-8">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f8ca4] mb-4">
                      About
                    </p>
                    <div className="max-w-3xl">
                      <p className="text-lg leading-9 text-gray-700 whitespace-pre-line">{member.bio}</p>
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f8ca4] mb-4">
                      Responsibilities
                    </p>
                    <p className="text-gray-700 leading-8 max-w-3xl">
                      {member.responsibilities || (
                        <>
                          This role focuses on shaping initiatives, coordinating delivery, and representing MoX in the areas connected to <span className="font-semibold text-gray-900">{member.role}</span>.
                        </>
                      )}
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
