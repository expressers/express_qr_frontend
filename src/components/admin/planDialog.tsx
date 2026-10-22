import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "../ui";
import { useLang } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  adminService,
  type AdminUser,
  type ManagedPlan,
  type PlanPeriodDays,
} from "@/service/api";
import { getErrorMessage } from "@/utils";

const PLANS: ManagedPlan[] = ["FREE", "PRO", "PREMIUM"];
const PERIODS: PlanPeriodDays[] = [30, 90, 365];

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  render,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  render: (value: T) => string;
}) {
  return (
    <div className="space-y-2">
      <span className="block text-sm leading-none font-medium">{label}</span>
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            onClick={() => onChange(option)}
            className={cn(
              "h-9 rounded-md px-3 text-sm font-medium transition-[background-color,color,transform] duration-(--dur-fast) ease-(--ease-out) active:scale-[.97]",
              value === option
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}>
            {render(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Altera o plano de um utilizador e a duração da activação manual (30, 90 ou 365 dias). */
function PlanDialog({
  user,
  onClose,
  onDone,
}: {
  user: AdminUser | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const { translations } = useLang();
  const t = translations.pages.Admin;
  const [plan, setPlan] = useState<ManagedPlan>("PRO");
  const [period, setPeriod] = useState<PlanPeriodDays>(30);
  const [isLoading, setIsLoading] = useState(false);
  const plans = t.plans as Record<string, string>;

  async function submit() {
    if (!user) return;
    try {
      setIsLoading(true);
      await adminService.changePlan(user.id, plan === "FREE" ? { plan } : { plan, periodDays: period });
      toast.success(t.planDialog.success);
      onDone();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.planDialog.error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.planDialog.title}</DialogTitle>
          <DialogDescription className="break-words">
            {t.planDialog.description.replace("{email}", user?.email ?? "")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <Segmented
            label={t.planDialog.plan}
            value={plan}
            options={PLANS}
            onChange={setPlan}
            render={(value) => plans[value] ?? value}
          />
          {plan !== "FREE" && (
            <Segmented
              label={t.planDialog.duration}
              value={period}
              options={PERIODS}
              onChange={setPeriod}
              render={(value) => t.planDialog.days.replace("{n}", String(value))}
            />
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" size="lg" className="sm:h-10" onClick={onClose} disabled={isLoading}>
            {t.planDialog.cancel}
          </Button>
          <Button type="button" size="lg" className="sm:h-10" onClick={submit} disabled={isLoading}>
            {isLoading && <Spinner />}
            {t.planDialog.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PlanDialog };
