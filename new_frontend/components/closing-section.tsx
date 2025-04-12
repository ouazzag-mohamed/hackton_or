import Image from "next/image"
import Link from "next/link"

export default function ClosingSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50 rounded-full opacity-70 translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Laptop Image with enhanced styling */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative w-full max-w-lg">
                <Image
                  src="/laptop-closing.png"
                  alt="Trchad platform interface"
                  width={600}
                  height={350}
                  className="w-full h-auto"
                />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-12 -left-10 w-32 h-32 bg-emerald-50 rounded-full opacity-80"></div>
            </div>
          </div>

          {/* Text Content with improved typography */}
          <div className="space-y-8 order-1 lg:order-2 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              Nous réunissons{" "}
              <span className="text-emerald-500 relative">
                l'intelligence artificielle, l'expérience humaine
                <span className="absolute bottom-1 left-0 w-full h-1 bg-emerald-100 -z-10 rounded-full"></span>
              </span>{" "}
              et la force d'une communauté pour te guider vers un avenir qui te ressemble.
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Rejoins une plateforme où ton orientation n'est plus une question de hasard, mais une stratégie
              personnalisée. Ici, chaque réponse, chaque opportunité, chaque échange te rapproche de la voie qui te
              correspond vraiment.
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                href="/signup"
                className="bg-emerald-500 border-b-[5px] border-b-emerald-600 text-white px-12 py-3 rounded-md text-center"
              >
                Rejoindre Trchad
              </Link>
              
              <Link
                href="/about"
                className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center group"
              >
                En savoir plus
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
