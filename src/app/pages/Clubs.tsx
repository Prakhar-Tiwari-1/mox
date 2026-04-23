import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { clubsFallback, type ClubProfile } from '../../lib/siteContent';
import { fetchClubs } from '../../lib/moxApi';
import { Skeleton } from '../components/ui/skeleton';

export default function Clubs() {
  const [clubs, setClubs] = useState<ClubProfile[]>(clubsFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        const data = await fetchClubs();
        setClubs(data);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">MoX Clubs</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Explore the student clubs that animate the MScT community. This section is already structured to become fully editable from the backend.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-[16/10] w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
              : clubs.map((club) => (
              <Card key={club.id} className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={club.image_url}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>{club.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-4">{club.description}</p>
                  <Button asChild className="w-full">
                    <Link to={`/clubs/${club.slug}`}>
                      Open club page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
