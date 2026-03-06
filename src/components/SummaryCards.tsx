import { DollarSign, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardsProps {
  totalSpending: number;
  transactionCount: number;
  highestCategory: string;
}

export function SummaryCards({ totalSpending, transactionCount, highestCategory }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Expenses",
      value: `$${totalSpending.toFixed(2)}`,
      icon: DollarSign,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: Receipt,
      accent: "bg-accent text-accent-foreground",
    },
    {
      label: "Top Category",
      value: highestCategory,
      icon: TrendingUp,
      accent: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.label} className="shadow-[var(--shadow-card)] border-border/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${c.accent}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-semibold font-[var(--font-display)]">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
