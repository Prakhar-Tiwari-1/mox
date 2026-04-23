import { useEffect, useState } from 'react';
import { Mail, Instagram, MapPin, Send, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { fetchFaqs, submitContactMessage } from '../../lib/moxApi';
import { faqFallback, type FAQItem } from '../../lib/siteContent';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>(faqFallback);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    void (async () => {
      const data = await fetchFaqs();
      setFaqs(data);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await submitContactMessage({ name, email, subject, message, website });

      setSuccess(true);
      toast.success('Message sent successfully! We will get back to you soon.');

      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setWebsite('');

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              We're here to help and answer any questions you may have.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Message Sent Successfully!</CardTitle>
                <CardDescription>
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button onClick={() => setSuccess(false)} variant="outline">
                  Send Another Message
                </Button>
                <Button onClick={() => window.location.href = '/'} className="ml-2">
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            We're here to help and answer any questions you may have. We look forward to hearing from you.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-website" className="sr-only">Website</Label>
                      <Input
                        id="contact-website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="Website"
                        autoComplete="off"
                        tabIndex={-1}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input
                        id="contact-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mox@polytechnique.fr"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input
                        id="contact-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#0c1c3b] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:mox@polytechnique.fr" className="text-[#0c1c3b] hover:underline">
                        mox@polytechnique.fr
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        We'll respond within 24-48 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#0c1c3b] rounded-full flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instagram</h3>
                      <a
                        href="https://www.instagram.com/mox_polytechnique?igsh=MW9hbHprczh4Mmk1ZQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0c1c3b] hover:underline"
                      >
                        @mox_polytechnique
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Follow us for updates and events
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#0c1c3b] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-gray-700">
                        MoX Locale, Bâtiment 76 <br />
                        École Polytechnique<br />
                        78 Bd des Marechaux<br />
                        91120 Palaiseau, Île-de-France<br />
                        France
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-64">
                  <iframe
                    src="https://www.google.com/maps?q=Batiment+76+%C3%89cole+Polytechnique+78+Bd+des+Marechaux+91120+Palaiseau+Ile-de-France+France&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="location"
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
