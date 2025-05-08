interface RedditPost {
  community: string;
  timestamp: string;
  title: string;
  content: string;
  isImage?: boolean;
  upvotes?: number;
  comments?: number;
}

export const redditPosts: RedditPost[] = [
  {
    community: "r/reactjs",
    timestamp: "2 hrs ago",
    title: "Next.js API routes vs Express - Need advice",
    content: `I've a working web application running with Next.js + Postgres, now I'm developing an Android application with Tauri + React which uses the same Postgres database. I want to know how can I use Next.js API routes exactly the same as how we use Express with React, like authentication, authorization, etc.
  
  I'm particularly concerned about:
  1. Session management
  2. Rate limiting
  3. File uploads
  4. Websocket support
  
  Has anyone implemented a full-fledged backend just using Next.js API routes? How does it compare to Express in terms of performance and flexibility? I love the simplicity of having everything in one Next.js project but worry about hitting limitations.
  
  Would appreciate any real-world experience!`,
    upvotes: 24,
    comments: 8,
  },
  {
    community: "r/pics",
    timestamp: "5 hrs ago",
    title: "Sunset at the Grand Canyon [OC]",
    content:
      "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isImage: true,
    upvotes: 1543,
    comments: 42,
  },
  {
    community: "r/javascript",
    timestamp: "1 day ago",
    title: "Debugging tips that changed my life",
    content: `After years of using console.log() for debugging, I finally learned to use the debugger properly. Here's what helped me:
  
  1. Conditional breakpoints - Right click a breakpoint to add conditions
  2. Logpoints - Breakpoints that log without pausing execution
  3. Watch expressions - Monitor variables in real time
  4. Call stack navigation - Step through the execution flow
  
  What debugging tricks have saved you hours of frustration?`,
    upvotes: 512,
    comments: 87,
  },
  {
    community: "r/programming",
    timestamp: "1 day ago",
    title: "My minimalist coding setup",
    content: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    isImage: true,
    upvotes: 892,
    comments: 63,
  },
  {
    community: "r/webdev",
    timestamp: "2 days ago",
    title: "Launched my first SaaS product!",
    content: `After 6 months of development, I've finally launched my first SaaS product! It's a time-tracking tool for freelancers built with:
  
  - Next.js (frontend)
  - TailwindCSS (styling)
  - Firebase (backend)
  - Stripe (payments)
  
  The hardest parts were:
  1. Implementing secure authentication
  2. Creating the pricing page logic
  3. Handling timezone conversions
  4. Building the reporting dashboard
  
  Would love any feedback from the community! You can check it out at [example.com] (not actually linking to avoid self-promo rules). 
  
  For other first-time SaaS builders, my biggest lesson was: start with the billing system. I built all the features first and then had to refactor everything to work with subscriptions.`,
    upvotes: 327,
    comments: 45,
  },
  {
    community: "r/aww",
    timestamp: "3 days ago",
    title: "My cat helping me debug",
    content: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    isImage: true,
    upvotes: 10245,
    comments: 231,
  },
  {
    community: "r/technology",
    timestamp: "4 days ago",
    title: "AI and the future of junior developers",
    content: `The rapid advancement of AI coding assistants has me both excited and concerned about the future of junior developer positions. 
  
  On one hand:
  - AI can handle boilerplate code
  - Can explain complex concepts
  - Helps with debugging
  
  But I worry:
  - Will companies hire fewer juniors?
  - Will the learning path change dramatically?
  - Could it create a larger gap between juniors and seniors?
  
  As a mid-level developer, I'm trying to mentor our juniors differently now, focusing more on:
  1. System design
  2. Code review skills
  3. Understanding business requirements
  4. Debugging AI-generated code
  
  What's your perspective? How are you adapting your hiring/learning strategies?`,
    upvotes: 784,
    comments: 293,
  },
  {
    community: "r/learnprogramming",
    timestamp: "5 days ago",
    title: "From self-study to first dev job in 6 months!",
    content: `I just wanted to share my journey in case it helps others:
  
  Month 1-2:
  - Learned HTML/CSS/JS basics
  - Built simple static sites
  - Did freeCodeCamp exercises
  
  Month 3-4:
  - Learned React
  - Built 3 portfolio projects
  - Started learning Node.js
  
  Month 5:
  - Contributed to open source
  - Networked on LinkedIn
  - Practiced algorithms
  
  Month 6:
  - Applied to 50+ jobs
  - Got 3 interviews
  - Landed a junior frontend position!
  
  The key for me was building real projects rather than just following tutorials. My portfolio had:
  1. A weather app
  2. A recipe finder
  3. A simple CRM
  
  Don't give up! The job search was brutal but worth it.`,
    upvotes: 1245,
    comments: 178,
  },
  {
    community: "r/gaming",
    timestamp: "1 week ago",
    title: "My retro gaming setup",
    content: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8",
    isImage: true,
    upvotes: 5678,
    comments: 432,
  },
  {
    community: "r/startups",
    timestamp: "1 week ago",
    title: "Building open-source alternatives to overpriced SaaS",
    content: `We're a small team building open-source alternatives to popular but expensive SaaS products. Our philosophy:
  - Core features should be free
  - Easy self-hosting
  - Modular architecture
  
  So far we've built alternatives to:
  1. A popular project management tool
  2. An email marketing platform
  3. A form builder
  
  We're deciding what to build next and would love community input. What SaaS products do you think:
  - Are overpriced for what they offer?
  - Have essential features that could be open-sourced?
  - Would benefit from a simpler alternative?
  
  Also happy to answer questions about maintaining OSS while trying to build a sustainable business model!`,
    upvotes: 432,
    comments: 156,
  },
];
