"use client";

import { Button } from "@/components/ui/button";
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
import type { Competition } from "@/lib/types";

export function CompetitionForm({
  competition,
}: {
  competition?: Competition;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={competition?.title} required />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                defaultValue={competition?.description}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Ticket price (£)</Label>
              <Input
                id="ticketPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={competition?.ticketPrice}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizeValue">Prize value (£)</Label>
              <Input
                id="prizeValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={competition?.prizeValue}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalTickets">Total tickets</Label>
              <Input
                id="totalTickets"
                type="number"
                min="1"
                defaultValue={competition?.totalTickets}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closesAt">Closes at</Label>
              <Input
                id="closesAt"
                type="datetime-local"
                defaultValue={competition?.closesAt.slice(0, 16)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={competition?.status ?? "draft"}>
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
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              {competition ? "Save changes" : "Create competition"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
