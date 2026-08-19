// Deliberately empty. Without this, a suspended admin segment (e.g. the
// competition modal's data fetch) has no loading.tsx of its own to catch
// it, so Suspense bubbles up to the root app/loading.tsx — the marketing
// site's full-screen branded loader, which is jarring for something as
// quick as opening a modal in the dashboard. This file just claims the
// Suspense boundary at the admin level and renders nothing.
export default function AdminLoading() {
  return null;
}
