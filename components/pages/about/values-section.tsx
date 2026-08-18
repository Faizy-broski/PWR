import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export interface ValueItem {
  title: string;
  description: string;
}

const defaultValues: ValueItem[] = [
  {
    title: "People First",
    description: "We put people at the centre of what we do.",
  },
  {
    title: "Transparency",
    description:
      "We believe competitions should be clear, fair and trustworthy.",
  },
  {
    title: "Positive Impact",
    description: "Success gives us an opportunity to create positive change.",
  },
  {
    title: "Community",
    description: "We grow alongside the people and communities around us.",
  },
];

function ValueBlock({
  value,
  className,
}: {
  value: ValueItem;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-brand-gold-dark/50 pt-5", className)}>
      <h3 className="text-sm font-extrabold tracking-wide text-[#0D0C0C] uppercase">
        {value.title}
      </h3>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-black/45">
        {value.description}
      </p>
    </div>
  );
}

export function ValuesSection({
  eyebrow = "What Matters Most",
  titleTop = "What We",
  titleAccent = "Stand For",
  values = defaultValues,
}: {
  eyebrow?: string;
  titleTop?: string;
  titleAccent?: string;
  values?: ValueItem[];
}) {
  const [first, second, third, fourth] = values;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:gap-y-0">
          <Reveal duration={0.5}>
            <div className="pb-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-brand-gradient" aria-hidden />
                <p className="text-[11px] font-semibold tracking-[0.25em] text-brand-gradient uppercase">
                  {eyebrow}
                </p>
              </div>

              <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold text-[#0D0C0C] uppercase sm:text-5xl">
                {titleTop}
                <br />
                <span className="font-script">
                  {titleAccent}
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="hidden lg:block">
            <div className="h-full border-brand-gold-dark/50" />
          </Reveal>

          <Reveal delay={0.15}>
            <ValueBlock value={first} />
          </Reveal>
          <Reveal delay={0.2}>
            <ValueBlock value={second} />
          </Reveal>
          <Reveal delay={0.25}>
            <ValueBlock value={third} />
          </Reveal>
          <Reveal delay={0.3}>
            <ValueBlock value={fourth} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}