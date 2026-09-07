-- Notifications: DB-logged records of what would otherwise be a
-- transactional email (entry confirmed, competition drawn, you won). No
-- email/SMS provider is wired up per project constraints — these rows are
-- the audit trail an admin can see today and what an email sender can read
-- from later without changing any of the call sites that create them.
create type public.notification_type as enum (
  'entry_confirmed',
  'competition_drawn',
  'you_won'
);

-- Editable copy for each notification type, shown/edited on the admin
-- notification-templates screen. {{competition_title}} and
-- {{ticket_numbers}} are substituted by public.notify() below.
create table public.notification_templates (
  type public.notification_type primary key,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

insert into public.notification_templates (type, title, body) values
  (
    'entry_confirmed',
    'Entry confirmed',
    'You''re in! Your entry into {{competition_title}} is confirmed — ticket number(s) {{ticket_numbers}}. Good luck!'
  ),
  (
    'competition_drawn',
    'Draw complete',
    '{{competition_title}} has been drawn. This time it wasn''t your ticket — check the Winners page for the result, and good luck in the next one.'
  ),
  (
    'you_won',
    'You won!',
    'Congratulations — your ticket won {{competition_title}}! Our team will be in touch about your prize.'
  );

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  competition_id uuid references public.competitions (id) on delete set null,
  type public.notification_type not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);
create index notifications_created_at_idx on public.notifications (created_at desc);

alter table public.notification_templates enable row level security;
alter table public.notifications enable row level security;

create policy "notification_templates_select_admin"
  on public.notification_templates for select
  to authenticated
  using (public.is_admin());

create policy "notification_templates_update_admin"
  on public.notification_templates for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Rows are written only by the security-definer notify() function below
-- (called from purchase_entry() / draw_winner()), so there is intentionally
-- no insert policy for regular authenticated users.
create policy "notifications_select_own_or_admin"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Shared helper: looks up the template for p_type, substitutes the known
-- placeholders, and inserts one notification row. security definer so it
-- can be called from other security-definer functions (purchase_entry,
-- draw_winner) regardless of the caller's RLS access to these tables.
create or replace function public.notify(
  p_user_id uuid,
  p_competition_id uuid,
  p_type public.notification_type,
  p_competition_title text,
  p_ticket_numbers text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
  v_body text;
begin
  select title, body into v_title, v_body
  from public.notification_templates
  where type = p_type;

  if not found then
    v_title := p_type::text;
    v_body := '';
  end if;

  v_title := replace(v_title, '{{competition_title}}', coalesce(p_competition_title, ''));
  v_body := replace(v_body, '{{competition_title}}', coalesce(p_competition_title, ''));
  v_body := replace(v_body, '{{ticket_numbers}}', coalesce(p_ticket_numbers, ''));

  insert into public.notifications (user_id, competition_id, type, title, body)
  values (p_user_id, p_competition_id, p_type, v_title, v_body);
end;
$$;
