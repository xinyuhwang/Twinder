const AVATAR_COLORS = [
  'bg-red-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-indigo-500',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function deriveColor(name: string): string {
  return AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length];
}

interface AvatarProps {
  name?: string;
  initials?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-base',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-24 h-24 text-3xl',
};

export function Avatar({
  name,
  initials,
  color,
  size = 'md',
  pulse = false,
  className = '',
}: AvatarProps) {
  const displayInitials = initials ?? (name ? deriveInitials(name) : '??');
  const displayColor = color ?? (name ? deriveColor(name) : 'bg-zinc-600');

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div
        className={`${SIZE_CLASSES[size]} ${displayColor} rounded-full flex items-center justify-center font-bold text-white`}
      >
        {displayInitials}
      </div>
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-violet-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
      )}
    </div>
  );
}
