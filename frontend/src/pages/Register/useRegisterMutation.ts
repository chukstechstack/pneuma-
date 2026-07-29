import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import socket from "@/api/socketApi.js";
import { RegisterMutationResponse, RegisterPayload } from "./Register.types";

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<RegisterMutationResponse, unknown, RegisterPayload>({
    mutationFn: (apiPayload: RegisterPayload) =>
      api.post<RegisterMutationResponse>("/auth/register", apiPayload).then((res) => res.data),
    onSuccess: async (response: RegisterMutationResponse) => {
      console.log("Registration successful! Server response:", response);
      const { id, uuid } = response.data.user;
      useAuthStore.getState().setAuth(id, uuid);
      socket.connect();
      socket.emit("📤 Emitting_Registered_User_Uuid", { userUuid: uuid });
      console.log(" 💤☢️ socket connected for User:", uuid);
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/home");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || err?.message || "An error occurred";
      alert(`Registration failed: ${message}`);
      console.error(message);
    },
  });
};