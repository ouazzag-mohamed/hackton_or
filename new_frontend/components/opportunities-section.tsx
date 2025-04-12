import Image from "next/image"

export default function OpportunitiesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Phone Mockups */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* First Phone (slightly behind) */}
              <div className="absolute -left-8 top-4">
                <Image
                  src="/opportunities-phone-2.png"
                  alt="Opportunities mobile interface"
                  width={280}
                  height={550}
                  className="w-auto h-auto max-h-[550px]"
                />
              </div>

              {/* Second Phone (in front) */}
              <div className="relative z-10">
                <Image
                  src="/opportunities-phone-1.png"
                  alt="Opportunities mobile interface"
                  width={280}
                  height={550}
                  className="w-auto h-auto max-h-[550px]"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left">
            <div className="max-w-lg">
              <p className="text-lg text-gray-800 leading-relaxed">
                Pourquoi courir après les bonnes opportunités quand elles peuvent te trouver ? Grâce à ton profil, tes
                objectifs et ton activité, on te propose uniquement les offres les plus pertinentes : bourses, stages,
                programmes, événements... sans le bruit inutile.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed mt-4">
                Plus besoin de fouiller, tu reçois un flux ciblé de ce qui colle vraiment à ton parcours. Un véritable
                éclaireur personnel, qui reste en veille pour toi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
