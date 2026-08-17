import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import socket from "@/api/socketApi.js";

interface RegisterPayload {
  [key: string]: unknown;
}

interface RegisterMutationResponse {
  message: string;
  user: {
    id: number | string;
    uuid: string;
  };
}

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<RegisterMutationResponse, unknown, RegisterPayload>({
    
    mutationFn: (apiPayload: RegisterPayload) =>

      api.post<RegisterMutationResponse>("/auth/register", apiPayload).then((res) => res.data),

    onSuccess: async (response: RegisterMutationResponse) => {
      console.log("Registration successful! Server response:", response);
      const user = response?.user;

      if (user) {
        console.log("Registered user:", user);
      } else {
        console.warn("Registration succeeded, but no user data was returned.");
        return;
      }

      const { id, uuid } = user;
      useAuthStore.getState().setAuth(String(id), uuid);
      socket.connect();
      socket.emit("current_Logged_In_User_Uuid", { userUuid: uuid });
      console.log(" 💤☢️ socket connected for User:", uuid);
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/homefeed");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || err?.message || "An error occurred";
      alert(`Registration failed: ${message}`);
      console.error(message);
    },
  });
};