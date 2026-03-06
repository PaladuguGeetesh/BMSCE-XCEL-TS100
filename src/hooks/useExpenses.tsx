// ============================================================
// UPDATED: Now calls the Express backend via expensesService
// instead of calling Supabase directly.
// Everything else (React Query, invalidation, computed values)
// stays exactly the same — only the data source changed.
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExpenses,
  addExpense as apiAddExpense,
  removeExpense,
} from "@/services/expensesService";
import type { Tables } from "@/integrations/supabase/types";

// Keep the same type so the rest of the app doesn't need to change
export type Expense = Tables<"expenses">;

export function useExpenses() {
  const queryClient = useQueryClient();

  // Fetch all expenses — now calls: GET /api/expenses
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  // Add expense — now calls: POST /api/expenses
  const addExpense = useMutation({
    mutationFn: apiAddExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  // Delete expense — now calls: DELETE /api/expenses/:id
  const deleteExpense = useMutation({
    mutationFn: removeExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  // ── Computed analytics (still done client-side from fetched data) ──
  const totalSpending = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const transactionCount = expenses.length;

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const highestCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    totalSpending,
    transactionCount,
    highestCategory,
    chartData,
  };
}
