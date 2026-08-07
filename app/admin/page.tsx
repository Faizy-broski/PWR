import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCompetitions } from "@/lib/data/competitions";

const stats = [
  {
    label: "Live competitions",
    value: mockCompetitions.filter((c) => c.status === "live").length,
  },
  { label: "Total revenue", value: "£142,830" },
  { label: "Tickets sold today", value: "1,204" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage competitions, orders, and users.
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
    </div>
  );
}
