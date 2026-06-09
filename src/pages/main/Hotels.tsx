import { useEffect, useState, lazy } from "react"
import { Building2, Pencil, Trash2 } from "lucide-react"
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { deleteHotel } from "../../firebase/services/HotelService"
import EditHotel from "../../modals/hotels/EditHotel"
import { fetchHotels, type HotelData } from "../../redux/slice/HotelSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/Store";

const Menubar = lazy(()=>import('../../components/Menubar'));

const Hotels = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: hotels, loading } = useSelector((state: RootState) => state.hotel);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  
  const [selectedHotel, setSelectedHotel] = useState<HotelData>({
    address: '',
    hotelId: '',
    hotelName: '',
    phone: ''
  });

  useEffect(()=>{
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleEdit = async (hotel: HotelData) => {
    setSelectedHotel(hotel);
    setOpenEditModal(true);
  }

  const handleDelete = async (hotelId: string) => {
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
      dispatch(fetchHotels());

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
    <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-4">
      <Menubar heading="Hotels" subheading="Manage your hotels" hotels={true} />

      <div className="grow relative overflow-auto">
        {loading && (
          <div className='absolute inset-0 flex justify-center items-center backdrop-blur-xs z-50'>
            <ClipLoader color="#5048E5" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
          {hotels.map((hotel, index) => (
            <div key={index} className="flex flex-col gap-3 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-gray-100 text-[#1B2A41]">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-bold truncate">{hotel.hotelName}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <Pencil size={16} className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300" onClick={()=>handleEdit(hotel)} />
                  <Trash2 size={16} className="text-red-500 hover:text-red-700 cursor-pointer transition duration-300" onClick={()=>handleDelete(hotel.hotelId)} />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-[#4B5563]">
                <p><strong>Address: </strong> {hotel.address}</p>
                <span><strong>Phone: </strong> <a href={`tel:${hotel.phone}`} className="text-blue-700">{hotel.phone}</a></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openEditModal && <EditHotel setOpenModal={setOpenEditModal} selectedHotel={selectedHotel} />}
    </div>
  )
}

export default Hotels