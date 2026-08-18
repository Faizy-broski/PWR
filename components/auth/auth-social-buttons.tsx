"use client";

export function AuthSocialButtons({
  onGoogleClick,
  onAppleClick,
}: {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-medium text-[#0D0C0C] transition-colors hover:bg-black/[0.03]"
      >
        <GoogleIcon className="size-4" />
        Google
      </button>
      <button
        type="button"
        onClick={onAppleClick}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-medium text-[#0D0C0C] transition-colors hover:bg-black/[0.03]"
      >
        <AppleIcon className="size-4" />
        Apple
      </button>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.11C6.22 6.87 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.365 1.43c0 1.14-.416 2.06-1.246 2.85-.906.86-1.965 1.35-3.086 1.26a3.6 3.6 0 0 1-.03-.44c0-1.09.478-2.05 1.253-2.79.82-.79 2.05-1.31 3.06-1.35.03.15.05.31.05.47Zm4.32 16.3c-.53 1.22-.79 1.77-1.47 2.85-.95 1.5-2.29 3.37-3.95 3.39-1.48.02-1.86-.97-3.87-.96-2 .01-2.42.98-3.9.96-1.66-.02-2.93-1.71-3.88-3.2-2.65-4.16-2.93-9.04-1.3-11.65 1.16-1.85 2.98-2.94 4.7-2.94 1.75 0 2.85 1 4.3 1 1.4 0 2.26-1 4.3-1 1.53 0 3.16.84 4.31 2.28-3.79 2.08-3.18 7.5.74 9.27Z" />
    </svg>
  );
}