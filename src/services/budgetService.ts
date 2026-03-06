// ============================================================
// src/services/budgetService.ts
// All budget API calls go through here.
// The hooks (useBudget.tsx) call these functions.
// ============================================================

import { api } from "./apiClient";
import type { Budget } from "@/hooks/useBudget";

// Shape of the budget summary from Express
export interface BudgetSummary {
  monthlyBudget: number;
  totalExpenses: number;
  remainingBalance: number;
  isOverBudget: boolean;
  month: number;
  year: number;
}

// Fetch current month's budget
export async function fetchBudget(): Promise<Budget | null> {
  const response = await api.get<{ data: Budget | null; currentMonth: number; currentYear: number }>(
    "/api/budget"
  );
  return response.data;
}

// Set/create budget for the current month
export async function createOrUpdateBudget(amount: number): Promise<Budget> {
  const response = await api.post<{ data: Budget; message: string }>(
    "/api/budget",
    { monthly_budget: amount }
  );
  return response.data;
}

// Update budget by ID
export async function updateBudgetById(
  id: string,
  amount: number
): Promise<Budget> {
  const response = await api.put<{ data: Budget; message: string }>(
    `/api/budget/${id}`,
    { monthly_budget: amount }
  );
  return response.data;
}

// Get budget summary: budget + total spent + remaining balance
// This is what powers the dashboard summary cards
export async function fetchBudgetSummary(): Promise<BudgetSummary> {
  return api.get<BudgetSummary>("/api/budget/summary");
}
