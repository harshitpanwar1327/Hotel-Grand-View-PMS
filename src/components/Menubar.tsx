import { useState } from "react";
import AddHotel from "../modals/hotels/AddHotel";

interface MenubarProps {
  heading: string;
  subheading: string;
  hotels?: boolean;
}

const Menubar: React.FC<MenubarProps> = ({
  heading,
  subheading,
  hotels = false
}) => {
  const [openHotelsModal, setOpenHotelsModal] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold">{heading}</h1>
        <p className="text-gray-500 text-sm">{subheading}</p>
      </div>

      {hotels &&
        <button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenHotelsModal(true)}>+ Add Hotel</button>
      }

      {openHotelsModal && <AddHotel setOpenModal={setOpenHotelsModal} />}
    </div>
  )
}

export default Menubar