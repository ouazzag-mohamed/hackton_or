'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const Hero = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  const floatAnimation = {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const buttonHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="mt-[50px] container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left side with image and illustrations */}
        <motion.div 
          className="md:col-span-6 lg:col-span-5 relative flex-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
        >
    
            <Image 
              src="/hero-image.png" 
              alt="Students" 
              width={600} 
              height={500} 
              className="w-full h-auto flex-1" 
              priority
            />
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -right-6 bg-emerald-100 rounded-full p-4 shadow-lg"
              animate={{
                rotate: [0, 10, 0, -10, 0],
                transition: { duration: 8, repeat: Infinity }
              }}
            >
              <span className="text-emerald-500 text-xl font-bold">98%</span>
              <span className="block text-xs text-emerald-700">satisfaction</span>
            </motion.div>
          </motion.div>
          

        {/* Right side with content */}
        <motion.div 
          className="md:col-span-6 lg:col-span-7 space-y-8 flex-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            custom={1}
            variants={fadeIn}
          >
            Réinvente <span className="text-emerald-500 relative inline-block">
              ton avenir
              <motion.span 
                className="absolute bottom-0 left-0 h-3 bg-emerald-100 w-full -z-10"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
                viewport={{ once: true }}
              ></motion.span>
            </span> avec une orientation sur-mesure, pensée
            pour les étudiants marocains.
          </motion.h1>
          
          <motion.p 
            className="text-gray-700 text-lg leading-relaxed"
            custom={2}
            variants={fadeIn}
          >
            La plateforme intelligente pour orienter et accompagner les étudiants marocains vers leur réussite.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            custom={3}
            variants={fadeIn}
          >
            <motion.div whileHover="hover" initial="rest" variants={buttonHover}>
              <Link href="/ai-analyst" className="bg-emerald-500 border-b-[5px] border-b-emerald-600 text-white px-12 py-3 rounded-md text-center inline-block hover:bg-emerald-600 transition-colors font-medium shadow-md relative overflow-hidden group">
                <span className="relative z-10">AI analyste</span>
                <motion.span 
                  className="absolute inset-0 bg-emerald-600 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
              </Link>
            </motion.div>
            
            <motion.div whileHover="hover" initial="rest" variants={buttonHover}>
              <Link href="/login" className="border-b-[5px] border border-gray-300 text-black px-10 py-3 rounded-md text-center inline-block hover:bg-gray-100 transition-colors font-medium shadow-sm">
                Log In
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap gap-8 pt-6"
            custom={4}
            variants={fadeIn}
          >
            {[
              { value: "+3K", label: "users" },
              { value: "+10k", label: "tests" },
              { value: "+150", label: "expert" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="flex items-center"
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <motion.span 
                  className="text-emerald-500 text-3xl font-bold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (index * 0.2), duration: 0.6 }}
                  viewport={{ once: true }}
                >{stat.value}</motion.span>
                <span className="ml-2 text-black font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-gray-100"
            custom={5}
            variants={fadeIn}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-100">
                  <Image
                    src="https://randomuser.me/api/portraits/men/52.jpg"
                    alt="User"
                    width={60}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <motion.div 
                    className="flex text-yellow-400 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.8 }}
                    viewport={{ once: true }}
                  >
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <p className="text-sm text-gray-800 italic">
                    "La communauté est ouf. J'ai posé une question hyper spécifique sur une prépa, en pensant que
                    personne n'allait répondre... et j'ai eu plein de retours utiles, sans jugement. C'est rassurant
                    de pouvoir parler franchement, même anonymement."
                  </p>
                </div>
              </div>
            </div>
            <motion.div 
              className="flex justify-center mt-6"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((dot, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero