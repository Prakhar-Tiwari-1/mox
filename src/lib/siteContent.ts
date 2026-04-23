export interface LeadershipMember {
  id: string;
  slug?: string;
  name: string;
  role: string;
  summary?: string;
  bio: string;
  responsibilities?: string;
  image_focus_x?: number;
  image_focus_y?: number;
  image_url: string;
  order: number;
  email?: string;
  phone?: string;
}

export interface ClubProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  contact_email?: string;
  contact_phone?: string;
  members?: {
    id: string;
    name: string;
    role: string;
    description?: string;
    image_url?: string;
    email?: string;
    phone?: string;
  }[];
  events?: {
    id: string;
    slug?: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export const leadershipFallback: LeadershipMember[] = [
  {
    id: '1',
    slug: 'georges-el-kerr',
    name: 'Georges El Kerr',
    role: 'Secretary General',
    summary: 'Leads the strategic and operational coordination of MoX across the MScT community.',
    bio: 'Leads the coordination of MoX operations, executive follow-up, and the broader association roadmap for the MScT community.',
    responsibilities: 'Coordinates executive priorities, ensures follow-up across initiatives, and helps align clubs, events, and representation efforts under the broader MoX roadmap.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-1.jpg',
    order: 1,
  },
  {
    id: '2',
    slug: 'jude-abou-daher',
    name: 'Jude Abou Daher',
    role: 'Communications',
    summary: 'Shapes MoX communications, messaging, and visibility across student-facing channels.',
    bio: 'Oversees communications, messaging, and visibility across student channels, event promotion, and community updates.',
    responsibilities: 'Leads communication planning, event promotion, social visibility, and the consistency of MoX messaging across outreach channels.',
    image_focus_x: 44,
    image_focus_y: 15,
    image_url: '/images/team/member-2.jpg',
    order: 2,
  },
  {
    id: '3',
    slug: 'vaughn-janes',
    name: 'Vaughn Janes',
    role: 'Events',
    summary: 'Helps design and deliver the main student-facing events that shape the MoX experience.',
    bio: 'Helps shape and deliver MoX events, coordinating logistics, planning, and student-facing experiences throughout the year.',
    responsibilities: 'Supports planning, logistics, and execution for community events, ensuring that MoX programming remains engaging and well delivered.',
    image_focus_x: 50,
    image_focus_y: 16,
    image_url: '/images/team/member-3.jpg',
    order: 4,
  },
  {
    id: '4',
    slug: 'nader-al-masri',
    name: 'Nader Al Masri',
    role: 'Pedagogical Affairs',
    summary: 'Represents academic and student-life concerns linked to the MScT journey at École Polytechnique.',
    bio: 'Represents academic and student-life concerns, helping connect MScT students with the administration on pedagogical matters.',
    responsibilities: 'Acts as a bridge between MScT students and the administration on pedagogical topics, student concerns, and broader academic follow-up.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-4.jpg',
    order: 3,
  },
  {
    id: '5',
    slug: 'eliott-hawley',
    name: 'Eliott Hawley',
    role: 'Treasurer',
    summary: 'Oversees financial follow-up and budget stewardship across MoX activities and operations.',
    bio: 'Manages budgeting, financial follow-up, and the allocation of resources that support MoX activities and student clubs.',
    responsibilities: 'Supervises budgeting, spending priorities, and the financial coordination needed to support events, clubs, and MoX operations.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-5.jpg',
    order: 5,
  },
  {
    id: '6',
    slug: 'alonso-hunter',
    name: 'Alonso Hunter',
    role: 'Clubs',
    summary: 'Supports student initiatives and strengthens the club ecosystem across the MScT community.',
    bio: 'Coordinates club relations and helps ensure student initiatives, events, and activities across the MScT community are supported.',
    responsibilities: 'Works with clubs to coordinate initiatives, support new ideas, and strengthen the role of student-led activities inside MoX.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-6.jpg',
    order: 6,
  },
  {
    id: '7',
    slug: 'gabriel-halpin',
    name: 'Gabriel Halpin',
    role: 'Welcoming',
    summary: 'Focuses on welcoming initiatives and student integration within the MoX community.',
    bio: 'Supports welcoming initiatives and helps new students integrate smoothly into the MoX and École Polytechnique environment.',
    responsibilities: 'Designs and supports welcoming efforts that help new students integrate into MoX, the MScT community, and campus life.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-7.jpg',
    order: 7,
  },
  {
    id: '8',
    slug: 'prakhar-tiwari',
    name: 'Prakhar Tiwari',
    role: 'Sponsorship & External Relations',
    summary: 'Develops external partnerships and visibility opportunities that support MoX growth.',
    bio: 'Develops external partnerships and sponsorship opportunities that support events, visibility, and MoX initiatives.',
    responsibilities: 'Builds external relationships, supports sponsorship outreach, and helps position MoX with partners beyond the student association.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-8.jpg',
    order: 8,
  },
  {
    id: '9',
    slug: 'abed-el-rahman-el-khatib',
    name: 'Abed El Rahman El Khatib',
    role: 'Academic & Internal Relations',
    summary: 'Strengthens internal coordination and academic-facing relations for the MScT student body.',
    bio: 'Works on internal coordination and academic-facing matters to keep the MScT student body connected and represented.',
    responsibilities: 'Supports academic-facing coordination, student representation, and stronger internal links across the MScT community.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-9.jpg',
    order: 9,
  },
  {
    id: '10',
    slug: 'jamil-jaber',
    name: 'Jamil Jaber',
    role: 'Sports',
    summary: 'Brings a stronger sports and wellbeing dimension to MoX student life.',
    bio: 'Leads sports-related initiatives and helps activate the social and wellbeing side of MScT student life.',
    responsibilities: 'Coordinates sports-related initiatives and helps expand the social, recreational, and wellbeing side of the community.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-10.jpg',
    order: 10,
  },
  {
    id: '11',
    slug: 'aditya-krishnan',
    name: 'Aditya Krishnan',
    role: 'Infrastructure',
    summary: 'Supports the operational backbone and internal infrastructure behind MoX activities.',
    bio: 'Supports the operational and infrastructure needs behind MoX activities, tools, and execution.',
    responsibilities: 'Helps ensure that the tools, operational setup, and internal systems behind MoX remain reliable and effective.',
    image_focus_x: 50,
    image_focus_y: 18,
    image_url: '/images/team/member-11.jpg',
    order: 11,
  },
];

export const faqFallback: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How long does it take to process membership applications?',
    answer: 'Membership applications are typically processed within 3 to 5 business days. You will receive a confirmation email once your application is approved.',
    display_order: 1,
  },
  {
    id: 'faq-2',
    question: 'Can I cancel my event registration?',
    answer: 'Yes, event registrations can generally be cancelled up to 7 days before the event. Please contact MoX with your registration details.',
    display_order: 2,
  },
  {
    id: 'faq-3',
    question: 'Do you offer corporate partnerships?',
    answer: 'Yes. MoX works with partners and organisations on events, student engagement, and visibility opportunities. Please contact us for more details.',
    display_order: 3,
  },
];

export const clubsFallback: ClubProfile[] = [
  {
    id: 'club-1',
    slug: 'mxter-chef',
    name: 'MXter Chef',
    tagline: 'Cooking, food culture, and shared tables.',
    description: 'MXter Chef brings students together around cooking, dinners, and food-centered community moments throughout the year.',
    image_url: '/images/events/event-2.jpg',
  },
  {
    id: 'club-2',
    slug: 'mx-arts',
    name: 'MX Arts',
    tagline: 'Creative, visual, and performing arts for MScT students.',
    description: 'MX Arts creates space for artistic expression across music, visual arts, performances, and collaborative creative projects.',
    image_url: '/images/events/event-1.jpg',
  },
  {
    id: 'club-3',
    slug: 'politix',
    name: 'PolitiX',
    tagline: 'Debate, policy, and current affairs.',
    description: 'PolitiX hosts discussions, debates, and events around politics, geopolitics, and public affairs in the MScT community.',
    image_url: '/images/events/event-2.jpg',
  },
  {
    id: 'club-4',
    slug: 'jeux',
    name: 'JeuX',
    tagline: 'Games, tabletop, and social competition.',
    description: 'JeuX brings people together through board games, tournaments, and casual game nights designed for connection and fun.',
    image_url: '/images/events/event-1.jpg',
  },
];
