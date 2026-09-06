export interface WorkerLocation {
  latitude: number;
  longitude: number;
}

interface UpdateWorkerLocationResponse {
  success: boolean;
  message?: string;
  worker?: {
    id: string;
    latitude: number | null;
    longitude: number | null;
  };
}

function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to continue");
  }

  return token;
}

export async function updateWorkerLocation(
  location: WorkerLocation,
) {
  const token = getToken();

  const response = await fetch("/api/workers/location", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  });

  const data: UpdateWorkerLocationResponse =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update worker location.",
    );
  }

  return data.worker;
}
