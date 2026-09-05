import type {
  BookingAction,
  BookingStatus,
} from "@/types/workerBooking";

export function getBookingStatusLabel(
  status: BookingStatus
) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "ASSIGNED":
      return "New Booking";

    case "ACCEPTED":
      return "Accepted";

    case "ON_THE_WAY":
      return "On the Way";

    case "ARRIVED":
      return "Arrived";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "REJECTED":
      return "Rejected";

    default:
      return status;
  }
}

export function getNextBookingAction(
  status: BookingStatus
): BookingAction | null {
  switch (status) {
    case "ASSIGNED":
      return "accept";

    case "ACCEPTED":
      return "startJourney";

    case "ON_THE_WAY":
      return "markArrived";

    case "ARRIVED":
      return "startWork";

    case "IN_PROGRESS":
      return "complete";

    default:
      return null;
  }
}

export function getBookingActionLabel(
  action: BookingAction
) {
  switch (action) {
    case "accept":
      return "Accept Booking";

    case "reject":
      return "Reject Booking";

    case "startJourney":
      return "Start Journey";

    case "markArrived":
      return "Mark Arrived";

    case "startWork":
      return "Start Work";

    case "complete":
      return "Complete Booking";

    default:
      return action;
  }
}
