'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { getLatestArticles, getArticlesByCategory } from '@/data/newsData';
import { NewsArticle } from '@/types/news';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      if (selectedCategory === 'all') {
        setArticles(getLatestArticles());
      } else {
        setArticles(getArticlesByCategory(selectedCategory as any));
      }
      setIsLoading(false);
    }, 500);
  }, [selectedCategory]);

  const categories = [
    { id: 'all', name: 'Tous les articles' },
    { id: 'education', name: 'Éducation' },
    { id: 'guidance', name: 'Orientation' },
    { id: 'opportunities', name: 'Opportunités' },
    { id: 'schools', name: 'Écoles' },
    { id: 'universities', name: 'Universités' }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
        {/* Hero section with background image */}
      <section className="relative pt-24 pb-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop"
            alt="Education in Morocco"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-800/80"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Actualités et Ressources
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Restez informé des dernières nouvelles sur l'éducation, l'orientation et les opportunités au Maroc
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <a href="#latest-news" className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-full font-medium transition-colors">
                Derniers Articles
              </a>
              <a href="#categories" className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-full font-medium transition-colors">
                Parcourir les Catégories
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories navigation */}
      <div className="sticky top-16 z-30 bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 space-x-4 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link href={`/news/${article.id}`} className="block">
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <Image 
                        src={article.imageUrl || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-opacity-90 ${
                          article.category === 'education' ? 'bg-blue-500' :
                          article.category === 'guidance' ? 'bg-emerald-500' :
                          article.category === 'opportunities' ? 'bg-purple-500' :
                          article.category === 'schools' ? 'bg-amber-500' :
                          'bg-red-500'
                        } text-white`}>
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">{article.source}</div>
                        <span className="text-emerald-600 flex items-center text-sm font-medium">
                          Lire plus
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {articles.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-600">Aucun article trouvé dans cette catégorie</h3>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                Voir tous les articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter subscription */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="text-gray-600 mb-8">Abonnez-vous à notre newsletter pour recevoir les dernières actualités et ressources sur l'éducation et l'orientation au Maroc.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button 
                type="submit"
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #10b981;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
