import "server-only";

// No transactional-email provider is wired up yet (no Resend/SendGrid API
// key configured — see .env.local.example). This module is the single
// place that will change once one is: swap the body of `send()` for a real
// provider call and every caller below keeps working unmodified.
interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function send(payload: EmailPayload) {
  if (!process.env.EMAIL_PROVIDER_API_KEY) {
    console.info(`[email:stub] Would send "${payload.subject}" to ${payload.to}`);
    return;
  }

  // TODO: wire the real provider once EMAIL_PROVIDER_API_KEY is supplied,
  // e.g.:
  //   const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);
  //   await resend.emails.send({ from: "PWR <hello@pwr.today>", ...payload });
  console.info(`[email:stub] EMAIL_PROVIDER_API_KEY set but no provider wired — dropping "${payload.subject}" to ${payload.to}`);
}

export async function sendWelcomeEmail(to: string, fullName: string | null) {
  const name = fullName?.trim() || "there";

  await send({
    to,
    subject: "Welcome to PWR",
    html: `
      <p>Hi ${name},</p>
      <p>Welcome to PWR — your account is set up and ready to go.</p>
      <p>Browse live competitions and enter in a couple of taps at
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pwr.today"}/competitions">pwr.today/competitions</a>.</p>
      <p>Good luck,<br />The PWR Team</p>
    `,
  });
}
