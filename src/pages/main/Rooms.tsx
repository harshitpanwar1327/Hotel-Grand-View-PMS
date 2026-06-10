import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, lazy } from "react";
import { deleteRoom } from "../../firebase/services/RoomService";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import EditRoom from "../../modals/rooms/EditRoom";
import { fetchRooms, type RoomData } from "../../redux/slice/RoomSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/Store";

const HotelSelector = lazy(()=>import("../../components/HotelSelector"));
const Menubar = lazy(()=>import('../../components/Menubar'));

const tabStatus = ["All", "Available", "Occupied", "Maintenance"];

const Rooms = () => {
  const [status, setStatus] = useState<string>("All");

  const [openEditRoomModal, setOpenEditRoomModal] = useState<boolean>(false);

  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const selectedHotel = useSelector((state: RootState) => state.selectedHotel.items.selectedHotel);
  const { items: rooms, loading } = useSelector((state: RootState) => state.room);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-600";
      case "Occupied":
        return "bg-red-600";
      case "Maintenance":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    if (selectedHotel.hotelId) {
      dispatch(fetchRooms({ status, hotelId: selectedHotel.hotelId }));
    }
  }, [dispatch, status, selectedHotel.hotelId]);

  const handleEditRoom = async (room: RoomData) => {
    setSelectedRoom(room);
    setOpenEditRoomModal(true);
  }

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete Room?",
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
        title: "Deleting Room...",
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

      await deleteRoom(roomId);
      dispatch(fetchRooms({ hotelId: selectedHotel.hotelId }));

      Swal.fire({
        title: "Deleted!",
        text: "Room deleted successfully.",
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
    <div className="w-full flex flex-col">
      <HotelSelector />

      <div className="flex-1 flex flex-col gap-6 p-4 overflow-auto">
        <Menubar heading="Rooms" subheading={`${rooms.length} rooms`} rooms={true} />

        <div className="flex flex-wrap gap-2">
          {tabStatus.map((tab, index) => (
            <button key={index} onClick={()=>setStatus(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm border transition duration-300 ${status === tab ? "bg-[#0d1e3b] text-white border-[#0d1e3b]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>{tab}</button>
          ))}
        </div>

        <div className="grow relative overflow-auto">
          {loading && (
            <div className='absolute inset-0 flex justify-center items-center backdrop-blur-xs z-50'>
              <ClipLoader color="#5048E5" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-1 overflow-y-auto">
            {rooms.map((room) => (
              <div key={room.roomNumber} className="flex flex-col gap-3 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Room Number</p>
                    <h2 className="text-2xl font-bold">{room.roomNumber}</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(room.status)}`} />
                    <span className="text-gray-500 text-sm">{room.status}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-medium">Room Type</p>
                  <p className="font-medium text-lg">{room.roomType}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-medium">Price</p>
                  <p className="font-medium text-lg">₹ {room.pricePerNight.toLocaleString('en-IN')} <span className="text-xs">/day</span></p>
                </div>

                <div className="self-end flex flex-wrap items-center gap-3">
                  <button className="w-10 h-10 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-blue-50 transition duration-300" onClick={()=>handleEditRoom(room)}>
                    <Pencil size={16} className="text-blue-500" />
                  </button>
                  <button className="w-10 h-10 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-50 transition duration-300" onClick={()=>handleDeleteRoom(room.roomId)}>
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {openEditRoomModal && selectedRoom && (
          <EditRoom setOpenModal={setOpenEditRoomModal} selectedRoom={selectedRoom} />
        )}
      </div>
    </div>
  )
}

export default Rooms