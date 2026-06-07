import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/UserSlice'
import hotelReducer from './slice/HotelSlice'
import roomReducer from './slice/RoomSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotel: hotelReducer,
    room: roomReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch