import { useState } from "react";
import AddHotel from "../modals/hotels/AddHotel";
import AddRoom from "../modals/rooms/AddRoom";

interface MenubarProps {
  heading: string;
  subheading: string;
  dashboard?: boolean;
  bookings?: boolean;
  rooms?: boolean;
  hotels?: boolean;
}

const Menubar: React.FC<MenubarProps> = ({
  heading,
  subheading,
  dashboard = false,
  bookings = false,
  rooms = false,
  hotels = false
}) => {
  const [openRoomsModal, setOpenRoomsModal] = useState<boolean>(false);
  const [openHotelsModal, setOpenHotelsModal] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold">{heading}</h1>
        <p className="text-gray-500 text-sm">{subheading}</p>
      </div>

      {rooms &&
        <button className="bg-[#0d1e3b] hover:bg-[#0d1e3b]/90 shadow-[#0d1e3b]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenRoomsModal(true)}>+ Add Room</button>
      }

      {hotels &&
        <button className="bg-[#0d1e3b] hover:bg-[#0d1e3b]/90 shadow-[#0d1e3b]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenHotelsModal(true)}>+ Add Hotel</button>
      }

      {openHotelsModal && <AddHotel setOpenModal={setOpenHotelsModal} />}
      {openRoomsModal && <AddRoom setOpenModal={setOpenRoomsModal} />}
    </div>
  )
}

export default Menubar