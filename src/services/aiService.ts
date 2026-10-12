import {
  AnswerEvaluation,
  InterviewConfig,
  InterviewQuestion,
  InterviewSession,
  QuestionAnswerRecord,
  ResumeProfile,
  AISettings,
} from '../types';

// Pre-packaged curated question database with detailed model answers for all 6 job roles
const CURATED_QUESTIONS: Record<string, Record<string, InterviewQuestion[]>> = {
  'frontend-dev': {
    Technical: [
      {
        id: 101,
        questionText: 'How does React’s Virtual DOM work, and how does the reconciliation algorithm determine when to re-render DOM nodes?',
        category: 'React Core',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Mention diffing algorithm, key prop heuristics, fiber tree, and commit vs render phases.',
        expectedKeyPoints: ['Diffing tree heuristic', 'Fiber node reconciliation', 'Render vs Commit phase', 'Importance of unique keys'],
        whyAsked: 'Tests fundamental architectural understanding of React performance and reconciliation mechanics.',
        modelAnswer: 'The Virtual DOM is a lightweight, in-memory JavaScript representation of the actual DOM. When component state or props change, React creates a new Virtual DOM tree and compares it to the previous Fiber tree using a heuristic O(n) diffing algorithm. During the reconciliation phase, React determines the minimal set of changes by assuming elements of different types generate different trees and utilizing stable keys for list items. Finally, during the Commit phase, React flushes these exact batch mutations to the real browser DOM synchronously, preventing expensive layout thrashing.',
      },
      {
        id: 102,
        questionText: 'Explain how you optimize Core Web Vitals (LCP, FID/INP, and CLS) in a modern React application.',
        category: 'Web Performance',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss code splitting (React.lazy), asset compression, image sizing, and layout shift prevention.',
        expectedKeyPoints: ['Code splitting & lazy loading', 'Image dimension attributes', 'Minimizing main thread blocking', 'Server-side rendering / static generation'],
        whyAsked: 'Evaluates whether the candidate builds production-ready applications with real-world user performance in mind.',
        modelAnswer: 'To optimize Largest Contentful Paint (LCP), I prioritize hero resource delivery using preload links, server-side rendering (SSR), and CDN caching. For Interaction to Next Paint (INP) and FID, I minimize main-thread execution by splitting bundles using React.lazy, deferring non-critical scripts, and offloading heavy tasks to Web Workers or requestIdleCallback. For Cumulative Layout Shift (CLS), I reserve layout dimensions with explicit width/height attributes or CSS aspect-ratio on all images and dynamic widgets, ensuring fonts and elements never shift content abruptly.',
      },
      {
        id: 103,
        questionText: 'What is the Event Loop in JavaScript, and how do microtasks (Promises) differ from macrotasks (setTimeout)?',
        category: 'JavaScript Fundamentals',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Walk through call stack execution, microtask queue priority, and event loop tick cycle.',
        expectedKeyPoints: ['Call stack vs task queue', 'Microtasks drain completely before next macrotask', 'Promise resolution vs timer scheduling'],
        whyAsked: 'Assesses mastery of asynchronous JavaScript execution and concurrency model.',
        modelAnswer: 'JavaScript executes on a single thread with a synchronous Call Stack, a Microtask Queue (Promises, queueMicrotask, MutationObserver), and a Macrotask Queue (setTimeout, setInterval, I/O). When the call stack empties, the Event Loop checks the Microtask Queue first and drains it entirely—including newly enqueued microtasks—before picking the next single macrotask. This means Promise handlers execute before timer callbacks, even if a setTimeout has a delay of 0 milliseconds.',
      },
      {
        id: 104,
        questionText: 'How would you architect state management across a large-scale frontend app when prop-drilling becomes unmaintainable?',
        category: 'Architecture',
        difficulty: 'Advanced',
        type: 'Technical',
        hint: 'Compare React Context, Redux Toolkit/Zustand, and server-cache solutions like TanStack Query.',
        expectedKeyPoints: ['Separation of server state vs UI state', 'Selective re-renders with selectors', 'React Context limitations with high-frequency updates'],
        whyAsked: 'Examines state design patterns, performance awareness, and tooling maturity in enterprise web apps.',
        modelAnswer: 'In enterprise applications, I decouple server state from client UI state. Server-synchronized data is managed with dedicated caching libraries like TanStack Query or RTK Query, which handle caching, deduping, and background invalidation out of the box. For global client UI state, I prefer lightweight atomic stores like Zustand or Redux Toolkit using memoized selectors to avoid unnecessary consumer re-renders. I avoid React Context for frequently updating state because Context updates trigger re-renders across all consuming components without fine-grained selector optimization.',
      },
      {
        id: 105,
        questionText: 'What is CSS specificity, and how does Tailwind CSS or CSS Modules prevent style collisions in modular applications?',
        category: 'CSS & Styling',
        difficulty: 'Beginner',
        type: 'Technical',
        hint: 'Explain inline vs ID vs class specificity, and scoped utility classes.',
        expectedKeyPoints: ['Specificity hierarchy', 'Scoped class hashing', 'Utility-first flat cascade'],
        whyAsked: 'Tests CSS fundamentals and understanding of modern modular styling tools.',
        modelAnswer: 'CSS specificity is the hierarchy browsers use to decide which style rule applies, calculated by counting inline styles (1000), IDs (100), classes/attributes/pseudo-classes (10), and element tags (1). In large applications, global CSS easily suffers from specificity wars. CSS Modules solves this by hashing class names uniquely at compile-time to scope rules locally to their component. Tailwind CSS solves specificity issues by generating single-purpose, flat utility classes with uniform low class specificity, eliminating selector nesting and unintended cascading side-effects.',
      },
    ],
    Behavioral: [
      {
        id: 106,
        questionText: 'Tell me about a time you had to deliver a critical frontend feature under a tight deadline. How did you prioritize technical debt versus speed?',
        category: 'Delivery & Time Management',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Use the STAR method: Situation, Task, Action, and Result.',
        expectedKeyPoints: ['Clear stakeholder alignment', 'Pruning non-critical UI requirements', 'Logging tech debt in Jira for fast follow-up'],
        whyAsked: 'Assesses pragmatic engineering trade-offs, stakeholder communication, and delivery discipline.',
        modelAnswer: 'In my previous project, we had to launch an enterprise analytics dashboard two weeks ahead of a major conference. Recognizing that building custom charting widgets from scratch would jeopardize the release, I convened with product managers to deselect non-essential animation requirements and adopted a proven headless charting library. I isolated our shortcuts behind clean abstractions and scheduled an explicit refactoring sprint immediately after launch. We hit the deadline with zero critical production bugs and resolved the technical debt within the next two sprints.',
      },
      {
        id: 107,
        questionText: 'Describe a disagreement you had with a UI/UX designer or product manager regarding feature feasibility. How did you resolve it?',
        category: 'Collaboration',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Focus on constructive empathy, presenting technical alternatives, and focusing on user impact.',
        expectedKeyPoints: ['Empathetic discussion', 'Proposing phased prototypes', 'Data/usability-driven compromise'],
        whyAsked: 'Measures conflict resolution, cross-functional collaboration, and user empathy.',
        modelAnswer: 'A designer once proposed a complex nested drag-and-drop hierarchy that required heavy mobile layout recalculations and would significantly degrade performance on lower-tier mobile devices. Instead of simply declining, I built a quick 30-minute prototype illustrating the frame drops and proposed a cleaner bottom-sheet list reordering alternative. The designer appreciated the concrete data, and after a brief team review, we implemented the alternative, which proved both easier for users to navigate and delivered 60fps performance across all target devices.',
      },
    ],
    HR: [
      {
        id: 108,
        questionText: 'Walk me through your background as a frontend developer, and why you are interested in this specific engineering role.',
        category: 'Background & Motivation',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Keep your answer under 2 minutes. Highlight key projects, core stack, and career trajectory.',
        expectedKeyPoints: ['Clear career narrative', 'Passion for frontend user experience', 'Alignment with team mission'],
        whyAsked: 'Validates clear communication, professional trajectory, and cultural alignment.',
        modelAnswer: 'I have spent the past several years developing interactive, accessible web applications primarily in React, TypeScript, and modern styling architectures. What excites me most about frontend engineering is the direct intersection between algorithmic problem-solving and immediate user impact. I am drawn to this role because your product tackles complex real-time workflows at scale, and my background in performance optimization and component architecture directly aligns with the engineering challenges your team is currently scaling.',
      },
    ],
  },
  'fullstack-dev': {
    Technical: [
      {
        id: 201,
        questionText: 'How do you design a secure RESTful API endpoint that handles file uploads and database persistence with proper error boundaries?',
        category: 'API & Backend',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss multipart/form-data, rate limiting, token validation, cloud bucket presigned URLs, and transactional integrity.',
        expectedKeyPoints: ['Authentication & authorization check', 'File MIME & size validation', 'Presigned URLs or streaming', 'Atomic database transactions'],
        whyAsked: 'Tests end-to-end backend design, security hygiene, and clean architectural separation.',
        modelAnswer: 'A secure upload flow avoids buffering full files in API memory. Instead, the client requests a temporary cryptographically signed presigned upload URL from an authenticated endpoint that validates user identity, MIME type whitelist, and strict file size limits. The client uploads directly to object storage (like AWS S3 or Google Cloud Storage). Upon completion, a webhook or verification endpoint records metadata in the database inside an ACID transaction. This prevents denial-of-service from memory spikes and ensures database consistency.',
      },
      {
        id: 202,
        questionText: 'Compare SQL (e.g. PostgreSQL) and NoSQL (e.g. MongoDB). When would you choose one over the other for a scalable system?',
        category: 'Databases',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss ACID guarantees, normalized relations, flexible schemas, and read vs write scale patterns.',
        expectedKeyPoints: ['ACID compliance and relational integrity in SQL', 'Schema flexibility and horizontal partitioning in NoSQL', 'Query complexity and indexing'],
        whyAsked: 'Checks database selection expertise based on workload characteristics.',
        modelAnswer: 'Relational databases like PostgreSQL provide strong ACID guarantees, structured schemas, foreign key constraints, and powerful complex joins, making them ideal for financial transactions, user authentication, and relational domain models. NoSQL databases like MongoDB or Cassandra excel when schemas evolve rapidly, documents are self-contained without cross-table relations, or write throughput requires horizontal sharding across distributed clusters. For 90% of business applications, PostgreSQL provides superior consistency and data integrity.',
      },
      {
        id: 203,
        questionText: 'How do you prevent common web security vulnerabilities such as Cross-Site Scripting (XSS), CSRF, and SQL Injection?',
        category: 'Web Security',
        difficulty: 'Advanced',
        type: 'Technical',
        hint: 'Explain input sanitization, parameterized queries, SameSite cookies, and Content Security Policies.',
        expectedKeyPoints: ['Parameterized queries / ORM protection', 'Input sanitization and CSP headers', 'SameSite=Strict cookie flags for CSRF'],
        whyAsked: 'Evaluates production security fundamentals and defensiveness.',
        modelAnswer: 'To eliminate SQL Injection, all database queries must use parameterized prepared statements or trusted ORMs. To neutralize XSS, user input must be sanitized and HTML-escaped, dangerous frontend APIs like dangerouslySetInnerHTML avoided, and a strict Content Security Policy (CSP) enforced via HTTP headers. For CSRF defense, authentication tokens should reside in HttpOnly cookies with SameSite=Strict or Lax attributes, alongside anti-CSRF challenge tokens for state-changing POST/PUT requests.',
      },
    ],
    Behavioral: [
      {
        id: 204,
        questionText: 'Describe a production outage or critical bug you encountered. How did you troubleshoot, triage, and establish preventative guardrails?',
        category: 'Incident Response',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Explain monitoring (logs/metrics), root cause analysis, hotfix deployment, and blameless post-mortem.',
        expectedKeyPoints: ['Calm diagnostic triage', 'Fast rollback / hotfix', 'Blameless post-mortem with automated regression test'],
        whyAsked: 'Measures resilience under pressure, diagnostic methodology, and post-mortem ownership.',
        modelAnswer: 'During a peak traffic window, our database connection pool exhausted, causing 504 Gateway Timeouts across core endpoints. I checked APM metrics and server logs, identified an unindexed wildcard query introduced in that morning’s release, and executed an immediate rollback within 8 minutes. Once service restored, I led a blameless post-mortem: we added the missing composite database index, lowered the slow-query alert threshold, and integrated automated query linter checks into our CI/CD pipeline to catch unindexed queries pre-merge.',
      },
    ],
    HR: [
      {
        id: 205,
        questionText: 'As a full stack engineer, do you gravitate more towards backend systems or frontend UX, and how do you maintain depth in both?',
        category: 'Work Style',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Emphasize your versatility and end-to-end product ownership mentality.',
        expectedKeyPoints: ['Comfort across stack', 'Focus on end-user product value', 'Continuous learning approach'],
        whyAsked: 'Assesses self-awareness, technical agility, and cross-functional enthusiasm.',
        modelAnswer: 'I view software development through the lens of delivering complete user value rather than artificial stack boundaries. While I enjoy architecting robust backend databases and resilient APIs, I take equal pride in building snappy, accessible user interfaces. Being able to trace a feature from the database schema all the way to the frontend rendering pipeline allows me to identify bottlenecks faster and build more cohesive, end-to-end product features.',
      },
    ],
  },
  'java-dev': {
    Technical: [
      {
        id: 301,
        questionText: 'Explain the internal workings of Java’s Garbage Collection and how memory is partitioned between Young Generation and Old Generation.',
        category: 'JVM Internals',
        difficulty: 'Advanced',
        type: 'Technical',
        hint: 'Mention Eden space, Survivor spaces (S0/S1), Tenured generation, and GC collectors like G1 or ZGC.',
        expectedKeyPoints: ['Eden and survivor promotion', 'Minor GC vs Major/Full GC', 'Stop-the-world pauses and G1GC compaction'],
        whyAsked: 'Tests in-depth JVM performance engineering, memory model, and garbage collector tuning.',
        modelAnswer: 'Java Heap memory is partitioned based on the weak generational hypothesis that most objects die young. The Young Generation contains the Eden space and two Survivor spaces (S0 and S1). New objects are allocated in Eden; during a Minor GC, surviving objects are copied between S0 and S1, incrementing their age counter. When their tenure reaches a threshold, they are promoted to the Old (Tenured) Generation. Modern collectors like G1GC partition the heap into dynamic regions, collecting garbage concurrently to minimize Stop-The-World pause times.',
      },
      {
        id: 302,
        questionText: 'What are the core principles of Spring Boot Dependency Injection, and how does bean lifecycle management function?',
        category: 'Spring Framework',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Explain ApplicationContext, @Component/@Service/@Autowired, Singleton scope, and PostConstruct/PreDestroy.',
        expectedKeyPoints: ['Inversion of Control (IoC) container', 'Bean scopes (singleton, prototype)', 'Lifecycle phases and dependency autowiring'],
        whyAsked: 'Validates understanding of Spring IoC container, decoupling, and lifecycle hooks.',
        modelAnswer: 'Inversion of Control (IoC) in Spring transfers the responsibility of object instantiation and dependency management to the Spring IoC container (ApplicationContext). Beans are declared via annotations like @Component, @Service, or @Bean, and injected via constructor injection. The bean lifecycle proceeds through instantiation, property population, BeanNameAware/BeanFactoryAware callbacks, pre-initialization BeanPostProcessors, @PostConstruct initialization, post-initialization proxies, and finally @PreDestroy upon container shutdown.',
      },
      {
        id: 303,
        questionText: 'How do you handle concurrency and multithreading in Java using java.util.concurrent without encountering race conditions or deadlocks?',
        category: 'Concurrency',
        difficulty: 'Advanced',
        type: 'Technical',
        hint: 'Mention ExecutorService, ConcurrentHashMap, Atomic variables, synchronized blocks, and Locks.',
        expectedKeyPoints: ['Thread pools with ExecutorService', 'Atomic operations and CAS (Compare-And-Swap)', 'Avoiding nested lock acquisition'],
        whyAsked: 'Assesses concurrent programming safety, lock management, and thread pool orchestration.',
        modelAnswer: 'To manage concurrency safely, I avoid raw Thread objects and instead use managed thread pools with ExecutorService or virtual threads in modern Java. For shared mutable state, I prefer non-blocking structures from java.util.concurrent, such as AtomicInteger which relies on hardware-level Compare-And-Swap (CAS), or ConcurrentHashMap for thread-safe reads and lock-striped writes. When explicit locking is necessary, ReentrantLock with tryLock timeouts prevents indefinite deadlocks, and locks must always be acquired in a globally uniform order.',
      },
    ],
    Behavioral: [
      {
        id: 304,
        questionText: 'Tell me about an enterprise microservice or legacy system you refactored. What was the business impact and how did you minimize regression risk?',
        category: 'Refactoring & Architecture',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Use the STAR method: describe test coverage, strangler pattern, or throughput gains.',
        expectedKeyPoints: ['Comprehensive integration tests before refactor', 'Strangler fig pattern or incremental delivery', 'Measurable latency/maintainability gain'],
        whyAsked: 'Measures enterprise software craftsmanship, risk management, and legacy code maturity.',
        modelAnswer: 'In an order processing system, an old monolithic servlet was taking over 2.4 seconds per checkout and had zero automated test coverage. Before modifying any logic, I wrote comprehensive integration tests using WireMock and Testcontainers to capture existing behavior as an infallible safety net. I then applied the Strangler Fig pattern to extract the payment subsystem into a clean, event-driven Spring Boot microservice. Checkout latency dropped by 65%, error rates declined from 3% to 0.05%, and deployment frequency doubled.',
      },
    ],
    HR: [
      {
        id: 305,
        questionText: 'Why do you prefer building backend systems with Java and Spring Boot compared to other languages like Node.js or Python?',
        category: 'Platform Motivation',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Mention type safety, robust tooling, enterprise scalability, and mature ecosystem.',
        expectedKeyPoints: ['Type safety and compiler guarantees', 'Enterprise robustness and high throughput', 'Mature ecosystem'],
        whyAsked: 'Assesses career intentionality and understanding of JVM platform trade-offs.',
        modelAnswer: 'I gravitate toward Java because of its compile-time type safety, exceptional JVM multithreading and garbage collection performance, and mature enterprise ecosystem. While Node.js and Python are great for rapid prototypes, Spring Boot provides rock-solid dependency injection, mature database transaction management, and robust observability that make building and maintaining complex, high-throughput systems far more reliable over multi-year enterprise lifecycles.',
      },
    ],
  },
  'data-analyst': {
    Technical: [
      {
        id: 401,
        questionText: 'Explain the difference between WHERE and HAVING clauses in SQL, and when you would use window functions like ROW_NUMBER() or RANK().',
        category: 'SQL Querying',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Differentiate pre-aggregation filtering vs post-aggregation filtering, and partitioning vs grouping.',
        expectedKeyPoints: ['WHERE filters before GROUP BY', 'HAVING filters aggregated groups', 'Window functions preserve row granularity'],
        whyAsked: 'Tests fundamental SQL competence and analytical query optimization.',
        modelAnswer: 'In SQL, the WHERE clause filters rows before any aggregation takes place, whereas the HAVING clause filters aggregated group metrics calculated by GROUP BY. Window functions like ROW_NUMBER() and RANK() differ from GROUP BY because they compute calculations across a partitioned window of rows while preserving individual row granularity. I use ROW_NUMBER() for deduplication or selecting the most recent record per customer, and RANK() when ties should share the same ordinal position.',
      },
      {
        id: 402,
        questionText: 'How do you handle dirty or missing data in a pandas DataFrame before presenting findings to stakeholders?',
        category: 'Data Wrangling',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss imputation (mean/median/mode), forward/back fill, outlier detection, and documenting data leakage.',
        expectedKeyPoints: ['Detecting missing patterns with isnull()', 'Appropriate imputation vs dropping', 'Checking for bias introduced by cleansing'],
        whyAsked: 'Evaluates data integrity, statistical hygiene, and awareness of analytical bias.',
        modelAnswer: 'I begin by auditing missingness patterns using df.isnull().sum() to understand whether values are Missing Completely at Random (MCAR) or systematically skewed. For numerical features with low missing rates, I impute using the median if the distribution has outliers, or mean if normally distributed. For categorical features, I use the mode or designate a separate "Unknown" category. Crucially, I always log data imputation ratios and communicate data limitations transparently to stakeholders so decisions are made with statistical integrity.',
      },
      {
        id: 403,
        questionText: 'How do you determine statistical significance in an A/B test, and what does a p-value of 0.03 mean in practice?',
        category: 'Statistics & Experimentation',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Explain null hypothesis, alpha threshold (usually 0.05), sample size requirements, and practical vs statistical significance.',
        expectedKeyPoints: ['Rejecting null hypothesis when p < 0.05', 'Probability of observing results by chance alone', 'Balancing statistical significance with practical business effect size'],
        whyAsked: 'Checks scientific rigor in experimentation and ability to explain statistical terms in business contexts.',
        modelAnswer: 'A p-value of 0.03 indicates that, assuming there is genuinely no difference between variants (the Null Hypothesis is true), there is only a 3% probability of observing a difference as large as or larger than what we measured purely due to random sampling chance. Because 0.03 is below the conventional alpha threshold of 0.05, we reject the null hypothesis and deem the result statistically significant. However, statistical significance must always be coupled with practical business significance (effect size, confidence intervals, and minimum detectable effect).',
      },
    ],
    Behavioral: [
      {
        id: 404,
        questionText: 'Describe a time when your data analysis contradicted a senior executive’s intuition. How did you communicate the findings effectively?',
        category: 'Executive Stakeholder Management',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Focus on clear data storytelling, visual charts, validating assumptions, and collaborative problem solving.',
        expectedKeyPoints: ['Objective visual charts', 'Validating their perspective before correcting', 'Leading with business implications'],
        whyAsked: 'Measures executive presence, tactful communication, and data storytelling under pushback.',
        modelAnswer: 'A department VP believed an expensive marketing channel was our primary growth driver and proposed doubling its budget. My attribution cohort analysis revealed that 70% of those conversions were returning customers who would have converted organically. Rather than being adversarial, I acknowledged their goal, walked through the cohort retention curves step-by-step, and highlighted where budget reallocation would generate an incremental 25% lift in net-new acquisitions. They appreciated the objective data and redirected the capital successfully.',
      },
    ],
    HR: [
      {
        id: 405,
        questionText: 'How do you keep your technical skills sharp in analytics as new BI tools and AI-assisted workflows emerge?',
        category: 'Continuous Learning',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Mention real project experimentation, data communities, and continuous learning.',
        expectedKeyPoints: ['Practical curiosity', 'Following industry trends', 'Applying new methods to real data'],
        whyAsked: 'Assesses self-motivation and adaptability to evolving analytical ecosystems.',
        modelAnswer: 'I maintain continuous learning by actively building projects with new analytical paradigms—such as incorporating automated SQL query assistants, exploring DuckDB for fast in-browser OLAP, and participating in weekly Kaggle and analytics community discussions. I evaluate new tools not for the hype, but for how they streamline data processing pipelines and enable faster, more accurate insights for decision-makers.',
      },
    ],
  },
  'customer-support': {
    Technical: [
      {
        id: 501,
        questionText: 'A high-tier customer submits an urgent ticket stating their payment failed and their account is locked. How do you triage this step-by-step?',
        category: 'Triage & Process',
        difficulty: 'Beginner',
        type: 'Technical',
        hint: 'Walk through acknowledging impact, checking billing logs, verifying identity, and coordinating with finance/eng.',
        expectedKeyPoints: ['Immediate empathetic acknowledgment', 'Verifying account security and logs', 'Providing clear timeline and workaround'],
        whyAsked: 'Tests crisis response, customer empathy, security verification, and procedural speed.',
        modelAnswer: 'First, I immediately reply with a calm, empathetic acknowledgment affirming that their issue is my top priority. Second, I verify account ownership and inspect the payment gateway transaction failure codes (e.g. Stripe decline reasons, 3D Secure timeouts). Third, if the block was triggered by an automated risk flag, I provision a temporary grace-period access pass while coordinating with billing engineering. Fourth, I guide the customer through updating payment details and follow up personally until full service is restored.',
      },
      {
        id: 502,
        questionText: 'How do you effectively manage SLAs when your support inbox receives a sudden 300% spike in inbound volume due to an incident?',
        category: 'Queue Management',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss macro templates, severity tagging, status page updates, and tier-1 routing.',
        expectedKeyPoints: ['Broadcasting status updates to reduce duplicates', 'Triage by urgency and customer tier', 'Leveraging bulk responses with personalization'],
        whyAsked: 'Evaluates workflow orchestration, incident management, and queue prioritization during crises.',
        modelAnswer: 'When an outage causes ticket spikes, the first line of defense is deflection: I collaborate with engineering to publish an incident status page banner and automated IVR/chat notices, which halts duplicate ticket creation. Next, I segment the queue using automated tags to triage critical enterprise accounts and payment issues ahead of general inquiries. Finally, our team deploys pre-approved incident macros with dynamic personalization tokens to maintain rapid first-response SLA times while keeping users informed in real-time.',
      },
    ],
    Behavioral: [
      {
        id: 503,
        questionText: 'Can you tell me about a time you handled an extremely irate or aggressive customer? How did you de-escalate the situation?',
        category: 'De-escalation & Empathy',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Use the HEAT or STAR framework: Hear, Empathize, Apologize, Take action.',
        expectedKeyPoints: ['Active listening without defensive interruption', 'Validating their frustration', 'Taking concrete ownership of next steps'],
        whyAsked: 'Measures emotional intelligence, composure under fire, and de-escalation mastery.',
        modelAnswer: 'A customer called furiously claiming our software crash cost them a client presentation. I applied the HEAT method (Hear, Empathize, Apologize, Take action): I listened attentively without interrupting until they felt heard, acknowledged the immense stress this caused their business, and apologized sincerely for the disruption. Once calmed, I took direct ownership, recovered their corrupted document through backup revisions, and established a direct communication line until their meeting concluded successfully.',
      },
    ],
    HR: [
      {
        id: 504,
        questionText: 'What motivates you to work in customer experience every day, and how do you prevent burnout during stressful weeks?',
        category: 'Resilience & Motivation',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Share genuine joy in solving user pain points and healthy work-life boundaries.',
        expectedKeyPoints: ['Genuine satisfaction from helping users', 'Self-care routines and team camaraderie', 'Constructive detachment'],
        whyAsked: 'Assesses career longevity, personal resilience, and cultural health.',
        modelAnswer: 'What drives me is being the trusted human advocate who turns a user’s stressful moment into a moment of relief and loyalty. To prevent burnout during high-volume weeks, I practice structured compartmentalization—taking short walks between intense escalations, leaning on supportive team retrospectives, and maintaining clear boundaries outside work so I return each morning energized with empathy.',
      },
    ],
  },
  'uiux-designer': {
    Technical: [
      {
        id: 601,
        questionText: 'Walk me through your end-to-end design process when tackling an ambiguous user workflow from discovery to handoff.',
        category: 'Design Process',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Mention user interviews, journey mapping, wireframing, interactive prototyping in Figma, usability testing, and engineer handoff.',
        expectedKeyPoints: ['Problem definition & user research', 'Low-fidelity divergence into high-fidelity convergence', 'Usability validation before developer handoff'],
        whyAsked: 'Tests design thinking methodology, product discovery, and practical design execution.',
        modelAnswer: 'My process begins with Discovery: interviewing users and analyzing analytics to define the root problem and user journey. In the Ideation phase, I sketch low-fidelity wireframes to explore divergent solutions rapidly with stakeholders. Once aligned on concept, I build interactive Figma prototypes with design tokens and auto-layout, test them with 5 representative users to uncover usability friction, and refine the interactions. Finally, during handoff, I provide developers with component specs, responsive breakpoints, error states, and accessibility tokens.',
      },
      {
        id: 602,
        questionText: 'How do you design for accessibility (WCAG AA) in terms of color contrast, touch targets, and keyboard navigation?',
        category: 'Accessibility',
        difficulty: 'Intermediate',
        type: 'Technical',
        hint: 'Discuss 4.5:1 text contrast ratios, minimum 44px tap targets, focus states, and screen reader annotations.',
        expectedKeyPoints: ['Contrast compliance ratios', 'Spatial touch target minimums', 'Keyboard accessibility & semantic annotations'],
        whyAsked: 'Evaluates inclusive design standards, legal compliance, and design system rigor.',
        modelAnswer: 'I embed WCAG 2.1 AA criteria directly into my design tokens. For color contrast, I ensure standard text achieves at least a 4.5:1 ratio against backgrounds (3:1 for large text) and never rely solely on color to convey information. For touch devices, all interactive elements meet the minimum 44x44 CSS pixel tap target standard with adequate spacing. For keyboard navigation, I design explicit, visible focus rings and annotate tab order and ARIA roles in Figma for our engineering team.',
      },
    ],
    Behavioral: [
      {
        id: 603,
        questionText: 'Describe a situation where engineering said your proposed design was too complex to build within the sprint. How did you adapt?',
        category: 'Developer Collaboration',
        difficulty: 'Intermediate',
        type: 'Behavioral',
        hint: 'Highlight pragmatic compromise, understanding technical constraints, and phased rollout.',
        expectedKeyPoints: ['Understanding underlying technical bottleneck', 'Creating an MVP that preserves core usability', 'Iterating towards ideal experience'],
        whyAsked: 'Measures flexibility, developer empathy, and pragmatic product delivery.',
        modelAnswer: 'I once designed a rich multi-filter modal with dynamic animated counts that engineering flagged would require complex custom backend queries and blow past the sprint deadline. I sat down with the lead engineer to understand the database bottleneck, and we agreed to phase the rollout: for V1, we used static batch filtering with native components, delivering 85% of user value on time. We logged the advanced live-count animation for V2 once caching infrastructure was in place.',
      },
    ],
    HR: [
      {
        id: 604,
        questionText: 'What design systems or products in the real world inspire your craft, and how do you critique digital experiences?',
        category: 'Design Philosophy',
        difficulty: 'Beginner',
        type: 'HR',
        hint: 'Give specific examples of interaction details, micro-copy, or frictionless design.',
        expectedKeyPoints: ['Analytical critique of micro-interactions', 'Awareness of industry standards', 'Emphasis on clarity and delight'],
        whyAsked: 'Measures visual taste, interaction sensibility, and critical design thinking.',
        modelAnswer: 'I admire products like Linear and Airbnb for their relentless commitment to cognitive ease and interaction fluidity. Linear’s keyboard-first navigation and instantaneous optimistic UI prove that speed is a core pillar of user experience. When critiquing any product, I evaluate whether every pixel, transition, and micro-copy string reduces cognitive load for the user, rather than adding decorative friction.',
      },
    ],
  },
};

export const aiService = {
  /**
   * Generates tailored interview questions based on role, difficulty, interview type, and resume profile.
   */
  async generateQuestions(
    config: InterviewConfig,
    resumeProfile: ResumeProfile | null,
    settings: AISettings
  ): Promise<InterviewQuestion[]> {
    // 1. Google Gemini
    if (settings.mode === 'gemini' && settings.apiKey.trim()) {
      try {
        const questions = await fetchQuestionsFromGemini(config, resumeProfile, settings.apiKey, settings.selectedModel);
        if (questions && questions.length > 0) {
          return questions.slice(0, config.questionCount);
        }
      } catch (err) {
        console.warn('Gemini question generation note:', err);
      }
    }

    // 2. OpenAI (ChatGPT)
    if (settings.mode === 'openai' && settings.apiKey.trim()) {
      try {
        const questions = await fetchQuestionsFromOpenAI(config, resumeProfile, settings.apiKey, settings.selectedModel);
        if (questions && questions.length > 0) {
          return questions.slice(0, config.questionCount);
        }
      } catch (err) {
        console.warn('OpenAI question generation note:', err);
      }
    }

    // 3. xAI (Grok)
    if (settings.mode === 'grok' && settings.apiKey.trim()) {
      try {
        const questions = await fetchQuestionsFromGrok(config, resumeProfile, settings.apiKey, settings.selectedModel);
        if (questions && questions.length > 0) {
          return questions.slice(0, config.questionCount);
        }
      } catch (err) {
        console.warn('xAI Grok question generation note:', err);
      }
    }

    // 4. Anthropic (Claude)
    if (settings.mode === 'anthropic' && settings.apiKey.trim()) {
      try {
        const questions = await fetchQuestionsFromAnthropic(config, resumeProfile, settings.apiKey, settings.selectedModel);
        if (questions && questions.length > 0) {
          return questions.slice(0, config.questionCount);
        }
      } catch (err) {
        console.warn('Anthropic question generation note:', err);
      }
    }

    // 5. DeepSeek
    if (settings.mode === 'deepseek' && settings.apiKey.trim()) {
      try {
        const questions = await fetchQuestionsFromDeepSeek(config, resumeProfile, settings.apiKey, settings.selectedModel);
        if (questions && questions.length > 0) {
          return questions.slice(0, config.questionCount);
        }
      } catch (err) {
        console.warn('DeepSeek question generation note:', err);
      }
    }

    // 6. High-fidelity Curated Engine (Default & Resilient Fallback)
    return getCuratedQuestions(config, resumeProfile);
  },

  /**
   * Evaluates a candidate's answer and returns a structured score breakdown.
   */
  async evaluateAnswer(
    question: InterviewQuestion,
    answerText: string,
    config: InterviewConfig,
    resumeProfile: ResumeProfile | null,
    settings: AISettings
  ): Promise<AnswerEvaluation> {
    // 1. Google Gemini
    if (settings.mode === 'gemini' && settings.apiKey.trim()) {
      try {
        const evalResult = await evaluateAnswerWithGemini(question, answerText, config, settings.apiKey, settings.selectedModel);
        if (evalResult) return evalResult;
      } catch (err) {
        console.warn('Gemini answer evaluation note, using high-accuracy evaluator:', err);
      }
    }

    // 2. OpenAI (ChatGPT)
    if (settings.mode === 'openai' && settings.apiKey.trim()) {
      try {
        const evalResult = await evaluateAnswerWithOpenAI(question, answerText, config, settings.apiKey, settings.selectedModel);
        if (evalResult) return evalResult;
      } catch (err) {
        console.warn('OpenAI evaluation note, using high-accuracy evaluator:', err);
      }
    }

    // 3. xAI (Grok)
    if (settings.mode === 'grok' && settings.apiKey.trim()) {
      try {
        const evalResult = await evaluateAnswerWithGrok(question, answerText, config, settings.apiKey, settings.selectedModel);
        if (evalResult) return evalResult;
      } catch (err) {
        console.warn('Grok evaluation note, using high-accuracy evaluator:', err);
      }
    }

    // 4. Anthropic (Claude)
    if (settings.mode === 'anthropic' && settings.apiKey.trim()) {
      try {
        const evalResult = await evaluateAnswerWithAnthropic(question, answerText, config, settings.apiKey, settings.selectedModel);
        if (evalResult) return evalResult;
      } catch (err) {
        console.warn('Anthropic evaluation note, using high-accuracy evaluator:', err);
      }
    }

    // 5. DeepSeek
    if (settings.mode === 'deepseek' && settings.apiKey.trim()) {
      try {
        const evalResult = await evaluateAnswerWithDeepSeek(question, answerText, config, settings.apiKey, settings.selectedModel);
        if (evalResult) return evalResult;
      } catch (err) {
        console.warn('DeepSeek evaluation note, using high-accuracy evaluator:', err);
      }
    }

    // 6. High-accuracy local STAR evaluator with strict penalties for incorrect or unknown responses
    return evaluateAnswerLocally(question, answerText, config, resumeProfile);
  },

  /**
   * Synthesizes full session data into an interview report
   */
  generateFinalReport(
    records: QuestionAnswerRecord[],
    config: InterviewConfig,
    resumeProfile: ResumeProfile | null,
    durationSeconds: number
  ): InterviewSession {
    const validRecords = records.filter((r) => r.evaluation);
    const count = validRecords.length || 1;

    const avgOverall = Math.round(validRecords.reduce((sum, r) => sum + (r.evaluation?.score || 10), 0) / count);
    const avgRelevance = Math.round(validRecords.reduce((sum, r) => sum + (r.evaluation?.relevanceScore || 10), 0) / count);
    const avgCompleteness = Math.round(validRecords.reduce((sum, r) => sum + (r.evaluation?.completenessScore || 10), 0) / count);
    const avgCommunication = Math.round(validRecords.reduce((sum, r) => sum + (r.evaluation?.communicationScore || 10), 0) / count);

    // Compute technical and problem solving scores accurately based on actual performance (no inflated minimum floor)
    const technicalScore = Math.min(98, Math.max(5, Math.round(avgRelevance * 0.95 + avgCompleteness * 0.05)));
    const problemSolvingScore = Math.min(98, Math.max(5, Math.round(avgCompleteness * 0.9 + avgRelevance * 0.1)));
    const confidenceScore = Math.min(98, Math.max(5, Math.round(avgCommunication * 0.9 + avgOverall * 0.1)));

    // Extract collective strengths and improvements
    const strengthsSet = new Set<string>();
    const improvementsSet = new Set<string>();
    const missingPointsSet = new Set<string>();

    validRecords.forEach((r) => {
      r.evaluation?.goodPoints.forEach((p) => strengthsSet.add(p));
      r.evaluation?.improvementPoints.forEach((p) => improvementsSet.add(p));
      r.evaluation?.missingKeyPoints.forEach((m) => missingPointsSet.add(m));
    });

    const strengths = Array.from(strengthsSet).slice(0, 4);
    if (strengths.length === 0) {
      strengths.push('Candidate attempted questions under timed simulation conditions.', 'Clear verbal engagement throughout the session.');
    }

    const areasForImprovement = Array.from(improvementsSet).slice(0, 4);
    if (areasForImprovement.length === 0) {
      areasForImprovement.push(
        'Study the provided Model Answers before real technical rounds.',
        'Incorporate the STAR methodology (Situation, Task, Action, Result) into every answer.',
        'Address the core technical mechanisms directly rather than speaking generally.'
      );
    }

    const skillsToImprove = Array.from(missingPointsSet).slice(0, 3);
    if (skillsToImprove.length === 0) {
      skillsToImprove.push(`Core ${config.roleTitle} technical fundamentals`, 'Systematic trade-off articulation', 'Concise behavioral storytelling');
    }

    const recommendedNextSteps = [
      `Review the Model Answers from this session for questions scoring under 60.`,
      `Practice 2 more mock sessions focusing specifically on ${config.roleTitle} (${config.difficulty}) scenarios.`,
      'Formulate bullet-point cheat sheets covering architectural trade-offs and latency implications.',
    ];

    return {
      id: 'session-' + Date.now(),
      date: new Date().toISOString(),
      config,
      records,
      overallScore: avgOverall,
      relevanceScore: avgRelevance,
      completenessScore: avgCompleteness,
      communicationScore: avgCommunication,
      technicalScore,
      problemSolvingScore,
      confidenceScore,
      strengths,
      areasForImprovement,
      skillsToImprove,
      recommendedNextSteps,
      durationSeconds,
    };
  },
};

// ----------------- LOCAL CURATED ENGINES -----------------

function getCuratedQuestions(config: InterviewConfig, resumeProfile: ResumeProfile | null): InterviewQuestion[] {
  const roleKey = config.roleId in CURATED_QUESTIONS ? config.roleId : 'frontend-dev';
  const rolePool = CURATED_QUESTIONS[roleKey];

  let selected: InterviewQuestion[] = [];

  if (config.type === 'Mixed') {
    const tech = rolePool.Technical || [];
    const behav = rolePool.Behavioral || [];
    const hr = rolePool.HR || [];
    selected = [...tech.slice(0, 3), ...behav.slice(0, 1), ...hr.slice(0, 1)];
  } else if (config.type in rolePool) {
    selected = [...rolePool[config.type]];
  } else {
    selected = [...(rolePool.Technical || [])];
  }

  // Personalize first question if resume has specific skills
  if (resumeProfile && resumeProfile.skills.length > 0 && selected.length > 0) {
    const topSkill = resumeProfile.skills[0];
    selected[0] = {
      ...selected[0],
      questionText: `I noticed your resume highlights experience with ${topSkill}. Could you walk me through how you’ve utilized ${topSkill} in a recent project and a specific technical challenge you overcame?`,
      hint: `Reference your project at ${resumeProfile.candidateName ? 'your previous role' : 'your experience'} and follow the STAR framework.`,
      expectedKeyPoints: [`Concrete ${topSkill} application`, 'Architecture challenge encountered', 'Measurable outcome/result'],
      modelAnswer: `In my recent project, I utilized ${topSkill} to build and maintain high-performance product features. One specific challenge was optimizing throughput and state synchronization under high data volume. By diagnosing latency bottlenecks and restructuring our module architecture with ${topSkill}, we reduced processing delays by 40% and improved test coverage to over 85%.`,
    };
  }

  // If question count needed is larger than pool, duplicate with variant prompts
  while (selected.length < config.questionCount) {
    const index = selected.length + 1;
    selected.push({
      id: 900 + index,
      questionText: `In a ${config.difficulty} ${config.roleTitle} position, how do you handle unexpected production bugs or performance bottlenecks?`,
      category: 'Problem Solving & Edge Cases',
      difficulty: config.difficulty,
      type: 'Technical',
      hint: 'Outline your triage sequence: reproduction, logging, root cause analysis, and post-incident regression tests.',
      expectedKeyPoints: ['Calm diagnostic triage', 'Root cause isolation', 'Automated regression testing'],
      modelAnswer: 'My triage workflow follows 4 stages: First, reproduction and isolation using APM logs and error tracking. Second, mitigation via feature flag or rapid rollback to safeguard user uptime. Third, root cause analysis and a clean patch. Finally, adding an automated integration test in CI to permanently prevent regression.',
    });
  }

  return selected.slice(0, config.questionCount);
}

/**
 * High-accuracy local STAR evaluator with strict scoring calibration:
 * - "I don't know" or skips: 5 - 15 marks
 * - Factually wrong / off-topic / gibberish: 10 - 25 marks
 * - Partially correct: 35 - 55 marks
 * - Competent answers: 70 - 85 marks
 * - Comprehensive answers: 86 - 98 marks
 */
function evaluateAnswerLocally(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  _resumeProfile: ResumeProfile | null
): AnswerEvaluation {
  const cleanAnswer = answerText.trim();
  const lowerAnswer = cleanAnswer.toLowerCase();
  const words = cleanAnswer ? cleanAnswer.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const defaultModelAnswer =
    question.modelAnswer ||
    `A comprehensive answer should define the fundamental concept (${(question.expectedKeyPoints || []).slice(0, 2).join(', ')}), describe how it works under the hood, and illustrate with a real-world scenario following the STAR framework.`;

  // 1. Check for "I Don't Know" or admission of no knowledge
  const dontKnowPhrases = [
    "don't know", "dont know", "do not know", "no idea", "not sure",
    "idk", "no clue", "haven't learned", "haven't studied", "have no idea",
    "cannot answer", "can't answer", "don't understand", "not familiar",
    "no experience with", "i forgot", "forgotten", "skip this", "pass this",
    "don't remember", "dont remember", "did not learn", "never worked with",
    "don't have any idea", "show me answer", "show answer", "solution please",
    "no answer", "skip"
  ];

  const isDontKnow =
    cleanAnswer.startsWith('[Candidate requested solution') ||
    dontKnowPhrases.some((phrase) => lowerAnswer.includes(phrase));

  if (isDontKnow) {
    return {
      questionId: question.id,
      score: 10,
      relevanceScore: 10,
      completenessScore: 5,
      communicationScore: 35, // Modest communication points for honest self-assessment
      verdict: 'unknown',
      goodPoints: ['Honest candidate self-assessment regarding unfamiliarity with this topic.'],
      improvementPoints: [
        'Candidate indicated they do not know the answer to this question.',
        `Review the core principles of ${question.category} prior to actual technical rounds.`,
        'Carefully study the Model Answer provided below.',
      ],
      missingKeyPoints: question.expectedKeyPoints || ['Core concept definitions', 'Implementation mechanics'],
      suggestedAnswer: defaultModelAnswer,
      actionableTip: 'In real interviews, even if unsure, walk through your initial intuition or mention adjacent tools rather than saying "I don\'t know".',
    };
  }

  // 2. Extreme brevity handling (< 8 words)
  if (wordCount < 8) {
    return {
      questionId: question.id,
      score: 20,
      relevanceScore: 20,
      completenessScore: 15,
      communicationScore: 25,
      verdict: 'incorrect',
      goodPoints: ['Attempted to provide a response.'],
      improvementPoints: [
        'The answer was far too brief (under 8 words) to assess technical competence.',
        'Provide a structured explanation using specific technical terminology.',
      ],
      missingKeyPoints: question.expectedKeyPoints || ['Core architectural principle', 'Concrete project implementation example'],
      suggestedAnswer: defaultModelAnswer,
      actionableTip: 'Aim for at least 4-5 sentences (60 to 100 words) to thoroughly demonstrate depth.',
    };
  }

  // 3. Expected Key Points Matching
  const expectedPoints = question.expectedKeyPoints || [];
  const matchedPoints: string[] = [];
  const unmatchedPoints: string[] = [];

  expectedPoints.forEach((point) => {
    const keywords = point.toLowerCase().split(/[\s,/-]+/).filter((w) => w.length > 3);
    const hasMatch = keywords.some((kw) => lowerAnswer.includes(kw));
    if (hasMatch) {
      matchedPoints.push(point);
    } else {
      unmatchedPoints.push(point);
    }
  });

  // Check relevance to question text keywords
  const questionKeywords = (question.questionText + ' ' + question.category)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['what', 'when', 'where', 'which', 'explain', 'describe', 'would', 'could', 'about', 'your', 'with', 'this', 'that', 'have', 'from'].includes(w));

  const matchedQuestionWords = questionKeywords.filter((kw) => lowerAnswer.includes(kw));

  // 4. FACTUALLY WRONG / OFF-TOPIC CHECK:
  // If no expected points match AND zero question keywords match, the answer is completely off-topic or wrong!
  if (matchedPoints.length === 0 && matchedQuestionWords.length === 0) {
    return {
      questionId: question.id,
      score: 15,
      relevanceScore: 10,
      completenessScore: 15,
      communicationScore: 25,
      verdict: 'incorrect',
      goodPoints: ['Spoke in full sentences.'],
      improvementPoints: [
        'The answer provided appears to be factually incorrect or completely off-topic.',
        `The response did not address any core concepts of "${question.category}".`,
        'Study the correct Model Answer below to learn the required technical concepts.',
      ],
      missingKeyPoints: expectedPoints.length > 0 ? expectedPoints : ['Fundamental concept definition'],
      suggestedAnswer: defaultModelAnswer,
      actionableTip: 'Listen carefully to the question keywords. If unfamiliar, ask clarifying questions rather than speaking off-topic.',
    };
  }

  // 5. Shallow attempt check (no keypoints matched, but touched on generic question word)
  if (matchedPoints.length === 0 && matchedQuestionWords.length > 0) {
    return {
      questionId: question.id,
      score: 30,
      relevanceScore: 35,
      completenessScore: 25,
      communicationScore: 40,
      verdict: 'partial',
      goodPoints: ['Mentioned the broad subject of the question.'],
      improvementPoints: [
        'Answer lacked essential technical depth and missed all key mechanics.',
        `Missing critical points: ${unmatchedPoints.slice(0, 2).join(', ')}.`,
      ],
      missingKeyPoints: expectedPoints,
      suggestedAnswer: defaultModelAnswer,
      actionableTip: 'Explain "how" and "why" things work under the hood, not just what they are called.',
    };
  }

  // 6. Partial to Strong Answer Scoring
  const keypointCoverage = expectedPoints.length > 0 ? matchedPoints.length / expectedPoints.length : 0.6;

  const starIndicators = [
    'situation', 'task', 'action', 'result', 'because', 'for example',
    'specifically', 'implemented', 'designed', 'optimized', 'reduced',
    'increased', 'architected', 'trade-off', 'latency', 'performance',
    'solution', 'challenge', 'outcome'
  ];
  const matchedStar = starIndicators.filter((w) => lowerAnswer.includes(w));

  // Base score calculated from actual keypoint coverage
  // 1 keypoint matched out of 3 = 45 base, 2 out of 3 = 70 base, 3 out of 3 = 85 base
  let calculatedScore = Math.round(35 + keypointCoverage * 50);
  const depthBonus = Math.min(8, Math.floor(wordCount / 12));
  const starBonus = Math.min(6, matchedStar.length * 1.5);
  calculatedScore += depthBonus + starBonus;

  const finalScore = Math.min(97, Math.max(30, calculatedScore));
  const relevance = Math.min(98, Math.max(25, Math.round(30 + keypointCoverage * 60)));
  const completeness = Math.min(98, Math.max(20, Math.round(25 + keypointCoverage * 55 + (wordCount >= 50 ? 15 : 0))));
  const communication = Math.min(98, Math.max(35, Math.round((relevance + completeness) / 2 + (matchedStar.length > 1 ? 5 : 0))));

  const verdict = finalScore >= 70 ? 'correct' : finalScore >= 45 ? 'partial' : 'incorrect';

  const goodPoints: string[] = [];
  if (matchedPoints.length > 0) {
    goodPoints.push(`Strong coverage of key concepts: ${matchedPoints.slice(0, 2).join(', ')}.`);
  }
  if (wordCount >= 50) {
    goodPoints.push('Substantial response length showing willingness to elaborate on technical details.');
  }
  if (matchedStar.length >= 2) {
    goodPoints.push('Utilized structured analytical phrasing to explain implementation decisions.');
  }

  const improvementPoints: string[] = [];
  if (unmatchedPoints.length > 0) {
    improvementPoints.push(`Could articulate depth regarding: ${unmatchedPoints.slice(0, 2).join(', ')}.`);
  }
  if (wordCount < 40) {
    improvementPoints.push('Expand your explanation with a specific past project scenario to anchor credibility.');
  }
  if (!lowerAnswer.includes('trade-off') && !lowerAnswer.includes('alternative') && config.difficulty !== 'Beginner') {
    improvementPoints.push('Discuss engineering trade-offs (e.g. latency vs. memory, or development speed vs. maintainability).');
  }

  return {
    questionId: question.id,
    score: finalScore,
    relevanceScore: relevance,
    completenessScore: completeness,
    communicationScore: communication,
    verdict,
    goodPoints: goodPoints.length > 0 ? goodPoints : ['Attempted response'],
    improvementPoints: improvementPoints.length > 0 ? improvementPoints : ['Review model answer for further polish.'],
    missingKeyPoints: unmatchedPoints.length > 0 ? unmatchedPoints : ['None - Comprehensive coverage'],
    suggestedAnswer: defaultModelAnswer,
    actionableTip: 'Structure answers using the STAR method (Situation, Task, Action, Result) to maximize impact.',
  };
}

// ----------------- GEMINI INTEGRATION -----------------

async function fetchQuestionsFromGemini(
  config: InterviewConfig,
  resumeProfile: ResumeProfile | null,
  apiKey: string,
  model = 'gemini-2.5-flash'
): Promise<InterviewQuestion[] | null> {
  const selectedModel = model || 'gemini-2.5-flash';
  const prompt = `You are an expert executive technical hiring manager interviewing for a ${config.difficulty} ${config.roleTitle} role.
Candidate Resume Skills: ${resumeProfile ? resumeProfile.skills.join(', ') : 'Not provided'}.
Interview Type: ${config.type}.
Custom Job Description: ${config.customJobDescription || 'Standard industry requirements'}.
Generate exactly ${config.questionCount} interview questions.

Return a valid JSON array of objects with this schema:
[
  {
    "id": 1,
    "questionText": "...",
    "category": "...",
    "difficulty": "${config.difficulty}",
    "type": "${config.type}",
    "hint": "...",
    "expectedKeyPoints": ["point 1", "point 2"],
    "modelAnswer": "Comprehensive senior-level answer...",
    "whyAsked": "Why interviewers ask this..."
  }
]
Do not wrap in markdown quotes, output pure JSON only.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return cleanJsonParse(text);
}

async function evaluateAnswerWithGemini(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  apiKey: string,
  model = 'gemini-2.5-flash'
): Promise<AnswerEvaluation | null> {
  const selectedModel = model || 'gemini-2.5-flash';
  const prompt = `You are a strict, fair technical interviewer evaluating a candidate for a ${config.difficulty} ${config.roleTitle} role.
Question: "${question.questionText}"
Candidate's Answer: "${answerText}"

STRICT SCORING RULES:
1. If the candidate says "I don't know", "no idea", "not sure", or skips: Score MUST be 5-15/100. Verdict: "unknown".
2. If the answer is factually incorrect, wrong, or off-topic: Score MUST be 10-25/100. Verdict: "incorrect". Explain clearly why it is wrong.
3. If the answer is partial/shallow with large omissions: Score MUST be 30-55/100. Verdict: "partial".
4. If the answer is good and covers core points: Score 70-85/100. Verdict: "correct".
5. If the answer is exceptional with edge cases & trade-offs: Score 86-98/100. Verdict: "correct".
NEVER award high scores to wrong or "don't know" answers.

Return a valid JSON object matching:
{
  "questionId": ${question.id},
  "score": 85,
  "relevanceScore": 88,
  "completenessScore": 82,
  "communicationScore": 86,
  "verdict": "correct",
  "goodPoints": ["strong point 1"],
  "improvementPoints": ["area to improve 1"],
  "missingKeyPoints": ["key technical point not mentioned"],
  "suggestedAnswer": "A concise model answer...",
  "actionableTip": "One high-leverage practice tip"
}
Do not wrap in markdown quotes, output pure JSON.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini evaluation error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return cleanJsonParse(text);
}

function cleanJsonParse(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(cleaned);
}

// ----------------- OPENAI (CHATGPT) INTEGRATION -----------------

async function fetchQuestionsFromOpenAI(
  config: InterviewConfig,
  resumeProfile: ResumeProfile | null,
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<InterviewQuestion[] | null> {
  const prompt = `Generate ${config.questionCount} interview questions for a ${config.difficulty} ${config.roleTitle} role (${config.type}).
Candidate skills: ${resumeProfile ? resumeProfile.skills.join(', ') : 'General'}.
Output a JSON array:
[
  {
    "id": 1,
    "questionText": "...",
    "category": "...",
    "difficulty": "${config.difficulty}",
    "type": "${config.type}",
    "hint": "...",
    "expectedKeyPoints": ["point 1", "point 2"],
    "modelAnswer": "...",
    "whyAsked": "..."
  }
]`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an executive interviewer outputting pure JSON array.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) return null;
  const parsed = cleanJsonParse(rawContent);
  return Array.isArray(parsed) ? parsed : parsed.questions || null;
}

async function evaluateAnswerWithOpenAI(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<AnswerEvaluation | null> {
  const prompt = `Strictly evaluate candidate's answer for ${config.difficulty} ${config.roleTitle}.
Question: "${question.questionText}"
Candidate's Answer: "${answerText}"

SCORING RULES:
- "I don't know" or skips: 5-15/100, verdict: "unknown".
- Wrong/off-topic answer: 10-25/100, verdict: "incorrect". Explain why it is wrong.
- Partial answer: 35-55/100, verdict: "partial".
- Good answer: 70-85/100, verdict: "correct".
- Comprehensive: 86-98/100, verdict: "correct".

Return JSON matching:
{
  "questionId": ${question.id},
  "score": 85,
  "relevanceScore": 88,
  "completenessScore": 82,
  "communicationScore": 86,
  "verdict": "correct",
  "goodPoints": ["point 1"],
  "improvementPoints": ["point 1"],
  "missingKeyPoints": ["point 1"],
  "suggestedAnswer": "model answer...",
  "actionableTip": "tip..."
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview evaluator outputting pure JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  return rawContent ? cleanJsonParse(rawContent) : null;
}

// ----------------- xAI (GROK) INTEGRATION -----------------

async function fetchQuestionsFromGrok(
  config: InterviewConfig,
  resumeProfile: ResumeProfile | null,
  apiKey: string,
  model = 'grok-2-latest'
): Promise<InterviewQuestion[] | null> {
  const prompt = `Generate ${config.questionCount} interview questions for a ${config.difficulty} ${config.roleTitle} role.
Candidate skills: ${resumeProfile ? resumeProfile.skills.join(', ') : 'General'}.
Output pure JSON array with id, questionText, category, difficulty, type, hint, expectedKeyPoints, modelAnswer, whyAsked.`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'grok-2-latest',
      messages: [
        { role: 'system', content: 'You are an interview system returning JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Grok HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) return null;
  const parsed = cleanJsonParse(rawContent);
  return Array.isArray(parsed) ? parsed : parsed.questions || null;
}

async function evaluateAnswerWithGrok(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  apiKey: string,
  model = 'grok-2-latest'
): Promise<AnswerEvaluation | null> {
  const prompt = `Evaluate candidate's answer for ${config.difficulty} ${config.roleTitle}.
Question: "${question.questionText}"
Candidate's Answer: "${answerText}"

SCORING RULES:
- "I don't know": 5-15/100, verdict: "unknown".
- Wrong/off-topic: 10-25/100, verdict: "incorrect". Explain why.
- Partial: 35-55/100, verdict: "partial".
- Good: 70-85/100, verdict: "correct".

Return pure JSON matching:
{
  "questionId": ${question.id},
  "score": 85,
  "relevanceScore": 88,
  "completenessScore": 82,
  "communicationScore": 86,
  "verdict": "correct",
  "goodPoints": ["point 1"],
  "improvementPoints": ["point 1"],
  "missingKeyPoints": ["point 1"],
  "suggestedAnswer": "model answer...",
  "actionableTip": "tip..."
}`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'grok-2-latest',
      messages: [
        { role: 'system', content: 'You are an interview evaluator returning JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Grok HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  return rawContent ? cleanJsonParse(rawContent) : null;
}

// ----------------- ANTHROPIC (CLAUDE) INTEGRATION -----------------

async function fetchQuestionsFromAnthropic(
  config: InterviewConfig,
  resumeProfile: ResumeProfile | null,
  apiKey: string,
  model = 'claude-3-5-haiku-20241022'
): Promise<InterviewQuestion[] | null> {
  const prompt = `Generate ${config.questionCount} interview questions for a ${config.difficulty} ${config.roleTitle} role.
Candidate skills: ${resumeProfile ? resumeProfile.skills.join(', ') : 'General'}.
Return pure JSON array with id, questionText, category, difficulty, type, hint, expectedKeyPoints, modelAnswer, whyAsked.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic HTTP ${response.status}`);
  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) return null;
  const parsed = cleanJsonParse(text);
  return Array.isArray(parsed) ? parsed : parsed.questions || null;
}

async function evaluateAnswerWithAnthropic(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  apiKey: string,
  model = 'claude-3-5-haiku-20241022'
): Promise<AnswerEvaluation | null> {
  const prompt = `Evaluate answer for ${config.difficulty} ${config.roleTitle}.
Question: "${question.questionText}"
Candidate Answer: "${answerText}"

SCORING RULES:
- "I don't know": 5-15/100, verdict: "unknown".
- Wrong/off-topic: 10-25/100, verdict: "incorrect". Explain why.
- Partial: 35-55/100, verdict: "partial".
- Good: 70-85/100, verdict: "correct".

Return pure JSON matching:
{
  "questionId": ${question.id},
  "score": 85,
  "relevanceScore": 88,
  "completenessScore": 82,
  "communicationScore": 86,
  "verdict": "correct",
  "goodPoints": ["point 1"],
  "improvementPoints": ["point 1"],
  "missingKeyPoints": ["point 1"],
  "suggestedAnswer": "model answer...",
  "actionableTip": "tip..."
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic HTTP ${response.status}`);
  const data = await response.json();
  const text = data.content?.[0]?.text;
  return text ? cleanJsonParse(text) : null;
}

// ----------------- DEEPSEEK INTEGRATION -----------------

async function fetchQuestionsFromDeepSeek(
  config: InterviewConfig,
  resumeProfile: ResumeProfile | null,
  apiKey: string,
  model = 'deepseek-chat'
): Promise<InterviewQuestion[] | null> {
  const prompt = `Generate ${config.questionCount} interview questions for ${config.difficulty} ${config.roleTitle} role.
Candidate skills: ${resumeProfile ? resumeProfile.skills.join(', ') : 'General'}.
Output pure JSON array:
[
  {
    "id": 1,
    "questionText": "...",
    "category": "...",
    "difficulty": "${config.difficulty}",
    "type": "${config.type}",
    "hint": "...",
    "expectedKeyPoints": ["point 1", "point 2"],
    "modelAnswer": "...",
    "whyAsked": "..."
  }
]`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an interview manager outputting pure JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) return null;
  const parsed = cleanJsonParse(rawContent);
  return Array.isArray(parsed) ? parsed : parsed.questions || null;
}

async function evaluateAnswerWithDeepSeek(
  question: InterviewQuestion,
  answerText: string,
  config: InterviewConfig,
  apiKey: string,
  model = 'deepseek-chat'
): Promise<AnswerEvaluation | null> {
  const prompt = `Evaluate candidate's answer for a ${config.difficulty} ${config.roleTitle} role.
Question: "${question.questionText}"
Candidate's Answer: "${answerText}"

SCORING RULES:
- "I don't know" or skips: 5-15/100, verdict: "unknown".
- Wrong/off-topic answer: 10-25/100, verdict: "incorrect". Explain why.
- Partial answer: 35-55/100, verdict: "partial".
- Good answer: 70-85/100, verdict: "correct".
- Comprehensive: 86-98/100, verdict: "correct".

Return pure JSON:
{
  "questionId": ${question.id},
  "score": 85,
  "relevanceScore": 88,
  "completenessScore": 82,
  "communicationScore": 86,
  "verdict": "correct",
  "goodPoints": ["point 1"],
  "improvementPoints": ["point 1"],
  "missingKeyPoints": ["point 1"],
  "suggestedAnswer": "model answer...",
  "actionableTip": "tip..."
}`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an interview evaluator outputting pure JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  return rawContent ? cleanJsonParse(rawContent) : null;
}
