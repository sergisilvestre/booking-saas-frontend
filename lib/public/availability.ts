import { apiClient } from "./client";

export interface AvailabilitySlot {
  startsAt: string;
  endsAt: string;
}

interface ApiAvailabilitySlot {
  start: string;
  end: string;
}

export async function getAvailability(
  eventTypeId: string,
  date: string,
  timezone: string,
): Promise<AvailabilitySlot[]> {
  const response = await apiClient.get<ApiAvailabilitySlot[]>(
    `/api/public/event-types/${encodeURIComponent(eventTypeId)}/availability`,
    {
      params: {
        date,
        timezone,
      },
    },
  );

  return response.map((slot) => ({
    startsAt: slot.start,
    endsAt: slot.end,
  }));
}
