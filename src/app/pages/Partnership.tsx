import { Download, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Partnership() {
  // Static brochure path: place your PDF at `public/brochure.pdf`
  const brochureUrl = '/brochure.pdf';

  const benefits = [
    {
      title: 'Brand Visibility',
      description: 'Increase your brand exposure to our extensive network of professionals.'
    },
    {
      title: 'Networking Opportunities',
      description: 'Connect with industry leaders and decision-makers at exclusive events.'
    },
    {
      title: 'Thought Leadership',
      description: 'Position your organization as an industry leader through our platforms.'
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored partnership packages to meet your specific business objectives.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a203c] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Partnership</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Partner with us to expand your reach, enhance your brand, and contribute to professional excellence.
          </p>
        </div>
      </section>

      {/* Partnership Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Partner With Us?</h2>
              <p className="text-gray-700 mb-6">
                The X network is considered one of the most powerful professional networks in the world - alumni 
                include 3 French Presidents, 3 Nobel Prize winners, a Fields Medalist, and the CEOs of many
                 of France's largest companies.
              </p>
              <p className="text-gray-700 mb-8">
                We offer flexible partnership packages designed to align with your business goals and 
                maximize your return on investment.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={brochureUrl} download>
                  <Button size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Brochure
                  </Button>
                </a>
                <a href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="/images/partnership.jpg"
                  alt="Partnership"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Partnership Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-[#0a203c] rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers removed per request */}

      {/* Admin upload removed — place brochure at `public/brochure.pdf` to enable download */}
    </div>
  );
}