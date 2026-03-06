import { Wallet, ArrowDownCircle, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BudgetCardsProps {
  monthlyBudget: number | string | undefined;
  totalExpenses: number | string | undefined;
}

export function BudgetCards({ monthlyBudget, totalExpenses }: BudgetCardsProps) {

  // Convert values safely to numbers
  const budget = Number(monthlyBudget ?? 0);
  const expenses = Number(totalExpenses ?? 0);

  const remaining = budget - expenses;
  const isOverBudget = remaining < 0;

  const cards = [
    {
      label: "Monthly Budget",
      value: `₹${budget.toFixed(2)}`,
      icon: Wallet,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Total Spent",
      value: `₹${expenses.toFixed(2)}`,
      icon: ArrowDownCircle,
      accent: "bg-accent text-accent-foreground",
    },
    {
      label: "Remaining Balance",
      value: `₹${Math.abs(remaining).toFixed(2)}`,
      prefix: isOverBudget ? "-" : "",
      icon: PiggyBank,
      accent: isOverBudget
        ? "bg-destructive/10 text-destructive"
        : "bg-green-500/10 text-green-600 dark:text-green-400",
      valueClass: isOverBudget
        ? "text-destructive"
        : "text-green-600 dark:text-green-400",
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
              <p className={cn("text-2xl font-semibold font-[var(--font-display)]", c.valueClass)}>
                {c.prefix}{c.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}