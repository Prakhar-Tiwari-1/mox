import { Link } from 'react-router';
import { Mail, MapPin, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MoX</h3>
            <p className="text-gray-400 text-sm mb-4">
              The student association for Masters students at École Polytechnique.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/mox_polytechnique/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn (Coming Soon)">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="text-gray-400 hover:text-white transition-colors">
                  Clubs
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="text-gray-400 hover:text-white transition-colors">
                  Partnership
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/PZVn9QWp48HkZc8X8" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Map
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  MoX Locale, Bâtiment 76<br />
                  École Polytechnique<br />
                  Route de Saclay<br />
                  91120 Palaiseau, Île-de-France<br />
                  France
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a href="mailto:mox@polytechnique.fr" className="text-gray-400 hover:text-white transition-colors">
                  mox@polytechnique.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400 space-y-2">
          <p>&copy; {currentYear} MoX</p>
          <p>
            This is not an official École Polytechnique website. It is a website for the Masters student association.
          </p>
        </div>
      </div>
    </footer>
  );
}
