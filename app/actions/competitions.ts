"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export type CompetitionFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

const CompetitionSchema = z.object({
  title: z.string().trim().min(3, { error: "Title is too short." }),
  description: z.string().trim().min(1, { error: "Add a description." }),
  category: z.enum(["free", "gold", "platinum", "vip"], {
    error: "Choose a category.",
  }),
  images: z
    .array(z.url({ error: "One of the uploaded images has an invalid URL." }))
    .min(1, { error: "Upload at least one image." }),
  ticketPrice: z.coerce
    .number({ error: "Enter a valid ticket price." })
    .gt(0, { error: "Ticket price must be greater than 0." }),
  prizeValue: z.coerce
    .number({ error: "Enter a valid prize value." })
    .gte(0, { error: "Prize value can't be negative." }),
  totalTickets: z.coerce
    .number({ error: "Enter a valid ticket count." })
    .int()
    .gt(0, { error: "Total tickets must be greater than 0." }),
  startsAt: z.string().min(1, { error: "Choose a start date." }),
  closesAt: z.string().min(1, { error: "Choose a closing date." }),
  status: z.enum(["draft", "live", "closed", "drawn"]),
}).refine((data) => new Date(data.closesAt) > new Date(data.startsAt), {
  error: "Closing date must be after the start date.",
  path: ["closesAt"],
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseForm(formData: FormData) {
  return CompetitionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    images: formData.getAll("images"),
    ticketPrice: formData.get("ticketPrice"),
    prizeValue: formData.get("prizeValue"),
    totalTickets: formData.get("totalTickets"),
    startsAt: formData.get("startsAt"),
    closesAt: formData.get("closesAt"),
    status: formData.get("status"),
  });
}

export async function createCompetition(
  _state: CompetitionFormState,
  formData: FormData,
): Promise<CompetitionFormState> {
  await requireAdmin();

  const validated = parseForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { title, startsAt, closesAt, images, ...rest } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase.from("competitions").insert({
    title,
    slug: `${slugify(title)}-${Date.now().toString(36)}`,
    description: rest.description,
    category: rest.category,
    images,
    ticket_price: rest.ticketPrice,
    prize_value: rest.prizeValue,
    total_tickets: rest.totalTickets,
    status: rest.status,
    starts_at: new Date(startsAt).toISOString(),
    closes_at: new Date(closesAt).toISOString(),
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  redirect("/admin/competitions");
}

export async function updateCompetition(
  id: string,
  _state: CompetitionFormState,
  formData: FormData,
): Promise<CompetitionFormState> {
  await requireAdmin();

  const validated = parseForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { startsAt, closesAt, images, ...rest } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("competitions")
    .update({
      title: rest.title,
      description: rest.description,
      category: rest.category,
      images,
      ticket_price: rest.ticketPrice,
      prize_value: rest.prizeValue,
      total_tickets: rest.totalTickets,
      status: rest.status,
      starts_at: new Date(startsAt).toISOString(),
      closes_at: new Date(closesAt).toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  redirect("/admin/competitions");
}
