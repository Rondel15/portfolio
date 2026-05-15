export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: "magento" | "nextjs" | "react" | "node";
  highlights: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "digidirect-algolia-search",
    title: "Algolia InstantSearch Customisation",
    description:
      "Deep customisation of Algolia InstantSearch on a high-traffic Adobe Commerce storefront, covering PLP behaviour, faceting, and add-to-cart UX.",
    longDescription:
      "Extended the default Algolia Magento 2 integration with a suite of frontend fixes and enhancements. Work spanned delegated event handling for seamless add-to-cart without page reloads, a MutationObserver-based sidebar collapse toggle, dynamic facet placeholder injection via a PHP plugin, and a PDP add-to-cart button recovery mechanism using a MutationObserver with setInterval polling fallback.",
    tags: ["Algolia", "InstantSearch", "Magento 2", "JavaScript", "PHP", "Knockout.js"],
    category: "magento",
    highlights: [
      "Delegated submit handler in tes-listing.phtml fixing add-to-cart without page reload on PLP",
      "MutationObserver sidebar collapse/expand toggle with is-collapsed CSS class binding",
      "PHP plugin injecting per-facet placeholder text into algoliaConfig.translations at runtime",
      "PDP add-to-cart button recovery via MutationObserver with setInterval polling safety net",
    ],
    featured: true,
  },
  {
    slug: "digidirect-particular-audience",
    title: "Particular Audience Recommendations Integration",
    description:
      "End-to-end integration of Particular Audience personalised product recommendations into Adobe Commerce, with a custom AJAX proxy and frontend widget.",
    longDescription:
      "Implemented a full-stack PA recommendations integration comprising a backend controller acting as an AJAX proxy to the PA API and a frontend pa-widget.phtml template rendering personalised carousels. Ongoing work included campaign class injection, a double-encoded URL entity fix via html_entity_decode and escapeJs, and Owl Carousel/Slick Slider fixes for nav repositioning, two-finger swipe support via MutationObserver, and a trackpad multi-slide jumping fix using an accumulative deltaX threshold.",
    tags: ["Particular Audience", "Magento 2", "PHP", "JavaScript", "Owl Carousel"],
    category: "magento",
    highlights: [
      "Backend AJAX proxy controller forwarding requests to the PA personalisation API",
      "pa-widget.phtml template with campaign class injection and escapeJs entity fix",
      "Owl Carousel nav repositioned to body with PA widget exclusion logic",
      "Trackpad multi-slide fix via accumulative deltaX threshold in Slick Slider handler",
    ],
    featured: true,
  },
  {
    slug: "digidirect-click-collect",
    title: "Click & Collect Module",
    description:
      "Custom Magento 2 module enabling quantity-aware store eligibility checks across a multi-source inventory network.",
    longDescription:
      "Built a comprehensive Click & Collect system that replaced a simple stock-existence check with a sophisticated network availability algorithm. The module sums per-SKU quantities across all sources and intelligently distinguishes local-pickup stores from deliver-to-store stores.",
    tags: ["Magento 2", "PHP", "Knockout.js", "MSI", "Adobe Commerce"],
    category: "magento",
    highlights: [
      "Multi-source inventory (MSI) integration with getNetworkAvailability()",
      "Knockout.js template for real-time store eligibility display",
      "Handles complex multi-SKU cart scenarios across store network",
      "Custom REST API endpoints for store availability queries",
    ],
    featured: true,
  },
  {
    slug: "digidirect-pronto-erp",
    title: "Pronto ERP Integration",
    description:
      "Bidirectional ERP sync between Magento 2 and Pronto using Magento service contracts and cron-based processing.",
    longDescription:
      "Architected and maintained a robust bidirectional integration between Magento 2 and the Pronto ERP system. Implemented using Magento service contracts for clean separation of concerns, with MSI-aware stock management and scheduled cron processing.",
    tags: ["Magento 2", "PHP", "ERP", "Cron", "MSI", "REST API"],
    category: "magento",
    highlights: [
      "Bidirectional sync using SourceItemsSaveInterface",
      "MSI-aware stock management across multiple sources",
      "Robust error handling with retry mechanisms",
      "Cron-based scheduling with configurable intervals",
    ],
    featured: true,
  },
  {
    slug: "digidirect-sitemap",
    title: "Async Sitemap Generator",
    description:
      "Message queue-based sitemap URL validator with async consumer and polling status endpoint.",
    longDescription:
      "Built a custom sitemap module that overcomes Fastly 503 timeout limitations on Magento Cloud by processing URL validation asynchronously via RabbitMQ message queues. Includes a polling status endpoint for real-time progress tracking.",
    tags: ["Magento 2", "PHP", "RabbitMQ", "Message Queue", "Fastly"],
    category: "magento",
    highlights: [
      "Async URL validation via RabbitMQ message queues",
      "Polling status endpoint with real-time progress",
      "Overcomes Fastly 503 timeout limitations",
      "Consumer-based architecture for scalable processing",
    ],
    featured: true,
  },
  {
    slug: "combination-pricing",
    title: "Combination Pricing Engine",
    description:
      "Custom Magento 2 pricing module with ANY/ALL trigger logic, three discount types, and Sydney timezone handling.",
    longDescription:
      "Designed and built a flexible combination pricing module from scratch. Supports complex trigger combinations (ANY/ALL product conditions), multiple discount types (fixed, percentage, fixed price), and precise timezone-aware scheduling for the Sydney market.",
    tags: ["Magento 2", "PHP", "Pricing", "Admin UI", "Timezone"],
    category: "magento",
    highlights: [
      "ANY/ALL product condition trigger logic",
      "Three discount types: fixed, percentage, fixed price",
      "Sydney timezone-aware scheduling",
      "Custom admin UI with raw select elements and _toHtml()",
    ],
    featured: true,
  },
  {
    slug: "nextjs-portfolio",
    title: "Developer Portfolio",
    description:
      "This portfolio — built with Next.js 15, TypeScript, and CSS Modules. Deployed on Vercel.",
    longDescription:
      "A clean, performant portfolio site built with Next.js App Router, TypeScript, and CSS Modules. Features dark mode, smooth animations, and a project showcase with detailed case studies.",
    tags: ["Next.js", "TypeScript", "CSS Modules", "Vercel"],
    category: "nextjs",
    highlights: [
      "Next.js 15 App Router architecture",
      "Dark/light mode with system preference detection",
      "Fully responsive with mobile-first design",
      "Static generation for optimal performance",
    ],
    liveUrl: "https://portfolio-roan-ten-23.vercel.app/",
    repoUrl: "https://github.com/yourusername/portfolio",
    featured: true,
  },
  {
    slug: "social-media-app",
    title: "Social Media App",
    description:
      "A full-featured social media platform built with Next.js — posts, follows, likes, and a real-time feed.",
    longDescription:
      "Developed a full-stack social media application with Next.js App Router, featuring user authentication, a dynamic feed, post creation, likes, comments, and a follow system.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    category: "nextjs",
    highlights: [
      "Full auth flow — sign up, login, protected routes",
      "Dynamic feed with posts, likes, and nested comments",
      "Follow / unfollow system with follower counts",
      "Server components for SSR + client components for interactivity",
      "Prisma ORM with PostgreSQL for type-safe database access",
    ],
    liveUrl: "https://social-app-henna-tau.vercel.app/",
    repoUrl: "https://github.com/Rondel15/social-app",
    featured: true,
  },
  {
    slug: "ai-powered-chat",
    title: "AI Powered Chat",
    description:
      "A React-based chat application with AI integration, real-time responses, and a clean conversational UI.",
    longDescription:
      "Built a fully client-side AI chat application in React with streaming responses, conversation history management, and a polished chat interface. Integrates with an AI API to deliver intelligent, context-aware replies in real time.",
    tags: ["React", "TypeScript", "AI API", "Streaming", "CSS Modules"],
    category: "react",
    highlights: [
      "Real-time streaming AI responses for a natural chat feel",
      "Conversation history with context carried across messages",
      "Clean, accessible chat UI with user and AI message bubbles",
      "Error handling and loading states for smooth UX",
    ],
    liveUrl: "https://ai-chat-ivory-six.vercel.app/",
    repoUrl: "https://github.com/Rondel15/ai-chat",
    featured: true,
  },
  {
    slug: "advanced-node-chat-app",
    title: "Real-time Chat App",
    description:
      "A full-stack real-time chat application built with Node.js, Socket.io, JWT authentication, and PostgreSQL — deployed on Render.",
    longDescription:
      "Built a production-ready real-time chat server from scratch using Node.js, Express, and Socket.io. Features JWT-based authentication for both HTTP routes and WebSocket connections, multi-room messaging with isolated streams, typing indicators, and message persistence via PostgreSQL. The frontend is a custom dark-themed UI served statically from the same Express server.",
    tags: ["Node.js", "Socket.io", "WebSockets", "Express", "JWT", "PostgreSQL", "JavaScript"],
    category: "node",
    highlights: [
      "JWT authentication middleware protecting both REST endpoints and WebSocket connections",
      "Multi-room real-time messaging with Socket.io — join, leave, and isolated message streams",
      "Message persistence with PostgreSQL — chat history survives server restarts",
      "Typing indicators and live presence events via Socket.io room broadcasting",
      "Single-server architecture — Express serves the frontend and Socket.io shares the HTTP port",
    ],
    liveUrl: "https://advanced-chat-app-render.onrender.com/",
    repoUrl: "https://github.com/Rondel15/advanced-chat-app-render",
    featured: true,
  },
  {
    slug: "node-chat-app",
    title: "Chat App",
    description:
      "A real-time Node.js chat application using WebSockets, supporting multiple rooms and live presence indicators.",
    longDescription:
      "Built a real-time chat server with Node.js and Socket.io, supporting multiple chat rooms, live user presence, and message persistence. The backend handles concurrent connections efficiently with event-driven architecture.",
    tags: ["Node.js", "Socket.io", "WebSockets", "Express", "JavaScript"],
    category: "node",
    highlights: [
      "Real-time bi-directional messaging via WebSockets (Socket.io)",
      "Multiple chat rooms with isolated message streams",
      "Live presence indicators — see who's online in each room",
      "Event-driven Node.js architecture for high concurrency",
    ],
    liveUrl: "https://chat-app-client-s9cj.onrender.com/",
    repoUrl: "https://github.com/Rondel15/chat-app",
    featured: true,
  },
];

export const getFeatured = () => projects.filter((p) => p.featured);
export const getBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
