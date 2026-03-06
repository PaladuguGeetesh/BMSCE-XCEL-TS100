import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Other"];

export default function AddExpensePage() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { addExpense } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !category || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Amount must be positive");
      return;
    }

    addExpense.mutate(
      {
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
        user_id: user!.id,
      },
      {
        onSuccess: () => {
          toast.success("Expense added!");
          navigate("/dashboard");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-[var(--shadow-elevated)] border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-[var(--font-display)]">Add Expense</CardTitle>
          <CardDescription>Track a new spending entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title / Description</Label>
              <Input
                id="title"
                placeholder="e.g. Lunch at café"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={addExpense.isPending}
            >
              {addExpense.isPending ? "Adding…" : "Add Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
