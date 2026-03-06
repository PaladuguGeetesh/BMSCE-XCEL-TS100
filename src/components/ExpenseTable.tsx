import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from "@/hooks/useExpenses";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ExpenseTable({
  expenses,
  onDelete,
  isDeleting,
}: ExpenseTableProps) {
  return (
    <Card className="shadow-[var(--shadow-card)] border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No expenses yet. Start tracking!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>${Number(expense.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <p>
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(expense.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
