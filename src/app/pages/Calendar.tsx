import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { fetchEvents, type PublicEvent } from '../../lib/moxApi';

export default function Calendar() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await fetchEvents();
      setEvents(data.length > 0 ? data : getSampleEvents());
    } catch (err) {
      console.error('Error loading events:', err);
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  const getSampleEvents = (): PublicEvent[] => [
    { id: '1', slug: 'bloom-x-party', title: 'Bloom X Party', date: '2026-09-10', time: '21:00', category: 'Party', status: 'upcoming', description: '', location: '', image_url: '/images/events/event-1.jpg', max_attendees: 200 },
    { id: '2', slug: 'x-forum-career-fair', title: 'X-Forum Career Fair', date: '2026-10-15', time: '09:00', category: 'Partnership', status: 'upcoming', description: '', location: '', image_url: '/images/events/event-2.jpg', max_attendees: 200 },
    { id: '3', slug: 'x-got-talent', title: 'X Got Talent', date: '2026-02-15', time: '19:00', category: 'Showcase', status: 'upcoming', description: '', location: '', image_url: '/images/events/event-1.jpg', max_attendees: 300 },
    { id: '4', slug: 'msct-gala', title: 'MScT Gala', date: '2026-06-20', time: '20:00', category: 'Social', status: 'upcoming', description: '', location: '', image_url: '/images/events/event-2.jpg', max_attendees: 400 },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return events.filter(event => event.date.slice(0, 10) === dateStr);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0c1c3b] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">MoX Calendar</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Stay up to date with all MoX events, deadlines, and key academic dates.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What's on the Calendar?</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>MoX Events:</strong> Gala, Bloom X, X Got Talent, cocktails, and trips.</li>
              <li><strong>Club Events:</strong> Gatherings by PolitiX, MX Arts, MXter Chef, JeuX, etc.</li>
              <li><strong>Academic Dates:</strong> Exam periods, MScT registration deadlines, and holidays.</li>
              <li><strong>Partnership Events:</strong> Company visits, workshops, and embedded programmes.</li>
            </ul>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{monthName}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous month</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next month</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="w-full h-96" />
                  ) : (
                    <div className="grid grid-cols-7 gap-2">
                      {/* Week day headers */}
                      {weekDays.map((day) => (
                        <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                          {day}
                        </div>
                      ))}

                      {/* Calendar days */}
                      {calendarDays.map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const date = new Date(year, month, day);
                        const dateEvents = getEventsForDate(date);
                        const isToday =
                          date.getDate() === new Date().getDate() &&
                          date.getMonth() === new Date().getMonth() &&
                          date.getFullYear() === new Date().getFullYear();

                          return (
                          <div
                            key={day}
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square border rounded-lg p-2 relative cursor-pointer transition-colors ${
                              selectedDate &&
                              date.getDate() === selectedDate.getDate() &&
                              date.getMonth() === selectedDate.getMonth() &&
                              date.getFullYear() === selectedDate.getFullYear()
                                ? 'border-[#0c1c3b] bg-[#eaf3fa]'
                                : isToday
                                  ? 'bg-[#0c1c3b] text-white border-[#0c1c3b]'
                                  : 'border-gray-200 hover:border-[#0c1c3b]'
                            }`}
                          >
                            <div className="text-sm font-medium">{day}</div>
                            {dateEvents.length > 0 && (
                              <div className="absolute bottom-1 right-1 flex gap-1">
                                {Array.from({ length: Math.min(dateEvents.length, 3) }).map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${isToday ? 'bg-orange-300' : 'bg-orange-500'}`} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events
                        .filter(e => e.status === 'upcoming')
                        .slice(0, 10)
                        .map((event) => (
                          <Link
                            key={event.id}
                            to={`/events/${event.slug || event.id}`}
                            className="block p-3 border border-gray-200 rounded-lg hover:border-[#0c1c3b] hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-sm line-clamp-2">{event.title}</h4>
                              <Badge variant="outline" className="ml-2 flex-shrink-0">
                                {event.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {new Date(event.date).toLocaleDateString('en-GB', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} at {event.time}
                            </p>
                          </Link>
                        ))}
                      {events.filter(e => e.status === 'upcoming').length === 0 && (
                        <p className="text-center text-gray-500 py-8">No upcoming events</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {selectedDate && !loading && (
            <div className="mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>
                    {`Events on ${selectedDate.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}`}
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedDate(null)}>
                    Clear selection
                  </Button>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedDateEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/${event.slug || event.id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-[#0c1c3b] hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h4 className="font-semibold text-base line-clamp-2">{event.title}</h4>
                            <Badge variant="outline" className="flex-shrink-0">
                              {event.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.time ? `${event.time}` : 'Time to be confirmed'}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-6">No events on this day.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Have an Event to Add?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Are you a MoX club (binet) or an academic coordinator? Let us know so we can add your event to the official calendar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline">Browse All Events</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
