'use client'
import Image from "next/image"

export default function CommunitySection() {
  const testimonials = [
    {
      id: 1,
      name: "Marc",
      role: "Consultant",
      age: 31,
      rating: 5,
      comment: "The platform opens up great opportunities when you're looking to get moving! Thanks to finding the right profits, my expertise and workflow have been expanded through various partnerships.",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Sarah",
      role: "Analyste",
      age: 27,
      rating: 5,
      comment: "Ce que j'aime, c'est la liberté. Vous pouvez poser vos questions sans aucune contrainte. La recherche me donne de bien meilleurs résultats que les autres plateformes que j'ai utilisées auparavant.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Jordan",
      role: "Chercheur",
      age: 35,
      rating: 5,
      comment: "Je suis toujours impressionné par la profondeur des informations que j'obtiens. La plateforme m'a guidé vers des solutions auxquelles je n'avais pas pensé auparavant, ce qui a fait toute la différence dans mon projet.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      featured: true
    },
    {
      id: 4,
      name: "Emma",
      role: "Designer",
      age: 29,
      rating: 5,
      comment: "J'ai découvert des outils dont j'ignorais même l'existence. Cela a complètement transformé mon flux de travail dès le premier jour et m'a fait gagner d'innombrables heures sur des projets complexes.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 5,
      name: "Edward",
      role: "Agent",
      age: 34,
      rating: 5,
      comment: "Une expérience incroyablement robuste dans l'ensemble. Le système comprend exactement ce que je recherche avant même que je puisse l'exprimer complètement.",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    {
      id: 6,
      name: "Sofia",
      role: "Numérique",
      age: 33,
      rating: 5,
      comment: "J'ai eu accès à des ressources et des opportunités qui étaient auparavant inaccessibles. Cela a vraiment été un changement de jeu pour le développement de ma carrière.",
      avatar: "https://randomuser.me/api/portraits/women/88.jpg"
    },
    {
      id: 7,
      name: "Thomas",
      role: "Développeur",
      age: 31,
      rating: 5,
      comment: "L'intégration avec mes outils existants a été sans faille. J'ai pu immédiatement améliorer ma productivité sans avoir à changer mes habitudes de travail.",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg"
    },
    {
      id: 8,
      name: "Camille",
      role: "Marketing",
      age: 28,
      rating: 4,
      comment: "La plateforme m'a permis de découvrir des insights sur mon audience que je n'aurais jamais pu obtenir autrement. C'est devenu un élément essentiel de ma stratégie.",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      featured: true
    },
    {
      id: 9,
      name: "Lucas",
      role: "Étudiant",
      age: 23,
      rating: 5,
      comment: "En tant qu'étudiant, l'accès à ces ressources est inestimable. Cela m'a donné un avantage significatif dans mes projets universitaires.",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    {
      id: 10,
      name: "Juliette",
      role: "Freelance",
      age: 34,
      rating: 5,
      comment: "La flexibilité de la plateforme correspond parfaitement à mon mode de vie de freelance. Je peux travailler de n'importe où et rester toujours connectée à mes projets importants.",
      avatar: "https://randomuser.me/api/portraits/women/57.jpg"
    }
  ];

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Testimonials</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez ce que nos utilisateurs disent de notre plateforme</p>
        </div>
        
        {/* Simple 3-column grid with variable heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-lg shadow-md p-6 h-auto ${
                item.featured ? 'border-l-4 border-emerald-500' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={item.avatar} 
                    alt={`${item.name}'s avatar`} 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-medium">{item.name}, {item.age} ans</h4>
                  <p className="text-sm text-gray-600">{item.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {renderStars(item.rating)}
              </div>
              
              <div>
                <p className="text-gray-700 italic">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
