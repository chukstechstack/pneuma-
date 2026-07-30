import type { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import socket from "@/api/socketApi.js";
import { LoginFormValues, LoginMutationResponse } from "./Login.types";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<LoginMutationResponse>, unknown, LoginFormValues>({
    mutationFn: (credentials: LoginFormValues) => api.post<LoginMutationResponse>("/auth/login", credentials),
    onSuccess: async (response: AxiosResponse<LoginMutationResponse>) => {
      console.log("Login successful! Server response:", response);
      const responseData = response.data;
      const id = (responseData as any).id as string | undefined;
      const uuid = (responseData as any).uuid as string;
      
      useAuthStore.getState().setAuth(id ?? uuid, uuid);

      socket.connect();
      socket.emit("current_Logged_In_User_Uuid", { userUuid: uuid });
      console.log(" 💤☢️ socket connected for User:", uuid);
      
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/homefeed");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || (err instanceof Error ? err.message : String(err));
      alert(`Login failed: ${message}`);
      console.error(message);
    },
  });
};