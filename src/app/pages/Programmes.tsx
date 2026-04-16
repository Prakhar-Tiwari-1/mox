import * as React from 'react';
import { Link } from 'react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const PROGRAMMES = [
  {
    id: 'vicai',
    code: 'ViCAI',
    title: 'Visual and Creative Artificial Intelligence',
    subtitle: 'Visual and Creative Artificial Intelligence',
    tags: ['Artificial Intelligence'],
  },
  {
    id: 'trai',
    code: 'TRAI',
    title: 'Trustworthy and Responsible AI',
    subtitle: 'Trustworthy and Responsible AI',
    tags: ['Artificial Intelligence'],
  },
  {
    id: 'llga',
    code: 'LLGA',
    title: 'Large Language Models, Graphs & Applications',
    subtitle: 'Large Language Models, Graphs & Applications',
    tags: ['AI', 'Computer Science'],
  },
  {
    id: 'maqi',
    code: 'MaQI',
    title: 'AI for Markets and Quantitative Investment (X–ENSAE)',
    subtitle: 'AI for Markets and Quantitative Investment (X–ENSAE)',
    tags: ['AI', 'Finance'],
  },
  {
    id: 'cys',
    code: 'CyS',
    title: 'Cybersecurity',
    subtitle: 'Cybersecurity',
    tags: ['Computer Science'],
  },
  {
    id: 'iot',
    code: 'IoT',
    title: 'Internet of Things: Innovation and Management',
    subtitle: 'Internet of Things: Innovation and Management',
    tags: ['Technology'],
  },
  {
    id: 'eesm',
    code: 'EESM',
    title: 'Environmental Engineering and Sustainability Management',
    subtitle: 'Environmental Engineering and Sustainability Management',
    tags: ['Environment'],
  },
  {
    id: 'steem',
    code: 'STEEM',
    title: 'Energy Environment: Science Technology and Management',
    subtitle: 'Energy Environment: Science Technology and Management',
    tags: ['Energy', 'Environment'],
  },
  {
    id: 'depp',
    code: 'DEPP',
    title: 'Data and Economics for Public Policy (X–ENSAE–Telecom)',
    subtitle: 'Data and Economics for Public Policy (X–ENSAE–Telecom)',
    tags: ['Data Science', 'Economy'],
  },
  {
    id: 'edacf',
    code: 'EDACF',
    title: 'Economics, Data Analytics and Corporate Finance (X–Bocconi)',
    subtitle: 'Economics, Data Analytics and Corporate Finance (X–Bocconi)',
    tags: ['Economy', 'Finance'],
  },
  {
    id: 'dddf',
    code: 'DDDF',
    title: 'Double Degree Data & Finance (X–HEC)',
    subtitle: 'Double Degree Data & Finance (X–HEC)',
    tags: ['Data Science', 'Finance'],
  },
  {
    id: 'dsaib',
    code: 'DSAIB',
    title: 'Data Science and AI for Business (X–HEC)',
    subtitle: 'Data Science and AI for Business (X–HEC)',
    tags: ['Data Science', 'AI'],
  },
  {
    id: 'excin',
    code: 'EXcin',
    title: 'Science & Technology in Extended Cinematography (X–ENS Louis Lumière)',
    subtitle: 'Science & Technology in Extended Cinematography (X–ENS Louis Lumière)',
    tags: ['Technology', 'Arts'],
  },
];

export default function Programmes() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0a203c] to-[#1a5a7f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our 13 Masters Programmes</h1>
          <p className="max-w-3xl text-white/90">
            Globally recruited, taught exclusively in English, spanning AI, data science, cybersecurity, energy transition,
            economics, and the arts. The most specialised postgraduate cohort in France.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMMES.map((p) => (
              <Card key={p.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0a203c] font-semibold">{p.code}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{p.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{p.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs uppercase">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to={`/programmes/${p.id}`} className="text-sm text-[#0a203c] underline">
                      Learn more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
