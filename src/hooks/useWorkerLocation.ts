"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { updateWorkerLocation } from "@/lib/api/workerLocationApi";

interface UseWorkerLocationOptions {
  enabled: boolean;
}

export function useWorkerLocation({
  enabled,
}: UseWorkerLocationOptions) {
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const sendLocation = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        await updateWorkerLocation({
          latitude,
          longitude,
        });

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update your location.",
        );
      }
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      setTracking(false);

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current,
        );

        watchIdRef.current = null;
      }

      return;
    }

    if (!("geolocation" in navigator)) {
      setError(
        "Geolocation is not supported by this browser.",
      );
      setTracking(false);
      return;
    }

    setError(null);
    setTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        void sendLocation(latitude, longitude);
      },
      (positionError) => {
        setTracking(false);

        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            setError(
              "Location permission was denied. Please allow location access to share your live position.",
            );
            break;

          case positionError.POSITION_UNAVAILABLE:
            setError(
              "Your current location could not be determined.",
            );
            break;

          case positionError.TIMEOUT:
            setError(
              "Location request timed out. Trying again...",
            );
            break;

          default:
            setError("Unable to access your location.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current,
        );

        watchIdRef.current = null;
      }

      setTracking(false);
    };
  }, [enabled, sendLocation]);

  return {
    tracking,
    error,
  };
}
