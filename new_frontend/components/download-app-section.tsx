import { group3 } from "@/public";
import Image from "next/image";
import Link from "next/link";

export default function DownloadAppSection() {
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
                src={group3}
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
              Telecharger
              <span className="text-emerald-500 relative">
                l’application mobile{" "}
                <span className="absolute bottom-1 left-0 w-full h-1 bg-emerald-100 -z-10 rounded-full"></span>
              </span>{" "}
              sur App store & Google play.{" "}
            </h2>
          <Image src="/badge.png" width={300} height={300} alt="download" />
          </div>
        </div>
      </div>
    </section>
  );
}
