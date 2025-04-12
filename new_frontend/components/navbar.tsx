'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Bell, Search, Moon, Sun, UserCircle, LogOut, Newspaper } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import { getLatestArticles } from "@/data/newsData"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants
  const linkVariants = {
    initial: { y: -5, opacity: 0 },
    animate: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: custom * 0.1, duration: 0.5 }
    }),
    hover: { 
      scale: 1.05,
      color: "#10b981", // emerald-500
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  }

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <div className={`
        backdrop-blur-lg bg-white/80 dark:bg-black/80
        border border-gray-200/20 dark:border-gray-700/30
        shadow-lg ${isScrolled ? 'shadow-emerald-500/5' : ''}
        rounded-xl mx-auto w-[95%] md:w-[90%] lg:w-[85%]
        px-4 py-3 flex items-center justify-between
        transition-all duration-500
      `}>
        {/* Logo */}
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>
              <Image 
                src="/logo.png" 
                alt="Trchad Logo" 
                width={110} 
                height={45} 
                className="h-10 w-auto relative" 
                priority
              />
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { name: "Home", href: "/" },
            { name: "AI Analyste", href: isAuthenticated ? "/ai-analyst" : "/login?redirect=/ai-analyst" },
            { name: "News", href: "/news" },
            { name: "Communauté", href: "/community" },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              variants={linkVariants}
            >
              <Link 
                href={item.href} 
                className={`
                  relative px-4 py-2 text-black dark:text-white font-medium rounded-lg
                  transition-all duration-300 mx-1 overflow-hidden group
                  ${isActive(item.href) ? 'text-emerald-600 dark:text-emerald-400' : ''}
                `}
              >
                {/* Hover effect background */}
                <span className={`
                  absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg
                  transform origin-left scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-300 ease-out -z-10
                `}></span>
                
                {/* Active indicator */}
                <span className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2
                  h-0.5 bg-emerald-500
                  transition-all duration-300
                  ${isActive(item.href) ? 'w-4/5' : 'w-0 group-hover:w-2/3'}
                `}></span>
                
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Search, Notifications, Theme Toggle, and Login */}
        <div className="flex items-center space-x-3">
          {/* Search button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>

          {/* Notification - Only show when logged in */}
          {isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative hidden md:block"
            >
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </motion.div>
          )}

          {/* Dark/Light mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: isDarkMode ? 0 : 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>

          {/* User menu or Login/Register button */}
          {isAuthenticated ? (
            <div className="relative group hidden md:block">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Image 
                    src={user?.profilePicture || "/placeholder-user.jpg"}
                    alt="Avatar" 
                    width={32} 
                    height={32} 
                    className="rounded-full w-8 h-8 object-cover border border-emerald-200" 
                  />
                  <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                </div>

                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 flex flex-col text-sm">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group hidden md:block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-70 group-hover:opacity-100 rounded-xl blur transition duration-200"></div>
              <Link href="/login" className="relative bg-emerald-500 border-b-[4px] border-b-emerald-700 text-white px-6 py-2 sm:px-8 md:px-10 rounded-xl font-medium inline-flex items-center">
                <span className="relative">Login</span>
              </Link>
            </motion.div>
          )}

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="exit"
            variants={mobileMenuVariants}
            className="fixed top-0 right-0 bottom-0 w-[250px] z-50 bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-emerald-500">Menu</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
            
            {/* User info in mobile menu - only when logged in */}
            {isAuthenticated && (
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Image 
                    src={user?.profilePicture || "/placeholder-user.jpg"}
                    alt="Avatar" 
                    width={48} 
                    height={48} 
                    className="rounded-full w-12 h-12 object-cover border-2 border-emerald-200" 
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "AI Analyste", href: isAuthenticated ? "/ai-analyst" : "/login?redirect=/ai-analyst" },
                { name: "Communauté", href: "/community" },
                { name: "Opportunités", href: "/opportunities" }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block py-3 px-4 rounded-lg 
                      ${isActive(item.href) 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-semibold' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Profile link for authenticated users */}
              {isAuthenticated && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Link 
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-5 h-5" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Se déconnecter</span>
                </button>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar