import { Link, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { type ClubProfile } from '../../lib/siteContent';
import { fetchClub } from '../../lib/moxApi';

export default function ClubDetail() {
  const { clubSlug } = useParams<{ clubSlug: string }>();
  const [club, setClub] = useState<ClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (!clubSlug) return;
    const loadClub = async () => {
      try {
        setLoading(true);
        setClub(await fetchClub(clubSlug));
      } finally {
        setLoading(false);
      }
    };
    loadClub();
  }, [clubSlug]);

  const customSections = useMemo(() => club?.sections || [], [club]);
  const hasEvents = !!club?.events?.length;
  const hasMembers = !!club?.members?.length;
  const hasContact = !!club?.contact_email || !!club?.contact_phone;

  const tabs = useMemo(() => {
    const baseTabs = [{ id: 'overview', label: 'Overview' }];
    if (hasEvents) baseTabs.push({ id: 'events', label: 'Club events' });
    if (hasMembers) baseTabs.push({ id: 'team', label: 'Team' });
    if (hasContact) baseTabs.push({ id: 'contact', label: 'Contact' });
    customSections.forEach((section) => baseTabs.push({ id: `section-${section.id}`, label: section.title }));
    return baseTabs;
  }, [customSections, hasContact, hasEvents, hasMembers]);

  if (loading) {
    return <div className="min-h-screen" />;
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Club not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">This club page has not been configured yet.</p>
            <Button asChild>
              <Link to="/clubs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to clubs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/clubs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to clubs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{club.name}</h1>
          <p className="text-xl text-white/90 max-w-3xl">{club.tagline}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <ImageWithFallback
                src={club.image_url}
                alt={club.name}
                className="w-full h-[320px] object-cover"
              />
            </div>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#0c1c3b] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">About this club</h2>
                  <p className="text-lg text-gray-700 leading-8">{club.description}</p>
                </div>
              )}

              {activeTab === 'events' && hasEvents && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Club events calendar</h2>
                  <div className="grid gap-4">
                    {club.events?.map((event) => (
                      <Link key={event.id} to={`/events/${event.slug || event.id}`} className="rounded-2xl border border-gray-200 p-5 hover:border-[#0c1c3b] hover:shadow-md transition-all">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {event.time ? ` at ${event.time}` : ''}
                        </p>
                        {event.location && <p className="text-sm text-gray-500 mt-1">{event.location}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && hasMembers && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Affiliated team</h2>
                  <div className="space-y-5">
                    {club.members?.map((member) => (
                      <div key={member.id} className="flex gap-4 items-start">
                        {member.image_url ? (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                            <ImageWithFallback src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0" />
                        )}
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-[#0c1c3b] font-medium">{member.role}</p>
                          {member.description && <p className="text-sm text-gray-600 leading-6">{member.description}</p>}
                          <div className="flex flex-col gap-1 text-sm">
                            {member.email && <a href={`mailto:${member.email}`} className="text-[#0c1c3b] hover:underline">{member.email}</a>}
                            {member.phone && <a href={`tel:${member.phone}`} className="text-[#0c1c3b] hover:underline">{member.phone}</a>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && hasContact && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Club contact</h2>
                  <div className="space-y-4">
                    {club.contact_email && (
                      <a href={`mailto:${club.contact_email}`} className="flex items-center gap-3 text-[#0c1c3b] hover:underline">
                        <Mail className="h-4 w-4" />
                        {club.contact_email}
                      </a>
                    )}
                    {club.contact_phone && (
                      <a href={`tel:${club.contact_phone}`} className="flex items-center gap-3 text-[#0c1c3b] hover:underline">
                        <Phone className="h-4 w-4" />
                        {club.contact_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {customSections.map((section) => (
                activeTab === `section-${section.id}` ? (
                  <div key={section.id} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    {section.kind === 'gallery' ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {section.images?.map((image) => (
                          <div key={image.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <ImageWithFallback src={image.image_url} alt={image.caption || section.title} className="w-full h-56 object-cover" />
                            {image.caption && <p className="px-4 py-3 text-sm text-gray-600">{image.caption}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-gray-700 leading-8 whitespace-pre-line">{section.content}</p>
                      </div>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
