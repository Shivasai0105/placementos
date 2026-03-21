// Company-wise frequently asked questions for placement preparation
// Each question has: id, question, topic, difficulty (easy/medium/hard)

export const COMPANY_QUESTIONS = [
  {
    company: 'Zoho',
    color: '#e65c00',
    bg: 'rgba(230,92,0,0.08)',
    border: 'rgba(230,92,0,0.3)',
    description: 'Zoho focuses heavily on programming logic, OOP, and data structures. Expect 2–3 coding rounds.',
    sections: [
      {
        topic: 'Arrays & Strings',
        questions: [
          { id: 'z1', q: 'Find all pairs in an array that sum to a given value', diff: 'easy' },
          { id: 'z2', q: 'Rotate an array by K positions', diff: 'easy' },
          { id: 'z3', q: 'Find the longest substring without repeating characters', diff: 'medium' },
          { id: 'z4', q: 'Given a string, find the first non-repeating character', diff: 'easy' },
          { id: 'z5', q: 'Check if a string is a valid anagram', diff: 'easy' },
          { id: 'z6', q: 'Find the maximum sum subarray (Kadane\'s Algorithm)', diff: 'medium' },
        ]
      },
      {
        topic: 'Linked List',
        questions: [
          { id: 'z7', q: 'Reverse a linked list (iterative and recursive)', diff: 'easy' },
          { id: 'z8', q: 'Detect a cycle in a linked list (Floyd\'s algorithm)', diff: 'medium' },
          { id: 'z9', q: 'Merge two sorted linked lists', diff: 'easy' },
          { id: 'z10', q: 'Find the middle of a linked list', diff: 'easy' },
          { id: 'z11', q: 'Remove N-th node from the end of a linked list', diff: 'medium' },
        ]
      },
      {
        topic: 'OOP & Java',
        questions: [
          { id: 'z12', q: 'Explain method overloading vs overriding with examples', diff: 'easy' },
          { id: 'z13', q: 'What is the difference between abstract class and interface?', diff: 'easy' },
          { id: 'z14', q: 'Implement a Stack using two Queues', diff: 'medium' },
          { id: 'z15', q: 'Explain SOLID principles with examples', diff: 'medium' },
          { id: 'z16', q: 'What is the difference between HashMap and LinkedHashMap?', diff: 'easy' },
        ]
      },
      {
        topic: 'Trees & Graphs',
        questions: [
          { id: 'z17', q: 'Find the height of a binary tree', diff: 'easy' },
          { id: 'z18', q: 'Level order traversal of a binary tree (BFS)', diff: 'medium' },
          { id: 'z19', q: 'Check if a binary tree is balanced', diff: 'medium' },
          { id: 'z20', q: 'Find the lowest common ancestor of two nodes', diff: 'medium' },
          { id: 'z21', q: 'Implement BFS and DFS for a graph', diff: 'medium' },
        ]
      },
    ]
  },
  {
    company: 'Freshworks',
    color: '#00b386',
    bg: 'rgba(0,179,134,0.08)',
    border: 'rgba(0,179,134,0.3)',
    description: 'Freshworks tests DSA, problem-solving, and CS fundamentals. Product thinking may be assessed in later rounds.',
    sections: [
      {
        topic: 'DSA Coding',
        questions: [
          { id: 'fw1', q: 'Two Sum: find two numbers that add up to a target', diff: 'easy' },
          { id: 'fw2', q: 'Valid parentheses — check using Stack', diff: 'easy' },
          { id: 'fw3', q: 'Binary search on a sorted array', diff: 'easy' },
          { id: 'fw4', q: 'Find all subsets of a set (Power Set)', diff: 'medium' },
          { id: 'fw5', q: 'Longest common subsequence', diff: 'hard' },
          { id: 'fw6', q: 'Implement a LRU Cache', diff: 'hard' },
          { id: 'fw7', q: 'Word search in a 2D grid (Backtracking)', diff: 'hard' },
        ]
      },
      {
        topic: 'CS Fundamentals',
        questions: [
          { id: 'fw8', q: 'Explain the 4 pillars of OOP', diff: 'easy' },
          { id: 'fw9', q: 'What is ACID property in databases?', diff: 'easy' },
          { id: 'fw10', q: 'Difference between SQL and NoSQL with use cases', diff: 'easy' },
          { id: 'fw11', q: 'What is indexing in databases and why does it matter?', diff: 'medium' },
          { id: 'fw12', q: 'Explain REST API design principles', diff: 'medium' },
          { id: 'fw13', q: 'What is the event loop in Node.js?', diff: 'medium' },
        ]
      },
      {
        topic: 'Dynamic Programming',
        questions: [
          { id: 'fw14', q: '0/1 Knapsack problem', diff: 'medium' },
          { id: 'fw15', q: 'Coin change problem (minimum coins)', diff: 'medium' },
          { id: 'fw16', q: 'Longest increasing subsequence', diff: 'medium' },
          { id: 'fw17', q: 'Climbing stairs (Fibonacci DP)', diff: 'easy' },
          { id: 'fw18', q: 'Matrix chain multiplication', diff: 'hard' },
        ]
      },
    ]
  },
  {
    company: 'TCS Digital',
    color: '#3b9eff',
    bg: 'rgba(59,158,255,0.08)',
    border: 'rgba(59,158,255,0.3)',
    description: 'TCS Digital has a dedicated coding test with 2 problems (30–45 min) + technical interview. Focuses on aptitude + logic.',
    sections: [
      {
        topic: 'Aptitude & Logic',
        questions: [
          { id: 'tcs1', q: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', diff: 'easy' },
          { id: 'tcs2', q: 'A train 150m long is moving at 60 km/h. Time to pass a 300m bridge?', diff: 'easy' },
          { id: 'tcs3', q: 'Profit and loss: Buy at ₹500, sell at ₹625. Profit percentage?', diff: 'easy' },
          { id: 'tcs4', q: 'Simple vs Compound interest difference over 3 years', diff: 'medium' },
          { id: 'tcs5', q: 'Time & Work: A does in 10 days, B in 15. Together?', diff: 'easy' },
        ]
      },
      {
        topic: 'Coding Problems',
        questions: [
          { id: 'tcs6', q: 'Print all prime numbers between 1 and N', diff: 'easy' },
          { id: 'tcs7', q: 'Find the GCD and LCM of two numbers', diff: 'easy' },
          { id: 'tcs8', q: 'Check if a number is a palindrome without converting to string', diff: 'easy' },
          { id: 'tcs9', q: 'Count occurrences of each character in a string', diff: 'easy' },
          { id: 'tcs10', q: 'Sort an array using Bubble Sort — write code', diff: 'easy' },
          { id: 'tcs11', q: 'Find the second largest element in an array without sorting', diff: 'easy' },
          { id: 'tcs12', q: 'Fibonacci sequence using recursion and iteration', diff: 'easy' },
        ]
      },
      {
        topic: 'Technical Interview',
        questions: [
          { id: 'tcs13', q: 'Explain TCP vs UDP and when you would use each', diff: 'easy' },
          { id: 'tcs14', q: 'What is normalization in DBMS? Explain 1NF, 2NF, 3NF', diff: 'medium' },
          { id: 'tcs15', q: 'What is a process vs a thread?', diff: 'easy' },
          { id: 'tcs16', q: 'Explain the OSI model layers', diff: 'medium' },
          { id: 'tcs17', q: 'What is deadlock and what are its necessary conditions?', diff: 'medium' },
        ]
      },
    ]
  },
  {
    company: 'Infosys DSE',
    color: '#9b6dff',
    bg: 'rgba(155,109,255,0.08)',
    border: 'rgba(155,109,255,0.3)',
    description: 'Infosys DSE (Digital Specialist Engineer) focuses on coding ability, logical aptitude, and CS Interview depth.',
    sections: [
      {
        topic: 'Logical & Verbal',
        questions: [
          { id: 'inf1', q: 'Syllogism: All birds are animals. No animals are stones. Conclusion?', diff: 'easy' },
          { id: 'inf2', q: 'Coding-decoding: If CAT = 24, DOG = 26, then COW = ?', diff: 'easy' },
          { id: 'inf3', q: 'Blood relations: A is B\'s mother. C is A\'s son. How is B related to C?', diff: 'easy' },
          { id: 'inf4', q: 'Series: 1, 4, 9, 16, 25, __ (identify pattern)', diff: 'easy' },
        ]
      },
      {
        topic: 'Hands-on Coding',
        questions: [
          { id: 'inf5', q: 'Reverse words in a sentence without reversing individual characters', diff: 'easy' },
          { id: 'inf6', q: 'Find duplicate elements in an array in O(n) time', diff: 'easy' },
          { id: 'inf7', q: 'Implement Merge Sort', diff: 'medium' },
          { id: 'inf8', q: 'Write a program to check if two strings are anagrams', diff: 'easy' },
          { id: 'inf9', q: 'Print Pascal\'s Triangle up to N rows', diff: 'medium' },
          { id: 'inf10', q: 'Convert decimal to binary without built-in functions', diff: 'easy' },
        ]
      },
      {
        topic: 'CS Depth Interview',
        questions: [
          { id: 'inf11', q: 'What is virtual memory and why is it needed?', diff: 'medium' },
          { id: 'inf12', q: 'Difference between stack and heap memory', diff: 'easy' },
          { id: 'inf13', q: 'What are joins in SQL? Explain with example', diff: 'medium' },
          { id: 'inf14', q: 'Explain the concept of polymorphism in OOP', diff: 'easy' },
          { id: 'inf15', q: 'What happens when you type a URL in a browser? (End to end)', diff: 'hard' },
        ]
      },
    ]
  },
  {
    company: 'Persistent',
    color: '#ff4d6a',
    bg: 'rgba(255,77,106,0.08)',
    border: 'rgba(255,77,106,0.3)',
    description: 'Persistent focuses on strong C/Java/DSA fundamentals and hands-on programming. Aptitude + 2 coding rounds + tech interview.',
    sections: [
      {
        topic: 'Core C / Java',
        questions: [
          { id: 'ps1', q: 'What is the difference between malloc and calloc in C?', diff: 'easy' },
          { id: 'ps2', q: 'Explain pointers in C with an example of pointer arithmetic', diff: 'medium' },
          { id: 'ps3', q: 'What is the difference between final, finally, and finalize in Java?', diff: 'easy' },
          { id: 'ps4', q: 'Explain the Java memory model (Stack vs Heap vs Method Area)', diff: 'medium' },
          { id: 'ps5', q: 'What is the output? Explain static binding vs dynamic binding', diff: 'medium' },
        ]
      },
      {
        topic: 'Data Structures',
        questions: [
          { id: 'ps6', q: 'Implement a Queue using a linked list', diff: 'easy' },
          { id: 'ps7', q: 'Delete a node from a BST', diff: 'medium' },
          { id: 'ps8', q: 'Find if a graph is connected using DFS', diff: 'medium' },
          { id: 'ps9', q: 'Inorder traversal of a binary tree without recursion (using stack)', diff: 'medium' },
          { id: 'ps10', q: 'Find the kth smallest element in a BST', diff: 'medium' },
        ]
      },
      {
        topic: 'Coding Round',
        questions: [
          { id: 'ps11', q: 'Count number of islands in a 2D grid (BFS/DFS)', diff: 'medium' },
          { id: 'ps12', q: 'Find the maximum depth of a binary tree', diff: 'easy' },
          { id: 'ps13', q: 'Spiral matrix traversal', diff: 'medium' },
          { id: 'ps14', q: 'Longest palindromic substring', diff: 'hard' },
          { id: 'ps15', q: 'Minimum spanning tree: explain Prim\'s and Kruskal\'s algorithm', diff: 'hard' },
        ]
      },
    ]
  },
];
