import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLang } from "./use_Lang";
import { userService } from "@/service/api";
import { useUserGetMe } from "./use_userGetMe";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MyProfileProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  address?: string;
}

function useMyProfile({
  email,
  firstName,
  lastName,
  phone,
  country,
  address,
}: MyProfileProps) {
  const { translations } = useLang();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = translations.pages.MyProfile;
  const schema = z.object({
    email: z
      .string()
      .nonempty(t.form.email.required)
      .email("Formato de email inválido")
      .optional(),
    firstName: z
      .string()
      .nonempty(t.form.firstName.required)
      .min(3, t.form.firstName.min)
      .optional(),
    lastName: z
      .string()
      .nonempty(t.form.lastName.required)
      .min(3, t.form.lastName.min)
      .optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      country: country || "",
      address: address || "",
    },
  });
  const { refreshGetMe } = useUserGetMe();
 useEffect(() => {
   form.reset({
     email: email || "",
     firstName: firstName || "",
     lastName: lastName || "",
     phone: phone || "",
     country: country || "",
     address: address || "",
   });
 }, [email, firstName, lastName, phone, country, address, form]);
  async function onSubmit(value: z.infer<typeof schema>) {
    setIsLoading(true);

    const payload = {
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      country: value.country,
      city: value.address,
    };
    try {
      const response = await userService.updateProfile(payload);
     

      if (!response.data.success) {
        throw new Error(`Erro ${response.status}`);
      }
      await refreshGetMe();
      toast.success("Perfil atualizado com sucesso!", {
        className: "bg-green-500 text-white font-semibold",
      });
    } catch (error) {
      toast.error("Erro ao atualizar perfil", {
        className: "bg-red-500/10 text-white font-semibold",
      });

      console.error("error:", error);
    }
  }
  return { form, onSubmit, isLoading };
}

export { useMyProfile };
