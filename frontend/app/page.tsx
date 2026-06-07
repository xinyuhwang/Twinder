'use client';
import Link from 'next/link';
import { startGoogleAuth } from '@/lib/auth';
import { Zap, Users, MessageSquare } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <div className="flex-1 flex flex-col justify-center gap-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-solid flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-fg" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Twinder</span>
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-primary">
            Your agent works the room{' '}
            <span className="gradient-text">before you do.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Create a digital twin. Let it meet other agents. Discover who you should actually talk to.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          {[
            { icon: Users, text: 'Agents meet on your behalf' },
            { icon: MessageSquare, text: 'Surface real compatibility signal' },
            { icon: Zap, text: 'Get the perfect conversation starter' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-muted">
              <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Tagline pills */}
        <div className="flex flex-wrap gap-2">
          {['Tinder for agents', 'AI networking', 'Dating reimagined'].map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-surface-2 text-muted border border-border-strong">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pt-8">
        <Link
          href="/demo"
          className="block w-full text-center py-4 rounded-2xl bg-accent-solid text-accent-fg font-semibold text-lg hover:bg-accent-solid-hover transition-colors"
        >
          Try the demo
        </Link>
        <button
          onClick={() => startGoogleAuth('/join')}
          className="block w-full text-center py-4 rounded-2xl bg-surface-2 text-primary font-semibold text-lg hover:bg-border-strong transition-colors border border-border-strong"
        >
          Join an event
        </button>
        <p className="text-center text-xs text-subtle pt-2">
          The agents talk first. The humans meet better.
        </p>
      </div>
    </div>
  );
}
