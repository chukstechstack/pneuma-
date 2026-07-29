import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { PendingRequest, MutationVariables, MutationContext } from "./PendingRequest.types";

export const usePendingRequests = () => {
  const queryClient = useQueryClient();

  const { data: pendingRequests = [] } = useQuery<PendingRequest[], Error, PendingRequest[]>({
    queryKey: ["pendingRequests"],
    queryFn: async () => {
      const res = await api.get<{ requests: PendingRequest[] }>("/task/profile/pending-requests");
      return res.data.requests;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const mutation = useMutation<PendingRequest[] | undefined, Error, MutationVariables, MutationContext>({
    mutationFn: async ({ targetUuid, action }) => {
      const res = await api.patch<{ updatedRequests: PendingRequest[] }>("/task/profile/request-action", {
        targetUuid,
        action,
      });
      return res.data.updatedRequests;
    },
    onMutate: async ({ targetUuid }) => {
      await queryClient.cancelQueries({ queryKey: ["pendingRequests"] });
      const previousRequests = queryClient.getQueryData<PendingRequest[]>(["pendingRequests"]);

      queryClient.setQueryData<PendingRequest[] | undefined>(["pendingRequests"], (old = []) =>
        old.filter((req) => req.requested_User_Uuid !== targetUuid),
      );

      return { previousRequests };
    },
    onSuccess: (updatedRequests) => {
      if (updatedRequests) {
        queryClient.setQueryData(["pendingRequests"], updatedRequests);
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData<PendingRequest[] | undefined>(["pendingRequests"], context.previousRequests);
      }
    },
  });

  return { pendingRequests, mutation };
};