export interface PendingRequest {
  requested_User_Uuid: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
}

export interface MutationVariables {
  targetUuid: string;
  action: string;
}

export interface MutationContext {
  previousRequests?: PendingRequest[] | null;
}