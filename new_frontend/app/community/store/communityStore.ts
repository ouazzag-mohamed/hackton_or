import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Define types for our community data
export type Comment = {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
};

export type Post = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  tags?: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  category?: 'question' | 'knowledge' | 'discussion' | 'opportunity';
};

interface CommunityState {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  filter: 'all' | 'questions' | 'knowledge' | 'discussions' | 'opportunities';
  sortBy: 'newest' | 'popular' | 'controversial';
  
  // Actions
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'>) => string;
  removePost: (postId: string) => void;
  upvotePost: (postId: string, userId: string) => void;
  downvotePost: (postId: string, userId: string) => void;
  
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => void;
  removeComment: (commentId: string) => void;
  upvoteComment: (commentId: string, userId: string) => void;
  downvoteComment: (commentId: string, userId: string) => void;
  
  setFilter: (filter: CommunityState['filter']) => void;
  setSortBy: (sortBy: CommunityState['sortBy']) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: [],
      comments: [],
      isLoading: false,
      filter: 'all',
      sortBy: 'newest',
      
      // Add a new post and return the ID of the new post
      addPost: (postData) => {
        const post: Post = {
          ...postData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          commentCount: 0,
        };
        
        set((state) => ({
          posts: [post, ...state.posts]
        }));
        
        return post.id;
      },
      
      // Remove a post and its comments
      removePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
          comments: state.comments.filter((comment) => comment.postId !== postId)
        }));
      },
      
      // Upvote a post
      upvotePost: (postId, userId) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId 
              ? { ...post, upvotes: post.upvotes + 1 } 
              : post
          )
        }));
      },
      
      // Downvote a post
      downvotePost: (postId, userId) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId 
              ? { ...post, downvotes: post.downvotes + 1 } 
              : post
          )
        }));
      },
      
      // Add a new comment
      addComment: (commentData) => {
        const comment: Comment = {
          ...commentData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
        };
        
        set((state) => ({
          comments: [comment, ...state.comments],
          posts: state.posts.map((post) => 
            post.id === commentData.postId 
              ? { ...post, commentCount: post.commentCount + 1 } 
              : post
          )
        }));
      },
      
      // Remove a comment
      removeComment: (commentId) => {
        const comment = get().comments.find((c) => c.id === commentId);
        if (!comment) return;
        
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
          posts: state.posts.map((post) => 
            post.id === comment.postId 
              ? { ...post, commentCount: Math.max(0, post.commentCount - 1) } 
              : post
          )
        }));
      },
      
      // Upvote a comment
      upvoteComment: (commentId, userId) => {
        set((state) => ({
          comments: state.comments.map((comment) => 
            comment.id === commentId 
              ? { ...comment, upvotes: comment.upvotes + 1 } 
              : comment
          )
        }));
      },
      
      // Downvote a comment
      downvoteComment: (commentId, userId) => {
        set((state) => ({
          comments: state.comments.map((comment) => 
            comment.id === commentId 
              ? { ...comment, downvotes: comment.downvotes + 1 } 
              : comment
          )
        }));
      },
      
      // Set filter
      setFilter: (filter) => {
        set({ filter });
      },
      
      // Set sort method
      setSortBy: (sortBy) => {
        set({ sortBy });
      }
    }),
    {
      name: 'community-store',
      skipHydration: typeof window === 'undefined',
    }
  )
);

// Helper function to get posts with applied filters and sorting
export const getFilteredAndSortedPosts = (
  posts: Post[],
  filter: CommunityState['filter'],
  sortBy: CommunityState['sortBy']
): Post[] => {
  // Filter posts
  let filteredPosts = [...posts];
  if (filter !== 'all') {
    filteredPosts = filteredPosts.filter((post) => {
      switch (filter) {
        case 'questions':
          return post.category === 'question';
        case 'knowledge':
          return post.category === 'knowledge';
        case 'discussions':
          return post.category === 'discussion';
        case 'opportunities':
          return post.category === 'opportunity';
        default:
          return true;
      }
    });
  }
  
  // Sort posts
  switch (sortBy) {
    case 'newest':
      return filteredPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'popular':
      return filteredPosts.sort((a, b) => 
        (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      );
    case 'controversial':
      return filteredPosts.sort((a, b) => 
        (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes)
      );
    default:
      return filteredPosts;
  }
};

// Helper function to add demo content
export const addDemoContent = () => {
  const store = useCommunityStore.getState();
  
  // Only add demo content if there are no posts yet
  if (store.posts.length === 0) {
    // Demo users
    const demoUsers = [
      { id: '1', name: 'Yasmine', avatar: '/avatars/yasmine.png' },
      { id: '2', name: 'Mehdi', avatar: '/avatars/mehdi.png' },
      { id: '3', name: 'Salma', avatar: '/avatars/salma.png' },
      { id: '4', name: 'Nizar', avatar: '/avatars/nizar.png' },
    ];
    
    // Add posts and collect their IDs
    const postIds = [];
    
    // Add question post
    const questionPostId = store.addPost({
      userId: '1',
      userName: 'Yasmine',
      userAvatar: '/avatars/yasmine.png',
      title: 'Conseil pour les tests d\'admission aux écoles d\'ingénieurs ?',
      content: 'Bonjour à tous ! Je suis en terminale et je souhaite me préparer pour les tests d\'admission aux écoles d\'ingénieurs. Avez-vous des conseils sur les meilleures méthodes de préparation ? Des livres à recommander ?',
      tags: ['admission', 'ingénierie', 'préparation'],
      category: 'question',
    });
    postIds.push(questionPostId);
    
    // Add knowledge post
    const knowledgePostId = store.addPost({
      userId: '2',
      userName: 'Mehdi',
      userAvatar: '/avatars/mehdi.png',
      title: 'Partage : Les meilleures ressources pour apprendre la programmation',
      content: 'Après plusieurs années d\'apprentissage, j\'ai compilé une liste des meilleures ressources gratuites pour apprendre la programmation. De Codecademy à freeCodeCamp, en passant par des chaînes YouTube comme Traversy Media ou Net Ninja. N\'hésitez pas à ajouter vos propres suggestions !',
      tags: ['programmation', 'ressources', 'apprentissage'],
      category: 'knowledge',
    });
    postIds.push(knowledgePostId);
    
    // Add opportunity post
    const opportunityPostId = store.addPost({
      userId: '3',
      userName: 'Salma',
      userAvatar: '/avatars/salma.png',
      title: 'Opportunité de stage dans le domaine médical',
      content: 'Mon université propose des stages d\'été dans plusieurs hôpitaux de Casablanca pour les étudiants en médecine ou sciences biomédicales. Les candidatures sont ouvertes jusqu\'au 30 avril. Si vous êtes intéressés, envoyez-moi un message pour plus de détails.',
      mediaUrl: '/placeholder.jpg',
      mediaType: 'image',
      tags: ['stage', 'médecine', 'opportunité'],
      category: 'opportunity',
    });
    postIds.push(opportunityPostId);
    
    // Add discussion post
    const discussionPostId = store.addPost({
      userId: '4',
      userName: 'Nizar',
      userAvatar: '/avatars/nizar.png',
      title: 'Débat : L\'intelligence artificielle va-t-elle remplacer certains métiers ?',
      content: 'Avec l\'avancée rapide de l\'IA comme ChatGPT et DALL-E, pensez-vous que certains métiers vont complètement disparaître ? Lesquels seront les plus touchés selon vous ? Et au contraire, quels nouveaux métiers pourraient émerger ?',
      tags: ['IA', 'futur', 'emploi'],
      category: 'discussion',
    });
    postIds.push(discussionPostId);
    
    // Add comments after all posts have been created and IDs collected
    store.addComment({
      postId: questionPostId,
      userId: '2',
      userName: 'Mehdi',
      userAvatar: '/avatars/mehdi.png',
      content: 'Je te recommande le livre "Réussir les tests d\'admission" des éditions Dunod, il m\'a beaucoup aidé l\'année dernière. Sinon, n\'hésite pas à faire les annales des années précédentes, c\'est ce qui fonctionne le mieux !'
    });
    
    store.addComment({
      postId: questionPostId,
      userId: '4',
      userName: 'Nizar',
      userAvatar: '/avatars/nizar.png',
      content: 'Les MOOCs sur Coursera sont aussi très utiles pour certaines matières comme les mathématiques ou la physique. J\'ai particulièrement aimé ceux du MIT.'
    });
    
    store.addComment({
      postId: discussionPostId,
      userId: '3',
      userName: 'Salma',
      userAvatar: '/avatars/salma.png',
      content: 'Je pense que les métiers les plus créatifs et ceux nécessitant beaucoup d\'intelligence émotionnelle seront moins impactés. Par contre, les tâches répétitives risquent d\'être automatisées.'
    });
  }
};