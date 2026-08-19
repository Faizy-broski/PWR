import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface AuthAvatar {
  src: string;
  alt: string;
}

const Avatars = [
  { src: "/auth/user-1.png", alt: "PWR winner" },
  { src: "/auth/user-2.png", alt: "PWR winner" },
  { src: "/auth/user-3.png", alt: "PWR winner" },
]

export function AuthShell({
  communityLabel = "Welcome to the PWR community",
  headlineTop = "Where Winning",
  headlineAccent = "Lives.",
  socialProofText = "Create your account and discover your next chance to win.",
  eyebrow,
  title,
  description,
  children,
}: {
  communityLabel?: string;
  headlineTop?: string;
  headlineAccent?: string;
  socialProofText?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh overflow-hidden bg-white">
      {/* Back to home */}
      <Link
        href="/"
        className="group absolute top-6 right-6 z-20 inline-flex items-center gap-1.5 text-xs font-semibold text-black/50 transition-colors hover:text-[#0D0C0C] lg:top-8 lg:right-10"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to home
      </Link>

      {/* Left — hero image panel */}
      <div className="hidden h-full w-1/2 p-3 lg:block bg-slate-100">
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#0D0C0C]">
          <Image
            src="/auth/auth-bg.png"
            alt="Auth Hero"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />

          {/* top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between">
            <div>
              <Image
                src="/pwr-logo.svg"
                alt="PWR"
                width={110}
                height={40}
                className="h-24 w-auto"
              />
            </div>
          </div>

          {/* bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-8 pt-24">
            <p className="mb-3 text-xs font-semibold tracking-[0.4em] text-white/70 uppercase">
              — {communityLabel}
            </p>
            <h2 className="text-3xl leading-[1.1] font-extrabold text-white uppercase xl:text-6xl">
              {headlineTop}
              <br />
              Changes{" "}
              <span className="font-script font-normal">
                {headlineAccent}
              </span>
            </h2>

            {Avatars && Avatars.length > 0 ? (
              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {Avatars.map((avatar) => (
                    <span
                      key={avatar.src}
                      className="relative size-8 overflow-hidden rounded-full border-2 border-[#0D0C0C]"
                    >
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                  ))}
                </div>
                <p className="max-w-[30ch] text-xs text-white/70">
                  {socialProofText}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex h-full w-full items-center justify-center overflow-hidden px-6 py-6 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-sm">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0D0C0C]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-black/45">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}