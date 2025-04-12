import Image from "next/image"
import { Star } from "lucide-react"

// Define the testimonial data structure
interface Testimonial {
  id: number
  name: string
  age: number
  location: string
  quote: string
  avatar: string
  highlighted?: boolean
}

export default function TestimonialsSection() {
  // Testimonial data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Yasmine",
      age: 18,
      location: "Casablanca",
      quote:
        "Pourquoi courir après les bonnes opportunités quand elles peuvent te trouver ? Grâce à ton profil, tes objectifs et ton activité, on te propose uniquement les offres les plus pertinentes : bourses, stages, programmes, événements... sans le bruit inutile. Plus besoin de fouiller, tu reçois un flux ciblé de ce qui colle vraiment à ton parcours. Un véritable éclaireur personnel, qui reste en veille pour toi.",
      avatar: "/avatars/yasmine.png",
    },
    {
      id: 2,
      name: "Ayoub",
      age: 20,
      location: "Fès",
      quote:
        "Ce que j'aime, c'est la liberté. Tu peux poser une question sans avoir peur d'être jugé. La communauté est respectueuse, et les réponses sont souvent plus utiles que celles que je reçois en classe.",
      avatar: "/avatars/ayoub.png",
    },
    {
      id: 3,
      name: "Salma",
      age: 18,
      location: "Marrakech",
      quote:
        "Je revenais toujours trop stressée un peu partout, c'était le chaos. Là, j'ai enfin un espace où les opportunités sont triées selon mon profil. J'ai postulé à une bourse que je n'aurais jamais trouvée autrement, et ça m'a fait gagner un gain de temps.",
      avatar: "/avatars/salma.png",
    },
    {
      id: 4,
      name: "Mehdi",
      age: 21,
      location: "Rabat",
      quote:
        "Pourquoi courir après les bonnes opportunités quand elles peuvent te trouver ? Grâce à ton profil, tes objectifs et ton activité, on te propose uniquement les offres les plus pertinentes : bourses, stages, programmes, événements... sans le bruit inutile. Plus besoin de fouiller, tu reçois un flux ciblé de ce qui colle vraiment à ton parcours. Un véritable éclaireur personnel, qui reste en veille pour toi.",
      avatar: "/avatars/mehdi.png",
    },
    {
      id: 5,
      name: "Hanae",
      age: 17,
      location: "Tanger",
      quote:
        "J'ai découvert des filières que je ne connaissais même pas grâce à l'analyse de l'IA. Je pensais faire médecine, mais j'ai réalisé que le digital sérieusement me correspondait mieux. C'est fou comment une simple évaluation a pu tout changer.",
      avatar: "/avatars/hanae.png",
      highlighted: true,
    },
    {
      id: 6,
      name: "Zakariae",
      age: 18,
      location: "Agadir",
      quote:
        "Franchement, j'étais sceptique au début. Mais le quiz était tellement bien fait, si lié à mes résultats, m'ont parlé. Ça m'a aidé à comprendre mes priorités.",
      avatar: "/avatars/zakariae.png",
    },
    {
      id: 7,
      name: "Mehdi",
      age: 21,
      location: "Rabat",
      quote:
        "Pourquoi courir après les bonnes opportunités quand elles peuvent te trouver ? Grâce à ton profil, tes objectifs et ton activité, on te propose uniquement les offres les plus pertinentes : bourses, stages, programmes, événements... sans le bruit inutile. Plus besoin de fouiller, tu reçois un flux ciblé de ce qui colle vraiment à ton parcours. Un véritable éclaireur personnel, qui reste en veille pour toi.",
      avatar: "/avatars/mehdi.png",
    },
    {
      id: 8,
      name: "Safae",
      age: 22,
      location: "Oujda",
      quote:
        "Je galérais à trouver des opportunités de stage dans mon domaine. Depuis que je me suis inscrite, j'ai eu plusieurs offres adaptées. C'est pas juste un site d'info, c'est un vrai outil qui nous prépare sur un arrière-plan.",
      avatar: "/avatars/safae.png",
    },
    {
      id: 9,
      name: "Nizar",
      age: 19,
      location: "Safi",
      quote:
        "Ce que j'aime, c'est la liberté. Tu peux poser une question sans avoir peur d'être jugé. La communauté est respectueuse, et les réponses sont souvent plus utiles que celles que je reçois en classe.",
      avatar: "/avatars/nizar.png",
    },
    {
      id: 10,
      name: "Leila",
      age: 20,
      location: "Tétouan",
      quote:
        "L'orientation scolaire au Maroc manque souvent de personnalisation. Ici, j'ai enfin trouvé un service qui me parle en tant qu'individu. C'est moderne, intuitif, et franchement bien pensé.",
      avatar: "/avatars/leila.png",
    },
    {
      id: 11,
      name: "Nizar",
      age: 19,
      location: "Safi",
      quote:
        "Ce que j'aime, c'est la liberté. Tu peux poser une question sans avoir peur d'être jugé. La communauté est respectueuse, et les réponses sont souvent plus utiles que celles que je reçois en classe.",
      avatar: "/avatars/nizar.png",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-black">Testim</span>
            <span className="text-emerald-500">onials</span>
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-2"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-gray-200 rounded-lg p-5 ${testimonial.highlighted ? "border-4 border-blue-500" : ""}`}
            >
              {/* Stars */}
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {testimonial.name}, {testimonial.age} ans,
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-sm text-gray-800 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
