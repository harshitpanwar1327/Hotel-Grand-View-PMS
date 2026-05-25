import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import AddRoom from "../../modals/AddRoom";

const roomStatus = ["All", "Available", "Occupied", "Maintenance"];

const Rooms = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500";

      case "Occupied":
        return "bg-red-500";

      case "Maintenance":
        return "bg-yellow-400";

      default:
        return "bg-gray-400";
    }
  };

  const [rooms, setRooms] = useState([
    {
      room: "001",
      type: "Standard",
      price: "₹1,800",
      status: roomStatus[1],
    },
    {
      room: "002",
      type: "Standard",
      price: "₹1,800",
      status: roomStatus[1],
    },
    {
      room: "003",
      type: "Deluxe",
      price: "₹2,800",
      status: roomStatus[0],
    },
    {
      room: "101",
      type: "Deluxe",
      price: "₹2,800",
      status: roomStatus[0],
    },
    {
      room: "202",
      type: "Suite",
      price: "₹4,500",
      status: roomStatus[0],
    },
    {
      room: "203",
      type: "Suite",
      price: "₹4,500",
      status: roomStatus[2],
    },
    {
      room: "204",
      type: "Suite",
      price: "₹4,500",
      status: roomStatus[2],
    },
    {
      room: "205",
      type: "Suite",
      price: "₹4,500",
      status: roomStatus[2],
    },
    {
      room: "206",
      type: "Suite",
      price: "₹4,500",
      status: roomStatus[2],
    },
  ]);
  
  const [activeTab, setActiveTab] = useState("All");

  const filteredRooms =
    activeTab === "All"
      ? rooms
      : rooms.filter((room) => room.status === activeTab);

  const handleStatusChange = (roomNumber: string, newStatus: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room === roomNumber
          ? { ...room, status: newStatus }
          : room
      )
    );
  };

  const [openAddRoomModal, setOpenAddRoomModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-gray-500 text-sm">{rooms.length} rooms</p>
        </div>

        <button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300" onClick={()=>setOpenAddRoomModal(true)}>+ Add Room</button>
      </div>

      <div className="flex gap-2">
        {roomStatus.map((status, index) => (
          <button key={index} onClick={()=>setActiveTab(status)} className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm border transition duration-300 ${activeTab === status ? "bg-[#1B2A41] text-white border-[#1B2A41]" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.room} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-500 text-sm">ROOM</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{room.room}</h2>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                <span className="text-gray-500 text-sm">{room.status}</span>
              </div>
            </div>

            <p className="text-gray-500 text-md mb-2">{room.type}</p>

            <div className="mb-6">
              <span className="text-xl font-bold text-slate-900">{room.price}</span>
              <span className="text-gray-500">/day</span>
            </div>

            <div className="flex items-center gap-3">
              <select value={room.status} onChange={(e) =>handleStatusChange(room.room, e.target.value)} className="flex-1 h-12 rounded-xl border border-gray-200 px-4 text-base shadow-sm outline-none bg-white">
                {roomStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition">
                <Pencil size={16} className="text-slate-700" />
              </button>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-50 transition">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {openAddRoomModal && <AddRoom setOpenModal={setOpenAddRoomModal} />}
    </div>
  )
}

export default Rooms