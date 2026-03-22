// Interview Prep Data: DSA Algorithms + MERN Q&A + Core CS (OS, DBMS, CN, OOP)

// ─── DSA ALGORITHM HINTS ─────────────────────────────────────────────────────
export const DSA_INTERVIEW = [
  {
    topic: 'Arrays & Hashing',
    questions: [
      { id: 'dsa1', q: 'Two Sum', hint: 'Use a hashmap: for each num, check if (target - num) exists in map. O(n).', tag: 'easy' },
      { id: 'dsa2', q: 'Contains Duplicate', hint: 'Add to a Set; if already present it\'s a duplicate. O(n) space. Or sort + adjacent check O(n log n) O(1) space.', tag: 'easy' },
      { id: 'dsa3', q: 'Product of Array Except Self', hint: 'Two-pass prefix/suffix product arrays. No division. O(n) time O(1) extra.', tag: 'medium' },
      { id: 'dsa4', q: 'Group Anagrams', hint: 'Sort each word as key, group into a map. O(n k log k).', tag: 'medium' },
      { id: 'dsa5', q: 'Top K Frequent Elements', hint: 'Use frequency count + bucket sort (index = freq). O(n).', tag: 'medium' },
      { id: 'dsa6', q: 'Longest Consecutive Sequence', hint: 'Put all nums in a Set. Only start counting from n where n-1 not in Set.', tag: 'medium' },
    ],
  },
  {
    topic: 'Two Pointers',
    questions: [
      { id: 'dsa7', q: 'Valid Palindrome', hint: 'Left + right pointers, skip non-alphanumeric, compare lowercase.', tag: 'easy' },
      { id: 'dsa8', q: '3Sum', hint: 'Sort, fix one pointer, two-pointer scan. Skip duplicates carefully.', tag: 'medium' },
      { id: 'dsa9', q: 'Container With Most Water', hint: 'Greedy two pointers. Move the shorter side inward.', tag: 'medium' },
      { id: 'dsa10', q: 'Trapping Rain Water', hint: 'Precompute maxLeft[] and maxRight[], min(maxL, maxR) - height[i].', tag: 'hard' },
    ],
  },
  {
    topic: 'Sliding Window',
    questions: [
      { id: 'dsa11', q: 'Longest Substring Without Repeating', hint: 'Expand right, shrink left when duplicate found. HashMap tracks last index.', tag: 'medium' },
      { id: 'dsa12', q: 'Minimum Window Substring', hint: 'Two hashmaps (have/need), expand right, shrink left when valid window found.', tag: 'hard' },
      { id: 'dsa13', q: 'Best Time to Buy and Sell Stock', hint: 'Track minPrice so far, compute profit at each step. O(n).', tag: 'easy' },
      { id: 'dsa14', q: 'Longest Repeating Character Replacement', hint: 'Window valid if: window size - max freq ≤ k. Expand right, shrink left.', tag: 'medium' },
    ],
  },
  {
    topic: 'Stack',
    questions: [
      { id: 'dsa15', q: 'Valid Parentheses', hint: 'Push opens, pop on close and check match. If stack empty on close → invalid.', tag: 'easy' },
      { id: 'dsa16', q: 'Min Stack', hint: 'Two stacks: main + minStack. Push current min alongside each value.', tag: 'medium' },
      { id: 'dsa17', q: 'Daily Temperatures', hint: 'Monotonic decreasing stack. Pop when warmer day found, compute days gap.', tag: 'medium' },
      { id: 'dsa18', q: 'Largest Rectangle in Histogram', hint: 'Monotonic increasing stack. When bar decreases, pop and compute area.', tag: 'hard' },
    ],
  },
  {
    topic: 'Binary Search',
    questions: [
      { id: 'dsa19', q: 'Binary Search', hint: 'mid = lo + (hi - lo) / 2. Adjust lo/hi based on comparison.', tag: 'easy' },
      { id: 'dsa20', q: 'Search in Rotated Sorted Array', hint: 'Identify which half is sorted, check if target lies in it. Otherwise search other half.', tag: 'medium' },
      { id: 'dsa21', q: 'Find Minimum in Rotated Array', hint: 'Binary search on the rotation. Minimum is at the inflection point.', tag: 'medium' },
      { id: 'dsa22', q: 'Median of Two Sorted Arrays', hint: 'Binary search on smaller array. Partition such that max(left) ≤ min(right).', tag: 'hard' },
    ],
  },
  {
    topic: 'Linked List',
    questions: [
      { id: 'dsa23', q: 'Reverse Linked List', hint: 'Three pointers: prev, curr, next. Iterative is O(1) space.', tag: 'easy' },
      { id: 'dsa24', q: 'Detect Cycle', hint: 'Floyd\'s algorithm: slow (1 step) and fast (2 steps). Meet = cycle exists.', tag: 'medium' },
      { id: 'dsa25', q: 'Merge Two Sorted Lists', hint: 'Dummy head pointer. Compare heads, attach smaller, advance.', tag: 'easy' },
      { id: 'dsa26', q: 'LRU Cache', hint: 'HashMap + Doubly Linked List. O(1) get/put. Move to front on access.', tag: 'medium' },
    ],
  },
  {
    topic: 'Trees & Graphs',
    questions: [
      { id: 'dsa27', q: 'Invert Binary Tree', hint: 'Recursively swap left and right at every node.', tag: 'easy' },
      { id: 'dsa28', q: 'Level Order Traversal (BFS)', hint: 'Queue-based BFS. Process level by level, track level size.', tag: 'medium' },
      { id: 'dsa29', q: 'Lowest Common Ancestor', hint: 'If root is null or equals p or q, return root. LCA is where left and right both return non-null.', tag: 'medium' },
      { id: 'dsa30', q: 'Number of Islands', hint: 'DFS/BFS from each unvisited \'1\', mark visited. Count DFS calls.', tag: 'medium' },
      { id: 'dsa31', q: 'Clone Graph', hint: 'HashMap<Node, Node> for cloned nodes. BFS/DFS to clone neighbors.', tag: 'medium' },
      { id: 'dsa32', q: 'Course Schedule (Cycle Detection)', hint: 'Topological sort / DFS with visiting/visited states. Cycle = not all nodes finish.', tag: 'medium' },
    ],
  },
  {
    topic: 'Dynamic Programming',
    questions: [
      { id: 'dsa33', q: 'Climbing Stairs', hint: 'dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2.', tag: 'easy' },
      { id: 'dsa34', q: 'House Robber', hint: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', tag: 'medium' },
      { id: 'dsa35', q: 'Longest Common Subsequence', hint: '2D DP. dp[i][j] = 1 + dp[i-1][j-1] if match, else max(dp[i-1][j], dp[i][j-1]).', tag: 'medium' },
      { id: 'dsa36', q: 'Coin Change', hint: 'dp[amount] = min coins. For each coin: dp[i] = min(dp[i], dp[i - coin] + 1). Bottom-up.', tag: 'medium' },
      { id: 'dsa37', q: '0/1 Knapsack', hint: '2D dp[i][w]: choose to include item i or not. dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]).', tag: 'medium' },
    ],
  },
];

// ─── MERN INTERVIEW Q&A ──────────────────────────────────────────────────────
export const MERN_INTERVIEW = [
  {
    category: 'React',
    questions: [
      { id: 'm1', q: 'What is the Virtual DOM?', a: 'A lightweight in-memory representation of the real DOM. React diffs old vs new (reconciliation), updates only changed nodes.' },
      { id: 'm2', q: 'useState vs useReducer', a: 'useState for simple local state. useReducer for complex state logic, multiple sub-values, or when next state depends on previous state.' },
      { id: 'm3', q: 'useEffect dependency array', a: 'Empty [] = runs once on mount. [val] = runs when val changes. No array = runs after every render. Return cleanup function for unmount.' },
      { id: 'm4', q: 'useMemo vs useCallback', a: 'useMemo memorizes a computed value. useCallback memorizes a function reference. Use both to avoid unnecessary re-renders. useCallback for functions, useMemo for expensive calculations.' },
      { id: 'm5', q: 'What is prop drilling and how do you fix it?', a: 'Passing props through many intermediate layers. Fix: useContext (for global state) or Redux/Zustand (for large apps).' },
      { id: 'm6', q: 'React component lifecycle (hooks)', a: 'Mount → useEffect([]), Update → useEffect([dep]), Unmount → cleanup function returned from useEffect.' },
      { id: 'm7', q: 'Controlled vs Uncontrolled components', a: 'Controlled: form value managed by state (onChange + value). Uncontrolled: value managed by DOM using refs.' },
      { id: 'm8', q: 'What is React.memo?', a: 'HOC that prevents re-render if props haven\'t changed. Like shouldComponentUpdate for function components.' },
    ],
  },
  {
    category: 'Node.js & Express',
    questions: [
      { id: 'm9', q: 'What is the Event Loop?', a: 'Node\'s mechanism for handling async operations. Call stack runs sync code, event loop pushes async callbacks (timers, I/O, promises) when stack is empty.' },
      { id: 'm10', q: 'What are middleware functions in Express?', a: 'Functions with (req, res, next) signature. Run in sequence. Used for auth, logging, validation, error handling. Call next() to pass to the next middleware.' },
      { id: 'm11', q: 'JWT Authentication flow', a: '1. User logs in → server verifies credentials → creates signed JWT. 2. Client stores JWT (localStorage/cookie). 3. Client sends JWT in Authorization header. 4. Server verifies signature on every protected route.' },
      { id: 'm12', q: 'What is CORS and how do you configure it?', a: 'Cross-Origin Resource Sharing. Browser blocks requests from different origins. Fix: use cors() middleware in Express, specify allowed origins, methods, and headers.' },
      { id: 'm13', q: 'Async/await vs Promises vs Callbacks', a: 'Callbacks → Promises (then/catch) → async/await (syntactic sugar over Promises). async/await is cleanest and most readable. All are non-blocking.' },
      { id: 'm14', q: 'What is process.env and why use it?', a: 'Stores environment variables (secrets, config) outside code. Prevents hardcoding passwords/keys. Use dotenv package to load .env file.' },
    ],
  },
  {
    category: 'MongoDB',
    questions: [
      { id: 'm15', q: 'SQL vs NoSQL — when to use MongoDB?', a: 'SQL: structured data, complex relations, ACID transactions. MongoDB: flexible schema, hierarchical data, fast reads, horizontal scaling, JSON-like documents.' },
      { id: 'm16', q: 'What is Mongoose and why use it?', a: 'ODM (Object Document Mapper) for MongoDB. Provides schema validation, middleware hooks (pre/post save), virtual fields, and a cleaner API over raw MongoDB driver.' },
      { id: 'm17', q: 'Indexing in MongoDB', a: 'Indexes speed up queries. Without index, MongoDB does a full collection scan. Use createIndex() for frequently queried fields. Trade-off: faster reads, slower writes.' },
      { id: 'm18', q: 'MongoDB aggregation pipeline', a: 'Chain of stages that transform documents: $match (filter), $group (aggregate), $project (select fields), $sort, $limit. Like SQL GROUP BY + SELECT.' },
      { id: 'm19', q: 'One-to-many relationships in MongoDB', a: 'Option 1: Embed documents (good for small arrays, frequently read together). Option 2: Reference by ObjectId (good for large arrays or independent access).' },
    ],
  },
  {
    category: 'REST API Design',
    questions: [
      { id: 'm20', q: 'HTTP methods and their purpose', a: 'GET: read. POST: create. PUT: full update. PATCH: partial update. DELETE: remove. HEAD: like GET but no body. OPTIONS: preflight for CORS.' },
      { id: 'm21', q: 'HTTP status codes — key ones', a: '200 OK. 201 Created. 400 Bad Request. 401 Unauthorized. 403 Forbidden. 404 Not Found. 409 Conflict. 422 Unprocessable. 500 Server Error.' },
      { id: 'm22', q: 'What makes an API RESTful?', a: '1. Stateless. 2. Client-server separation. 3. Uniform interface (resources as URLs). 4. Cacheable. 5. Layered system. Resources identified by URIs, manipulated through representations.' },
      { id: 'm23', q: 'How do you secure a REST API?', a: 'HTTPS always. JWT for auth. Rate limiting (express-rate-limit). Input validation. Helmet.js for security headers. Avoid exposing sensitive data in responses.' },
    ],
  },
];

// ─── CORE CS INTERVIEW Q&A ───────────────────────────────────────────────────
export const CORE_CS_INTERVIEW = [
  {
    category: 'Operating Systems',
    questions: [
      { id: 'os1', q: 'Process vs Thread', a: 'Process: independent execution with its own memory space. Thread: lightweight sub-unit of a process, shares memory with sibling threads. Threads are faster to create/switch.' },
      { id: 'os2', q: 'What is a deadlock? Conditions?', a: 'Deadlock: processes stuck waiting for each other. Conditions (all 4 needed): Mutual exclusion, Hold & Wait, No preemption, Circular wait.' },
      { id: 'os3', q: 'What is virtual memory?', a: 'OS illusion that each process has more memory than physically available. Uses paging/swapping between RAM and disk. Enables program isolation and larger address spaces.' },
      { id: 'os4', q: 'CPU scheduling algorithms', a: 'FCFS (simple, convoy effect), SJF (min average wait, needs burst time), Round Robin (time quantum, fair), Priority (starvation risk), MLFQ (multi-level feedback).' },
      { id: 'os5', q: 'What is a context switch?', a: 'Saving the state (registers, PC, stack) of a running process and loading another. Allows multitasking. Has overhead — too frequent context switches reduce performance.' },
      { id: 'os6', q: 'Mutex vs Semaphore', a: 'Mutex: binary lock, only the owning thread can unlock. Semaphore: signaling mechanism, count-based, any thread can signal. Mutex = ownership, Semaphore = signaling.' },
    ],
  },
  {
    category: 'DBMS',
    questions: [
      { id: 'db1', q: 'ACID properties', a: 'Atomicity (all or nothing), Consistency (valid state before and after), Isolation (transactions don\'t interfere), Durability (committed data survives crashes).' },
      { id: 'db2', q: 'Normalization — 1NF, 2NF, 3NF', a: '1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency. 3NF: 2NF + no transitive dependency. Goal: eliminate redundancy and update anomalies.' },
      { id: 'db3', q: 'What is indexing?', a: 'Data structure (B-tree/hash) that speeds up SELECT queries. Trades write speed for read speed. Primary index on PK, secondary on other columns.' },
      { id: 'db4', q: 'Types of JOINs', a: 'INNER: matching rows only. LEFT: all from left + matching right. RIGHT: all from right + matching left. FULL OUTER: all rows from both. CROSS: cartesian product.' },
      { id: 'db5', q: 'Transaction isolation levels', a: 'Read Uncommitted → Read Committed → Repeatable Read → Serializable. Higher isolation = fewer anomalies but more locking overhead.' },
      { id: 'db6', q: 'What is a foreign key?', a: 'Column that references the primary key of another table. Enforces referential integrity — prevents orphan records. Can have ON DELETE CASCADE or RESTRICT.' },
    ],
  },
  {
    category: 'Computer Networks',
    questions: [
      { id: 'cn1', q: 'OSI Model — 7 layers', a: 'Physical, Data Link, Network, Transport, Session, Presentation, Application. Mnemonic: "Please Do Not Throw Sausage Pizza Away".' },
      { id: 'cn2', q: 'TCP vs UDP', a: 'TCP: reliable, ordered, connection-oriented, slower (handshake). UDP: unreliable, no ordering, connectionless, fast. TCP for web/email, UDP for video/games/DNS.' },
      { id: 'cn3', q: 'What happens when you type a URL?', a: '1. DNS lookup → IP. 2. TCP 3-way handshake. 3. TLS handshake (HTTPS). 4. HTTP GET request. 5. Server responds. 6. Browser parses HTML, fetches CSS/JS. 7. Renders page.' },
      { id: 'cn4', q: 'HTTP vs HTTPS', a: 'HTTP: plaintext, no encryption. HTTPS: HTTP over TLS. Encrypts data in transit using asymmetric (handshake) then symmetric (data) encryption. Port 443 vs 80.' },
      { id: 'cn5', q: 'What is a subnet mask?', a: 'Divides IP into network and host portions. E.g., /24 means first 24 bits = network (255.255.255.0). Subnetting allows splitting a large network into smaller ones.' },
      { id: 'cn6', q: 'What is DNS?', a: 'Domain Name System — translates human-readable domain names (google.com) to IP addresses. Hierarchy: Root → TLD → Authoritative. Cached at OS, router, and ISP levels.' },
    ],
  },
  {
    category: 'OOP Concepts',
    questions: [
      { id: 'oop1', q: 'Four pillars of OOP', a: 'Encapsulation (hide data, expose through methods), Inheritance (reuse code from parent class), Polymorphism (one interface, many behaviors), Abstraction (hide impl, show essentials).' },
      { id: 'oop2', q: 'Abstract class vs Interface (Java)', a: 'Abstract class: can have state, constructors, and partial implementation. Interface: all abstract (pre-Java 8), no state. Class can implement multiple interfaces but extend only one class.' },
      { id: 'oop3', q: 'Method overloading vs overriding', a: 'Overloading: same method name, different parameters, same class — compile-time polymorphism. Overriding: subclass redefines parent method — runtime polymorphism.' },
      { id: 'oop4', q: 'What is a constructor?', a: 'Special method called when an object is created. Same name as class, no return type. Used to initialize object state. Java provides default constructor if none defined.' },
      { id: 'oop5', q: 'SOLID Principles', a: 'S: Single Responsibility. O: Open/Closed. L: Liskov Substitution. I: Interface Segregation. D: Dependency Inversion. These guide maintainable, extensible OOP design.' },
      { id: 'oop6', q: 'What is a design pattern? Name 3.', a: 'Reusable solutions to common design problems. Singleton (one instance), Factory (create objects without specifying class), Observer (publish-subscribe notification).' },
    ],
  },
];
