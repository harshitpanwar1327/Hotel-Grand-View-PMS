import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, UserPlus, ClipboardList, BedDouble, Hotel } from "lucide-react"
import { Logout, Menu } from "@mui/icons-material"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import Logo from '../assets/Logo.png'

const Navigation = () => {
  const navClass = ({ isActive }: { isActive: boolean })=>`relative w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-white/80 transition duration-300 ${isActive? 'text-white! bg-white/10 border border-white/10' : 'hover:bg-white/3 hover:text-white'}`;

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
      <div className="relative h-full hidden lg:flex flex-col w-65 shrink-0 z-50 bg-[linear-gradient(135deg,#111B2D,#1B2A41_60%,#263A63)] text-white">
        <div className="absolute -top-24 -right-24 size-60 rounded-full opacity-20 blur-3xl bg-[linear-gradient(135deg,#D1A85D,#E8D2A0)]" />

        <div className='flex items-center gap-3 px-6 py-8 border-b border-white/10'>
          <img src={Logo} alt="Logo" className="w-12 h-12 border border-white/10 rounded-2xl" />
          <div>
            <h2 className='font-semibold'>RC Stays & Resorts</h2>
            <p className='text-xs text-white/80'>Reception Console</p>
          </div>
        </div>

        <div className="grow flex flex-col gap-2 px-4 py-6 overflow-y-auto">
          <p className="text-xs uppercase font-semibold text-gray-500 ml-4 mb-2">Workspace</p>
          {role==="Owner" &&
            <NavLink to="/dashboard" className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                  )}
                  <LayoutDashboard size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                  Dashboard
                </>
              )}
            </NavLink>
          }
          <NavLink to="/check-in" className={navClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                )}
                <UserPlus size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                Check In
              </>
            )}
          </NavLink>
          <NavLink to="/bookings" className={navClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                )}
                <ClipboardList size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                Bookings
              </>
            )}
          </NavLink>
          {role==="Owner" &&
            <NavLink to="/rooms" className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                  )}
                  <BedDouble size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                  Rooms
                </>
              )}
            </NavLink>
          }
          {role==="Owner" &&
            <NavLink to="/hotels" className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                  )}
                  <Hotel size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                  Hotels
                </>
              )}
            </NavLink>
          }
        </div>

        <div className='relative flex justify-center items-center p-4' ref={profileRef}>
          <div className='w-full flex items-center gap-3 p-3 rounded-2xl border border-white/10 cursor-pointer bg-white/6 backdrop-blur' onClick={()=>setProfileDropdown(!profileDropdown)}>
            <div className="flex justify-center items-center w-10 h-10 bg-white/15 text-white rounded-full text-lg font-semibold border border-white/15 shrink-0">{(email?.[0])?.toUpperCase()}</div>
            <div className='min-w-0'>
              <h3 className='text-sm font-semibold truncate'>{email}</h3>
              <p className='text-xs text-gray-300 font-medium truncate'><span className="capitalize">{role}</span> Account</p>
            </div>
          </div>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div className="w-[85%] absolute bottom-[90%]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-white bg-white/10 border border-white/10 hover:text-red-500 transition duration-300" onClick={handleLogout}>
                  <Logout sx={{ fontSize: '18px' }} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --------------- HAMBURGER --------------- */}
      <div className='lg:hidden p-2 shadow-lg fixed top-4 left-4 rounded-lg z-50 bg-[#0d1e3b]' onClick={()=>setIsOpen(!isOpen)}>
        <Menu className="text-white"/>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="lg:hidden fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div className="fixed top-0 left-0 h-screen lg:hidden flex flex-col bg-[linear-gradient(135deg,#111B2D,#1B2A41_60%,#263A63)] text-white w-65 shrink-0 z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center gap-3 px-6 py-8 border-b border-white/10'>
                <img src={Logo} alt="Logo" className="w-12 h-12 border border-white/10 rounded-2xl" />
                <div>
                  <h2 className='font-semibold'>RC Stays & Resorts</h2>
                  <p className='text-xs text-white/80'>Reception Console</p>
                </div>
              </div>

              <div className="grow flex flex-col gap-2 px-4 py-6 overflow-y-auto">
                <p className="text-xs uppercase font-semibold text-gray-500 ml-4 mb-2">Workspace</p>
                {role==="Owner" &&
                  <NavLink to="/dashboard" className={navClass}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                        )}
                        <LayoutDashboard size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                        Dashboard
                      </>
                    )}
                  </NavLink>
                }
                <NavLink to="/check-in" className={navClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                      )}
                      <UserPlus size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                      Check In
                    </>
                  )}
                </NavLink>
                <NavLink to="/bookings" className={navClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                      )}
                      <ClipboardList size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                      Bookings
                    </>
                  )}
                </NavLink>
                {role==="Owner" &&
                  <NavLink to="/rooms" className={navClass}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                        )}
                        <BedDouble size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                        Rooms
                      </>
                    )}
                  </NavLink>
                }
                {role==="Owner" &&
                  <NavLink to="/hotels" className={navClass}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#D1A85D]" />
                        )}
                        <Hotel size={18} className={isActive ? "text-[#D1A85D]" : ""} />
                        Hotels
                      </>
                    )}
                  </NavLink>
                }
              </div>

              <div className='relative flex justify-center items-center p-4' ref={profileRef}>
                <div className='w-full flex items-center gap-3 p-3 rounded-2xl border border-white/10 cursor-pointer bg-white/6 backdrop-blur' onClick={()=>setProfileDropdown(!profileDropdown)}>
                  <div className="flex justify-center items-center w-10 h-10 bg-white/15 text-white rounded-full text-lg font-semibold border border-white/15 shrink-0">{(email?.[0])?.toUpperCase()}</div>
                  <div className='min-w-0'>
                    <h3 className='text-sm font-semibold truncate'>{email}</h3>
                    <p className='text-xs text-gray-300 font-medium truncate'><span className="capitalize">{role}</span> Account</p>
                  </div>
                </div>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div className="w-[85%] absolute bottom-[90%]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-white bg-white/10 border border-white/10 hover:text-red-500 transition duration-300" onClick={handleLogout}>
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