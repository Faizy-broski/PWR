"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MotionButton } from "@/components/admin/motion-button";
import {
  updateNotificationTemplate,
  type NotificationTemplateFormState,
} from "@/app/actions/notifications";
import type { NotificationTemplate } from "@/lib/data/notifications";

const TYPE_LABELS: Record<NotificationTemplate["type"], string> = {
  entry_confirmed: "Entry confirmed",
  competition_drawn: "Competition drawn",
  you_won: "You won",
};

export function NotificationTemplateCard({
  template,
}: {
  template: NotificationTemplate;
}) {
  const action = updateNotificationTemplate.bind(null);
  const [state, formAction, pending] = useActionState<
    NotificationTemplateFormState,
    FormData
  >(action, undefined);

  return (
    <Card className="rounded-3xl shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="type" value={template.type} />
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {TYPE_LABELS[template.type]}
          </h2>

          <div className="space-y-2">
            <Label htmlFor={`${template.type}-title`}>Title</Label>
            <Input
              id={`${template.type}-title`}
              name="title"
              defaultValue={template.title}
              required
            />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${template.type}-body`}>Body</Label>
            <Textarea
              id={`${template.type}-body`}
              name="body"
              rows={3}
              defaultValue={template.body}
              required
            />
            <p className="text-xs text-muted-foreground">
              Placeholders: {"{{competition_title}}"}
              {template.type === "entry_confirmed" && ", {{ticket_numbers}}"}
            </p>
            {state?.errors?.body && (
              <p className="text-sm text-destructive">
                {state.errors.body[0]}
              </p>
            )}
          </div>

          {state?.message && (
            <p
              className={
                state.message === "Saved."
                  ? "text-sm text-brand-gold-dark"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <MotionButton>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
            </MotionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
