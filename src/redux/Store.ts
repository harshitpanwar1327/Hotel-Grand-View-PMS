import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/UserSlice'
import hotelReducer from './slice/HotelSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotel: hotelReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch