import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHotels } from '../../firebase/services/HotelService';
import type { Timestamp } from 'firebase/firestore';

export interface HotelFirestore {
  address: string;
  createdAt?: Timestamp | null;
  hotelId: string;
  hotelName: string;
  phone: string;
  updatedAt?: Timestamp | null;
}

export interface HotelData {
  address: string;
  createdAt?: string | null;
  hotelId: string;
  hotelName: string;
  phone: string;
  updatedAt?: string | null;
}

interface HotelDataState {
  items: HotelData[],
  loading: boolean,
  error: string | null
}

const initialState: HotelDataState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchHotels = createAsyncThunk<HotelData[], void, { rejectValue: string }>(
  "hotel/fetchHotels",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getHotels();

      if (!result.success || !result.data) {
        return rejectWithValue(result.message || "Failed to fetch hotels.");
      }

      const hotels: HotelData[] = (result.data as HotelFirestore[]).map((hotel) => ({
        ...hotel,
        createdAt: hotel.createdAt?.toDate().toISOString() ?? null,
        updatedAt: hotel.updatedAt?.toDate().toISOString() ?? null
      }));

      return hotels;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch hotels.");
    }
  }
);

export const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch hotel data.";
      });
  },
})

export default hotelSlice.reducer;