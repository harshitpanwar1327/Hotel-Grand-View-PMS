import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDashboardData, type DashboardData } from "../../firebase/services/DashboardService";
import { toast } from "react-toastify";
import { BedDouble, BedSingle, KeyRound } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { formatDateTime } from "../../utils/Helper";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    todayCheckIns: [],
    todayCheckOuts: []
  });
  
  const [loading, setLoading] = useState<boolean>(false);

  const dashboardStats = [
    {
      title: "Total Rooms",
      value: dashboardData.totalRooms,
      icon: <KeyRound size={18} />,
      bg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Occupied",
      value: dashboardData.occupiedRooms,
      icon: <BedDouble size={18} />,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Available",
      value: dashboardData.availableRooms,
      icon: <BedSingle size={18} />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch rooms!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  return (
    <>
      <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>

          <NavLink to={'/check-in'} className="hidden md:block bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300">+ New Check-in</NavLink>
        </div>

        <div className="grow relative overflow-auto">
          {loading && (
            <div className='absolute inset-0 flex justify-center items-center backdrop-blur-xs z-50'>
              <ClipLoader color="#5048E5" />
            </div>
          )}

          <div className="flex flex-col gap-6 pb-1 overflow-y-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((card, index) => (
                <div key={index} className="flex flex-col gap-3 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-gray-500 uppercase font-medium text-sm">{card.title}</p>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} ${card.iconColor}`}>{card.icon}</div>
                  </div>
                  <h2 className="text-3xl font-bold">{card.value.toLocaleString('en-IN')}</h2>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 font-semibold">
                <h2>Active Check-ins</h2>
                <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center">{dashboardData.todayCheckIns.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="p-4">Room No.</th>
                      <th className="p-4">Guest Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Check-in</th>
                      <th className="p-4">Check-out</th>
                      <th className="p-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.todayCheckIns.length > 0 ? (
                      dashboardData.todayCheckIns.map((data)=>(
                        <tr key={data.bookingId} className="border-t border-gray-100 text-sm hover:bg-gray-50 transition duration-300">
                          <td className="p-4 font-medium">#{data.roomNumber}</td>
                          <td className="p-4">{data.guestName}</td>
                          <td className="p-4">{data.phone}</td>
                          <td className="p-4">
                            {formatDateTime(data.checkInAt)}
                          </td>
                          <td className="p-4">
                            {formatDateTime(data.checkOutAt)}
                          </td>
                          <td className={`p-4 font-medium ${data.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>{data.pendingAmount > 0 ? `Due ₹${data.pendingAmount}` : "Paid"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-sm text-gray-500">
                          No active bookings
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 font-semibold">
                <h2>Today's Check-outs</h2>
                <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center">{dashboardData.todayCheckOuts.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="p-4">Room No.</th>
                      <th className="p-4">Guest Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.todayCheckOuts.length > 0 ? (
                      dashboardData.todayCheckOuts.map((data)=>(
                        <tr key={data.bookingId} className="border-t border-gray-100 text-sm hover:bg-gray-50 transition duration-300">
                          <td className="p-4 font-medium">#{data.roomNumber}</td>
                          <td className="p-4">{data.guestName}</td>
                          <td className="p-4">{data.phone}</td>
                          <td className="p-4">₹{data.totalAmount.toLocaleString('en-IN')}</td>
                          <td className={`p-4 font-medium ${data.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>{data.pendingAmount > 0 ? `Due ₹${data.pendingAmount.toLocaleString('en-IN')}` : "Paid"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-sm text-gray-500">
                          No checkouts today
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard