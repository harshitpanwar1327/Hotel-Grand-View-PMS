// import { BedDouble, BedSingle, IndianRupee, KeyRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  // const cards = [
  //   {
  //     title: "TOTAL ROOMS",
  //     value: 6,
  //     icon: <KeyRound size={15}/>,
  //     bg: "bg-[#EEF2FF]",
  //     iconColor: "text-[#1B2A41]",
  //   },
  //   {
  //     title: "OCCUPIED",
  //     value: 2,
  //     icon: <BedSingle size={15} />,
  //     bg: "bg-[#FEE2E2]",
  //     iconColor: "text-red-500",
  //   },
  //   {
  //     title: "AVAILABLE",
  //     value: 3,
  //     icon: <BedDouble size={15} />,
  //     bg: "bg-[#DCFCE7]",
  //     iconColor: "text-green-600",
  //   },
  //   {
  //     title: "TODAY REVENUE",
  //     value: "₹0",
  //     icon: <IndianRupee size={15} />,
  //     bg: "bg-[#F3F4F6]",
  //     iconColor: "text-black",
  //   },
  // ];

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

        {/* <div className="relative flex flex-col gap-6 p-6 min-h-full w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-gray-500 font-semibold text-sm">{card.title}</p>
                  <h2 className="text-xl font-bold mt-6 text-[#111827]">{card.value}</h2>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.bg}`}>
                  <div className={card.iconColor}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Active Check-ins</h2>
              <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center font-semibold">0</div>
            </div>
            <table className="w-full">
              <thead className="bg-[#f8fafc]">
                <tr className="text-left text-gray-500 text-base">
                  <th className="px-8 py-5">Room</th>
                  <th className="px-8 py-5">Guest</th>
                  <th className="px-8 py-5">Phone</th>
                  <th className="px-8 py-5">Check-in</th>
                  <th className="px-8 py-5">Check-out</th>
                  <th className="px-8 py-5">Payment</th>
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

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Today's Check-outs</h2>
            </div>
            <table className="w-full">
              <thead className="bg-[#f8fafc]">
                <tr className="text-left text-gray-500 text-base">
                  <th className="px-8 py-5">Room</th>
                  <th className="px-8 py-5">Guest</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Time</th>
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
          </div>
        </div> */}
      </div>
    </>
  )
}

export default Dashboard