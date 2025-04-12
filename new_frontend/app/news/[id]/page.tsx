'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2, Bookmark, Tag } from 'lucide-react';
import { getArticleById, getLatestArticles } from '@/data/newsData';
import { NewsArticle } from '@/types/news';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const fetchedArticle = getArticleById(id);
      setArticle(fetchedArticle || null);
      
      // Get related articles (excluding current one)
      const latest = getLatestArticles()
        .filter(a => a.id !== id)
        .slice(0, 3);
      setRelatedArticles(latest);
      
      setIsLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex justify-center">
          <div className="loader"></div>
        </div>
        <style jsx>{`
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
          <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Article header */}
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 text-emerald-600 font-medium mb-6 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux actualités
            </Link>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
            >
              {article.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div>
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
              <div>Source: <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{article.source}</a></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured image */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <Image 
                src={article.imageUrl || '/placeholder.jpg'}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Article content */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <div className="prose prose-emerald max-w-none">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-800">{paragraph}</p>
                  ))}
                </div>
                
                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Share options */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Partager</h4>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Articles connexes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    href={`/news/${relatedArticle.id}`}
                    key={relatedArticle.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40">
                      <Image 
                        src={relatedArticle.imageUrl || '/placeholder.jpg'}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-gray-800">{relatedArticle.title}</h3>
                      <div className="text-sm text-gray-500">
                        {formatDate(relatedArticle.publishedAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}
