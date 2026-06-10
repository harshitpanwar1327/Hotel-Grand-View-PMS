import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRooms } from '../../firebase/services/RoomService';

export interface RoomData {
  createdAt?: string | null;
  hotelId: string;
  pricePerNight: number;
  roomId: string;
  roomNumber: string;
  roomType: string;
  status: string;
  updatedAt?: string | null;
}

interface FetchRoomsPayload {
  status?: string;
  hotelId?: string;
}

interface RoomDataState {
  items: RoomData[],
  loading: boolean,
  error: string | null
}

const initialState: RoomDataState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchRooms = createAsyncThunk<RoomData[], FetchRoomsPayload, { rejectValue: string }>(
  "room/fetchRooms",
  async ({ status, hotelId }, { rejectWithValue }) => {
    try {
      const result = await getRooms(status, hotelId);

      if (!result.success || !result.data) {
        return rejectWithValue(result.message || "Failed to fetch rooms.");
      }

      return result.data as RoomData[];
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch rooms.");
    }
  }
);

export const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rooms.";
      });
  },
})

export default roomSlice.reducer;