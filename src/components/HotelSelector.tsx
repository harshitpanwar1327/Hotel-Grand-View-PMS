import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../redux/Store"
import { useEffect } from "react";
import { fetchUserDetails } from "../redux/slice/UserSlice";
import { setSelectedHotel } from "../redux/slice/SelectedHotelSlice";

const HotelSelector = () => {
  const uid = sessionStorage.getItem('userId');

  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector((state: RootState) => state.user.items.hotels);
  const selectedHotel = useSelector((state: RootState) => state.selectedHotel.items.selectedHotel);
  
  useEffect(()=>{
    if (uid) dispatch(fetchUserDetails(uid));
  }, [uid, dispatch]);

  const handleHotelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const hotelId = event.target.value;
    const selectedHotel = hotels.find((hotel) => hotel.hotelId === hotelId);
    if (selectedHotel) dispatch(setSelectedHotel(selectedHotel));
  };

  return (
    <div className="flex justify-end p-4 border-b border-gray-200">
      <select name="hotel" id="hotel" value={selectedHotel.hotelId} onChange={handleHotelChange} className="border border-gray-200 p-2 rounded-xl shadow-sm focus:outline-none focus:ring focus:ring-[#D1A85D] focus:border-[#D1A85D]">
        <option value="">All Hotels</option>
        {hotels.map((hotel) => (
          <option key={hotel.hotelId} value={hotel.hotelId}>{hotel.hotelName}</option>
        ))}
      </select>
    </div>
  )
}

export default HotelSelector