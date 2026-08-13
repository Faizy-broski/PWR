"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  COMPETITION_CATEGORIES,
  COMPETITION_CATEGORY_LABELS,
  type Competition,
} from "@/lib/types";
import {
  createCompetition,
  updateCompetition,
  type CompetitionFormState,
} from "@/app/actions/competitions";

export function CompetitionForm({
  competition,
}: {
  competition?: Competition;
}) {
  const action = competition
    ? updateCompetition.bind(null, competition.id)
    : createCompetition;
  const [state, formAction, pending] = useActionState<
    CompetitionFormState,
    FormData
  >(action, undefined);
  const [images, setImages] = useState<string[]>(
    competition?.images.filter((url) => url !== "/window.svg") ?? [],
  );
  // Groups images uploaded before the competition exists yet (create flow)
  // under one folder in storage; reused as-is for the edit flow.
  const [uploadFolder] = useState(() => competition?.id ?? crypto.randomUUID());

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={competition?.title} required />
              {state?.errors?.title && (
                <p className="text-sm text-destructive">{state.errors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={competition?.description}
                required
              />
              {state?.errors?.description && (
                <p className="text-sm text-destructive">
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Images</Label>
              <ImageDropzone
                images={images}
                onChange={setImages}
                folder={uploadFolder}
              />
              {state?.errors?.images && (
                <p className="text-sm text-destructive">{state.errors.images[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={competition?.category ?? "free"}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPETITION_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {COMPETITION_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.category && (
                <p className="text-sm text-destructive">{state.errors.category[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={competition?.status ?? "draft"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="drawn">Drawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Ticket price (£)</Label>
              <Input
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={competition?.ticketPrice}
                required
              />
              {state?.errors?.ticketPrice && (
                <p className="text-sm text-destructive">
                  {state.errors.ticketPrice[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizeValue">Prize value (£)</Label>
              <Input
                id="prizeValue"
                name="prizeValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={competition?.prizeValue}
                required
              />
              {state?.errors?.prizeValue && (
                <p className="text-sm text-destructive">
                  {state.errors.prizeValue[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalTickets">Total tickets</Label>
              <Input
                id="totalTickets"
                name="totalTickets"
                type="number"
                min="1"
                defaultValue={competition?.totalTickets}
                required
              />
              {state?.errors?.totalTickets && (
                <p className="text-sm text-destructive">
                  {state.errors.totalTickets[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startsAt">Starts at</Label>
              <Input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                defaultValue={competition?.startsAt.slice(0, 16)}
                required
              />
              {state?.errors?.startsAt && (
                <p className="text-sm text-destructive">{state.errors.startsAt[0]}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Set this in the future to schedule — it won&apos;t appear
                publicly until then.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closesAt">Closes at</Label>
              <Input
                id="closesAt"
                name="closesAt"
                type="datetime-local"
                defaultValue={competition?.closesAt.slice(0, 16)}
                required
              />
              {state?.errors?.closesAt && (
                <p className="text-sm text-destructive">{state.errors.closesAt[0]}</p>
              )}
            </div>
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving…"
                : competition
                  ? "Save changes"
                  : "Create competition"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
