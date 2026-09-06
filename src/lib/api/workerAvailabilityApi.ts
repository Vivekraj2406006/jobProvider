export interface WorkerAvailabilityEntry {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface GetAvailabilityResponse {
  success: boolean;
  availability?: WorkerAvailabilityEntry[];
  message?: string;
}

interface UpdateAvailabilityResponse {
  success: boolean;
  message?: string;
  availability?: WorkerAvailabilityEntry[];
}

function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required.");
  }

  return token;
}

export async function getWorkerAvailability(): Promise<
  WorkerAvailabilityEntry[]
> {
  const token = getToken();

  const response = await fetch("/api/workers/availability", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as GetAvailabilityResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load availability.");
  }

  return data.availability ?? [];
}

export async function updateWorkerAvailability(
  availability: WorkerAvailabilityEntry[]
): Promise<WorkerAvailabilityEntry[]> {
  const token = getToken();

  const response = await fetch("/api/workers/availability", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      availability,
    }),
  });

  const data = (await response.json()) as UpdateAvailabilityResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to save availability.");
  }

  return data.availability ?? availability;
}
