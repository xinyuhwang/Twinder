'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/MobileShell';
import { Avatar } from '@/components/Avatar';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { DEMO_PERSONAS } from '@/lib/personas';
import { buildPreviewFromTwinPreview, type AgentPreviewDisplay } from '@/lib/preview';
import type { UserRead } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Check,
  Eye,
  Pencil,
  Shield,
  Sparkles,
  RefreshCw,
  LogOut,
  Loader2,
} from 'lucide-react';

type Tab = 'public' | 'edit';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('public');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.replace('/demo');
      return;
    }

    async function load() {
      try {
        const me = await api.getMe(token!);
        setUser(me);
        setName(me.name ?? '');
        setAge(me.age != null ? String(me.age) : '');
        setBio(me.persona ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const publicPreview = useMemo<AgentPreviewDisplay | null>(() => {
    if (!user) return null;
    const twin = localStore.getTwinPreview();
    const persona = DEMO_PERSONAS.find(p => p.id === localStore.getPersonaId()) ?? null;
    const fallbackTwin = {
      public_safe_summary: user.persona ?? '',
      looking_for: [] as string[],
      interests: [] as string[],
    };
    return buildPreviewFromTwinPreview(twin ?? fallbackTwin, persona, user.name);
  }, [user]);

  async function handleSave() {
    const token = localStore.getToken();
    if (!token) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    let parsedAge: number | null = null;
    if (age.trim()) {
      const n = Number(age);
      if (!Number.isInteger(n) || n < 13 || n > 120) {
        setError('Enter a valid age between 13 and 120.');
        return;
      }
      parsedAge = n;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await api.updateMe(token, {
        name: trimmedName,
        age: parsedAge,
        persona: bio.trim(),
      });
      setUser(updated);
      localStore.setUserName(updated.name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStore.reset();
    router.replace('/demo');
  }

  if (loading) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col gap-5 px-6 py-10">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? 'You'} size="lg" />
          <div className="min-w-0 flex-1 space-y-0.5">
            <h1 className="truncate text-2xl font-bold text-primary">{user?.name ?? 'Your profile'}</h1>
            <p className="truncate text-sm text-subtle">
              {user?.age != null ? `${user.age} - ` : ''}
              {user?.email ?? ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface p-1">
          <TabButton active={tab === 'public'} onClick={() => setTab('public')} icon={Eye}>
            Public profile
          </TabButton>
          <TabButton active={tab === 'edit'} onClick={() => setTab('edit')} icon={Pencil}>
            Edit
          </TabButton>
        </div>

        {error && (
          <div className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error-fg">
            {error}
          </div>
        )}

        {tab === 'public' && publicPreview && (
          <PublicProfile preview={publicPreview} />
        )}

        {tab === 'edit' && (
          <div className="space-y-5">
            <Field label="Name">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="field-input"
              />
            </Field>

            <Field label="Age" hint="Optional. Shown only to confirmed meets.">
              <input
                value={age}
                onChange={e => setAge(e.target.value.replace(/[^0-9]/g, ''))}
                inputMode="numeric"
                placeholder="e.g. 27"
                className="field-input"
              />
            </Field>

            <Field
              label="Bio"
              hint="Your twin uses this to represent you. Matches see a safe summary, never the raw text."
            >
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={6}
                placeholder="What you build, what you care about, who you want to meet..."
                className="field-textarea"
              />
            </Field>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-solid py-4 text-lg font-semibold text-accent-fg transition-colors hover:bg-accent-solid-hover disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="h-5 w-5" />
                  Saved
                </>
              ) : (
                'Save changes'
              )}
            </button>

            <button
              onClick={() => {
                localStore.setRawContext(bio.trim());
                router.push('/onboarding');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-medium text-secondary transition-colors hover:border-border-strong"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              Rebuild my twin from intake
            </button>
          </div>
        )}

        <ThemeToggle />

        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 py-3 text-sm text-subtle transition-colors hover:text-error-fg"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Eye;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-accent-solid text-accent-fg' : 'text-muted hover:text-secondary'
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-secondary">{label}</label>
      {children}
      {hint && <p className="text-xs text-subtle leading-relaxed">{hint}</p>}
    </div>
  );
}

function PublicProfile({ preview }: { preview: AgentPreviewDisplay }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-subtle">
        This is how your twin represents you to other agents in the arena.
      </p>

      <div className="card-glow space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <Avatar
            name={preview.avatarName}
            initials={preview.avatarInitials}
            color={preview.avatarColor}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-primary">{preview.agentName}</h2>
            <p className="text-sm text-accent-muted">{preview.agentVibe}</p>
          </div>
        </div>
        {preview.summary && (
          <p className="text-sm leading-relaxed text-secondary">{preview.summary}</p>
        )}
      </div>

      <PreviewSection title="Looking for" items={preview.lookingFor} />
      <PreviewSection title="Interests" items={preview.interests} />
      <PreviewSection title="Can help with" items={preview.canHelpWith} />

      <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          <Shield className="h-3.5 w-3.5" />
          Privacy
        </div>
        <ul className="space-y-1.5">
          {preview.privacySettings.map(item => (
            <li key={item} className="flex items-start gap-2 text-xs text-muted">
              <span className="mt-0.5 flex-shrink-0 text-success">-</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreviewSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item}
            className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
