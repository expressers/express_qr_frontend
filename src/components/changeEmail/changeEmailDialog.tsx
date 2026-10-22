import { useState } from "react";
import { MailCheck } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from "../ui";
import { PasswordInput } from "../authShell/authFields";
import { useChangeEmail, useLang } from "@/hooks";

/** "Alterar email": novo email + senha actual; o link de confirmação segue para o novo endereço. */
function ChangeEmailDialog({ currentEmail }: { currentEmail?: string | null }) {
  const { translations } = useLang();
  const t = translations.pages.Settings.changeEmail;
  const label = translations.pages.MyProfile.form.email.change;
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isLoading, sentTo, reset } = useChangeEmail(currentEmail);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="lg" className="w-full shrink-0 sm:h-10 sm:w-auto">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{sentTo ? t.sentTitle : t.title}</DialogTitle>
          <DialogDescription>{sentTo ? t.sentHint : t.description}</DialogDescription>
        </DialogHeader>

        {sentTo ? (
          <>
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-input bg-muted/50 p-3 text-sm">
              <MailCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p className="min-w-0 break-words">
                {t.sent.replace("{email}", sentTo)}
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" size="lg" className="w-full sm:h-10 sm:w-auto">
                  {t.close}
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form
              noValidate
              onSubmit={(event) => {
                // O diálogo vive dentro do formulário do perfil: sem isto o submit sobe pela árvore React.
                event.stopPropagation();
                void form.handleSubmit(onSubmit)(event);
              }}
              aria-busy={isLoading}
              className="space-y-5">
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.newEmail}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder={t.newEmailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.currentPassword}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="current-password"
                        placeholder={t.currentPasswordPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="lg" className="sm:h-10">
                    {t.cancel}
                  </Button>
                </DialogClose>
                <Button type="submit" size="lg" className="sm:h-10" disabled={isLoading}>
                  {isLoading && <Spinner />}
                  {t.submit}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { ChangeEmailDialog };
