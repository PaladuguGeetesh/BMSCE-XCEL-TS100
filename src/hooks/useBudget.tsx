// ============================================================
// UPDATED: Now calls the Express backend via budgetService
// instead of calling Supabase directly.
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBudget,
  createOrUpdateBudget,
} from "@/services/budgetService";

export interface Budget {
  id: string;
  user_id: string;
  monthly_budget: number;
  month: number;
  year: number;
  created_at: string;
}

export function useBudget() {
  const queryClient = useQueryClient();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Fetch current month's budget — calls: GET /api/budget
  const { data: budget, isLoading } = useQuery({
    queryKey: ["budget", currentMonth, currentYear],
    queryFn: fetchBudget,
  });

  // Set/update budget — calls: POST /api/budget (upsert on server)
  const setBudget = useMutation({
    mutationFn: (amount: number) => createOrUpdateBudget(amount),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", currentMonth, currentYear] }),
  });

  const monthlyBudget = budget?.monthly_budget ?? 0;

  return { budget, monthlyBudget, isLoading, setBudget, currentMonth, currentYear };
}
