import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getUserDetails } from '../../firebase/services/UserService'
import type { SelectedHotel } from './SelectedHotelSlice';

export interface UserData {
  createdAt: string | null,
  email: string,
  hotels: SelectedHotel[],
  isActive: boolean,
  role: string,
  uid: string,
  updatedAt: string | null
}

interface UserDataState {
  items: UserData,
  loading: boolean,
  error: string | null
}

const initialState: UserDataState = {
  items: {
    createdAt: null,
    email: '',
    hotels: [],
    isActive: true,
    role: '',
    uid: '',
    updatedAt: null
  },
  loading: false,
  error: null,
}

export const fetchUserDetails = createAsyncThunk<UserData, string, { rejectValue: string }>(
  "user/fetchUserDetails",
  async (uid, { rejectWithValue }) => {
    const result = await getUserDetails(uid);

    if (!result.success || !result.data) {
      return rejectWithValue(result.message ?? "User not found");
    }

    return result.data;
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user details";
      });
  },
})

export default userSlice.reducer;