import { useState, type ComponentProps } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useLang } from "@/hooks";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useFormField } from "../ui/form";

/** Password field with an accessible show/hide toggle. Receives FormControl props directly. */
function PasswordInput({ className, ...props }: ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  const { translations } = useLang();
  const t = translations.components.AuthShell;

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        aria-label={visible ? t.hidePassword : t.showPassword}
        aria-pressed={visible}
        onClick={() => setVisible((state) => !state)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground">
        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  );
}

/** Inline field error: icon plus text, announced to assistive tech, never colour alone. */
function FieldError() {
  const { error, formMessageId } = useFormField();
  if (!error?.message) return null;

  return (
    <p
      id={formMessageId}
      role="alert"
      className="flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{String(error.message)}</span>
    </p>
  );
}

export { PasswordInput, FieldError };
