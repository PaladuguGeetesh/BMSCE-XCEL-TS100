import { SummaryCards } from "@/components/SummaryCards";
import { BudgetCards } from "@/components/BudgetCards";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { ExpenseTable } from "@/components/ExpenseTable";
import { SetBudgetDialog } from "@/components/SetBudgetDialog";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "sonner";

export default function DashboardPage() {
  const {
    expenses,
    isLoading,
    deleteExpense,
    totalSpending,
    transactionCount,
    highestCategory,
    chartData,
  } = useExpenses();

  const { monthlyBudget, isLoading: budgetLoading } = useBudget();

  const handleDelete = (id: string) => {
    deleteExpense.mutate(id, {
      onSuccess: () => toast.success("Expense deleted"),
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading || budgetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Your expense overview at a glance</p>
        </div>
        <SetBudgetDialog />
      </div>

      {monthlyBudget > 0 && (
        <BudgetCards monthlyBudget={monthlyBudget} totalExpenses={totalSpending} />
      )}

      <SummaryCards
        totalSpending={totalSpending}
        transactionCount={transactionCount}
        highestCategory={highestCategory}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ExpensePieChart data={chartData} />
        </div>
        <div className="lg:col-span-3">
          <ExpenseTable
            expenses={expenses}
            onDelete={handleDelete}
            isDeleting={deleteExpense.isPending}
          />
        </div>
      </div>
    </div>
  );
}
