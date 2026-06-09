import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback, lazy } from "react";
import { deleteRoom, getRooms, updateRoom } from "../../firebase/services/RoomService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AddRoom from "../../modals/rooms/AddRoom";
import EditRoom from "../../modals/rooms/EditRoom";
import type { RoomData } from "../../redux/slice/RoomSlice";

const HotelSelector = lazy(()=>import("../../components/HotelSelector"));

const tabStatus = ["All", "Available", "Occupied", "Maintenance"];
const roomStatus = ["Available", "Occupied", "Maintenance"];

const Rooms = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>("All");

  const [openAddRoomModal, setOpenAddRoomModal] = useState<boolean>(false);
  const [openEditRoomModal, setOpenEditRoomModal] = useState<boolean>(false);

  const [selectedRoom, setSelectedRoom] = useState<RoomData>({});

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

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRooms(activeTab);
      // setRooms(response as RoomData[]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch rooms!");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchRooms]);

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      fetchRooms();

      toast.success("Room status updated.");

    } catch (error) {
      console.log(error);
      toast.error("Failed to update room!");
    }
  };

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
      fetchRooms();

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

      <div className="flex-1 flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
            <p className="text-gray-500 text-sm">{rooms.length} rooms</p>
          </div>

          <button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenAddRoomModal(true)}>+ Add Room</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabStatus.map((status, index) => (
            <button key={index} onClick={()=>setActiveTab(status)} className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm border transition duration-300 ${activeTab === status ? "bg-[#1B2A41] text-white border-[#1B2A41]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
              {status}
            </button>
          ))}
        </div>

        <div className="grow relative overflow-auto">
          {loading && (
            <div className='absolute inset-0 flex justify-center items-center backdrop-blur-xs z-50'>
              <ClipLoader color="#5048E5" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
            {rooms.map((room) => (
              <div key={room.roomNumber} className="flex flex-col gap-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
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

                <div className="flex flex-wrap items-center gap-2">
                  <select value={room.status} onChange={(e)=>handleStatusChange(room.roomId, e.target.value)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 shadow-sm outline-none bg-white">
                    {roomStatus.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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

        {openAddRoomModal && <AddRoom setOpenModal={setOpenAddRoomModal} fetchRooms={fetchRooms} />}
        {openEditRoomModal && <EditRoom setOpenModal={setOpenEditRoomModal} selectedRoom={selectedRoom} fetchRooms={fetchRooms} />}
      </div>
    </div>
  )
}

export default Rooms