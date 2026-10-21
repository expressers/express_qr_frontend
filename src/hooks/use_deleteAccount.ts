import { userService } from "@/service/api";
import { toast } from "sonner";

function useDeleteAccount() {
  async function DeleteAccount() {
    try {
      const response = await userService.DeleteAccount();

      if (response.status !== 204) {
        throw new Error(`Erro ${response.status}`);
      }

      toast.success("Conta eliminada com sucesso!", {
        className: "bg-green-500/10 text-white font-semibold",
      });
    } catch (error) {
      toast.error("Erro ao eliminar conta", {
        className: "bg-red-500/10 text-white font-semibold",
      });
      console.error("Error deleting account:", error);
    }
  }

  return { DeleteAccount };
}

export { useDeleteAccount };
