import { useEffect, useState, useCallback } from "react"
import { Building2, Pencil } from "lucide-react"
import { toast } from "react-toastify"
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { deleteHotel, getHotels, type HotelData } from "../../firebase/services/HotelService"
import AddHotel from "../../modals/hotels/AddHotel"
import EditHotel from "../../modals/hotels/EditHotel"

const Hotels = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  
  const [selectedHotel, setSelectedHotel] = useState<HotelData>({
    address: '',
    hotelName: '',
    phone: ''
  });

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHotels();
      if (response.success && response.data) {
        setHotels(response.data as HotelData[]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch hotels.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchHotels]);

  const handleEditRoom = async (hotel: HotelData) => {
    setSelectedHotel(hotel);
    setOpenEditModal(true);
  }

  const handleDeleteRoom = async (hotelId: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Hotel?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-5 py-2",
          cancelButton: "rounded-xl px-5 py-2",
        },
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting hotel...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl",
        },
      });

      await deleteHotel(hotelId);
      fetchHotels();

      Swal.fire({
        title: "Deleted!",
        text: "Hotel deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl",
        },
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete room.",
        icon: "error",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl",
        },
      });
    }
  };

  return (
    <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl font-bold">Hotels</h1>
                <p className="text-gray-500 text-sm">Manage your hotels</p>
            </div>
            <button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenAddModal(true)}>+ Add Hotel</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {hotels.map((hotel, index) => (
            <div key={index} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6]">
                    <Building2 size={20} className="text-[#334155]"/>
                  </div>
                  <div>
                    <h3 className="text-md font-bold">{hotel.hotelName}</h3>
                  </div>
                </div>

                <button className="w-10 h-10 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-blue-50 transition duration-300" onClick={()=>handleEditRoom(hotel)}>
                  <Pencil size={16} className="text-blue-500" />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[#4B5563]">
                <p>{hotel.address}</p>
                <p>{hotel.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Users size={20} className="text-[#4B5563]"/>
            <h2 className="text-md font-bold">Staff & Hotel Assignment</h2>
          </div>

          <p className="mt-4 text-md text-[#6B7280]">Assign each receptionist to a hotel. Admins are unassigned and see every hotel.</p>
          
          <div className="mt-8 flex items-center justify-between">
            <div>
              <h3 className="text-md font-bold">Harshit Panwar</h3>
              <p className="text-sm text-[#6B7280]">harshitpanwar1327@gmail.com</p>
            </div>

            <select name="name" id="name" className="p-2 border border-gray-200 rounded-xl focus:outline-none focus-within:border-[#1B2A41] focus-within:ring-1 focus-within:ring-[#1B2A41] transition duration-300">
              <option value="">All hotels (admin)</option>
              {hotels.map((hotel) => (
                <option key={hotel.name} value={hotel.name}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {openAddModal && <AddHotel setOpenModal={setOpenAddModal} fetchHotels={fetchHotels} />}
        {openEditModal && <EditHotel setOpenModal={setOpenEditModal} fetchHotels={fetchHotels} selectedHotel={selectedHotel} />}
    </div>
  )
}

export default Hotels