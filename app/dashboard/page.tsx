import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCompetitions } from "@/lib/data/competitions";

const stats = [
  { label: "Active entries", value: "3" },
  { label: "Tickets held", value: "12" },
  { label: "Competitions won", value: "0" },
];

export default function DashboardPage() {
  const active = mockCompetitions.filter((c) => c.status === "live");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here&apos;s where your entries stand.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Active competitions</h2>
        <div className="space-y-3">
          {active.map((competition) => (
            <div
              key={competition.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-medium">{competition.title}</p>
                <p className="text-sm text-muted-foreground">
                  Closes {new Date(competition.closesAt).toLocaleDateString("en-GB")}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">4 tickets</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
