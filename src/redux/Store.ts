import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/UserSlice'
import hotelReducer from './slice/HotelSlice'
import roomReducer from './slice/RoomSlice'
import selectedHotelReducer from './slice/SelectedHotelSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotel: hotelReducer,
    room: roomReducer,
    selectedHotel: selectedHotelReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch