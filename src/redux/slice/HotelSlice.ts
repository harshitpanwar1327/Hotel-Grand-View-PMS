import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHotels } from '../../firebase/services/HotelService';

export interface HotelData {
  uid?: string;
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

      return result.data as HotelData[];
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
        state.error = action.payload || "Failed to fetch hotels.";
      });
  },
})

export default hotelSlice.reducer;