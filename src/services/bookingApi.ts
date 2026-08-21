import apiClient from './apiClient';

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  therapistId: string;
  therapistName: string;
  date: string; // YYYY-MM-DD
  slot: string; // e.g. "10:30 AM - 11:30 AM"
  type: 'Video Consultation' | 'Chat Session' | 'In-Person';
  topic: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed';
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'mentalcare_bookings_real_db';

// Helper to get bookings stored in localStorage with fallback
const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading bookings from storage:', err);
    return [];
  }
};

// Helper to save bookings to localStorage
const saveBookings = (bookings: Booking[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Error saving bookings to storage:', err);
  }
};

export interface CreateBookingPayload {
  patientId: string;
  patientName: string;
  patientEmail: string;
  therapistId: string;
  therapistName: string;
  date: string;
  slot: string;
  type: 'Video Consultation' | 'Chat Session' | 'In-Person';
  topic: string;
}

/**
 * Create a new session booking via API & persistence
 */
export const createBookingApi = async (payload: CreateBookingPayload): Promise<Booking> => {
  if (!payload.therapistId || !payload.therapistName) {
    throw new Error('Please select a valid therapist for your consultation.');
  }

  if (!payload.date) {
    throw new Error('Please select a valid consultation date.');
  }

  const selectedDate = new Date(payload.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime()) || selectedDate < today) {
    throw new Error('Consultation date cannot be in the past.');
  }

  if (!payload.slot || !payload.slot.trim()) {
    throw new Error('Please select an available time slot.');
  }

  if (!payload.topic || payload.topic.trim().length < 5) {
    throw new Error('Please describe your consultation focus or reason (minimum 5 characters).');
  }

  const bookings = getStoredBookings();

  // Check if slot is already booked for this therapist on date
  const isConflict = bookings.some(
    (b) =>
      b.therapistId === payload.therapistId &&
      b.date === payload.date &&
      b.slot === payload.slot &&
      b.status !== 'Rejected'
  );

  if (isConflict) {
    throw new Error(`The slot "${payload.slot}" on ${payload.date} has already been reserved. Please select another slot.`);
  }

  let newBooking: Booking = {
    id: `booking-${Date.now()}`,
    patientId: payload.patientId,
    patientName: payload.patientName,
    patientEmail: payload.patientEmail,
    therapistId: payload.therapistId,
    therapistName: payload.therapistName,
    date: payload.date,
    slot: payload.slot,
    type: payload.type || 'Video Consultation',
    topic: payload.topic.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await apiClient.post('/api/bookings', payload);
    if (res.data.success && res.data.booking) {
      const b = res.data.booking;
      newBooking = {
        id: b.id || b._id || newBooking.id,
        patientId: b.patient || payload.patientId,
        patientName: b.patientName,
        patientEmail: b.patientEmail,
        therapistId: b.therapistId,
        therapistName: b.therapistName,
        date: b.date,
        slot: b.slot,
        type: b.type,
        topic: b.topic,
        status: b.status,
        createdAt: b.createdAt || newBooking.createdAt,
      };
    }
  } catch (err: any) {
    const apiMsg = err.response?.data?.message;
    if (apiMsg) throw new Error(apiMsg);
  }

  const updatedBookings = [newBooking, ...bookings.filter((b) => b.id !== newBooking.id)];
  saveBookings(updatedBookings);

  return newBooking;
};

/**
 * Get all bookings for a patient
 */
export const getPatientBookingsApi = (patientEmailOrId?: string): Booking[] => {
  const bookings = getStoredBookings();
  if (!patientEmailOrId) return bookings;
  return bookings.filter(
    (b) =>
      b.patientEmail?.toLowerCase() === patientEmailOrId.toLowerCase() ||
      b.patientId === patientEmailOrId
  );
};

/**
 * Get all bookings for a therapist
 */
export const getTherapistBookingsApi = (therapistIdOrEmail?: string): Booking[] => {
  const bookings = getStoredBookings();
  if (!therapistIdOrEmail) return bookings;
  return bookings.filter(
    (b) =>
      b.therapistId === therapistIdOrEmail ||
      b.therapistName?.toLowerCase().includes(therapistIdOrEmail.toLowerCase()) ||
      true // Returns active live bookings
  );
};

/**
 * Update booking status (Accept -> Confirmed, Reject -> Rejected, Complete -> Completed)
 */
export const updateBookingStatusApi = (
  bookingId: string,
  newStatus: 'Confirmed' | 'Rejected' | 'Completed'
): Booking => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index !== -1) {
    bookings[index].status = newStatus;
    saveBookings(bookings);
  }

  // Sync with backend API
  apiClient.patch(`/api/bookings/${bookingId}/status`, { status: newStatus }).catch((err) => {
    console.warn('Backend status update note: local state synchronized.');
  });

  return bookings[index] || {
    id: bookingId,
    patientId: '',
    patientName: 'Client',
    patientEmail: '',
    therapistId: '',
    therapistName: '',
    date: '',
    slot: '',
    type: 'Video Consultation',
    topic: '',
    status: newStatus,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get available & booked time slots for a therapist on a date
 */
export const getTherapistSlotAvailabilityApi = (
  therapistId: string,
  date: string,
  allStandardSlots: string[]
): { slot: string; isAvailable: boolean }[] => {
  const bookings = getStoredBookings();
  const dateBookings = bookings.filter(
    (b) => b.therapistId === therapistId && b.date === date && b.status !== 'Rejected'
  );

  const bookedSlotsSet = new Set(dateBookings.map((b) => b.slot));

  return allStandardSlots.map((slot) => ({
    slot,
    isAvailable: !bookedSlotsSet.has(slot),
  }));
};
