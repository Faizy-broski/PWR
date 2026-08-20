"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ProfileForm } from "@/components/account/profile-form";

export function AccountSettingsTab({
  fullName,
  email,
  phone,
}: {
  fullName: string;
  email: string;
  phone: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <ProfileForm
      fullName={fullName}
      email={email}
      phone={phone}
      onSaved={() => startTransition(() => router.refresh())}
    />
  );
}
