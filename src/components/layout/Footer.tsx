import { Link } from 'react-router-dom';
import { Trophy, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold leading-none">
                  GRIDIRON
                </h3>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-widest">
                  Fantasy League
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm max-w-md">
              The premier destination for fantasy football enthusiasts. Track your team, 
              analyze stats, and dominate your league.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/standings', label: 'Standings' },
                { href: '/stats', label: 'Player Stats' },
                { href: '/recaps', label: 'Weekly Recaps' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:commissioner@gridironleague.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors duration-200"
                >
                  <Mail size={14} />
                  Commissioner
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors duration-200"
                >
                  <ExternalLink size={14} />
                  League Rules
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Gridiron Fantasy League. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
