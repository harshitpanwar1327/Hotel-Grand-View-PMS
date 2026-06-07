import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getUserDetails } from '../../firebase/services/UserService'
import { Timestamp } from "firebase/firestore";

export interface UserDetails {
  createdAt: Timestamp | null,
  email: string,
  hotelIds: string[],
  isActive: boolean,
  role: string,
  uid: string,
  updatedAt: Timestamp | null
}

interface UserDetailsState {
  items: UserDetails,
  loading: boolean,
  error: string | null
}

const initialState: UserDetailsState = {
  items: {
    createdAt: null,
    email: '',
    hotelIds: [],
    isActive: true,
    role: '',
    uid: '',
    updatedAt: null
  },
  loading: false,
  error: null,
}

export const fetchUserDetails = createAsyncThunk<UserDetails, string, { rejectValue: string }>(
  "user/fetchUserDetails",
  async (uid: string, { rejectWithValue }) => {
    const result = await getUserDetails(uid);

    if (!result.success || !result.data) {
      return rejectWithValue(result.message ?? "User not found");
    }

    return result.data;
  }
)

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

      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<UserDetails>) => {
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