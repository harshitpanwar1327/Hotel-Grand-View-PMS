import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, UserPlus, ClipboardList, BedDouble, Hotel } from "lucide-react"
import { Logout, Menu } from "@mui/icons-material"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import Logo from '../assets/Logo.png'

const Navigation = () => {
  const navClass = ({ isActive }: { isActive: boolean })=>`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 transition duration-300 border border-gray-800 ${isActive? 'bg-[#1B2A41] border border-[#e4ad4b] !text-[#e4ad4b]' : 'hover:bg-gray-700 hover:text-white'}`;

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

  const email = sessionStorage.getItem('userEmail');
  const role = sessionStorage.getItem('userRole');

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
          navigate('/');
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
      <div className="h-full hidden lg:flex flex-col w-65 shrink-0 z-50 bg-linear-to-br from-[#04122a] via-[#1c2c4b] to-[#383c44] text-white">
        <div className='flex items-center gap-3 px-4 py-6 border-b border-gray-700'>
          <img src={Logo} alt="Logo" className="w-14 h-14 border border-white/10 rounded-2xl p-2" />
          <div>
            <h2 className='font-semibold'>RC Stays & Resorts</h2>
            <p className='text-xs text-gray-300 font-medium'>Reception Console</p>
          </div>
        </div>

        <div className="grow flex flex-col gap-2 p-4 overflow-y-auto">
          {role==="Owner" &&
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          }
          <NavLink to="/check-in" className={navClass}>
            <UserPlus size={18} /> Check In
          </NavLink>
          <NavLink to="/bookings" className={navClass}>
            <ClipboardList size={18} /> Bookings
          </NavLink>
          {role==="Owner" &&
            <NavLink to="/rooms" className={navClass}>
              <BedDouble size={18} /> Rooms
            </NavLink>
          }
          {role==="Owner" &&
            <NavLink to="/hotels" className={navClass}>
              <Hotel size={18} /> Hotels
            </NavLink>
          }
        </div>

        <div className='relative flex justify-center items-center p-4 border-t border-gray-700' ref={profileRef}>
          <div className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-700 cursor-pointer bg-[#323e5d]' onClick={()=>setProfileDropdown(!profileDropdown)}>
            <div className="w-10 h-10 bg-[#1a2638] text-white rounded-lg text-lg font-semibold flex justify-center items-center shrink-0">{(email?.[0])?.toUpperCase()}</div>
            <div className='min-w-0'>
              <h3 className='text-sm font-semibold truncate'>{email}</h3>
              <p className='text-xs text-gray-300 font-medium truncate'><span className="capitalize">{role}</span> Account</p>
            </div>
          </div>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div className="w-[85%] absolute bottom-[90%] bg-[#2a385a] border border-gray-700 shadow-md rounded-lg z-60 flex flex-col gap-1 p-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e4ad4b] bg-[#2a385a] hover:text-white hover:bg-red-700 transition duration-300" onClick={handleLogout}>
                  <Logout sx={{ fontSize: '18px' }} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --------------- HAMBURGER --------------- */}
      <div className='lg:hidden! cursor-pointer p-2 shadow-lg fixed top-4 left-4 rounded-lg z-50 bg-[#2a385a]' onClick={()=>setIsOpen(!isOpen)}>
        <Menu className="text-white"/>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="lg:hidden fixed inset-0 bg-black/30 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div className="fixed top-0 left-0 h-screen flex flex-col bg-linear-to-br from-[#04122a] via-[#1c2c4b] to-[#383c44] text-white w-65 shrink-0 z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center gap-3 px-4 py-6 border-b border-gray-700'>
                <img src={Logo} alt="Logo" className="w-14 h-14 border border-white/10 rounded-2xl p-2" />
                <div>
                  <h2 className='font-semibold'>RC Stays & Resorts</h2>
                  <p className='text-xs text-gray-300 font-medium'>Reception Console</p>
                </div>
              </div>

              <div className="grow flex flex-col gap-2 p-4 overflow-y-auto">
                {role==="Owner" &&
                  <NavLink to="/dashboard" className={navClass} onClick={()=>setIsOpen(false)}>
                    <LayoutDashboard size={18} /> Dashboard
                  </NavLink>
                }
                <NavLink to="/check-in" className={navClass} onClick={()=>setIsOpen(false)}>
                  <UserPlus size={18} /> Check In
                </NavLink>
                <NavLink to="/bookings" className={navClass} onClick={()=>setIsOpen(false)}>
                  <ClipboardList size={18} /> Bookings
                </NavLink>
                {role==="Owner" &&
                  <NavLink to="/rooms" className={navClass} onClick={()=>setIsOpen(false)}>
                    <BedDouble size={18} /> Rooms
                  </NavLink>
                }
                {role==="Owner" &&
                  <NavLink to="/hotels" className={navClass} onClick={()=>setIsOpen(false)}>
                    <Hotel size={18} /> Hotels
                  </NavLink>
                }
              </div>

              <div className='relative flex justify-center items-center p-4 border-t border-gray-700' ref={profileRef}>
                <div className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-700 cursor-pointer bg-[#323e5d]' onClick={()=>setProfileDropdown(!profileDropdown)}>
                  <div className="w-10 h-10 bg-[#1a2638] text-white rounded-lg text-lg font-semibold flex justify-center items-center shrink-0">{(email?.[0])?.toUpperCase()}</div>
                  <div className='min-w-0'>
                    <h3 className='text-sm font-semibold truncate'>{email}</h3>
                    <p className='text-xs text-gray-300 font-medium truncate'><span className="capitalize">{role}</span> Account</p>
                  </div>
                </div>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div className="w-[85%] absolute bottom-[90%] bg-[#2a385a] border border-gray-700 shadow-md rounded-lg z-60 flex flex-col gap-1 p-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e4ad4b] bg-[#2a385a] hover:text-white hover:bg-red-700 transition duration-300" onClick={handleLogout}>
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