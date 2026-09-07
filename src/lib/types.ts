export type BookingRequest = {
  name: string;
  contact: string;
  message: string;
  consent: boolean;
};

export type BookingResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
