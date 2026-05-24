import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, UserPlus, ClipboardList, BedDouble } from "lucide-react"
import { Logout, Menu } from "@mui/icons-material"
import { Hotel } from "lucide-react"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Swal from 'sweetalert2'

const Navigation = () => {
  const navClass = ({ isActive }: { isActive: boolean })=>`w-full flex items-center gap-3 p-2 px-3 rounded-xl text-[#1B2A41]! transition duration-300 ${isActive? 'bg-[#1B2A41] text-white!' : 'hover:bg-gray-200'}`;

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
  const email = sessionStorage.getItem('userEmail');
  

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node))
        setProfileDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
      }).then((result) => {
      if (result.isConfirmed) {
        try {
          sessionStorage.clear();
          navigate('/login');
          Swal.fire({
            title: "Logged out!",
            text: "You have been successfully logged out.",
            icon: "success"
          });
        } catch (error) {
          console.error("Logout error:", error);
          Swal.fire({
            title: "Error",
            text: "Something went wrong while logging out.",
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <>
      <div className="h-screen hidden lg:flex flex-col border-r border-gray-300 shrink-0 z-60 bg-[#fbfcfe]">
        <div className='flex items-center gap-4 px-6 py-8 border-b border-gray-300'>
          <div className="w-10 h-10 rounded-2xl bg-[#0f2942] text-white flex items-center justify-center">
            <Hotel className="size-5" />
          </div>
          <div>
            <h3 className='font-bold text-lg'>Taj Heritage Stay</h3>
            <p className='text-xs text-gray-500 flex items-center gap-1'>Agra</p>
          </div>
        </div>

        <div className="grow flex flex-col gap-2 p-4 overflow-y-auto">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard className="h-4 w-4"/> Dashboard
          </NavLink>
          <NavLink to="/check-in" className={navClass}>
            <UserPlus className="h-4 w-4"/> Check In
          </NavLink>
          <NavLink to="/bookings" className={navClass}>
            <ClipboardList className="h-4 w-4"/> Bookings
          </NavLink>
          <NavLink to="/rooms" className={navClass}>
            <BedDouble className="h-4 w-4"/> Rooms
          </NavLink>
        </div>

        <div className='relative flex justify-center items-center p-4 border-t border-gray-300 cursor-pointer' ref={profileRef}>
          <div className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-300' onClick={()=>setProfileDropdown(!profileDropdown)}>
            <div className="w-10 h-10 bg-[#1B2A41] text-white rounded-lg text-lg font-semibold flex justify-center items-center">{(email?.[0])?.toUpperCase()}</div>
            <div>
              <h3 className='text-sm font-semibold'>{email}</h3>
              <p className='text-xs text-[#8F9DB7]'>Admin Account</p>
            </div>
          </div>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="w-[85%] absolute bottom-[90%] bg-white border border-gray-300 shadow-md rounded-lg z-60 flex flex-col gap-1 p-1"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition" onClick={handleLogout}>
                  <Logout sx={{ fontSize: '18px' }} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --------------- HAMBURGER --------------- */}
      <div className='lg:hidden! cursor-pointer p-2 shadow-lg fixed top-4 left-4 rounded-lg z-60' onClick={()=>setIsOpen(!isOpen)}>
        <Menu />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/30 z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-screen flex flex-col bg-[#fbfcfe] border-r border-gray-300 shrink-0 z-60"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center gap-4 px-6 py-8 border-b border-gray-300'>
                <div className="w-10 h-10 rounded-2xl bg-[#0f2942] text-white flex items-center justify-center">
                  <Hotel className="size-5" />
                </div>
                <div>
                  <h3 className='font-bold'>Taj Heritage Stay</h3>
                  <p className='text-xs text-[#8F9DB7] flex items-center gap-1'>Agra</p>
                </div>
              </div>

              <div className="grow flex flex-col gap-2 p-4 overflow-y-auto">
                <NavLink to="/dashboard" className={navClass}>
                  <LayoutDashboard className="h-4 w-4"/> Dashboard
                </NavLink>
                <NavLink to="/check-in" className={navClass}>
                  <UserPlus className="h-4 w-4"/> Check In
                </NavLink>
                <NavLink to="/bookings" className={navClass}>
                  <ClipboardList className="h-4 w-4"/> Bookings
                </NavLink>
                <NavLink to="/rooms" className={navClass}>
                  <BedDouble className="h-4 w-4"/> Rooms
                </NavLink>
              </div>

              <div className='relative flex justify-center items-center p-4 border-t border-gray-300 cursor-pointer' ref={profileRef}>
                <div className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-300' onClick={()=>setProfileDropdown(!profileDropdown)}>
                  <div className="w-10 h-10 bg-[#1B2A41] text-white rounded-lg text-lg font-semibold flex justify-center items-center">{(email?.[0])?.toUpperCase()}</div>
                  <div>
                    <h3 className='text-sm font-semibold'>{email}</h3>
                    <p className='text-xs text-[#8F9DB7]'>Admin Account</p>
                  </div>
                </div>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="w-[85%] absolute bottom-[90%] bg-white border border-gray-300 shadow-md rounded-lg z-60 flex flex-col gap-1 p-1"
                    >
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition" onClick={handleLogout}>
                        <Logout sx={{ fontSize: '18px' }} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation