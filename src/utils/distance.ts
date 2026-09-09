export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculates the straight-line distance between two coordinates
 * using the Haversine formula.
 *
 * Returns distance in kilometers.
 */
export function calculateDistanceKm(
  from: Coordinates,
  to: Coordinates,
): number {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    to.latitude - from.latitude;

  const longitudeDifference =
    to.longitude - from.longitude;

  const latitudeDifferenceRadians =
    (latitudeDifference * Math.PI) / 180;

  const longitudeDifferenceRadians =
    (longitudeDifference * Math.PI) / 180;

  const fromLatitudeRadians =
    (from.latitude * Math.PI) / 180;

  const toLatitudeRadians =
    (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifferenceRadians / 2) ** 2 +
    Math.sin(longitudeDifferenceRadians / 2) ** 2 *
      Math.cos(fromLatitudeRadians) *
      Math.cos(toLatitudeRadians);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return earthRadiusKm * c;
}

export function formatDistanceKm(
  distanceKm: number,
): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Provides a simple ETA based on an assumed average
 * road speed.
 *
 * This is an estimate, not real road routing.
 */
export function calculateEtaMinutes(
  distanceKm: number,
  averageSpeedKmh = 25,
): number {
  if (distanceKm <= 0) {
    return 0;
  }

  return Math.max(
    1,
    Math.round((distanceKm / averageSpeedKmh) * 60),
  );
}

export function formatEtaMinutes(
  minutes: number,
): string {
  if (minutes <= 1) {
    return "1 min";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}
