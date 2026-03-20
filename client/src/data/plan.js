// Frontend plan data — mirrors server/data/plan.js exactly
export const PLAN = [
  {
    week:1, theme:"ARRAYS + STRINGS + APTITUDE BOOT",
    focus:"Zoho/Freshworks pattern: Arrays, Hashing, Two Pointer",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude Warmup — Number Series & Percentages", detail:"IndiaBix: 20 questions timed 15 min. Topics: number series, simple %, profit-loss", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Two Sum + Best Time to Buy & Sell Stock", detail:"LeetCode #1, #121. Master HashMap O(n) approach. Draw out the logic before coding.", time:"6:20–7:30 PM", lc:"LC #1, #121"},
        {tag:"oop", name:"OOP: Classes, Objects, Constructors in Java", detail:"Write Student class with name, cgpa, methods. Understand this keyword, constructor overloading.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"JS Deep Dive: Event Loop + Call Stack", detail:"Namaste JS S2 revision. Draw call stack for a setTimeout + Promise example.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Time, Speed, Distance + Ratios", detail:"PrepInsta: 20 Qs timed. Zoho round 1 heavily tests this. Focus on shortcuts.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Contains Duplicate + Maximum Subarray (Kadane)", detail:"LeetCode #217, #53. Kadane's is a must-know. Write it from scratch without hints.", time:"6:20–7:30 PM", lc:"LC #217, #53"},
        {tag:"oop", name:"OOP: Inheritance — single, multilevel, hierarchical", detail:"Code Animal→Dog→GoldenRetriever chain. Understand super(), method resolution order.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Node.js: Setup + First Express Server", detail:"npm init, install express, create server with 3 routes: /, /about, /api/data", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Logical Reasoning: Seating & Blood Relations", detail:"IndiaBix logical reasoning section. 20 Qs. Common in TCS/Infosys filters.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Product of Array Except Self + Move Zeroes", detail:"LeetCode #238, #283. No division allowed for #238 — prefix/suffix trick.", time:"6:20–7:30 PM", lc:"LC #238, #283"},
        {tag:"oop", name:"OOP: Polymorphism — compile-time vs runtime", detail:"Method overloading vs overriding. Code Shape class with area() overridden in Circle, Rect, Triangle.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Node.js: Middleware + body-parser + Postman testing", detail:"Add 3 middleware functions. Test with Postman GET/POST.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Permutations, Combinations, Probability", detail:"Freshworks and Zoho test P&C heavily. Practice 15 questions.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"3Sum + Container With Most Water", detail:"LeetCode #15, #11. Two pointer mastery. 3Sum: sort first, fix one, two pointer rest.", time:"6:20–7:30 PM", lc:"LC #15, #11"},
        {tag:"theory", name:"DBMS: ER Diagrams, Keys — Primary, Foreign, Candidate, Super", detail:"Draw ER for college DB. Understand entity, attributes, relationships.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"MongoDB: Install + Mongoose connect + first Schema", detail:"Create User schema with name, email, createdAt. Insert and findAll.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Verbal: Reading Comprehension + Synonyms", detail:"Infosys SP verbal section style. 2 passages + 10 vocab Qs.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Trapping Rain Water + Rotate Array", detail:"LeetCode #42, #189. Rain water: two pointer O(n) O(1). Classic hard problem.", time:"6:20–7:30 PM", lc:"LC #42, #189"},
        {tag:"oop", name:"OOP: Abstraction — abstract classes vs interfaces", detail:"Code Flyable, Swimmable interfaces + Duck class implementing both. When to use what?", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"MongoDB: CRUD operations + error handling", detail:"Implement create, read, update, delete with proper try/catch and status codes.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"Full Aptitude Mock — 45 min, 40 questions", detail:"PrepInsta full mock. Quant + Logical + Verbal. Simulate real test conditions.", time:"9:00–9:45 AM", lc:""},
        {tag:"dsa", name:"Sliding Window: Max Sum Subarray of K + Longest no-repeat", detail:"LeetCode #643, #3. Sliding window template. Write a generic solution.", time:"9:45–11:00 AM", lc:"LC #643, #3"},
        {tag:"dsa", name:"Valid Anagram + Group Anagrams + Top K Frequent", detail:"LeetCode #242, #49, #347. HashMap frequency counting pattern.", time:"11:00 AM–12:30 PM", lc:"LC #242, #49, #347"},
        {tag:"project", name:"Deploy Weather App to Vercel", detail:"Clean up code, add loading states, deploy. Add to GitHub + portfolio link.", time:"2:00–4:00 PM", lc:""},
        {tag:"theory", name:"Week 1 Review + Plan Week 2", detail:"Re-solve 2 hardest problems without hints. Update tracker. Note weak spots.", time:"4:00–5:00 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — Arrays timed 45 min", detail:"Pick 1 easy + 1 medium. Speak full solution aloud before typing. State time complexity at end.", time:"9:00–9:45 AM", lc:"LC #1, #15, #238"},
        {tag:"dsa", name:"Weak Drill — re-solve 3 problems you struggled this week", detail:"Open tracker. Pick worst 3 from Week 1. Full solution from scratch. No hints, no copying.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Binary Search — template + 3 problems", detail:"LeetCode #704, #35, #278. Master left/right pointer template. Write it 3 times until natural.", time:"2:00–3:30 PM", lc:"LC #704, #35, #278"},
        {tag:"theory", name:"Plan Week 2 in detail + update tracker", detail:"Write exact problem names for each day. Zero decision-making during the week.", time:"4:00–4:30 PM", lc:""}
      ]}
    ]
  },
  {
    week:2, theme:"STRINGS + HASHING + DEEP OOP",
    focus:"Zoho tests OOP very deeply. Freshworks loves string manipulation.",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Work & Time + Pipes & Cisterns", detail:"Zoho loves these. 20 Qs on IndiaBix. Learn the formula shortcut.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Minimum Window Substring + Longest Palindromic Substring", detail:"LeetCode #76, #5. #76 is hard — take your time. Expand around center for #5.", time:"6:20–7:30 PM", lc:"LC #76, #5"},
        {tag:"oop", name:"OOP: Encapsulation — getters/setters, access modifiers", detail:"BankAccount class: private balance, public deposit/withdraw. Why private fields matter.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Express + MongoDB: Full REST API — User management", detail:"GET /users, POST /users, PUT /users/:id, DELETE /users/:id", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Averages, Mixtures, Allegations", detail:"PrepInsta: 20 Qs. Mixture problems are common in Persistent/TCS.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Find All Anagrams + Permutation in String", detail:"LeetCode #438, #567. Sliding window + character frequency array.", time:"6:20–7:30 PM", lc:"LC #438, #567"},
        {tag:"oop", name:"Java Collections: ArrayList, LinkedList, HashMap, HashSet, TreeMap", detail:"Write 5 mini programs — one per collection. Know time complexities of each.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: Setup + JSX + Props + Components", detail:"Create React app. Build Header, Card, Footer components with props.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Number System: HCF, LCM, Remainders", detail:"IndiaBix number system. 20 Qs. HCF/LCM shortcut methods.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Encode/Decode Strings + Longest Consecutive Sequence", detail:"LeetCode #271, #128. HashSet for O(n) consecutive sequence.", time:"6:20–7:30 PM", lc:"LC #271, #128"},
        {tag:"oop", name:"OOP: Exception Handling — try/catch/finally/throws/custom", detail:"Write custom InsufficientFundsException. Understand checked vs unchecked.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: useState + useEffect + fetch API", detail:"Build a component that fetches GitHub user data and displays it.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Clocks, Calendars, Age Problems", detail:"PrepInsta: 20 Qs. These appear in Infosys and Zoho rounds.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Word Search + Decode Ways", detail:"LeetCode #79, #91. #79 is backtracking — understand DFS on grid.", time:"6:20–7:30 PM", lc:"LC #79, #91"},
        {tag:"theory", name:"DBMS: Normalization — 1NF, 2NF, 3NF, BCNF with examples", detail:"Draw table before/after normalization for a Student-Course-Grade schema.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: React Router v6 — multi-page SPA", detail:"Home, About, Projects, Contact pages with NavLink active styling.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Coding/Decoding + Direction Sense", detail:"Verbal reasoning section. 20 Qs. Common in all campus filters.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Minimum Size Subarray Sum + Subarray Sum Equals K", detail:"LeetCode #209, #560. Prefix sum + HashMap pattern for #560.", time:"6:20–7:30 PM", lc:"LC #209, #560"},
        {tag:"oop", name:"OOP Mock Interview — 20 Qs spoken aloud", detail:"Record yourself. Cover all 4 pillars, collections, exceptions, static vs instance.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Build: Expense Tracker with MongoDB backend", detail:"React frontend + Express API + MongoDB. Full CRUD, category filter.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"Full Zoho-style Aptitude Mock — 60 min", detail:"Zoho pattern: 30 aptitude + 15 reasoning + 5 verbal. Strict timer.", time:"9:00–10:00 AM", lc:""},
        {tag:"dsa", name:"String to Integer (atoi) + Roman to Integer + Zigzag", detail:"LeetCode #8, #13, #6. Edge cases matter here — practice on paper first.", time:"10:00–11:30 AM", lc:"LC #8, #13, #6"},
        {tag:"dsa", name:"Count Vowels/Consonants + Reverse Words + Valid Palindrome II", detail:"LeetCode #557, #680. String manipulation Zoho asks in coding round.", time:"11:30 AM–12:30 PM", lc:"LC #557, #680"},
        {tag:"project", name:"Expense Tracker: Deploy + add charts", detail:"Add Chart.js/Recharts for category breakdown. Deploy to Render.", time:"2:00–4:00 PM", lc:""},
        {tag:"theory", name:"Review OOP weak spots + plan Week 3", detail:"Write all 4 pillars from memory. Update problem tracker.", time:"4:00–5:00 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — OOP spoken round 40 min", detail:"Interviewer mode: answer 15 OOP questions aloud. All 4 pillars + collections + exceptions. Record yourself.", time:"9:00–9:40 AM", lc:""},
        {tag:"dsa", name:"Weak Drill — re-solve 3 string/hashing problems cold", detail:"No hints. Identify which pattern tripped you — sliding window, hashmap, or two pointer.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Stack and Queue — implement + 4 problems", detail:"LeetCode #20, #155, #225, #232. Code Stack from scratch. Understand Min Stack O(1) space trick.", time:"2:00–3:30 PM", lc:"LC #20, #155, #225, #232"},
        {tag:"theory", name:"Plan Week 3 + write 5 SQL queries from memory", detail:"Joins, GROUP BY, subquery, HAVING. Plan Mon–Sat tasks for Week 3.", time:"4:00–4:30 PM", lc:""}
      ]}
    ]
  },
  {
    week:3, theme:"LINKED LISTS + DBMS DEEP DIVE",
    focus:"Persistent/Zoho technical round: LL + SQL queries",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Simple & Compound Interest", detail:"IndiaBix finance section. 20 Qs. Formula memorization + shortcut.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Reverse LL (iterative + recursive) + Middle of LL", detail:"LeetCode #206, #876. Code both approaches. Slow/fast pointer for middle.", time:"6:20–7:30 PM", lc:"LC #206, #876"},
        {tag:"theory", name:"DBMS: SQL — SELECT, WHERE, GROUP BY, HAVING, ORDER BY", detail:"Write 10 SQL queries on a student DB. GROUP BY vs WHERE with aggregates.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: Context API — global state management", detail:"Build a cart context. useContext + useReducer pattern.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Geometry: Areas, Volumes", detail:"Circles, triangles, cylinders — 20 Qs. Surprisingly common in Zoho.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Cycle Detection + Find Cycle Start + Intersection of Two LLs", detail:"LeetCode #141, #142, #160. Floyd's algorithm. Understand why it works.", time:"6:20–7:30 PM", lc:"LC #141, #142, #160"},
        {tag:"theory", name:"DBMS: SQL Joins — INNER, LEFT, RIGHT, FULL, CROSS, SELF", detail:"Write JOIN queries with 3 tables. Draw Venn diagrams. Know when to use each.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Node.js: JWT Authentication — signup/login/protected routes", detail:"bcrypt password hashing, JWT sign/verify, middleware for protected routes.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Data Interpretation: Bar/Pie/Line charts", detail:"PrepInsta DI section. 15 Qs. Zoho and Freshworks include these.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Merge Two Sorted Lists + Merge K Sorted Lists", detail:"LeetCode #21, #23. #23 is hard — use min-heap or divide & conquer.", time:"6:20–7:30 PM", lc:"LC #21, #23"},
        {tag:"theory", name:"DBMS: Transactions — ACID, Isolation Levels, Dirty Read", detail:"Understand serializable, repeatable read, read committed. Real-world scenarios.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: Forms + validation + controlled components", detail:"Registration form with email, password strength, real-time error messages.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Puzzles + Syllogisms", detail:"IndiaBix: 20 Qs. Zoho round 1 has tricky puzzles. Practice Venn diagrams.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Remove Nth Node + Reorder List + LRU Cache", detail:"LeetCode #19, #143, #146. LRU Cache: HashMap + Doubly LL. Must know.", time:"6:20–7:30 PM", lc:"LC #19, #143, #146"},
        {tag:"theory", name:"DBMS: Indexing — B+ Tree, Clustered vs Non-clustered, Query Optimization", detail:"Explain EXPLAIN command in SQL. When indexes hurt performance.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Full-stack: Connect React app to Express + JWT auth", detail:"Login page → JWT token → protected dashboard → logout flow.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Full mixed mock 30 Qs — 25 min", detail:"Simulate Zoho Round 1 timing. No calculators, quick mental math.", time:"6:00–6:25 PM", lc:""},
        {tag:"dsa", name:"Add Two Numbers + Sort List + Palindrome LL", detail:"LeetCode #2, #148, #234. Sort list: merge sort on LL.", time:"6:25–7:30 PM", lc:"LC #2, #148, #234"},
        {tag:"theory", name:"DBMS: Stored Procedures + Triggers + Views", detail:"Write a stored procedure for student grade calculation. Trigger for audit log.", time:"7:45–8:30 PM", lc:""},
        {tag:"project", name:"Notes App: Full MERN with auth", detail:"Login → personal notes CRUD → JWT secured → deployed. Add to portfolio.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"SQL Practical Mock — write 15 queries on paper", detail:"Joins, subqueries, GROUP BY, HAVING, nested SELECT. Zoho technical round tests SQL.", time:"9:00–10:00 AM", lc:""},
        {tag:"dsa", name:"Copy List with Random Pointer + Rotate LL + Flatten Multilevel LL", detail:"LeetCode #138, #61, #430. Complex pointer manipulation.", time:"10:00–11:30 AM", lc:"LC #138, #61, #430"},
        {tag:"dsa", name:"LL Revision: re-solve 3 hardest cold", detail:"No hints. Full solution. Explain the algorithm aloud.", time:"11:30 AM–12:30 PM", lc:""},
        {tag:"project", name:"Polish portfolio: add Notes app + update resume", detail:"Live links, tech stack, brief description. PDF resume ready.", time:"2:00–4:00 PM", lc:""},
        {tag:"theory", name:"DBMS full review — 1 page cheat sheet", detail:"All concepts on 1 page: ER, normalization, SQL, transactions, indexes.", time:"4:00–5:00 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — LL + SQL combined round 50 min", detail:"15 min: explain reverse LL + cycle detection aloud. 20 min: write 5 SQL queries on paper. 15 min: 1 DSA medium.", time:"9:00–9:50 AM", lc:"LC #206, #141"},
        {tag:"dsa", name:"Weak Drill — re-solve 3 LL problems you found hard", detail:"LRU Cache, Merge K Sorted Lists, or whichever tripped you. No hints. Explain before coding.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Monotonic Stack — concept + 4 problems", detail:"LeetCode #739, #496, #503, #901. Draw stack state step by step. Pattern: when to pop.", time:"2:00–3:30 PM", lc:"LC #739, #496, #503, #901"},
        {tag:"theory", name:"DBMS full revision aloud — 15 questions spoken", detail:"Normalization, joins, transactions, indexing. Answer as if in Zoho technical round.", time:"4:00–4:45 PM", lc:""}
      ]}
    ]
  },
  {
    week:4, theme:"TREES + OS FUNDAMENTALS",
    focus:"Trees are most asked in Zoho/Freshworks technical rounds",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Trains, Boats & Streams", detail:"IndiaBix: 20 Qs. Relative speed problems. Common in service company filters.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Inorder + Preorder + Postorder (iterative, not recursive)", detail:"LeetCode #94, #144, #145. Iterative using stack. Interviewers prefer this.", time:"6:20–7:30 PM", lc:"LC #94, #144, #145"},
        {tag:"theory", name:"OS: Processes — PCB, Process States, Context Switching", detail:"Draw the 5-state process diagram. What happens during context switch? Fork() basics.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: Custom Hooks — useFetch, useDebounce, useLocalStorage", detail:"Build and use all 3 in a project. Understand hook composition.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Quadratic Equations + Inequality", detail:"PrepInsta: 20 Qs. Bank + IT company common filter topic.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Max Depth + Diameter + Balanced Binary Tree", detail:"LeetCode #104, #543, #110. All require DFS. Understand how diameter = left+right depth.", time:"6:20–7:30 PM", lc:"LC #104, #543, #110"},
        {tag:"theory", name:"OS: Threads — user vs kernel threads, multithreading benefits", detail:"Process vs Thread comparison table. Why threads share heap but not stack.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"TypeScript: Types, Interfaces, Generics basics for React", detail:"Convert your Card component to TypeScript. Typed props, return types.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Critical Reasoning + Assumptions", detail:"Freshworks loves this. 20 Qs. Strong/weak argument identification.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Level Order Traversal + Zigzag + Right Side View", detail:"LeetCode #102, #103, #199. BFS on tree — queue approach. All are Zoho favorites.", time:"6:20–7:30 PM", lc:"LC #102, #103, #199"},
        {tag:"theory", name:"OS: CPU Scheduling — FCFS, SJF, Round Robin, Priority", detail:"Draw Gantt charts for all 4. Calculate waiting time and turnaround time.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Capstone project: Plan + wireframe + schema design", detail:"Choose topic (e.g. Job Tracker / Study Planner). Design DB schema, API routes.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Full Zoho mock 40 Qs — 45 min", detail:"Simulate exact Zoho round 1. Quant + Reasoning + Verbal. Strict timing.", time:"6:00–6:45 PM", lc:""},
        {tag:"dsa", name:"Invert Binary Tree + Symmetric Tree + Same Tree", detail:"LeetCode #226, #101, #100. Recursion patterns. Understand mirror logic.", time:"6:45–7:45 PM", lc:"LC #226, #101, #100"},
        {tag:"theory", name:"OS: Deadlock — 4 conditions, prevention, avoidance, Banker's algo", detail:"Banker's algorithm: write the safety algorithm. Draw resource allocation graph.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Capstone: Backend — all API routes + Postman collection", detail:"Auth routes + all CRUD routes. Document with Postman. Error handling.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Review weak areas from mocks", detail:"Re-do the topic types you got wrong. Focus, not new topics.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Path Sum I & II + LCA of Binary Tree", detail:"LeetCode #112, #113, #236. DFS path tracking. LCA: recursive divide.", time:"6:20–7:30 PM", lc:"LC #112, #113, #236"},
        {tag:"theory", name:"OS: Memory Management — Paging, Segmentation, Virtual Memory", detail:"Page table entry, TLB, page fault, thrashing. Draw paging diagram.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Capstone: React frontend — all pages + routing", detail:"All pages connected. Loading states, error boundaries, responsive layout.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"OS Theory Mock — 20 Questions written/spoken", detail:"All OS topics covered. Answer as if interviewer asked. Time: 30 min.", time:"9:00–9:30 AM", lc:""},
        {tag:"dsa", name:"Validate BST + Kth Smallest in BST + BST Iterator", detail:"LeetCode #98, #230, #173. BST inorder = sorted. Use that insight.", time:"9:30–11:00 AM", lc:"LC #98, #230, #173"},
        {tag:"dsa", name:"Construct Tree from Preorder+Inorder + Serialize & Deserialize BT", detail:"LeetCode #105, #297. Hard — crucial for Zoho/Freshworks senior rounds.", time:"11:00 AM–12:30 PM", lc:"LC #105, #297"},
        {tag:"project", name:"Capstone: Connect frontend + backend + deploy", detail:"Full integration. Fix CORS, env variables, deploy to Render + Vercel.", time:"2:00–4:30 PM", lc:""},
        {tag:"theory", name:"OS cheat sheet + Week 4 review", detail:"1-page OS summary. Re-solve 2 hardest tree problems cold.", time:"4:30–5:30 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — Trees full round 60 min", detail:"10 min intro + 2 tree medium problems 25 min each. Explain traversal choice + time complexity.", time:"9:00–10:00 AM", lc:"LC #102, #236, #98"},
        {tag:"dsa", name:"Weak Drill — re-solve 3 tree problems cold", detail:"Serialize/Deserialize, Binary Tree Max Path Sum, or whatever was hardest this week. No notes.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Heaps and Priority Queue — intro + 4 problems", detail:"LeetCode #215, #703, #347, #973. Understand min-heap vs max-heap. PriorityQueue in Java.", time:"2:00–3:30 PM", lc:"LC #215, #703, #347, #973"},
        {tag:"theory", name:"OS revision aloud — scheduling + deadlock + memory", detail:"Draw Gantt chart, Banker algorithm, page table diagram. All from memory.", time:"4:00–4:45 PM", lc:""}
      ]}
    ]
  },
  {
    week:5, theme:"RECURSION + BACKTRACKING + CN",
    focus:"Freshworks round 2 — complex DSA + system fundamentals",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Pattern Recognition + Matrix Reasoning", detail:"Zoho loves these. IndiaBix non-verbal section. 20 Qs.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Subsets + Subsets II (with duplicates)", detail:"LeetCode #78, #90. Power set using recursion. Draw the recursion tree.", time:"6:20–7:30 PM", lc:"LC #78, #90"},
        {tag:"theory", name:"CN: OSI Model — all 7 layers with protocols", detail:"Draw and label OSI vs TCP/IP. Which layer does HTTP/FTP/SMTP operate at?", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"React: Performance — memo, useMemo, useCallback", detail:"When to use each. Demonstrate with a slow component before/after.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — 30 Q mixed mock — 25 min", detail:"PrepInsta full mixed. No peeking. Timer strict.", time:"6:00–6:25 PM", lc:""},
        {tag:"dsa", name:"Permutations + Permutations II (duplicates)", detail:"LeetCode #46, #47. Backtracking with used[] array. Trace through example.", time:"6:25–7:30 PM", lc:"LC #46, #47"},
        {tag:"theory", name:"CN: TCP vs UDP — handshake, reliability, use cases", detail:"3-way handshake diagram. When to use UDP (gaming, video call). TCP flow control.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Node.js: File system, streams, events, EventEmitter", detail:"Read/write files. Create a custom EventEmitter class.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Profit & Loss (advanced — marked price, discount)", detail:"IndiaBix: 20 Qs. Successive discounts shortcut method.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Combination Sum I, II + Phone Number Letter Combos", detail:"LeetCode #39, #40, #17. Backtracking variants — understand the choice/explore/undo pattern.", time:"6:20–7:30 PM", lc:"LC #39, #40, #17"},
        {tag:"theory", name:"CN: HTTP vs HTTPS — SSL/TLS handshake, certificates, status codes", detail:"How HTTPS works. Status codes: 200/201/301/400/401/403/404/500.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"System Design intro: REST API best practices", detail:"Versioning, pagination, rate limiting, authentication patterns.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Ranking + Ordering problems", detail:"20 Qs verbal reasoning. Common in Infosys/TCS pattern.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Palindrome Partitioning + Word Search + N-Queens (conceptual)", detail:"LeetCode #131, #79, #51. For N-Queens: understand the solution structure.", time:"6:20–7:30 PM", lc:"LC #131, #79"},
        {tag:"theory", name:"CN: DNS — how it works, DNS records, CDN basics", detail:"Draw DNS resolution. A record, CNAME, MX record. What is a CDN?", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Capstone: Add features — search, filter, pagination", detail:"Server-side pagination. Search with debounce. Filter by category.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Zoho advanced coding questions (pattern printing)", detail:"Zoho Round 1 has pattern programs. Practice 5 patterns in Java/C.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Restore IP Addresses + Generate Parentheses + Sudoku Solver", detail:"LeetCode #93, #22, #37. Sudoku: constraint-based backtracking.", time:"6:20–7:30 PM", lc:"LC #93, #22, #37"},
        {tag:"mock", name:"Mock Technical Interview — OOP + DBMS + DSA", detail:"Simulate full 45-min interview. Pick 1 DSA problem, answer aloud + 10 theory Qs.", time:"7:45–9:00 PM", lc:""},
        {tag:"mern", name:"Capstone: UI polish — animations, responsive, dark mode", detail:"Smooth page transitions, mobile-first layout, CSS variables for theme.", time:"9:00–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"Zoho Round 1 simulation — full 90 min", detail:"30 aptitude + 5 pattern programs + 5 reasoning. Exact Zoho format.", time:"9:00–10:30 AM", lc:""},
        {tag:"dsa", name:"Letter Tile Possibilities + Beautiful Arrangement + Path with Max Gold", detail:"LeetCode #1079, #526, #1219. Advanced backtracking.", time:"10:30 AM–12:00 PM", lc:"LC #1079, #526, #1219"},
        {tag:"dsa", name:"Backtracking revision: re-solve #39, #46, #131 cold", detail:"No hints. Timed 20 min each. Say algorithm aloud before coding.", time:"12:00–1:00 PM", lc:"LC #39, #46, #131"},
        {tag:"project", name:"Capstone: Final deploy + record 2-min demo video", detail:"Screen record yourself demoing the app. Practice your project pitch.", time:"2:00–4:00 PM", lc:""},
        {tag:"theory", name:"CN cheat sheet + week review", detail:"1-page CN summary. Update problem tracker total count.", time:"4:00–5:00 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — Backtracking + CN theory 55 min", detail:"1 backtracking medium timed 30 min. Then 10 CN questions aloud: OSI, TCP, HTTP, DNS, HTTPS.", time:"9:00–9:55 AM", lc:"LC #39, #131"},
        {tag:"dsa", name:"Weak Drill — re-solve 3 backtracking problems cold", detail:"Subsets II, Combination Sum II, or Word Search. Trace full recursion tree on paper before coding.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Greedy Algorithms — concept + 4 problems", detail:"LeetCode #455, #435, #56, #763. Greedy choice property. When greedy works vs when DP needed.", time:"2:00–3:30 PM", lc:"LC #455, #435, #56, #763"},
        {tag:"theory", name:"Communication — record 90-sec project pitch", detail:"Explain your best project in 90 seconds. No filler words. Watch it back critically.", time:"4:00–4:30 PM", lc:""}
      ]}
    ]
  },
  {
    week:6, theme:"DYNAMIC PROGRAMMING + SYSTEM DESIGN BASICS",
    focus:"DP is the differentiator for 10+ LPA. System design for Freshworks/startups.",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — 30 Q mock — Freshworks pattern", detail:"PrepInsta Freshworks pattern. 30 min timer. Focus on DI and logical.", time:"6:00–6:30 PM", lc:""},
        {tag:"dsa", name:"Climbing Stairs + House Robber + House Robber II", detail:"LeetCode #70, #198, #213. 1D DP fundamentals. Tabulation vs memoization.", time:"6:30–7:30 PM", lc:"LC #70, #198, #213"},
        {tag:"system", name:"System Design: URL Shortener", detail:"Components: API server, DB, cache (Redis), hash function. Scaling considerations.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Node.js: Caching with Redis basics + rate limiting", detail:"Cache API responses. Implement rate limiter middleware.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Mixed 25 Qs — weak topic focus", detail:"Pick your 2 weakest topics. 25 targeted questions. No skipping.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Coin Change + Coin Change II + Min Cost Climbing Stairs", detail:"LeetCode #322, #518, #746. BFS approach for #322. Count ways for #518.", time:"6:20–7:30 PM", lc:"LC #322, #518, #746"},
        {tag:"system", name:"System Design: Design a Chat App (basic)", detail:"WebSockets vs polling. Message storage. Online presence. Rooms.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"WebSockets: Socket.io basics", detail:"Real-time chat with Socket.io + Express. Rooms, emit, broadcast.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — Full 45 Q mock — 40 min", detail:"Simulate actual test. Mix of all topics. Mark, don't guess wrong.", time:"6:00–6:40 PM", lc:""},
        {tag:"dsa", name:"Longest Common Subsequence + Edit Distance", detail:"LeetCode #1143, #72. Draw the DP table manually first. LCS is base for many.", time:"6:40–7:45 PM", lc:"LC #1143, #72"},
        {tag:"system", name:"System Design: File Upload Service", detail:"S3-like storage. Pre-signed URLs. Chunked upload. CDN delivery.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"AWS/Cloudinary: Image upload in MERN app", detail:"Multer + Cloudinary integration. Upload profile pictures.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Java output prediction questions", detail:"Zoho asks 10 output questions in technical round. Predict without IDE.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"0-1 Knapsack + Partition Equal Subset Sum + Target Sum", detail:"LeetCode #416, #494. Classic Knapsack from scratch. Understand subset sum.", time:"6:20–7:30 PM", lc:"LC #416, #494"},
        {tag:"mock", name:"Zoho Technical Round Simulation", detail:"10 Java output Qs + 5 OOP Qs + 2 DSA problems + 5 DBMS SQL. 60 min total.", time:"7:45–9:00 PM", lc:""},
        {tag:"mern", name:"Resume + Portfolio final review", detail:"All projects linked. 1-page resume. Tech stack listed. CGPA mentioned.", time:"9:00–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"aptitude", name:"Aptitude — Final round prep: Infosys SP pattern", detail:"IndiaBix Infosys mock. 35 Qs, 35 min. Negative marking awareness.", time:"6:00–6:35 PM", lc:""},
        {tag:"dsa", name:"Longest Increasing Subsequence + Number of LIS", detail:"LeetCode #300, #673. Patience sorting approach. O(n log n) solution.", time:"6:35–7:30 PM", lc:"LC #300, #673"},
        {tag:"theory", name:"HR Prep: STAR answers for top 10 questions", detail:"Tell me about yourself, biggest failure, teamwork, why this company, 5-year goal.", time:"7:45–8:30 PM", lc:""},
        {tag:"project", name:"Add real-time feature to capstone (Socket.io chat/notifs)", detail:"Live notification when new item added. Use your capstone project.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"Persistent/TCS Digital mock — 60 min", detail:"PrepInsta company-specific mock. Pattern differs from Zoho. Practice both.", time:"9:00–10:00 AM", lc:""},
        {tag:"dsa", name:"Unique Paths + Unique Paths II + Minimum Path Sum", detail:"LeetCode #62, #63, #64. Grid DP family. All use same base idea.", time:"10:00–11:15 AM", lc:"LC #62, #63, #64"},
        {tag:"dsa", name:"Jump Game + Jump Game II + Word Break + Decode Ways", detail:"LeetCode #55, #45, #139, #91. DP on strings/arrays.", time:"11:15 AM–12:30 PM", lc:"LC #55, #45, #139, #91"},
        {tag:"system", name:"System Design: Design Pastebin / Google Drive (basic)", detail:"Speak for 5 min without notes. Components, trade-offs, scaling.", time:"2:00–3:00 PM", lc:""},
        {tag:"theory", name:"DP revision: write recurrences for all Week 6 problems", detail:"Recurrence relation → memoization → tabulation → space optimize.", time:"3:00–4:30 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Mock Interview — DP round 60 min", detail:"2 DP problems: 1D 25 min + 2D 30 min. Write recurrence before coding. Explain state definition.", time:"9:00–10:00 AM", lc:"LC #322, #1143"},
        {tag:"dsa", name:"Weak Drill — re-solve 3 DP problems you got wrong", detail:"Edit Distance, Partition Equal Subset, or LIS. Draw DP table fully before writing code.", time:"10:00–11:30 AM", lc:""},
        {tag:"dsa", name:"NEW: Bit Manipulation — concept + 4 problems", detail:"LeetCode #136, #191, #338, #371. XOR tricks, bit shifting. Understand AND OR XOR NOT.", time:"2:00–3:30 PM", lc:"LC #136, #191, #338, #371"},
        {tag:"theory", name:"System Design revision — speak URL shortener + chat app", detail:"5 min each without notes. Components, DB schema, scaling. Time yourself strictly.", time:"4:00–4:45 PM", lc:""}
      ]}
    ]
  },
  {
    week:7, theme:"GRAPHS + MOCK INTERVIEW WEEK",
    focus:"Amazon/MS dream target + Freshworks advanced rounds",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Final Zoho-style 50 Q mock — 50 min", detail:"Last full aptitude mock. Analyze mistakes. This is the last big aptitude session.", time:"6:00–6:50 PM", lc:""},
        {tag:"dsa", name:"Number of Islands + Clone Graph + Flood Fill", detail:"LeetCode #200, #133, #733. BFS vs DFS on grid. Visited array technique.", time:"6:50–7:45 PM", lc:"LC #200, #133, #733"},
        {tag:"theory", name:"Graphs theory: representations, BFS, DFS — code from scratch", detail:"Adjacency matrix vs list. BFS iterative, DFS recursive + iterative.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Full MERN stack review — explain every file in capstone", detail:"Open your capstone. Explain every function, every route, every component.", time:"8:45–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"aptitude", name:"Aptitude — Java MCQs: Output + Concept", detail:"20 Java output questions. Static blocks, inheritance, exception flow.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Course Schedule I & II + Find if Path Exists", detail:"LeetCode #207, #210, #1971. Topological sort: BFS (Kahn's) + DFS.", time:"6:20–7:30 PM", lc:"LC #207, #210, #1971"},
        {tag:"mock", name:"Full Mock Interview #1 — Freshworks style", detail:"Resume intro (2 min) + 2 DSA (25 min each) + 5 CS theory + project questions.", time:"7:30–9:00 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"aptitude", name:"Aptitude — TCS Digital coding section practice", detail:"TCS Digital has advanced coding. Practice 3 medium problems in 60 min.", time:"6:00–7:00 PM", lc:""},
        {tag:"dsa", name:"Rotting Oranges + Pacific Atlantic + Word Ladder", detail:"LeetCode #994, #417, #127. Multi-source BFS. #127 is BFS on word graph.", time:"7:00–8:00 PM", lc:"LC #994, #417, #127"},
        {tag:"mock", name:"Full Mock Interview #2 — Zoho style", detail:"10 Java output + 2 SQL queries written + 1 DSA medium + 5 OOP questions.", time:"8:00–9:00 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"aptitude", name:"Aptitude — Review all mock mistakes + last drill", detail:"Go through all mock errors. 20 targeted Qs on weak topics only.", time:"6:00–6:20 PM", lc:""},
        {tag:"dsa", name:"Network Delay Time (Dijkstra) + Cheapest Flights in K Stops", detail:"LeetCode #743, #787. Dijkstra + Bellman-Ford. Graph shortest path.", time:"6:20–7:30 PM", lc:"LC #743, #787"},
        {tag:"mock", name:"Full Mock Interview #3 — Startup style", detail:"Project deep dive (20 min) + 1 system design (15 min) + 1 DSA + HR questions.", time:"7:30–9:00 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"dsa", name:"Graphs revision: re-solve islands, topo sort, Dijkstra cold", detail:"3 problems, no hints, timed 20 min each. Explain before coding.", time:"6:15–7:30 PM", lc:""},
        {tag:"theory", name:"Communication practice: Record 90-sec self intro", detail:"Use Yoodli or phone recorder. Review for filler words, clarity, confidence.", time:"7:45–8:30 PM", lc:""},
        {tag:"project", name:"All projects: final code review + README files", detail:"Each project has a clean README with setup instructions, screenshots, live link.", time:"8:30–9:30 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"aptitude", name:"Final aptitude mock + analysis", detail:"Last mock. Aim for 85%+. Identify any last-minute weak spots.", time:"9:00–10:00 AM", lc:""},
        {tag:"dsa", name:"Union Find: Number of Connected Components + Redundant Connection", detail:"LeetCode #323, #684. Disjoint Set Union with path compression.", time:"10:00–11:15 AM", lc:"LC #323, #684"},
        {tag:"dsa", name:"Graph revision: minimum spanning tree, Kruskal's concept", detail:"LeetCode #1584. Understand Kruskal's greedy approach.", time:"11:15 AM–12:15 PM", lc:"LC #1584"},
        {tag:"mock", name:"Full Day Mock — Placement Simulation", detail:"3 hr simulation: 45 min aptitude + 60 min DSA (3 problems) + 60 min interview.", time:"2:00–5:00 PM", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Full Placement Round Simulation — 2.5 hrs", detail:"45 min aptitude + 60 min coding 3 problems + 45 min technical interview theory + project walkthrough.", time:"9:00–11:30 AM", lc:""},
        {tag:"dsa", name:"Weak Drill — graphs or any topic still shaky", detail:"Pick your single weakest topic from Weeks 1-7. Solve 3 problems. No rushing.", time:"12:00–1:30 PM", lc:""},
        {tag:"dsa", name:"NEW: Tries — implement + 3 problems", detail:"LeetCode #208, #211, #648. Code Trie from scratch: insert, search, startsWith. Understand node structure.", time:"3:00–4:30 PM", lc:"LC #208, #211, #648"},
        {tag:"theory", name:"Final week plan — decide what NOT to study in Week 8", detail:"Week 8 is revision only. List your 10 weakest problems. No new topics allowed in Week 8.", time:"5:00–5:30 PM", lc:""}
      ]}
    ]
  },
  {
    week:8, theme:"FINAL SPRINT — PLACEMENT READY",
    focus:"Last push. Only revision. No new topics. Execute what you know.",
    days:[
      {name:"Mon", tasks:[
        {tag:"aptitude", name:"Aptitude — Top 30 hardest Qs from all mocks — timed", detail:"Compile your hardest 30 mistakes. Solve again. These are your gaps.", time:"6:00–6:30 PM", lc:""},
        {tag:"dsa", name:"Re-solve your 10 weakest problems — no hints", detail:"From your tracker. Full solutions. Explain each step aloud.", time:"6:30–7:45 PM", lc:""},
        {tag:"theory", name:"DBMS final drill — 20 questions spoken", detail:"Normalization, joins, transactions, indexing, stored procs. All from memory.", time:"7:45–8:30 PM", lc:""},
        {tag:"mern", name:"Final project demo practice", detail:"Demo all 3 projects. Anticipate questions. Prepare: tech choices, challenges faced.", time:"8:30–9:30 PM", lc:""}
      ]},
      {name:"Tue", tasks:[
        {tag:"dsa", name:"Timed contest simulation — 90 min, 3 problems", detail:"LeetCode weekly contest format. 1 easy + 2 medium. Rank yourself.", time:"6:00–7:30 PM", lc:""},
        {tag:"theory", name:"OS final drill — 20 questions spoken", detail:"Scheduling, deadlock, memory, file systems. Answer like in an interview.", time:"7:30–8:15 PM", lc:""},
        {tag:"mock", name:"Full Mock Interview #4 — Video recorded", detail:"Record on phone. Watch back. Note body language, pace, filler words.", time:"8:15–9:30 PM", lc:""}
      ]},
      {name:"Wed", tasks:[
        {tag:"dsa", name:"DP final revision — 6 classics from scratch", detail:"Knapsack, LCS, LIS, Coin Change, Edit Distance, Unique Paths. No notes.", time:"6:15–7:30 PM", lc:""},
        {tag:"theory", name:"CN + System Design final revision", detail:"OSI, TCP/IP, HTTP, DNS, URL shortener, chat app design. 1-page cheat.", time:"7:30–8:15 PM", lc:""},
        {tag:"project", name:"Live test all 3 deployed projects", detail:"Test every feature on mobile + desktop. Fix last bugs. Share links.", time:"8:15–9:30 PM", lc:""}
      ]},
      {name:"Thu", tasks:[
        {tag:"dsa", name:"Graph + Tree final revision — 6 classics cold", detail:"Islands, topo sort, tree traversals, LCA, BFS level order, Dijkstra.", time:"6:15–7:30 PM", lc:""},
        {tag:"oop", name:"OOP + Java final rapid-fire — 20 Qs spoken", detail:"All 4 pillars + collections + generics + streams + exceptions. No writing.", time:"7:30–8:15 PM", lc:""},
        {tag:"mock", name:"Full placement round simulation — 45 min", detail:"Self-interview: intro + 1 system design + 1 DSA + project walkthrough + HR.", time:"8:15–9:30 PM", lc:""}
      ]},
      {name:"Fri", tasks:[
        {tag:"dsa", name:"Final 3 unsolved mediums from your list", detail:"Pick 3 you've been avoiding. Solve them. No more avoiding.", time:"6:15–7:30 PM", lc:""},
        {tag:"theory", name:"HR: Practice all 10 behavioral answers aloud", detail:"Intro, failure, teamwork, conflict, why company, 5-year plan. STAR format.", time:"7:30–8:15 PM", lc:""},
        {tag:"theory", name:"Resume: Final proofread + LinkedIn update", detail:"No typos. Consistent formatting. LinkedIn headline updated. Photo.", time:"8:15–9:00 PM", lc:""},
        {tag:"theory", name:"🎉 You are Placement Ready. Rest tonight.", detail:"Light reading only. Sleep before 11 PM. You have done the work.", time:"9:00 PM", lc:""}
      ]},
      {name:"Sat (Free)", tasks:[
        {tag:"mock", name:"Ultimate placement simulation — 3.5 hours", detail:"Aptitude (45 min) + Online coding test (60 min) + Technical interview (60 min) + HR (30 min).", time:"9:00 AM–12:30 PM", lc:""},
        {tag:"project", name:"Record demo videos for all 3 projects", detail:"2-min demo each. Upload to YouTube unlisted. Add links to resume.", time:"2:00–3:30 PM", lc:""},
        {tag:"theory", name:"🏆 8 WEEKS COMPLETE — TRUST YOUR PREP", detail:"You solved 250+ problems. Deployed 3 projects. Cleared 8 mock interviews. You're ready.", time:"All day", lc:""}
      ]},
      {name:"Sun", tasks:[
        {tag:"mock", name:"Final Mock — Video recorded full interview 60 min", detail:"Record on phone. Resume intro + 1 system design + 1 DSA + project walkthrough + 3 HR questions.", time:"9:00–10:00 AM", lc:""},
        {tag:"dsa", name:"Last weak problem drill — final gaps only", detail:"Maximum 3 problems. These are your last unresolved gaps. Solve them. Done.", time:"10:30–12:00 PM", lc:""},
        {tag:"theory", name:"Watch your recorded mock — note 3 improvements", detail:"Rate: clarity, speed, confidence, correctness. Fix 1 thing before actual interviews.", time:"2:00–2:45 PM", lc:""},
        {tag:"theory", name:"REST. You are placement ready.", detail:"8 weeks. 250+ problems. 3 projects deployed. 8 mock interviews. Trust the work you put in.", time:"Evening", lc:""}
      ]}
    ]
  }
];
