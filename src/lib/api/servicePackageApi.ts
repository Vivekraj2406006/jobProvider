export interface ServicePackage {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
}

interface ServicePackagesResponse {
  success: boolean;
  service?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  packages?: ServicePackage[];
  message?: string;
}

export async function getServicePackages(
  serviceId: string
): Promise<ServicePackage[]> {
  const response = await fetch(
    `/api/service-packages/${encodeURIComponent(serviceId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data: ServicePackagesResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch service packages");
  }

  return data.packages ?? [];
}
