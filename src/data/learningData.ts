import type { TopicComplexity, SubtopicProgress, SkillType, TopicSize, SubtopicDifficulty } from '../types'

export const TOPIC_SIZE_BASE_TIME: Record<TopicSize, number> = {
  'Tiny': 8,
  'Small': 15,
  'Medium': 25,
  'Large': 45,
  'Very Large': 75
}

export const TOPIC_COMPLEXITY_BASE_XP: Record<TopicComplexity, number> = {
  'Simple': 20,
  'Medium': 40,
  'Hard': 80,
  'Very Hard': 150
}

export const DIFFICULTY_MULTIPLIERS: Record<SubtopicDifficulty, { time: number, xp: number }> = {
  'Easy': { time: 1.25, xp: 0.75 },
  'Normal': { time: 1.0, xp: 1.0 },
  'Hard': { time: 0.75, xp: 1.5 }
}

const generateId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '-')

export type DomainTopic = { 
  title: string, 
  complexity: TopicComplexity, 
  size: TopicSize 
}
export type DomainGroup = { domain: string, topics: DomainTopic[] }
export type Curriculum = DomainGroup[]

export type SkillDefinition = {
  id: string
  canonicalName: string
  type: SkillType
  aliases: string[]
  curriculum: Curriculum
}

export const SKILL_REGISTRY: SkillDefinition[] = [
  {
    id: 'html',
    canonicalName: 'HTML',
    type: 'OTHER',
    aliases: ["html","html5"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of HTML', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'css',
    canonicalName: 'CSS',
    type: 'OTHER',
    aliases: ["css","css3"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of CSS', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'javascript',
    canonicalName: 'JavaScript',
    type: 'OTHER',
    aliases: ["javascript","js"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of JavaScript', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'typescript',
    canonicalName: 'TypeScript',
    type: 'OTHER',
    aliases: ["typescript","ts"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of TypeScript', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'react',
    canonicalName: 'React',
    type: 'OTHER',
    aliases: ["react","reactjs","react.js"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of React', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'nextjs',
    canonicalName: 'Next.js',
    type: 'OTHER',
    aliases: ["nextjs","next.js","next"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Next.js', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'python',
    canonicalName: 'Python',
    type: 'OTHER',
    aliases: ["python","py"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Python', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'go',
    canonicalName: 'Go',
    type: 'OTHER',
    aliases: ["go","golang"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Go', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'rust',
    canonicalName: 'Rust',
    type: 'OTHER',
    aliases: ["rust","rs"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Rust', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'csharp',
    canonicalName: 'C#',
    type: 'OTHER',
    aliases: ["c#","csharp"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of C#', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'postgresql',
    canonicalName: 'PostgreSQL',
    type: 'OTHER',
    aliases: ["postgresql","postgres"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of PostgreSQL', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'rest-api',
    canonicalName: 'REST API',
    type: 'OTHER',
    aliases: ["rest api","rest-api","restful"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of REST API', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'docker',
    canonicalName: 'Docker',
    type: 'OTHER',
    aliases: ["docker"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Docker', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'kubernetes',
    canonicalName: 'Kubernetes',
    type: 'OTHER',
    aliases: ["kubernetes","k8s"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Kubernetes', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'linux',
    canonicalName: 'Linux',
    type: 'OTHER',
    aliases: ["linux"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Linux', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    canonicalName: 'Cybersecurity',
    type: 'OTHER',
    aliases: ["cybersecurity","security"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Cybersecurity', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'cryptography',
    canonicalName: 'Cryptography',
    type: 'OTHER',
    aliases: ["cryptography","crypto"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Cryptography', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'sql',
    canonicalName: 'SQL',
    type: 'OTHER',
    aliases: ["sql"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of SQL', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'cs-fundamentals',
    canonicalName: 'CS Fundamentals',
    type: 'OTHER',
    aliases: ["cs fundamentals","cs-fundamentals"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of CS Fundamentals', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'system-design',
    canonicalName: 'System Design',
    type: 'OTHER',
    aliases: ["system design","system-design"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of System Design', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'cpp',
    canonicalName: 'C++',
    type: 'OTHER',
    aliases: ["cpp","c++"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of C++', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa',
    canonicalName: 'Data Structures & Algorithms',
    type: 'OTHER',
    aliases: ["dsa","data structures and algorithms"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Data Structures & Algorithms', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'daa',
    canonicalName: 'Design & Analysis of Algorithms',
    type: 'OTHER',
    aliases: ["daa","design and analysis of algorithms"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Design & Analysis of Algorithms', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'pointers',
    canonicalName: 'Pointers',
    type: 'OTHER',
    aliases: ["pointers"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Pointers', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'binary-trees',
    canonicalName: 'Binary Trees',
    type: 'OTHER',
    aliases: ["binary trees","binary-trees"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of Binary Trees', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'aiml',
    canonicalName: 'AI & ML',
    type: 'OTHER',
    aliases: ["aiml","ai & ml"],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Basics of AI & ML', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'java',
    canonicalName: 'Java',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['java', 'core java'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Syntax', complexity: 'Simple', size: 'Tiny' },
          { title: 'Variables', complexity: 'Simple', size: 'Small' },
          { title: 'Primitive Data Types', complexity: 'Simple', size: 'Small' },
          { title: 'Operators', complexity: 'Simple', size: 'Tiny' },
          { title: 'Input / Output', complexity: 'Simple', size: 'Tiny' },
          { title: 'Type Casting', complexity: 'Medium', size: 'Small' }
        ]
      },
      {
        domain: 'Control Flow',
        topics: [
          { title: 'if / else', complexity: 'Simple', size: 'Small' },
          { title: 'switch', complexity: 'Simple', size: 'Small' },
          { title: 'for loop', complexity: 'Simple', size: 'Small' },
          { title: 'while loop', complexity: 'Simple', size: 'Tiny' },
          { title: 'do-while', complexity: 'Simple', size: 'Tiny' },
          { title: 'break / continue', complexity: 'Simple', size: 'Tiny' }
        ]
      },
      {
        domain: 'Methods',
        topics: [
          { title: 'Methods', complexity: 'Medium', size: 'Medium' },
          { title: 'Parameters', complexity: 'Simple', size: 'Small' },
          { title: 'Return Values', complexity: 'Simple', size: 'Small' },
          { title: 'Method Overloading', complexity: 'Medium', size: 'Medium' },
          { title: 'Recursion', complexity: 'Hard', size: 'Large' },
          { title: 'Scope', complexity: 'Medium', size: 'Small' }
        ]
      },
      {
        domain: 'Object-Oriented Programming',
        topics: [
          { title: 'Classes', complexity: 'Medium', size: 'Medium' },
          { title: 'Objects', complexity: 'Medium', size: 'Medium' },
          { title: 'Constructors', complexity: 'Medium', size: 'Small' },
          { title: 'Encapsulation', complexity: 'Medium', size: 'Medium' },
          { title: 'Inheritance', complexity: 'Hard', size: 'Large' },
          { title: 'Polymorphism', complexity: 'Hard', size: 'Large' },
          { title: 'Abstraction', complexity: 'Medium', size: 'Medium' },
          { title: 'Interfaces', complexity: 'Hard', size: 'Medium' },
          { title: 'Abstract Classes', complexity: 'Hard', size: 'Medium' }
        ]
      },
      {
        domain: 'Collections',
        topics: [
          { title: 'ArrayList', complexity: 'Medium', size: 'Medium' },
          { title: 'LinkedList', complexity: 'Medium', size: 'Medium' },
          { title: 'HashSet', complexity: 'Medium', size: 'Medium' },
          { title: 'TreeSet', complexity: 'Medium', size: 'Medium' },
          { title: 'HashMap', complexity: 'Hard', size: 'Large' },
          { title: 'TreeMap', complexity: 'Hard', size: 'Large' },
          { title: 'Queue', complexity: 'Medium', size: 'Small' },
          { title: 'Deque', complexity: 'Medium', size: 'Small' },
          { title: 'Iterators', complexity: 'Medium', size: 'Small' }
        ]
      },
      {
        domain: 'Exceptions',
        topics: [
          { title: 'try / catch', complexity: 'Medium', size: 'Small' },
          { title: 'finally', complexity: 'Medium', size: 'Tiny' },
          { title: 'throw', complexity: 'Medium', size: 'Tiny' },
          { title: 'throws', complexity: 'Medium', size: 'Tiny' },
          { title: 'Custom Exceptions', complexity: 'Hard', size: 'Medium' }
        ]
      },
      {
        domain: 'Advanced Java',
        topics: [
          { title: 'Generics', complexity: 'Hard', size: 'Large' },
          { title: 'Streams', complexity: 'Hard', size: 'Large' },
          { title: 'Lambdas', complexity: 'Medium', size: 'Medium' },
          { title: 'Functional Interfaces', complexity: 'Medium', size: 'Medium' },
          { title: 'Multithreading', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Concurrency', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'JVM concepts', complexity: 'Very Hard', size: 'Large' },
          { title: 'Memory management', complexity: 'Very Hard', size: 'Large' },
          { title: 'Reflection', complexity: 'Very Hard', size: 'Large' },
          { title: 'Annotations', complexity: 'Hard', size: 'Medium' },
          { title: 'Modules', complexity: 'Medium', size: 'Medium' }
        ]
      }
    ]
  },
  {
    id: 'c',
    canonicalName: 'C',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['c', 'c programming'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Syntax & Types', complexity: 'Simple', size: 'Small' },
          { title: 'Variables & Constants', complexity: 'Simple', size: 'Small' },
          { title: 'Operators', complexity: 'Simple', size: 'Small' },
        ]
      },
      {
        domain: 'Control Flow',
        topics: [
          { title: 'Conditionals (if, switch)', complexity: 'Simple', size: 'Medium' },
          { title: 'Loops (for, while, do-while)', complexity: 'Simple', size: 'Medium' },
        ]
      },
      {
        domain: 'Functions',
        topics: [
          { title: 'Function Prototypes', complexity: 'Medium', size: 'Small' },
          { title: 'Pass by Value', complexity: 'Medium', size: 'Small' },
          { title: 'Scope & Storage Classes', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Memory & Pointers',
        topics: [
          { title: 'Pointers Overview', complexity: 'Hard', size: 'Large' },
          { title: 'Pointer Arithmetic', complexity: 'Very Hard', size: 'Medium' },
          { title: 'Pass by Reference', complexity: 'Hard', size: 'Medium' },
          { title: 'Dynamic Memory (malloc, free)', complexity: 'Very Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Data Structures',
        topics: [
          { title: 'Arrays & Strings', complexity: 'Medium', size: 'Medium' },
          { title: 'Structs', complexity: 'Medium', size: 'Medium' },
          { title: 'Unions & Bitfields', complexity: 'Hard', size: 'Medium' },
          { title: 'Enums & Typedef', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Advanced C',
        topics: [
          { title: 'File I/O', complexity: 'Medium', size: 'Large' },
          { title: 'Preprocessor Directives', complexity: 'Hard', size: 'Medium' },
          { title: 'Function Pointers', complexity: 'Very Hard', size: 'Large' },
          { title: 'Compilation Process', complexity: 'Hard', size: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'cpp',
    canonicalName: 'C++',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['c++', 'cpp', 'c plus plus'],
    curriculum: [
      {
        domain: 'C++ Fundamentals',
        topics: [
          { title: 'Syntax & Basic Types', complexity: 'Simple', size: 'Small' },
          { title: 'I/O Streams', complexity: 'Simple', size: 'Small' },
          { title: 'Namespaces', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Object-Oriented C++',
        topics: [
          { title: 'Classes & Objects', complexity: 'Medium', size: 'Medium' },
          { title: 'Constructors & Destructors', complexity: 'Medium', size: 'Medium' },
          { title: 'Inheritance & Polymorphism', complexity: 'Hard', size: 'Large' },
          { title: 'Virtual Functions', complexity: 'Very Hard', size: 'Medium' },
          { title: 'Operator Overloading', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Memory Management',
        topics: [
          { title: 'Pointers & References', complexity: 'Hard', size: 'Large' },
          { title: 'Dynamic Memory (new/delete)', complexity: 'Hard', size: 'Medium' },
          { title: 'Smart Pointers', complexity: 'Very Hard', size: 'Large' },
          { title: 'RAII', complexity: 'Very Hard', size: 'Large' },
        ]
      },
      {
        domain: 'STL',
        topics: [
          { title: 'Containers', complexity: 'Medium', size: 'Large' },
          { title: 'Iterators', complexity: 'Hard', size: 'Medium' },
          { title: 'Algorithms', complexity: 'Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Advanced C++',
        topics: [
          { title: 'Templates', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Exceptions', complexity: 'Hard', size: 'Medium' },
          { title: 'Move Semantics', complexity: 'Very Hard', size: 'Large' },
          { title: 'Lambdas', complexity: 'Hard', size: 'Medium' },
          { title: 'Concurrency', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'python',
    canonicalName: 'Python',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['python', 'py'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Syntax & Variables', complexity: 'Simple', size: 'Tiny' },
          { title: 'Data Types', complexity: 'Simple', size: 'Small' },
          { title: 'Operators', complexity: 'Simple', size: 'Tiny' },
          { title: 'String Manipulation', complexity: 'Simple', size: 'Small' },
        ]
      },
      {
        domain: 'Control Flow',
        topics: [
          { title: 'If/Elif/Else', complexity: 'Simple', size: 'Small' },
          { title: 'For & While Loops', complexity: 'Simple', size: 'Small' },
          { title: 'Break, Continue, Pass', complexity: 'Simple', size: 'Tiny' },
        ]
      },
      {
        domain: 'Data Structures',
        topics: [
          { title: 'Lists & Tuples', complexity: 'Simple', size: 'Medium' },
          { title: 'Dictionaries', complexity: 'Medium', size: 'Medium' },
          { title: 'Sets', complexity: 'Medium', size: 'Small' },
          { title: 'Comprehensions', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Functions',
        topics: [
          { title: 'Defining Functions', complexity: 'Simple', size: 'Small' },
          { title: 'Arguments (*args, **kwargs)', complexity: 'Medium', size: 'Medium' },
          { title: 'Lambda Functions', complexity: 'Medium', size: 'Small' },
          { title: 'Scope (LEGB)', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Object-Oriented Programming',
        topics: [
          { title: 'Classes & Objects', complexity: 'Medium', size: 'Medium' },
          { title: 'Inheritance & Polymorphism', complexity: 'Hard', size: 'Large' },
          { title: 'Magic Methods', complexity: 'Hard', size: 'Medium' },
          { title: 'Decorators (@property)', complexity: 'Very Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Advanced Python',
        topics: [
          { title: 'File Handling', complexity: 'Medium', size: 'Medium' },
          { title: 'Try/Except', complexity: 'Medium', size: 'Small' },
          { title: 'Decorators', complexity: 'Very Hard', size: 'Large' },
          { title: 'Generators', complexity: 'Very Hard', size: 'Large' },
          { title: 'Asyncio', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'javascript',
    canonicalName: 'JavaScript',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['javascript', 'js', 'vanilla js'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Syntax & Variables', complexity: 'Simple', size: 'Tiny' },
          { title: 'Data Types', complexity: 'Simple', size: 'Small' },
          { title: 'Operators', complexity: 'Simple', size: 'Tiny' },
          { title: 'Type Coercion', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Functions',
        topics: [
          { title: 'Function Declarations & Expressions', complexity: 'Medium', size: 'Medium' },
          { title: 'Arrow Functions', complexity: 'Simple', size: 'Small' },
          { title: 'Scope & Hoisting', complexity: 'Hard', size: 'Medium' },
          { title: 'Closures', complexity: 'Very Hard', size: 'Large' },
          { title: 'this Keyword', complexity: 'Very Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Objects & Arrays',
        topics: [
          { title: 'Object Literals', complexity: 'Simple', size: 'Small' },
          { title: 'Array Methods (map, filter)', complexity: 'Hard', size: 'Large' },
          { title: 'Destructuring', complexity: 'Medium', size: 'Medium' },
          { title: 'Spread & Rest', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Asynchronous JavaScript',
        topics: [
          { title: 'Callbacks', complexity: 'Medium', size: 'Medium' },
          { title: 'Promises', complexity: 'Hard', size: 'Large' },
          { title: 'Async/Await', complexity: 'Hard', size: 'Medium' },
          { title: 'Event Loop', complexity: 'Very Hard', size: 'Very Large' },
        ]
      },
      {
        domain: 'DOM & Events',
        topics: [
          { title: 'DOM Manipulation', complexity: 'Medium', size: 'Medium' },
          { title: 'Event Listeners', complexity: 'Hard', size: 'Medium' },
          { title: 'Event Delegation', complexity: 'Very Hard', size: 'Large' },
        ]
      }
    ]
  },
  {
    id: 'typescript',
    canonicalName: 'TypeScript',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['typescript', 'ts'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Type Annotations', complexity: 'Simple', size: 'Small' },
          { title: 'Basic Types', complexity: 'Simple', size: 'Medium' },
          { title: 'Interfaces vs Types', complexity: 'Medium', size: 'Medium' },
        ]
      },
      {
        domain: 'Advanced Types',
        topics: [
          { title: 'Generics', complexity: 'Hard', size: 'Large' },
          { title: 'Utility Types', complexity: 'Hard', size: 'Medium' },
          { title: 'Mapped Types', complexity: 'Very Hard', size: 'Large' },
          { title: 'Conditional Types', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'csharp',
    canonicalName: 'C#',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['c#', 'csharp', 'c-sharp'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'Syntax & Data Types', complexity: 'Simple', size: 'Medium' },
          { title: 'Control Flow', complexity: 'Simple', size: 'Medium' },
        ]
      },
      {
        domain: 'Object-Oriented C#',
        topics: [
          { title: 'Classes & Structs', complexity: 'Medium', size: 'Large' },
          { title: 'Properties & Fields', complexity: 'Medium', size: 'Medium' },
          { title: 'Inheritance & Interfaces', complexity: 'Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Advanced C#',
        topics: [
          { title: 'LINQ', complexity: 'Hard', size: 'Very Large' },
          { title: 'Delegates & Events', complexity: 'Very Hard', size: 'Large' },
          { title: 'Async / Await', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Records & Pattern Matching', complexity: 'Hard', size: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'go',
    canonicalName: 'Go',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['go', 'golang'],
    curriculum: [
      {
        domain: 'Go Fundamentals',
        topics: [
          { title: 'Syntax & Types', complexity: 'Simple', size: 'Medium' },
          { title: 'Functions & Multiple Returns', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Data Structures',
        topics: [
          { title: 'Arrays & Slices', complexity: 'Medium', size: 'Large' },
          { title: 'Maps', complexity: 'Medium', size: 'Medium' },
          { title: 'Pointers', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Concurrency',
        topics: [
          { title: 'Goroutines', complexity: 'Hard', size: 'Large' },
          { title: 'Channels', complexity: 'Very Hard', size: 'Large' },
          { title: 'Select Statement', complexity: 'Very Hard', size: 'Medium' },
          { title: 'WaitGroups & Mutexes', complexity: 'Very Hard', size: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'rust',
    canonicalName: 'Rust',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['rust', 'rs'],
    curriculum: [
      {
        domain: 'Rust Fundamentals',
        topics: [
          { title: 'Variables & Mutability', complexity: 'Medium', size: 'Medium' },
          { title: 'Data Types', complexity: 'Simple', size: 'Small' },
        ]
      },
      {
        domain: 'Memory & Ownership',
        topics: [
          { title: 'Ownership Rules', complexity: 'Very Hard', size: 'Large' },
          { title: 'References & Borrowing', complexity: 'Very Hard', size: 'Large' },
          { title: 'Lifetimes', complexity: 'Very Hard', size: 'Very Large' },
        ]
      },
      {
        domain: 'Structs & Enums',
        topics: [
          { title: 'Enums', complexity: 'Medium', size: 'Medium' },
          { title: 'Pattern Matching', complexity: 'Hard', size: 'Large' },
          { title: 'Option & Result', complexity: 'Hard', size: 'Medium' },
        ]
      },
      {
        domain: 'Advanced Rust',
        topics: [
          { title: 'Traits & Generics', complexity: 'Very Hard', size: 'Large' },
          { title: 'Smart Pointers', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Concurrency', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'sql',
    canonicalName: 'SQL',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['sql', 'structured query language'],
    curriculum: [
      {
        domain: 'Fundamentals',
        topics: [
          { title: 'SELECT Statements', complexity: 'Simple', size: 'Small' },
          { title: 'WHERE Clause', complexity: 'Simple', size: 'Small' },
          { title: 'ORDER BY', complexity: 'Simple', size: 'Tiny' },
        ]
      },
      {
        domain: 'Joins & Relations',
        topics: [
          { title: 'INNER JOIN', complexity: 'Medium', size: 'Medium' },
          { title: 'OUTER JOINS', complexity: 'Hard', size: 'Medium' },
          { title: 'CROSS JOIN', complexity: 'Medium', size: 'Small' },
        ]
      },
      {
        domain: 'Advanced SQL',
        topics: [
          { title: 'GROUP BY & Aggregation', complexity: 'Hard', size: 'Large' },
          { title: 'Subqueries', complexity: 'Hard', size: 'Large' },
          { title: 'Window Functions', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'CTEs', complexity: 'Hard', size: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'php',
    canonicalName: 'PHP',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['php'],
    curriculum: [{ domain: 'Fundamentals', topics: [{ title: 'Syntax', complexity: 'Simple', size: 'Medium' }] }]
  },
  {
    id: 'kotlin',
    canonicalName: 'Kotlin',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['kotlin', 'kt'],
    curriculum: [{ domain: 'Fundamentals', topics: [{ title: 'Syntax', complexity: 'Simple', size: 'Medium' }] }]
  },
  {
    id: 'swift',
    canonicalName: 'Swift',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['swift'],
    curriculum: [{ domain: 'Fundamentals', topics: [{ title: 'Syntax', complexity: 'Simple', size: 'Medium' }] }]
  },
  {
    id: 'dart',
    canonicalName: 'Dart',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['dart'],
    curriculum: [{ domain: 'Fundamentals', topics: [{ title: 'Syntax', complexity: 'Simple', size: 'Medium' }] }]
  },
  {
    id: 'ruby',
    canonicalName: 'Ruby',
    type: 'PROGRAMMING_LANGUAGE',
    aliases: ['ruby', 'rb'],
    curriculum: [{ domain: 'Fundamentals', topics: [{ title: 'Syntax', complexity: 'Simple', size: 'Medium' }] }]
  },
  {
    id: 'dsa',
    canonicalName: 'Data Structures & Algorithms',
    type: 'DSA',
    aliases: ['dsa', 'data structures', 'algorithms'],
    curriculum: [
      {
        domain: 'Foundations',
        topics: [
          { title: 'Complexity Analysis', complexity: 'Medium', size: 'Small' },
          { title: 'Big O', complexity: 'Medium', size: 'Small' },
          { title: 'Big Theta', complexity: 'Hard', size: 'Tiny' },
          { title: 'Big Omega', complexity: 'Hard', size: 'Tiny' },
          { title: 'Time Complexity', complexity: 'Medium', size: 'Medium' },
          { title: 'Space Complexity', complexity: 'Medium', size: 'Medium' },
          { title: 'Recursion', complexity: 'Hard', size: 'Large' },
          { title: 'Iteration', complexity: 'Simple', size: 'Small' }
        ]
      },
      {
        domain: 'Arrays',
        topics: [
          { title: 'One-dimensional Arrays', complexity: 'Simple', size: 'Small' },
          { title: 'Multidimensional Arrays', complexity: 'Medium', size: 'Medium' },
          { title: 'Dynamic Arrays', complexity: 'Medium', size: 'Medium' },
          { title: 'Prefix Sum', complexity: 'Hard', size: 'Medium' },
          { title: 'Difference Arrays', complexity: 'Very Hard', size: 'Large' },
          { title: 'Sliding Window', complexity: 'Hard', size: 'Large' },
          { title: 'Two Pointer Technique', complexity: 'Hard', size: 'Large' }
        ]
      },
      {
        domain: 'Linked Lists',
        topics: [
          { title: 'Singly Linked List', complexity: 'Medium', size: 'Large' },
          { title: 'Doubly Linked List', complexity: 'Medium', size: 'Large' },
          { title: 'Circular Linked List', complexity: 'Hard', size: 'Medium' },
          { title: 'Insertions', complexity: 'Simple', size: 'Small' },
          { title: 'Deletions', complexity: 'Simple', size: 'Small' },
          { title: 'Reversal', complexity: 'Hard', size: 'Large' },
          { title: 'Fast and Slow Pointers', complexity: 'Hard', size: 'Large' },
          { title: 'Merge Linked Lists', complexity: 'Medium', size: 'Medium' }
        ]
      },
      {
        domain: 'Stacks',
        topics: [
          { title: 'Stack Fundamentals', complexity: 'Simple', size: 'Medium' },
          { title: 'Array-based Stack', complexity: 'Medium', size: 'Small' },
          { title: 'Linked Stack', complexity: 'Medium', size: 'Small' },
          { title: 'Applications of Stack', complexity: 'Hard', size: 'Large' },
          { title: 'Monotonic Stack', complexity: 'Very Hard', size: 'Very Large' }
        ]
      },
      {
        domain: 'Queues',
        topics: [
          { title: 'Queue Fundamentals', complexity: 'Simple', size: 'Medium' },
          { title: 'Circular Queue', complexity: 'Medium', size: 'Medium' },
          { title: 'Deque', complexity: 'Medium', size: 'Medium' },
          { title: 'Priority Queue', complexity: 'Hard', size: 'Large' },
          { title: 'Queue Applications', complexity: 'Medium', size: 'Large' }
        ]
      },
      {
        domain: 'Hashing',
        topics: [
          { title: 'Hash Tables', complexity: 'Medium', size: 'Medium' },
          { title: 'Hash Functions', complexity: 'Hard', size: 'Medium' },
          { title: 'Collision Handling', complexity: 'Very Hard', size: 'Large' },
          { title: 'Chaining', complexity: 'Hard', size: 'Medium' },
          { title: 'Open Addressing', complexity: 'Very Hard', size: 'Medium' },
          { title: 'Hash Maps', complexity: 'Medium', size: 'Medium' },
          { title: 'Hash Sets', complexity: 'Medium', size: 'Small' }
        ]
      },
      {
        domain: 'Trees',
        topics: [
          { title: 'Tree Fundamentals', complexity: 'Medium', size: 'Large' },
          { title: 'Binary Trees', complexity: 'Medium', size: 'Large' },
          { title: 'Tree Traversals', complexity: 'Medium', size: 'Medium' },
          { title: 'Preorder', complexity: 'Medium', size: 'Small' },
          { title: 'Inorder', complexity: 'Medium', size: 'Small' },
          { title: 'Postorder', complexity: 'Medium', size: 'Small' },
          { title: 'Level Order', complexity: 'Hard', size: 'Medium' },
          { title: 'Binary Search Trees', complexity: 'Hard', size: 'Large' },
          { title: 'AVL Trees', complexity: 'Very Hard', size: 'Large' },
          { title: 'Red-Black Trees', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Heaps', complexity: 'Hard', size: 'Large' },
          { title: 'Trie', complexity: 'Very Hard', size: 'Large' },
          { title: 'Segment Tree', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Fenwick Tree', complexity: 'Very Hard', size: 'Very Large' }
        ]
      },
      {
        domain: 'Graphs',
        topics: [
          { title: 'Graph Fundamentals', complexity: 'Medium', size: 'Large' },
          { title: 'BFS', complexity: 'Hard', size: 'Large' },
          { title: 'DFS', complexity: 'Hard', size: 'Large' },
          { title: 'Topological Sort', complexity: 'Very Hard', size: 'Large' },
          { title: 'Shortest Path', complexity: 'Hard', size: 'Large' },
          { title: 'Dijkstra', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Bellman-Ford', complexity: 'Very Hard', size: 'Large' },
          { title: 'Floyd-Warshall', complexity: 'Very Hard', size: 'Large' },
          { title: 'MST', complexity: 'Hard', size: 'Large' },
          { title: 'Prim', complexity: 'Very Hard', size: 'Large' },
          { title: 'Kruskal', complexity: 'Very Hard', size: 'Large' },
          { title: 'Union-Find / DSU', complexity: 'Very Hard', size: 'Very Large' }
        ]
      },
      {
        domain: 'Searching',
        topics: [
          { title: 'Linear Search', complexity: 'Simple', size: 'Small' },
          { title: 'Binary Search', complexity: 'Medium', size: 'Medium' },
          { title: 'Binary Search Variations', complexity: 'Hard', size: 'Large' },
          { title: 'Search on Answer', complexity: 'Very Hard', size: 'Large' }
        ]
      },
      {
        domain: 'Sorting',
        topics: [
          { title: 'Bubble Sort', complexity: 'Simple', size: 'Small' },
          { title: 'Selection Sort', complexity: 'Simple', size: 'Small' },
          { title: 'Insertion Sort', complexity: 'Simple', size: 'Small' },
          { title: 'Merge Sort', complexity: 'Hard', size: 'Large' },
          { title: 'Quick Sort', complexity: 'Hard', size: 'Large' },
          { title: 'Heap Sort', complexity: 'Very Hard', size: 'Large' },
          { title: 'Counting Sort', complexity: 'Medium', size: 'Medium' }
        ]
      },
      {
        domain: 'Algorithmic Techniques',
        topics: [
          { title: 'Divide and Conquer', complexity: 'Hard', size: 'Large' },
          { title: 'Greedy Algorithms', complexity: 'Hard', size: 'Large' },
          { title: 'Backtracking', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Dynamic Programming', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Bit Manipulation', complexity: 'Hard', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'daa',
    canonicalName: 'Design & Analysis of Algorithms',
    type: 'DAA',
    aliases: ['daa', 'design and analysis of algorithms'],
    curriculum: [
      {
        domain: 'Algorithm Fundamentals',
        topics: [
          { title: 'Problem Solving', complexity: 'Medium', size: 'Medium' },
          { title: 'Complexity Analysis', complexity: 'Hard', size: 'Large' },
          { title: 'Asymptotic Notation', complexity: 'Hard', size: 'Medium' },
          { title: 'Recurrence Relations', complexity: 'Very Hard', size: 'Large' },
          { title: 'Recurrence Trees', complexity: 'Very Hard', size: 'Large' },
          { title: 'Master Theorem', complexity: 'Very Hard', size: 'Large' }
        ]
      },
      {
        domain: 'Algorithm Paradigms',
        topics: [
          { title: 'Divide and Conquer', complexity: 'Hard', size: 'Large' },
          { title: 'Greedy Algorithms', complexity: 'Hard', size: 'Large' },
          { title: 'Dynamic Programming', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Backtracking', complexity: 'Very Hard', size: 'Large' },
          { title: 'Branch and Bound', complexity: 'Very Hard', size: 'Large' },
          { title: 'Randomized Algorithms', complexity: 'Very Hard', size: 'Large' }
        ]
      },
      {
        domain: 'Complexity Theory',
        topics: [
          { title: 'NP Problems', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'P vs NP', complexity: 'Very Hard', size: 'Large' },
          { title: 'NP-Complete Problems', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Approximation Algorithms', complexity: 'Very Hard', size: 'Very Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa_java',
    canonicalName: 'DSA with Java',
    type: 'LANGUAGE_SPECIFIC',
    aliases: ['dsa java', 'java dsa', 'dsa in java', 'dsa with java'],
    curriculum: [
      {
        domain: 'DSA in Java',
        topics: [
          { title: 'Arrays in Java', complexity: 'Medium', size: 'Medium' },
          { title: 'Linked Lists in Java', complexity: 'Hard', size: 'Large' },
          { title: 'Stacks in Java', complexity: 'Medium', size: 'Medium' },
          { title: 'Queues in Java', complexity: 'Medium', size: 'Medium' },
          { title: 'HashMap / HashSet', complexity: 'Hard', size: 'Large' },
          { title: 'Trees in Java', complexity: 'Very Hard', size: 'Large' },
          { title: 'Heaps in Java', complexity: 'Very Hard', size: 'Large' },
          { title: 'Graphs in Java', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Sorting in Java', complexity: 'Hard', size: 'Large' },
          { title: 'Searching in Java', complexity: 'Medium', size: 'Medium' },
          { title: 'Dynamic Programming in Java', complexity: 'Very Hard', size: 'Very Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa_cpp',
    canonicalName: 'DSA with C++',
    type: 'LANGUAGE_SPECIFIC',
    aliases: ['dsa c++', 'dsa cpp', 'c++ dsa', 'cpp dsa', 'dsa in c++', 'dsa with c++'],
    curriculum: [
      {
        domain: 'DSA in C++',
        topics: [
          { title: 'Arrays in C++', complexity: 'Medium', size: 'Medium' },
          { title: 'std::vector', complexity: 'Medium', size: 'Medium' },
          { title: 'Linked Lists', complexity: 'Hard', size: 'Large' },
          { title: 'std::stack', complexity: 'Medium', size: 'Small' },
          { title: 'std::queue', complexity: 'Medium', size: 'Small' },
          { title: 'std::priority_queue', complexity: 'Hard', size: 'Medium' },
          { title: 'std::unordered_map', complexity: 'Hard', size: 'Medium' },
          { title: 'Trees', complexity: 'Very Hard', size: 'Large' },
          { title: 'Graphs', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Algorithms using STL', complexity: 'Hard', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa_c',
    canonicalName: 'DSA with C',
    type: 'LANGUAGE_SPECIFIC',
    aliases: ['dsa c', 'c dsa', 'dsa in c', 'dsa with c'],
    curriculum: [
      {
        domain: 'DSA in C',
        topics: [
          { title: 'Arrays in C', complexity: 'Medium', size: 'Medium' },
          { title: 'Structs & Pointers', complexity: 'Hard', size: 'Large' },
          { title: 'Linked Lists in C', complexity: 'Very Hard', size: 'Large' },
          { title: 'Trees in C', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Graphs in C', complexity: 'Very Hard', size: 'Very Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa_python',
    canonicalName: 'DSA with Python',
    type: 'LANGUAGE_SPECIFIC',
    aliases: ['dsa python', 'python dsa', 'dsa in python', 'dsa with python'],
    curriculum: [
      {
        domain: 'DSA in Python',
        topics: [
          { title: 'Lists as Arrays', complexity: 'Medium', size: 'Small' },
          { title: 'Linked Lists in Python', complexity: 'Medium', size: 'Medium' },
          { title: 'Dictionaries as HashMaps', complexity: 'Medium', size: 'Small' },
          { title: 'Trees in Python', complexity: 'Hard', size: 'Large' },
          { title: 'Graphs in Python', complexity: 'Hard', size: 'Large' }
        ]
      }
    ]
  },
  {
    id: 'dsa_javascript',
    canonicalName: 'DSA with JavaScript',
    type: 'LANGUAGE_SPECIFIC',
    aliases: ['dsa javascript', 'dsa js', 'javascript dsa', 'js dsa', 'dsa in js', 'dsa with js', 'dsa with javascript'],
    curriculum: [
      {
        domain: 'DSA in JavaScript',
        topics: [
          { title: 'Arrays in JS', complexity: 'Medium', size: 'Medium' },
          { title: 'Sets & Maps', complexity: 'Medium', size: 'Small' },
          { title: 'Linked Lists in JS', complexity: 'Hard', size: 'Large' },
          { title: 'Trees in JS', complexity: 'Hard', size: 'Large' },
          { title: 'Graphs in JS', complexity: 'Very Hard', size: 'Very Large' }
        ]
      }
    ]
  },
  {
    id: 'react',
    canonicalName: 'React',
    type: 'FRAMEWORK',
    aliases: ['react', 'react.js', 'reactjs'],
    curriculum: [
      {
        domain: 'React Basics',
        topics: [
          { title: 'Components & Props', complexity: 'Simple', size: 'Medium' },
          { title: 'State & useState', complexity: 'Medium', size: 'Medium' },
          { title: 'useEffect & Lifecycle', complexity: 'Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Advanced React',
        topics: [
          { title: 'Context API', complexity: 'Medium', size: 'Medium' },
          { title: 'Custom Hooks', complexity: 'Hard', size: 'Large' },
          { title: 'Performance Optimization', complexity: 'Very Hard', size: 'Large' },
          { title: 'State Management', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'nodejs',
    canonicalName: 'Node.js',
    type: 'FRAMEWORK',
    aliases: ['node', 'node.js', 'nodejs'],
    curriculum: [
      {
        domain: 'Node Basics',
        topics: [
          { title: 'Event Loop', complexity: 'Hard', size: 'Large' },
          { title: 'Modules', complexity: 'Medium', size: 'Small' },
          { title: 'File System', complexity: 'Medium', size: 'Medium' },
        ]
      },
      {
        domain: 'Backend Development',
        topics: [
          { title: 'HTTP Module', complexity: 'Medium', size: 'Medium' },
          { title: 'Express.js', complexity: 'Medium', size: 'Large' },
          { title: 'Middleware', complexity: 'Hard', size: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'machine_learning',
    canonicalName: 'Machine Learning',
    type: 'AI_ML',
    aliases: ['ml', 'machine learning'],
    curriculum: [
      {
        domain: 'Foundations',
        topics: [
          { title: 'Linear Algebra Basics', complexity: 'Hard', size: 'Large' },
          { title: 'Statistics & Probability', complexity: 'Hard', size: 'Large' },
        ]
      },
      {
        domain: 'Models',
        topics: [
          { title: 'Supervised Learning', complexity: 'Medium', size: 'Large' },
          { title: 'Unsupervised Learning', complexity: 'Medium', size: 'Large' },
          { title: 'Neural Networks', complexity: 'Very Hard', size: 'Very Large' },
        ]
      }
    ]
  },
  {
    id: 'operating_systems',
    canonicalName: 'Operating Systems',
    type: 'COMPUTER_SCIENCE',
    aliases: ['os', 'operating systems'],
    curriculum: [
      {
        domain: 'OS Concepts',
        topics: [
          { title: 'Processes & Threads', complexity: 'Hard', size: 'Large' },
          { title: 'CPU Scheduling', complexity: 'Hard', size: 'Large' },
          { title: 'Deadlocks', complexity: 'Very Hard', size: 'Large' },
          { title: 'Memory Management', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'File Systems', complexity: 'Hard', size: 'Large' },
        ]
      }
    ]
  },
  {
    id: 'dbms',
    canonicalName: 'DBMS',
    type: 'COMPUTER_SCIENCE',
    aliases: ['dbms', 'database management systems'],
    curriculum: [
      {
        domain: 'Database Concepts',
        topics: [
          { title: 'Relational Model', complexity: 'Medium', size: 'Medium' },
          { title: 'Normalization', complexity: 'Hard', size: 'Large' },
          { title: 'Transactions & ACID', complexity: 'Very Hard', size: 'Large' },
          { title: 'Concurrency Control', complexity: 'Very Hard', size: 'Very Large' },
          { title: 'Indexing', complexity: 'Hard', size: 'Large' },
        ]
      }
    ]
  },
  {
    id: 'computer_networks',
    canonicalName: 'Computer Networks',
    type: 'COMPUTER_SCIENCE',
    aliases: ['cn', 'computer networks', 'networking'],
    curriculum: [
      {
        domain: 'Networking Concepts',
        topics: [
          { title: 'OSI Model', complexity: 'Medium', size: 'Large' },
          { title: 'TCP/IP', complexity: 'Hard', size: 'Large' },
          { title: 'Routing Protocols', complexity: 'Very Hard', size: 'Large' },
          { title: 'Application Layer (HTTP/DNS)', complexity: 'Hard', size: 'Medium' },
        ]
      }
    ]
  }
]

export const resolveSkill = (input: string): SkillDefinition => {
  const normalized = input.toLowerCase().trim()
  
  // Try exact match in aliases
  const matched = SKILL_REGISTRY.find(s => s.aliases.includes(normalized))
  if (matched) return matched

  // Fallback / Unknown Custom Skill
  return {
    id: generateId(input),
    canonicalName: input,
    type: 'OTHER',
    aliases: [],
    curriculum: [
      {
        domain: 'Custom Learning',
        topics: [
          { title: 'Fundamentals', complexity: 'Simple', size: 'Medium' },
          { title: 'Core Concepts', complexity: 'Medium', size: 'Large' }
        ]
      }
    ]
  }
}

export const generateSubtopicsForSkill = (skillDef: SkillDefinition): SubtopicProgress[] => {
  const subtopics: SubtopicProgress[] = []
  
  skillDef.curriculum.forEach(domainGroup => {
    domainGroup.topics.forEach(topic => {
      subtopics.push({
        id: generateId(`${domainGroup.domain}-${topic.title}`),
        title: topic.title,
        domain: domainGroup.domain,
        size: topic.size,
        complexity: topic.complexity,
        baseTime: TOPIC_SIZE_BASE_TIME[topic.size],
        baseXP: TOPIC_COMPLEXITY_BASE_XP[topic.complexity],
        status: 'Not Started'
      })
    })
  })

  return subtopics
}

export const formatEstimatedTime = (timeInMinutes: number): string => {
  if (timeInMinutes <= 5) return '2–5 min'
  if (timeInMinutes <= 12) return '8–12 min'
  if (timeInMinutes <= 25) return '15–25 min'
  if (timeInMinutes <= 45) return '30–45 min'
  if (timeInMinutes <= 60) return '45–60 min'
  if (timeInMinutes <= 90) return '60–90 min'
  return '90+ min'
}

export const calculateSkillProgress = (subtopics: SubtopicProgress[]): number => {
  if (!subtopics || subtopics.length === 0) return 0
  
  let earnedPoints = 0
  let totalPoints = 0

  const complexityWeight: Record<TopicComplexity, number> = {
    'Simple': 1,
    'Medium': 2,
    'Hard': 3,
    'Very Hard': 4
  }

  subtopics.forEach(t => {
    const weight = complexityWeight[t.complexity] || 1
    totalPoints += weight
    if (t.status === 'Completed') {
      earnedPoints += weight
    }
  })

  if (totalPoints === 0) return 0
  return Math.round((earnedPoints / totalPoints) * 100)
}

export const PATHWAY_REGISTRY: import('../types').PathwayDefinition[] = [
  { id: 'frontend', name: 'Frontend Development', description: 'A structured path containing the skills required for frontend development.', aliases: ['frontend', 'front end', 'frontend development'] },
  { id: 'backend', name: 'Backend Development', description: 'Server-side programming, APIs, and databases.', aliases: ['backend', 'back end', 'backend development'] },
  { id: 'devops-cloud', name: 'DevOps / Cloud', description: 'Infrastructure, deployment, containers, and monitoring.', aliases: ['devops', 'cloud', 'devops / cloud'] },
  { id: 'cybersecurity', name: 'Cybersecurity', description: 'Security, cryptography, and ethical hacking.', aliases: ['cybersecurity', 'security', 'infosec'] },
  { id: 'databases', name: 'Databases', description: 'Data modeling, SQL, NoSQL, and database administration.', aliases: ['databases', 'db'] },
  { id: 'computer-science', name: 'Computer Science', description: 'Core CS concepts, operating systems, and architecture.', aliases: ['cs', 'computer science'] },
  { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Core algorithms and data structures.', aliases: ['dsa', 'data structures'] },
  { id: 'ai-ml', name: 'AI / Machine Learning', description: 'Artificial intelligence, machine learning, and deep learning.', aliases: ['ai', 'ml', 'machine learning', 'artificial intelligence'] },
  { id: 'programming-languages', name: 'Programming Languages', description: 'Various programming languages.', aliases: ['programming', 'languages'] }
];

export const getSkillsForPathway = (pathwayId: string): SkillDefinition[] => {
  const mapping: Record<string, string[]> = {
    'frontend': ['html', 'css', 'javascript', 'typescript', 'react', 'nextjs'],
    'backend': ['python', 'java', 'go', 'rust', 'csharp', 'postgresql', 'rest-api', 'docker'],
    'devops-cloud': ['docker', 'kubernetes', 'linux', 'python'],
    'cybersecurity': ['cybersecurity', 'cryptography', 'python'],
    'databases': ['sql', 'postgresql'],
    'computer-science': ['cs-fundamentals', 'system-design', 'python', 'c'],
    'dsa': ['dsa', 'daa', 'pointers', 'binary-trees'],
    'ai-ml': ['aiml', 'machine-learning', 'python'],
    'programming-languages': ['c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'go', 'rust', 'csharp', 'html', 'css']
  };
  const ids = mapping[pathwayId] || [];
  return ids.map(id => resolveSkill(id)).filter(Boolean) as SkillDefinition[];
};
