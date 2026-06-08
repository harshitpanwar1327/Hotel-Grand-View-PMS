import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SelectedHotel {
  hotelId: string;
  hotelName: string;
}

interface HotelDetails {
  selectedHotel: SelectedHotel;
}

interface HotelState {
  items: HotelDetails,
  loading: boolean,
  error: string | null
}

const initialState: HotelState = {
  items: {
    selectedHotel: {
      hotelId: '',
      hotelName: ''
    }
  },
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: "selectedHotel",
  initialState,
  reducers: {
    setSelectedHotel: (state, action: PayloadAction<SelectedHotel>) => {
      state.items.selectedHotel = action.payload;
    }
  },
});

export const { setSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;