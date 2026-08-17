"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const purposeOptions = [
  { value: "general", label: "General Enquiry" },
  { value: "competition", label: "Competition Question" },
  { value: "account", label: "Account Support" },
  { value: "winner", label: "Winner Support" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const fieldClassName =
  "h-auto rounded-none border-0 border-b border-white/15 bg-transparent px-0 pb-2 text-sm text-white placeholder:text-white/30 shadow-none focus-visible:border-brand-gold-light focus-visible:ring-0";

export function ContactForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to server action / API route
    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData));
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-10">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <Image
          src="/pwr-logo.svg"
          alt=""
          aria-hidden
          width={480}
          height={232}
          className="h-auto w-[280px] opacity-5 sm:w-[380px] lg:w-[800px]"
        />
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Your full name"
              required
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase"
            >
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+92 300 000 0000"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="purpose"
              className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase"
            >
              Purpose
            </Label>
            <Select name="purpose">
              <SelectTrigger
                id="purpose"
                className={`${fieldClassName} w-full justify-between data-[placeholder]:text-brand-gold-light [&>svg]:text-white/40`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#171717] text-white">
                {purposeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="focus:bg-white/5 focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="message"
              className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase"
            >
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about what you're looking for..."
              rows={2}
              required
              className={`${fieldClassName} resize-none`}
            />
          </div>
        </div>

        <div className="pt-7">
          <button
            type="submit"
            className="bg-brand-gradient inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-bold text-white sm:w-auto"
          >
            Schedule Consultation
            <ArrowUpRight className="size-4" />
          </button>
          <p className="mt-4 text-center text-[11px] text-white/35 sm:text-left">
            By submitting, you agree to Layerback&apos;s private consultation
            policy.
          </p>
        </div>
      </form>
    </div>
  );
}