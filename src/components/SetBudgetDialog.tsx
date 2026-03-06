import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "sonner";

export function SetBudgetDialog() {
  const { monthlyBudget, setBudget, currentMonth, currentYear } = useBudget();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString("default", {
    month: "long",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }
    setBudget.mutate(val, {
      onSuccess: () => {
        toast.success("Budget updated");
        setOpen(false);
        setAmount("");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Set Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
          <DialogDescription>
            Set your budget for {monthName} {currentYear}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Monthly Budget Amount</Label>
            <Input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={monthlyBudget > 0 ? `Current: ₹${monthlyBudget}` : "e.g. 20000"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={setBudget.isPending}>
              {setBudget.isPending ? "Saving…" : "Save Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
