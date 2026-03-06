// ============================================================
// src/services/expensesService.ts
// All expense API calls go through here.
// The hooks (useExpenses.tsx) call these functions.
// ============================================================

import { api } from "./apiClient";
import type { Expense } from "@/hooks/useExpenses";

// Shape of what we send when creating an expense
interface CreateExpensePayload {
  title: string;
  amount: number;
  category: string;
  date: string;
  user_id: string; // still included for compatibility
}

// Shape of the summary response from Express
export interface ExpenseSummary {
  totalSpending: number;
  transactionCount: number;
  highestCategory: string;
  categoryBreakdown: {
    category: string;
    total: number;
    count: number;
  }[];
}

// Fetch all expenses for the current user
export async function fetchExpenses(): Promise<Expense[]> {
  const response = await api.get<{ data: Expense[]; count: number }>(
    "/api/expenses"
  );
  return response.data;
}

// Add a new expense
export async function addExpense(
  expense: CreateExpensePayload
): Promise<Expense> {
  const response = await api.post<{ data: Expense; message: string }>(
    "/api/expenses",
    expense
  );
  return response.data;
}

// Delete an expense by ID
export async function removeExpense(id: string): Promise<void> {
  await api.delete(`/api/expenses/${id}`);
}

// Get analytics summary (totals, category breakdown)
export async function fetchExpenseSummary(): Promise<ExpenseSummary> {
  return api.get<ExpenseSummary>("/api/expenses/summary");
}
