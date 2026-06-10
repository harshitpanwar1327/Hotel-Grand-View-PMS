import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookings } from '../../firebase/services/BookingService';

export interface BookingData {
  aadharNumber: string;
  bookingStatus: string;
  bookingId: string;
  checkInAt: string;
  checkOutAt: string;
  checkedOutAt?: string | null;
  createdAt?: string | null;
  createdBy: string;
  guestName: string;
  hotelId: string;
  numberOfGuests: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  pendingAmount: number;
  phone: string;
  roomId: string;
  roomNumber: string;
  totalAmount: number;
  updatedAt?: string | null;
}

export interface FetchBookingsPayload {
  status?: string;
  date: string;
  hotelId: string;
}

interface BookingDataState {
  items: BookingData[],
  loading: boolean,
  error: string | null
}

const initialState: BookingDataState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchBookings = createAsyncThunk<BookingData[], FetchBookingsPayload, { rejectValue: string }>(
  "booking/fetchBookings",
  async (filters, { rejectWithValue }) => {
    try {
      const result = await getBookings(filters);

      if (!result.success || !result.data) {
        return rejectWithValue(result.message || "Failed to fetch bookings.");
      }

      return result.data as BookingData[];
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch bookings.");
    }
  }
);

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bookings.";
      });
  },
})

export default bookingSlice.reducer;