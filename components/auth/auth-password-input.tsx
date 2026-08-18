"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthPasswordInput({
  id,
  name,
  required,
  className,
}: {
  id?: string;
  name: string;
  required?: boolean;
  className?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={inputId}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        className={cn("h-12 rounded-full border-black/10 pr-16 pl-5", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-5 -translate-y-1/2 text-[10px] font-bold tracking-wide text-black/40 uppercase transition-colors hover:text-brand-gold-dark"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}