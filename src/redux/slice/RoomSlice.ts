import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Timestamp } from 'firebase/firestore';
import { getRooms } from '../../firebase/services/RoomService';

interface RoomFirestore {
  createdAt?: Timestamp | null;
  hotelId: string;
  pricePerNight: number;
  roomId: string;
  roomNumber: string;
  roomType: string;
  status: string;
  updatedAt?: Timestamp | null;
}

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

export const fetchRooms = createAsyncThunk<RoomData[], void, { rejectValue: string }>(
  "room/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getRooms();

      if (!result.success || !result.data) {
        return rejectWithValue(result.message || "Failed to fetch rooms.");
      }

      const rooms: RoomData[] = (result.data as RoomFirestore[]).map((room) => ({
        ...room,
        createdAt: room.createdAt?.toDate().toISOString() ?? null,
        updatedAt: room.updatedAt?.toDate().toISOString() ?? null
      }));

      return rooms;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch hotels.");
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