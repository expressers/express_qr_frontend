import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { userService } from "@/service/api";
import { applyFieldErrors, getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";
import { useUserGetMe } from "./use_userGetMe";

interface MyProfileProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function useMyProfile({ email, firstName, lastName, phone }: MyProfileProps) {
  const { translations } = useLang();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = translations.pages.MyProfile;
  const schema = z.object({
    // Só leitura: PATCH /api/account/me já não aceita `email` (mudança de email fica para a onda 4).
    email: z.string().optional(),
    firstName: z.string().nonempty(t.form.firstName.required).min(3, t.form.firstName.min),
    lastName: z.string().nonempty(t.form.lastName.required).min(3, t.form.lastName.min),
    phone: z.string().optional(),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
    },
  });
  const { refreshGetMe } = useUserGetMe();

  useEffect(() => {
    form.reset({
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
    });
  }, [email, firstName, lastName, phone, form]);

  async function onSubmit(value: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      await userService.updateProfile({
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
      });
      await refreshGetMe();
      toast.success(t.toastSuccess);
    } catch (error) {
      applyFieldErrors(
        error,
        form.setError,
        { firstName: "firstName", lastName: "lastName", phone: "phone" },
        translations.errors.FIELD_INVALID,
      );
      toast.error(getErrorMessage(error, translations.errors, t.toastError));
    } finally {
      setIsLoading(false);
    }
  }

  return { form, onSubmit, isLoading };
}

export { useMyProfile };
