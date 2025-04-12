'use client'
import { group1, group2, group3 } from "@/public"
import Image from "next/image"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }
  
  const imageReveal = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Key Features
        </motion.h2>
        
        {/* Feature 1 - Image Right */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <motion.div 
            className="md:w-1/2 md:pr-8 mb-6 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <p dir="rtl" className="text-black/75 text-xl leading-10">
            Oubliez les conseils génériques. Notre Analyste d'Orientation IA ne se contente pas de poser des questions : il révèle une direction. Grâce à un quiz intelligent adapté à ton parcours et à tes centres d'intérêt, tu obtiens une vue claire et précise de qui tu es… et de tout ce que tu peux viser. Découvre instantanément ton score, tes résultats, et accède à une feuille de route personnalisée avec des universités adaptées, des domaines d'étude pertinents, et un tableau de bord pour suivre ton évolution. L'orientation devient enfin stratégique.            </p>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
          >
            <div className="flex justify-center items-center">
              <Image 
                src={group1} 
                alt="Smart Navigation Feature" 
                width={600} 
                height={400} 
                className="w-full h-auto max-w-[700px]"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNmj13oIwAAAABJRU5ErkJggg=="
              />
            </div>
          </motion.div>
        </div>
        
        {/* Feature 2 - Image Left */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-16">
          <motion.div 
            className="md:w-1/2 md:pl-8 mb-6 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <p className="text-black/75 text-xl leading-10">
            Les vraies questions n'ont pas toujours besoin d'un nom. C'est pourquoi notre communauté a été pensée pour offrir une liberté totale : questions anonymes, réponses authentiques, et un système qui valorise l'entraide et la clarté. Que tu sois en plein doute ou juste à la recherche de témoignages sincères, tu trouveras ici des réponses humaines, pas des discours préfabriqués. C'est comme Reddit — mais pour les étudiants, avec une vraie bienveillance intégrée.            </p>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
          >
            <div className="flex justify-center items-center">
              <Image 
                src={group2}
                alt="Personalized Experience Feature" 
                width={600} 
                height={400} 
                className="w-full h-auto max-w-[500px]"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNmj13oIwAAAABJRU5ErkJggg=="
              />
            </div>
          </motion.div>
        </div>
        
        {/* Feature 3 - Image Right */}
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 md:pr-8 mb-6 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <p dir="rtl" className="text-black/75 text-xl leading-10">
            Pourquoi courir après les bonnes opportunités quand elles peuvent te trouver ? Grâce à ton profil, tes objectifs et ton activité, on te propose uniquement les offres les plus pertinentes : bourses, stages, programmes, événements… sans le bruit inutile. Plus besoin de fouiller, tu reçois un flux ciblé de ce qui colle vraiment à ton parcours. Un véritable éclaireur personnel, qui reste en veille pour toi.            </p>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
          >
            <div className="flex justify-center items-center">
              <Image 
                src={group3} 
                alt="Seamless Integration Feature" 
                width={600} 
                height={400} 
                className="w-full h-auto max-w-[500px]"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJJgNmj13oIwAAAABJRU5ErkJggg=="
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
