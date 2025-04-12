import { NewsArticle } from '@/types/news';

export const mockNewsArticles: NewsArticle[] = [  {
    id: '1',
    title: 'Le Ministère de l\'Éducation lance une nouvelle plateforme d\'orientation pour les lycéens',
    summary: 'Une nouvelle plateforme numérique vise à aider les élèves du secondaire à mieux choisir leur parcours universitaire.',
    content: `Le Ministère de l'Éducation Nationale, de la Formation professionnelle, de l'Enseignement Supérieur et de la Recherche Scientifique a lancé une nouvelle plateforme numérique dédiée à l'orientation des lycéens.

Cette initiative s'inscrit dans le cadre de la stratégie nationale pour la modernisation du système éducatif. La plateforme offre des tests d'aptitude, des informations détaillées sur les filières universitaires, et un système de recommandation basé sur les résultats scolaires des élèves.

"Notre objectif est de réduire le taux d'échec et de réorientation en première année universitaire en proposant des choix plus éclairés aux bacheliers", a déclaré un responsable du ministère.

La plateforme sera progressivement déployée dans tous les lycées du royaume au cours de l'année scolaire 2025-2026.`,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1964&auto=format&fit=crop',
    source: 'Ministère de l\'Éducation Nationale',
    sourceUrl: 'https://www.men.gov.ma',
    publishedAt: '2025-03-15T08:30:00Z',
    category: 'guidance',
    tags: ['orientation', 'numérique', 'lycée', 'université']
  },  {
    id: '2',
    title: 'Inauguration de l\'École Supérieure d\'Intelligence Artificielle à Rabat',
    summary: 'Une nouvelle école dédiée à la formation en IA ouvre ses portes dans la capitale.',
    content: `Le Maroc renforce son positionnement dans le domaine des technologies de pointe avec l'inauguration à Rabat de l'École Supérieure d'Intelligence Artificielle (ESIA).

Fruit d'un partenariat entre le Royaume et plusieurs entreprises technologiques internationales, cet établissement vise à former la prochaine génération de spécialistes marocains en intelligence artificielle et en science des données.

La cérémonie d'inauguration s'est déroulée en présence de plusieurs ministres et représentants du secteur privé. Les premiers étudiants intégreront l'école dès septembre 2025.

"Cette école représente un pilier essentiel de notre stratégie nationale pour développer l'écosystème numérique marocain", a souligné le ministre de l'Industrie et du Numérique.

L'ESIA proposera des programmes de niveau master et des formations continues certifiantes, avec des bourses disponibles pour les étudiants méritants.`,
    imageUrl: 'https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?q=80&w=2031&auto=format&fit=crop',
    source: 'Agence Marocaine de Presse',
    sourceUrl: 'https://www.map.ma',
    publishedAt: '2025-03-28T14:15:00Z',
    category: 'education',
    tags: ['intelligence artificielle', 'formation', 'technologie', 'enseignement supérieur']
  },  {
    id: '3',
    title: 'Programme d\'échange éducatif entre le Maroc et le Canada',
    summary: 'Un nouveau programme favorisera la mobilité des étudiants entre les universités marocaines et canadiennes.',
    content: `Un accord majeur vient d'être signé entre le Maroc et le Canada pour faciliter les échanges universitaires entre les deux pays. Ce programme permettra à plus de 500 étudiants marocains de poursuivre une partie de leurs études dans des universités canadiennes chaque année.

Le programme inclut également des bourses d'excellence pour les meilleurs candidats et prévoit des facilités administratives pour l'obtention des visas d'études.

"Cette coopération renforcée témoigne des liens d'amitié entre nos deux pays et de notre volonté commune de favoriser la circulation des savoirs", a déclaré l'ambassadeur du Canada lors de la cérémonie de signature à Rabat.

Les universités participantes comprennent l'Université Mohammed V, l'Université Hassan II, l'Université de Montréal, l'Université Laval et plusieurs autres établissements renommés des deux pays.`,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop',
    source: 'Le Matin',
    sourceUrl: 'https://lematin.ma',
    publishedAt: '2025-04-02T09:45:00Z',
    category: 'opportunities',
    tags: ['international', 'échange', 'bourse', 'canada']
  },  {
    id: '4',
    title: 'Réforme du système d\'orientation scolaire dans les collèges marocains',
    summary: 'Une nouvelle approche d\'orientation sera mise en place dès le collège pour mieux préparer les choix futurs.',
    content: `Le Ministère de l'Éducation Nationale a annoncé une réforme complète du système d'orientation dans les collèges marocains. À partir de la rentrée 2025, des conseillers d'orientation spécialement formés interviendront dès la première année du collège pour accompagner les élèves dans leur parcours éducatif.

Cette initiative vise à identifier plus tôt les aptitudes et centres d'intérêt des élèves afin de mieux les guider vers des filières adaptées au lycée puis à l'université.

"Nous ne pouvons plus attendre la dernière année du lycée pour parler d'orientation. C'est un processus qui doit commencer bien avant", a expliqué un responsable du ministère.

Le programme inclut des ateliers de découverte professionnelle, des tests d'orientation modernisés et des rencontres avec des professionnels de différents secteurs. Des outils numériques d'aide à l'orientation seront également déployés dans tous les établissements concernés.`,
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop',
    source: 'Aujourd\'hui le Maroc',
    sourceUrl: 'https://aujourdhui.ma',
    publishedAt: '2025-03-20T11:20:00Z',
    category: 'guidance',
    tags: ['collège', 'orientation', 'réforme', 'éducation']
  },  {
    id: '5',
    title: 'Ouverture des inscriptions pour les Grandes Écoles d\'Ingénieurs',
    summary: 'Les modalités d\'inscription au concours national d\'accès aux grandes écoles d\'ingénieurs ont été publiées.',
    content: `La direction des Grandes Écoles d'Ingénieurs a annoncé l'ouverture des inscriptions pour le concours national commun (CNC) 2025. Les candidats peuvent s'inscrire en ligne du 15 avril au 15 mai 2025.

Cette année, plusieurs nouveautés ont été introduites dans le processus de sélection, notamment une épreuve dédiée à l'innovation et au développement durable. Le nombre de places disponibles a également augmenté de 15% par rapport à l'année précédente.

"Nous cherchons à identifier les talents qui sauront relever les défis technologiques et environnementaux de demain", a précisé le directeur du concours.

Les écoles participantes incluent l'EMI, l'ENSIAS, l'EHTP, l'INPT et plusieurs autres établissements prestigieux. Les résultats préliminaires seront annoncés fin juin 2025.`,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    source: 'L\'Économiste',
    sourceUrl: 'https://www.leconomiste.com',
    publishedAt: '2025-04-10T07:30:00Z',
    category: 'schools',
    tags: ['concours', 'ingénieur', 'inscription', 'grandes écoles']
  }
];

export const getFeaturedArticles = (): NewsArticle[] => {
  return mockNewsArticles.slice(0, 3);
};

export const getLatestArticles = (): NewsArticle[] => {
  return [...mockNewsArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

export const getArticlesByCategory = (category: NewsArticle['category']): NewsArticle[] => {
  return mockNewsArticles.filter(article => article.category === category);
};

export const getArticleById = (id: string): NewsArticle | undefined => {
  return mockNewsArticles.find(article => article.id === id);
};
