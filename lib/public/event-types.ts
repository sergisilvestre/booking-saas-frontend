import { apiClient } from "./client";

export interface EventType {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  duration: number;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface EventTypeResponse {
  data: EventType;
}

export async function getPublicEventType(
  eventType: string,
): Promise<EventTypeResponse> {
  return apiClient.get<EventTypeResponse>(
    `/api/public/event-types/${encodeURIComponent(eventType)}`,
  );
}