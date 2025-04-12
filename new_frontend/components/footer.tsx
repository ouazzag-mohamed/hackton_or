import Image from "next/image"
import Link from "next/link"
import { Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Top Row - Logo and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold text-emerald-500 mb-2">
              <Image src="/logo-2.png" alt="Trchad Logo" width={130} height={50} className="h-12 w-auto" />
            </Link>
            <p className="text-gray-300 text-sm max-w-xs text-center md:text-left">
              Guidant les étudiants marocains vers leur réussite académique et professionnelle.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" 
                  className="bg-gray-800 hover:bg-emerald-500 p-2 rounded-full transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="bg-gray-800 hover:bg-emerald-500 p-2 rounded-full transition-colors">
              <Facebook className="w-5 h-5 text-white" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="bg-gray-800 hover:bg-emerald-500 p-2 rounded-full transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Middle Row - Navigation, Contact and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Navigation Links */}
          <div>
            <h3 className="text-emerald-400 font-bold mb-4 text-lg">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-gray-300 hover:text-emerald-500 transition-colors text-sm">
                À propos de nous
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-emerald-500 transition-colors text-sm">
                Nos services
              </Link>
              <Link href="/resources" className="text-gray-300 hover:text-emerald-500 transition-colors text-sm">
                Ressources pédagogiques
              </Link>
              <Link href="/community" className="text-gray-300 hover:text-emerald-500 transition-colors text-sm">
                Communauté étudiante
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-emerald-500 transition-colors text-sm">
                Contactez-nous
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-emerald-400 font-bold mb-4 text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">Avenue Mohammed V, Rabat 10000, Maroc</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+212 522 123 456</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">contact@irchad.ma</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-emerald-400 font-bold mb-4 text-lg">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-3">
              Restez informé des dernières opportunités et ressources pour les étudiants
            </p>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="bg-gray-800 text-white px-3 py-3 text-sm rounded-l-md sm:rounded-r-none rounded-r-md mb-2 sm:mb-0 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
              />
              <button className="bg-emerald-500 text-white font-medium px-4 py-3 text-sm rounded-r-md sm:rounded-l-none rounded-l-md hover:bg-emerald-600 transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row - Copyright */}
        <div className="pt-6 border-t border-gray-800 text-center md:text-left text-sm text-gray-400">
          <p>Copyright © {new Date().getFullYear()} Irchad. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
