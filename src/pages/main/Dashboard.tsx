import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDashboardData, type DashboardData } from "../../firebase/services/DashboardService";
import { toast } from "react-toastify";
import { BedDouble, BedSingle, KeyRound } from "lucide-react";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0
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
      value: dashboardData.availableRooms,
      icon: <BedDouble size={18} />,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Available",
      value: dashboardData.occupiedRooms,
      icon: <BedSingle size={18} />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      setDashboardData(response as DashboardData);
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
      <div className="mt-10 lg:mt-0 flex-1 flex flex-col gap-6 p-6">
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

          <NavLink to={'/check-in'} className="bg-[#1B2A41] hover:bg-[#1B2A41]/90 shadow-[#1B2A41]/40 hover:shadow-lg text-white text-sm px-6 py-3 rounded-2xl shadow-sm transition duration-300">+ New Check-in</NavLink>
        </div>

        {loading ? (
          <div className="flex grow items-center justify-center">
            <ClipLoader color="#1B2A41" size={50} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-auto">
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

            {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 font-semibold">
                <h2>Active Check-ins</h2>
                <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center">0</div>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="p-4">Room</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Check-in</th>
                    <th className="p-4">Check-out</th>
                    <th className="p-4">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-lg text-gray-500">
                      No active bookings
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="p-4 border-b border-gray-200 font-semibold">Today's Check-outs</h2>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="p-4">Room</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-lg text-gray-500">
                      No checkouts today
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard