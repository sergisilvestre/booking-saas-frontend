"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Whether the signed-in user's role has a permission. Only hides what the
 * role cannot use: the API enforces every permission anyway.
 */
export function useCan(): (permission: string) => boolean {
  const { user } = useCurrentUser();
  const permissions = user?.permissions;

  // Older sessions without the list: show everything and let the API decide.
  return (permission) => (permissions ? permissions.includes(permission) : true);
}
