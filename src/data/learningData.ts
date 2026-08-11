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
    id: "git",
    canonicalName: "Git",
    type: "OTHER",
    aliases: [
      "git",
      "version control",
      "github",
      "gitlab"
    ],
    curriculum: [
      {
        domain: "Git Basics",
        topics: [
          {
            title: "Repositories",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Commits",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Branching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merging",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rebasing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stashing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Remote Repositories",
        topics: [
          {
            title: "Cloning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fetching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pulling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pushing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Forks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pull Requests",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Git",
        topics: [
          {
            title: "Cherry-picking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interactive Rebase",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Git Hooks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Submodules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bisect",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "svn",
    canonicalName: "SVN",
    type: "OTHER",
    aliases: [
      "svn",
      "subversion"
    ],
    curriculum: [
      {
        domain: "SVN Basics",
        topics: [
          {
            title: "Checking out",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Committing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Updating",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Branching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merging",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "python",
    canonicalName: "Python",
    type: "OTHER",
    aliases: [
      "python",
      "py"
    ],
    curriculum: [
      {
        domain: "Python Basics",
        topics: [
          {
            title: "Variables & Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules & Packages",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Structures",
        topics: [
          {
            title: "Lists & Tuples",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dictionaries & Sets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Comprehensions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Python",
        topics: [
          {
            title: "Decorators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context Managers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Metaclasses",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Asyncio",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "javascript",
    canonicalName: "JavaScript",
    type: "OTHER",
    aliases: [
      "javascript",
      "js",
      "ecmascript"
    ],
    curriculum: [
      {
        domain: "Core JS",
        topics: [
          {
            title: "Variables (let/const)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrow Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Closures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hoisting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Asynchronous JS",
        topics: [
          {
            title: "Promises",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Async/Await",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Event Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Callbacks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented JS",
        topics: [
          {
            title: "Prototypes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "This Keyword",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "typescript",
    canonicalName: "TypeScript",
    type: "OTHER",
    aliases: [
      "typescript",
      "ts"
    ],
    curriculum: [
      {
        domain: "Types & Interfaces",
        topics: [
          {
            title: "Basic Types",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "Interfaces vs Type Aliases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generics",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Types",
        topics: [
          {
            title: "Union & Intersection Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mapped Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Conditional Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Utility Types",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Configuration",
        topics: [
          {
            title: "tsconfig.json",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strict Mode",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Module Resolution",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "java",
    canonicalName: "Java",
    type: "OTHER",
    aliases: [
      "java",
      "jvm",
      "jdk"
    ],
    curriculum: [
      {
        domain: "Java Fundamentals",
        topics: [
          {
            title: "OOP Concepts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classes & Objects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interfaces & Abstract Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Packages",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Java Core",
        topics: [
          {
            title: "Collections Framework",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exceptions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Streams API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambdas",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency",
        topics: [
          {
            title: "Threads",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Runnables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Synchronization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Locks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "cpp",
    canonicalName: "C++",
    type: "OTHER",
    aliases: [
      "c++",
      "cpp",
      "c++11"
    ],
    curriculum: [
      {
        domain: "C++ Basics",
        topics: [
          {
            title: "Variables & Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Structures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pointers & References",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented C++",
        topics: [
          {
            title: "Classes & Objects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inheritance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Polymorphism",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Operator Overloading",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced C++",
        topics: [
          {
            title: "Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "STL (Standard Template Library)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Smart Pointers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Move Semantics",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "c",
    canonicalName: "C",
    type: "OTHER",
    aliases: [
      "c"
    ],
    curriculum: [
      {
        domain: "C Fundamentals",
        topics: [
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays & Strings",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Memory Management",
        topics: [
          {
            title: "Pointers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Memory (malloc/free)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pointer Arithmetic",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Structs & Unions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "csharp",
    canonicalName: "C#",
    type: "OTHER",
    aliases: [
      "c#",
      "csharp",
      ".net"
    ],
    curriculum: [
      {
        domain: "C# Basics",
        topics: [
          {
            title: "Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interfaces",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced C#",
        topics: [
          {
            title: "LINQ",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Delegates & Events",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Async/Await",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Attributes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "go",
    canonicalName: "Go",
    type: "OTHER",
    aliases: [
      "go",
      "golang"
    ],
    curriculum: [
      {
        domain: "Go Basics",
        topics: [
          {
            title: "Packages",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slices & Maps",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency",
        topics: [
          {
            title: "Goroutines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Channels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Select",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "WaitGroups",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mutexes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Interfaces & Error Handling",
        topics: [
          {
            title: "Interfaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Assertions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Handling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Panics & Recover",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "rust",
    canonicalName: "Rust",
    type: "OTHER",
    aliases: [
      "rust",
      "rs"
    ],
    curriculum: [
      {
        domain: "Rust Basics",
        topics: [
          {
            title: "Variables & Mutability",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ownership & Borrowing",
        topics: [
          {
            title: "Ownership Rules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "References & Borrowing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lifetimes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Rust",
        topics: [
          {
            title: "Structs & Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pattern Matching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Traits",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Concurrency",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Smart Pointers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "ruby",
    canonicalName: "Ruby",
    type: "OTHER",
    aliases: [
      "ruby"
    ],
    curriculum: [
      {
        domain: "Ruby Basics",
        topics: [
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Blocks, Procs, & Lambdas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "OOP in Ruby",
        topics: [
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inheritance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mixins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Metaprogramming",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "php",
    canonicalName: "PHP",
    type: "OTHER",
    aliases: [
      "php"
    ],
    curriculum: [
      {
        domain: "PHP Basics",
        topics: [
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Structures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced PHP",
        topics: [
          {
            title: "OOP",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Traits",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Namespaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PDO (PHP Data Objects)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Composer",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "swift",
    canonicalName: "Swift",
    type: "OTHER",
    aliases: [
      "swift",
      "ios"
    ],
    curriculum: [
      {
        domain: "Swift Basics",
        topics: [
          {
            title: "Variables & Constants",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Optionals",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions & Closures",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "OOP & Protocols",
        topics: [
          {
            title: "Classes & Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Properties & Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Protocols",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Extensions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "kotlin",
    canonicalName: "Kotlin",
    type: "OTHER",
    aliases: [
      "kotlin",
      "android"
    ],
    curriculum: [
      {
        domain: "Kotlin Basics",
        topics: [
          {
            title: "Basic Syntax",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "Null Safety",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions & Lambdas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classes & Objects",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Kotlin",
        topics: [
          {
            title: "Coroutines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Extension Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sealed Classes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "html",
    canonicalName: "HTML",
    type: "OTHER",
    aliases: [
      "html",
      "html5"
    ],
    curriculum: [
      {
        domain: "HTML Basics",
        topics: [
          {
            title: "Document Structure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Semantic HTML",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Forms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multimedia",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "css",
    canonicalName: "CSS",
    type: "OTHER",
    aliases: [
      "css",
      "css3"
    ],
    curriculum: [
      {
        domain: "CSS Basics",
        topics: [
          {
            title: "Selectors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Box Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Typography",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Colors",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "CSS Layout",
        topics: [
          {
            title: "Flexbox",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Grid",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Positioning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Responsive Design",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Media Queries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced CSS",
        topics: [
          {
            title: "Animations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transitions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Properties (Variables)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CSS Preprocessors (Sass/Less)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "react",
    canonicalName: "React",
    type: "OTHER",
    aliases: [
      "react",
      "react.js",
      "reactjs"
    ],
    curriculum: [
      {
        domain: "React Basics",
        topics: [
          {
            title: "JSX",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Props",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Event Handling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "React Hooks",
        topics: [
          {
            title: "useState",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useEffect",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useContext",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useRef",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Hooks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced React",
        topics: [
          {
            title: "Context API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Performance Optimization (Memo/Callback)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Portals",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Boundaries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "angular",
    canonicalName: "Angular",
    type: "OTHER",
    aliases: [
      "angular"
    ],
    curriculum: [
      {
        domain: "Angular Basics",
        topics: [
          {
            title: "Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Directives",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Angular Core",
        topics: [
          {
            title: "Services & DI",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Forms (Reactive & Template-driven)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RxJS & Observables",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "vue-js",
    canonicalName: "Vue.js",
    type: "OTHER",
    aliases: [
      "vue",
      "vue.js",
      "vuejs"
    ],
    curriculum: [
      {
        domain: "Vue Basics",
        topics: [
          {
            title: "Instance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template Syntax",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Computed Properties",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Watchers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Components",
        topics: [
          {
            title: "Props",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Events",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slots",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Composition API",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "svelte",
    canonicalName: "Svelte",
    type: "OTHER",
    aliases: [
      "svelte"
    ],
    curriculum: [
      {
        domain: "Svelte Basics",
        topics: [
          {
            title: "Reactivity",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Props",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Logic Blocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Events",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Svelte",
        topics: [
          {
            title: "Stores",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lifecycle",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Actions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transitions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "tailwind-css",
    canonicalName: "Tailwind CSS",
    type: "OTHER",
    aliases: [
      "tailwind",
      "tailwindcss"
    ],
    curriculum: [
      {
        domain: "Tailwind Basics",
        topics: [
          {
            title: "Utility-First Concept",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Responsive Design",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hover & Focus States",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Customization",
        topics: [
          {
            title: "Configuration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Adding Custom Styles",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Plugins",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "figma",
    canonicalName: "Figma",
    type: "OTHER",
    aliases: [
      "figma"
    ],
    curriculum: [
      {
        domain: "Figma Basics",
        topics: [
          {
            title: "Frames",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shapes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Text",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Constraints",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Figma",
        topics: [
          {
            title: "Auto Layout",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variants",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Prototyping",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "node-js",
    canonicalName: "Node.js",
    type: "OTHER",
    aliases: [
      "node.js",
      "node",
      "nodejs"
    ],
    curriculum: [
      {
        domain: "Node Basics",
        topics: [
          {
            title: "Event Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules (CommonJS vs ESM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NPM/Yarn",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "File System",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Web Servers",
        topics: [
          {
            title: "HTTP Module",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Express.js Basics",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "Middleware",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Routing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "express-js",
    canonicalName: "Express.js",
    type: "OTHER",
    aliases: [
      "express",
      "express.js"
    ],
    curriculum: [
      {
        domain: "Express Basics",
        topics: [
          {
            title: "Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Middleware",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Request/Response Objects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Handling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "nestjs",
    canonicalName: "NestJS",
    type: "OTHER",
    aliases: [
      "nestjs",
      "nest"
    ],
    curriculum: [
      {
        domain: "NestJS Core",
        topics: [
          {
            title: "Controllers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Providers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Middleware",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exception Filters",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Guards",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interceptors",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "django",
    canonicalName: "Django",
    type: "OTHER",
    aliases: [
      "django"
    ],
    curriculum: [
      {
        domain: "Django Basics",
        topics: [
          {
            title: "Models",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Views",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "URLs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Admin Interface",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Django",
        topics: [
          {
            title: "ORM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Forms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authentication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Django REST Framework",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "flask",
    canonicalName: "Flask",
    type: "OTHER",
    aliases: [
      "flask"
    ],
    curriculum: [
      {
        domain: "Flask Basics",
        topics: [
          {
            title: "Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Templates (Jinja2)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Request Data",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Responses",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Flask",
        topics: [
          {
            title: "Blueprints",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Application Context",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Extensions (SQLAlchemy, Migrate)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "spring-boot",
    canonicalName: "Spring Boot",
    type: "OTHER",
    aliases: [
      "spring",
      "spring boot"
    ],
    curriculum: [
      {
        domain: "Spring Basics",
        topics: [
          {
            title: "Dependency Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inversion of Control",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spring MVC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spring Data JPA",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Spring",
        topics: [
          {
            title: "Spring Security",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Actuator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Microservices with Spring Cloud",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "graphql",
    canonicalName: "GraphQL",
    type: "OTHER",
    aliases: [
      "graphql",
      "gql"
    ],
    curriculum: [
      {
        domain: "GraphQL Basics",
        topics: [
          {
            title: "Queries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mutations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Schemas & Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Resolvers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced GraphQL",
        topics: [
          {
            title: "Subscriptions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fragments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Directives",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Apollo Client/Server",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "rest-api",
    canonicalName: "REST API",
    type: "OTHER",
    aliases: [
      "rest",
      "restful"
    ],
    curriculum: [
      {
        domain: "REST Basics",
        topics: [
          {
            title: "HTTP Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Status Codes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Resource Naming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Statelessness",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "API Design",
        topics: [
          {
            title: "Versioning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pagination",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Filtering & Sorting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authentication (OAuth/JWT)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "grpc",
    canonicalName: "gRPC",
    type: "OTHER",
    aliases: [
      "grpc",
      "protobuf"
    ],
    curriculum: [
      {
        domain: "gRPC Basics",
        topics: [
          {
            title: "Protocol Buffers (Protobuf)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Service Definition",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Unary RPC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Streaming RPC (Server, Client, Bidirectional)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "sql",
    canonicalName: "SQL",
    type: "OTHER",
    aliases: [
      "sql",
      "relational-database"
    ],
    curriculum: [
      {
        domain: "SQL Basics",
        topics: [
          {
            title: "SELECT",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "WHERE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ORDER BY",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GROUP BY",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "HAVING",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Joins & Relations",
        topics: [
          {
            title: "INNER JOIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LEFT/RIGHT JOIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "FULL OUTER JOIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Self Joins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Subqueries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "DDL & DML",
        topics: [
          {
            title: "CREATE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ALTER",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DROP",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "INSERT",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UPDATE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DELETE",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced SQL",
        topics: [
          {
            title: "Indexes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transactions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Views",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stored Procedures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Triggers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Window Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "postgresql",
    canonicalName: "PostgreSQL",
    type: "OTHER",
    aliases: [
      "postgresql",
      "postgres",
      "psql"
    ],
    curriculum: [
      {
        domain: "Postgres Basics",
        topics: [
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JSONB",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Array Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "psql CLI",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Postgres",
        topics: [
          {
            title: "Full Text Search",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PostGIS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partitioning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vacuuming",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "mysql",
    canonicalName: "MySQL",
    type: "OTHER",
    aliases: [
      "mysql",
      "mariadb"
    ],
    curriculum: [
      {
        domain: "MySQL Basics",
        topics: [
          {
            title: "Storage Engines (InnoDB vs MyISAM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "User Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced MySQL",
        topics: [
          {
            title: "Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Clustering",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Performance Tuning",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Backup & Restore",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "mongodb",
    canonicalName: "MongoDB",
    type: "OTHER",
    aliases: [
      "mongodb",
      "mongo",
      "nosql"
    ],
    curriculum: [
      {
        domain: "MongoDB Basics",
        topics: [
          {
            title: "Documents & Collections",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "BSON",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CRUD Operations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Indexes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced MongoDB",
        topics: [
          {
            title: "Aggregation Pipeline",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replica Sets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sharding",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Modeling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "redis",
    canonicalName: "Redis",
    type: "OTHER",
    aliases: [
      "redis",
      "caching"
    ],
    curriculum: [
      {
        domain: "Redis Basics",
        topics: [
          {
            title: "Strings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lists",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hashes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sorted Sets",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Redis",
        topics: [
          {
            title: "Pub/Sub",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transactions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Persistence (RDB/AOF)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Redis Cluster",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Eviction Policies",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "elasticsearch",
    canonicalName: "Elasticsearch",
    type: "OTHER",
    aliases: [
      "elasticsearch",
      "elk"
    ],
    curriculum: [
      {
        domain: "Elasticsearch Basics",
        topics: [
          {
            title: "Documents & Indices",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mapping",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Basic Search Queries",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "Text Analysis",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Elasticsearch",
        topics: [
          {
            title: "Aggregations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cluster Management",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Logstash & Kibana Integration",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "cassandra",
    canonicalName: "Cassandra",
    type: "OTHER",
    aliases: [
      "cassandra",
      "apache cassandra"
    ],
    curriculum: [
      {
        domain: "Cassandra Basics",
        topics: [
          {
            title: "Data Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CQL (Cassandra Query Language)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partitioning & Clustering Keys",
            complexity: "Very Hard",
            size: "Very Large"
          }
        ]
      },
      {
        domain: "Advanced Cassandra",
        topics: [
          {
            title: "Architecture (Ring, Gossip)",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Consistency Levels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tombstones",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Compaction",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "apache-kafka",
    canonicalName: "Apache Kafka",
    type: "OTHER",
    aliases: [
      "kafka",
      "event-streaming"
    ],
    curriculum: [
      {
        domain: "Kafka Basics",
        topics: [
          {
            title: "Topics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Producers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consumers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Brokers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partitions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Offsets",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Kafka",
        topics: [
          {
            title: "Consumer Groups",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Zookeeper/KRaft",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Kafka Streams",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Kafka Connect",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "apache-spark",
    canonicalName: "Apache Spark",
    type: "OTHER",
    aliases: [
      "spark",
      "apache spark"
    ],
    curriculum: [
      {
        domain: "Spark Basics",
        topics: [
          {
            title: "RDDs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DataFrames",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Datasets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transformations & Actions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Spark",
        topics: [
          {
            title: "Spark SQL",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spark Streaming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Machine Learning Library (MLlib)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Performance Tuning",
            complexity: "Very Hard",
            size: "Very Large"
          }
        ]
      }
    ]
  },
  {
    id: "airflow",
    canonicalName: "Airflow",
    type: "OTHER",
    aliases: [
      "airflow",
      "apache airflow"
    ],
    curriculum: [
      {
        domain: "Airflow Basics",
        topics: [
          {
            title: "DAGs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tasks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Operators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scheduling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Airflow",
        topics: [
          {
            title: "XComs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables & Connections",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Operators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "docker",
    canonicalName: "Docker",
    type: "OTHER",
    aliases: [
      "docker",
      "containers",
      "containerization"
    ],
    curriculum: [
      {
        domain: "Docker Basics",
        topics: [
          {
            title: "Images",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Containers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dockerfile",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Volumes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Networks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Docker Compose",
        topics: [
          {
            title: "docker-compose.yml",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Environment Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multi-container apps",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Docker",
        topics: [
          {
            title: "Multi-stage Builds",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Security Scanning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Registry Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "kubernetes",
    canonicalName: "Kubernetes",
    type: "OTHER",
    aliases: [
      "kubernetes",
      "k8s",
      "container orchestration"
    ],
    curriculum: [
      {
        domain: "K8s Basics",
        topics: [
          {
            title: "Pods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ReplicaSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Deployments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Namespaces",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Configuration & Storage",
        topics: [
          {
            title: "ConfigMaps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Secrets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Volumes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PersistentVolumes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PersistentVolumeClaims",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced K8s",
        topics: [
          {
            title: "Ingress",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DaemonSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "StatefulSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jobs & CronJobs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Helm Charts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RBAC",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "aws",
    canonicalName: "AWS",
    type: "OTHER",
    aliases: [
      "aws",
      "amazon web services",
      "cloud"
    ],
    curriculum: [
      {
        domain: "Compute",
        topics: [
          {
            title: "EC2",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambda",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ECS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "EKS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Elastic Beanstalk",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & DB",
        topics: [
          {
            title: "S3",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "EBS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "EFS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RDS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DynamoDB",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ElastiCache",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Security",
        topics: [
          {
            title: "VPC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Route 53",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CloudFront",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "IAM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "KMS",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Management",
        topics: [
          {
            title: "CloudWatch",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CloudFormation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Terraform on AWS",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "google-cloud-platform",
    canonicalName: "Google Cloud Platform",
    type: "OTHER",
    aliases: [
      "gcp",
      "google cloud"
    ],
    curriculum: [
      {
        domain: "Compute",
        topics: [
          {
            title: "Compute Engine",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud Run",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GKE (Google Kubernetes Engine)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "App Engine",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & DB",
        topics: [
          {
            title: "Cloud Storage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud SQL",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud Spanner",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Firestore",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bigtable",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data & Analytics",
        topics: [
          {
            title: "BigQuery",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dataflow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pub/Sub",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dataproc",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Security",
        topics: [
          {
            title: "VPC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud Load Balancing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud IAM",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "microsoft-azure",
    canonicalName: "Microsoft Azure",
    type: "OTHER",
    aliases: [
      "azure",
      "microsoft azure"
    ],
    curriculum: [
      {
        domain: "Compute",
        topics: [
          {
            title: "Virtual Machines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "App Service",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AKS (Azure Kubernetes Service)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & DB",
        topics: [
          {
            title: "Blob Storage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure SQL Database",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cosmos DB",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Cache for Redis",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Security",
        topics: [
          {
            title: "Virtual Network",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Active Directory (Entra ID)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Key Vault",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "terraform",
    canonicalName: "Terraform",
    type: "OTHER",
    aliases: [
      "terraform",
      "iac",
      "infrastructure as code"
    ],
    curriculum: [
      {
        domain: "Terraform Basics",
        topics: [
          {
            title: "Providers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Resources",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Sources",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables & Outputs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Terraform",
        topics: [
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Workspaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Provisioners",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Remote State",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Terraform Cloud",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "ci-cd",
    canonicalName: "CI/CD",
    type: "OTHER",
    aliases: [
      "ci/cd",
      "continuous integration",
      "continuous deployment"
    ],
    curriculum: [
      {
        domain: "CI/CD Concepts",
        topics: [
          {
            title: "Continuous Integration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Continuous Delivery",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Continuous Deployment",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipelines",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Tools",
        topics: [
          {
            title: "GitHub Actions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GitLab CI",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jenkins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CircleCI",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Practices",
        topics: [
          {
            title: "Automated Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Artifact Management",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Deployment Strategies (Blue/Green, Canary)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "linux",
    canonicalName: "Linux",
    type: "OTHER",
    aliases: [
      "linux",
      "unix",
      "shell"
    ],
    curriculum: [
      {
        domain: "Linux Basics",
        topics: [
          {
            title: "File System Hierarchy",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Basic Commands (ls, cd, cp, rm)",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "File Permissions (chmod, chown)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Process Management",
        topics: [
          {
            title: "ps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "top/htop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "kill",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Background Jobs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Text",
        topics: [
          {
            title: "ping",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "curl/wget",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "grep",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "awk",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "sed",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "tar/gzip",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Bash Scripting",
        topics: [
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Loops",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Conditionals",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cron Jobs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "nginx",
    canonicalName: "Nginx",
    type: "OTHER",
    aliases: [
      "nginx",
      "web-server",
      "reverse-proxy"
    ],
    curriculum: [
      {
        domain: "Nginx Basics",
        topics: [
          {
            title: "Installation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Configuration Structure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Static File Serving",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Nginx",
        topics: [
          {
            title: "Reverse Proxy",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Load Balancing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SSL/TLS Termination",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caching",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "data-structures",
    canonicalName: "Data Structures",
    type: "OTHER",
    aliases: [
      "data structures",
      "ds"
    ],
    curriculum: [
      {
        domain: "Linear Structures",
        topics: [
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Linked Lists",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stacks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Queues",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Trees & Graphs",
        topics: [
          {
            title: "Binary Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Binary Search Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Heaps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Graphs (Directed/Undirected)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Hashing",
        topics: [
          {
            title: "Hash Tables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hash Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Collision Resolution",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "algorithms",
    canonicalName: "Algorithms",
    type: "OTHER",
    aliases: [
      "algorithms",
      "algo"
    ],
    curriculum: [
      {
        domain: "Sorting & Searching",
        topics: [
          {
            title: "Bubble/Selection/Insertion Sort",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merge/Quick Sort",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Binary Search",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graph Algorithms",
        topics: [
          {
            title: "BFS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DFS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dijkstra's",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "A* Search",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Minimum Spanning Tree",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Paradigms",
        topics: [
          {
            title: "Divide & Conquer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Programming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Greedy Algorithms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Backtracking",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Complexity",
        topics: [
          {
            title: "Big O Notation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Time Complexity",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Space Complexity",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "system-design",
    canonicalName: "System Design",
    type: "OTHER",
    aliases: [
      "system design",
      "architecture"
    ],
    curriculum: [
      {
        domain: "Core Concepts",
        topics: [
          {
            title: "Scalability (Horizontal vs Vertical)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Latency vs Throughput",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CAP Theorem",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PACELC Theorem",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Components",
        topics: [
          {
            title: "Load Balancers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caches",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Databases (SQL vs NoSQL)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Message Queues",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CDNs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Patterns",
        topics: [
          {
            title: "Microservices",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Event-Driven Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Sharding",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consistent Hashing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "design-patterns",
    canonicalName: "Design Patterns",
    type: "OTHER",
    aliases: [
      "design patterns",
      "oop patterns"
    ],
    curriculum: [
      {
        domain: "Creational Patterns",
        topics: [
          {
            title: "Singleton",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Factory Method",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Abstract Factory",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Builder",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Prototype",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Structural Patterns",
        topics: [
          {
            title: "Adapter",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bridge",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Composite",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Decorator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Facade",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Proxy",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Behavioral Patterns",
        topics: [
          {
            title: "Observer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strategy",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Command",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template Method",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Visitor",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "networking-fundamentals",
    canonicalName: "Networking Fundamentals",
    type: "OTHER",
    aliases: [
      "networking",
      "computer networks"
    ],
    curriculum: [
      {
        domain: "OSI & TCP/IP Models",
        topics: [
          {
            title: "Physical/Data Link",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Network (IP)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transport (TCP/UDP)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Application (HTTP, DNS)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Web Protocols",
        topics: [
          {
            title: "HTTP/HTTPS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DNS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "WebSockets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SSL/TLS Handshake",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Network Devices & Concepts",
        topics: [
          {
            title: "Routers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Switches",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Firewalls",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Subnetting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NAT",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "operating-systems-fundamentals",
    canonicalName: "Operating Systems Fundamentals",
    type: "OTHER",
    aliases: [
      "operating systems",
      "os"
    ],
    curriculum: [
      {
        domain: "Process Management",
        topics: [
          {
            title: "Processes vs Threads",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scheduling Algorithms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context Switching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inter-process Communication (IPC)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency",
        topics: [
          {
            title: "Deadlocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mutexes & Semaphores",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Race Conditions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Memory Management",
        topics: [
          {
            title: "Virtual Memory",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Paging",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Segmentation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Thrashing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & File Systems",
        topics: [
          {
            title: "File System Implementation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Disk Scheduling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RAID",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "cybersecurity-fundamentals",
    canonicalName: "Cybersecurity Fundamentals",
    type: "OTHER",
    aliases: [
      "cybersecurity",
      "infosec",
      "security"
    ],
    curriculum: [
      {
        domain: "Core Concepts",
        topics: [
          {
            title: "CIA Triad",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authentication vs Authorization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Principle of Least Privilege",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Zero Trust",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Cryptography",
        topics: [
          {
            title: "Symmetric Encryption (AES)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Asymmetric Encryption (RSA)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hashing (SHA)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Digital Signatures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PKI",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Network Security",
        topics: [
          {
            title: "Firewalls",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "IDS/IPS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "VPNs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Network Segmentation",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "owasp-top-10",
    canonicalName: "OWASP Top 10",
    type: "OTHER",
    aliases: [
      "owasp",
      "web security",
      "appsec"
    ],
    curriculum: [
      {
        domain: "Injection & Auth",
        topics: [
          {
            title: "SQL Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cross-Site Scripting (XSS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Broken Authentication",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data & Config",
        topics: [
          {
            title: "Sensitive Data Exposure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Security Misconfiguration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "XML External Entities (XXE)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Access & Monitoring",
        topics: [
          {
            title: "Broken Access Control",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Insecure Deserialization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Insufficient Logging & Monitoring",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "penetration-testing",
    canonicalName: "Penetration Testing",
    type: "OTHER",
    aliases: [
      "pentesting",
      "ethical hacking"
    ],
    curriculum: [
      {
        domain: "Methodology",
        topics: [
          {
            title: "Reconnaissance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scanning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exploitation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Post-Exploitation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reporting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Tools",
        topics: [
          {
            title: "Nmap",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Burp Suite",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Metasploit",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Wireshark",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "machine-learning",
    canonicalName: "Machine Learning",
    type: "OTHER",
    aliases: [
      "ml",
      "machine learning"
    ],
    curriculum: [
      {
        domain: "Supervised Learning",
        topics: [
          {
            title: "Linear Regression",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Logistic Regression",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Decision Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Random Forests",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SVM",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Unsupervised Learning",
        topics: [
          {
            title: "K-Means Clustering",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "PCA (Principal Component Analysis)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Anomaly Detection",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Model Evaluation",
        topics: [
          {
            title: "Cross-Validation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Precision, Recall, F1-Score",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ROC/AUC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Overfitting/Underfitting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "deep-learning",
    canonicalName: "Deep Learning",
    type: "OTHER",
    aliases: [
      "deep learning",
      "dl",
      "neural networks"
    ],
    curriculum: [
      {
        domain: "Neural Networks",
        topics: [
          {
            title: "Perceptrons",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Activation Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Backpropagation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Loss Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Optimizers (Adam, SGD)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architectures",
        topics: [
          {
            title: "CNNs (Convolutional Neural Networks)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RNNs & LSTMs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transformers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Autoencoders",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "generative-ai",
    canonicalName: "Generative AI",
    type: "OTHER",
    aliases: [
      "generative ai",
      "genai",
      "llm",
      "large language models"
    ],
    curriculum: [
      {
        domain: "Core Concepts",
        topics: [
          {
            title: "Transformers Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Attention Mechanism",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Embeddings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tokenization",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Prompt Engineering",
        topics: [
          {
            title: "Zero-shot/Few-shot",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Chain of Thought",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RAG (Retrieval-Augmented Generation)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Model Fine-Tuning",
        topics: [
          {
            title: "LoRA/QLoRA",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RLHF",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Instruction Tuning",
            complexity: "Very Hard",
            size: "Very Large"
          }
        ]
      },
      {
        domain: "Frameworks & APIs",
        topics: [
          {
            title: "OpenAI API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LangChain",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LlamaIndex",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hugging Face",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "tensorflow",
    canonicalName: "TensorFlow",
    type: "OTHER",
    aliases: [
      "tensorflow",
      "tf"
    ],
    curriculum: [
      {
        domain: "TF Basics",
        topics: [
          {
            title: "Tensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Operations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Autodiff",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Keras API",
        topics: [
          {
            title: "Sequential Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functional API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Layers & Models",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Callbacks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Deployment",
        topics: [
          {
            title: "TF Serving",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TF Lite",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TensorFlow.js",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "pytorch",
    canonicalName: "PyTorch",
    type: "OTHER",
    aliases: [
      "pytorch",
      "torch"
    ],
    curriculum: [
      {
        domain: "PyTorch Basics",
        topics: [
          {
            title: "Tensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Autograd",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "nn.Module",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Optimizers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Handling",
        topics: [
          {
            title: "Datasets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DataLoaders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transforms",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced PyTorch",
        topics: [
          {
            title: "Custom Autograd Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Distributed Training",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "TorchScript",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ONNX Export",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "pandas",
    canonicalName: "Pandas",
    type: "OTHER",
    aliases: [
      "pandas"
    ],
    curriculum: [
      {
        domain: "Pandas Basics",
        topics: [
          {
            title: "Series",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DataFrames",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reading/Writing Data (CSV, Excel, SQL)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Manipulation",
        topics: [
          {
            title: "Indexing & Selecting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Filtering",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Missing Data",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Grouping & Aggregation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merging & Joining",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "numpy",
    canonicalName: "NumPy",
    type: "OTHER",
    aliases: [
      "numpy"
    ],
    curriculum: [
      {
        domain: "NumPy Basics",
        topics: [
          {
            title: "Ndarrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Array Creation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Indexing & Slicing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Operations",
        topics: [
          {
            title: "Broadcasting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mathematical Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Linear Algebra (numpy.linalg)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "react-native",
    canonicalName: "React Native",
    type: "OTHER",
    aliases: [
      "react native",
      "rn"
    ],
    curriculum: [
      {
        domain: "RN Basics",
        topics: [
          {
            title: "Core Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Styling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Touches",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Navigation (React Navigation)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Native Device Features",
        topics: [
          {
            title: "Camera",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Location",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Storage (AsyncStorage)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Push Notifications",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced RN",
        topics: [
          {
            title: "Animations (Reanimated)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Native Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Over-the-Air Updates",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "flutter",
    canonicalName: "Flutter",
    type: "OTHER",
    aliases: [
      "flutter",
      "dart"
    ],
    curriculum: [
      {
        domain: "Flutter Basics",
        topics: [
          {
            title: "Widgets (Stateless vs Stateful)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layouts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Material & Cupertino",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State Management (Provider/Riverpod)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Flutter",
        topics: [
          {
            title: "Animations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Networking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Local Storage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Platform Channels",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "android-development",
    canonicalName: "Android Development",
    type: "OTHER",
    aliases: [
      "android",
      "android sdk"
    ],
    curriculum: [
      {
        domain: "Android Basics",
        topics: [
          {
            title: "Activities",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fragments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Intents",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Manifest",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Resources",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "UI & Layouts",
        topics: [
          {
            title: "XML Layouts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ConstraintLayout",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RecyclerView",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jetpack Compose",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture & Data",
        topics: [
          {
            title: "MVVM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ViewModel",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LiveData",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Room Database",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Retrofit",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "ios-development",
    canonicalName: "iOS Development",
    type: "OTHER",
    aliases: [
      "ios",
      "ios sdk"
    ],
    curriculum: [
      {
        domain: "iOS Basics",
        topics: [
          {
            title: "App Lifecycle",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ViewControllers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Storyboards vs Programmatic UI",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "SwiftUI",
        topics: [
          {
            title: "Views & Modifiers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State & Binding",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lists & Navigation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Combine Framework",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data & Networking",
        topics: [
          {
            title: "CoreData",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "URLSession",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Codable",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "testing-fundamentals",
    canonicalName: "Testing Fundamentals",
    type: "OTHER",
    aliases: [
      "testing",
      "qa",
      "software testing"
    ],
    curriculum: [
      {
        domain: "Testing Types",
        topics: [
          {
            title: "Unit Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Integration Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "End-to-End (E2E) Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Performance Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Security Testing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concepts",
        topics: [
          {
            title: "Test-Driven Development (TDD)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Behavior-Driven Development (BDD)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mocking & Stubbing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Code Coverage",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "jest",
    canonicalName: "Jest",
    type: "OTHER",
    aliases: [
      "jest"
    ],
    curriculum: [
      {
        domain: "Jest Basics",
        topics: [
          {
            title: "Writing Tests",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Matchers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Setup & Teardown",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Mocking",
        topics: [
          {
            title: "Mock Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mocking Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Timer Mocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Snapshot Testing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "cypress",
    canonicalName: "Cypress",
    type: "OTHER",
    aliases: [
      "cypress"
    ],
    curriculum: [
      {
        domain: "Cypress Basics",
        topics: [
          {
            title: "Writing E2E Tests",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Selectors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Assertions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interacting with Elements",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Cypress",
        topics: [
          {
            title: "Network Stubbing (cy.intercept)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Commands",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CI Integration",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "selenium",
    canonicalName: "Selenium",
    type: "OTHER",
    aliases: [
      "selenium",
      "webdriver"
    ],
    curriculum: [
      {
        domain: "Selenium Basics",
        topics: [
          {
            title: "WebDriver",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Locators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Waits (Implicit vs Explicit)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Page Object Model (POM)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "blockchain-fundamentals",
    canonicalName: "Blockchain Fundamentals",
    type: "OTHER",
    aliases: [
      "blockchain",
      "crypto",
      "web3"
    ],
    curriculum: [
      {
        domain: "Core Concepts",
        topics: [
          {
            title: "Distributed Ledgers",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Cryptography in Blockchain",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consensus Mechanisms (PoW, PoS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Smart Contracts",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ecosystems",
        topics: [
          {
            title: "Bitcoin",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Ethereum",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layer 2 Solutions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DeFi (Decentralized Finance)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NFTs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "solidity",
    canonicalName: "Solidity",
    type: "OTHER",
    aliases: [
      "solidity",
      "smart contracts"
    ],
    curriculum: [
      {
        domain: "Solidity Basics",
        topics: [
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mappings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Smart Contracts",
        topics: [
          {
            title: "Deploying",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modifiers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Events",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inheritance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interfaces",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security & Advanced",
        topics: [
          {
            title: "Reentrancy Attacks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gas Optimization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Oracles (Chainlink)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ERC-20 & ERC-721 Standards",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "game-development-fundamentals",
    canonicalName: "Game Development Fundamentals",
    type: "OTHER",
    aliases: [
      "gamedev",
      "game design"
    ],
    curriculum: [
      {
        domain: "Core Concepts",
        topics: [
          {
            title: "Game Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Delta Time",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Physics Engines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Collision Detection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AI & Pathfinding (A*)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graphics",
        topics: [
          {
            title: "Rendering Pipeline",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shaders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Textures & Materials",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lighting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "unity",
    canonicalName: "Unity",
    type: "OTHER",
    aliases: [
      "unity",
      "unity3d"
    ],
    curriculum: [
      {
        domain: "Unity Basics",
        topics: [
          {
            title: "GameObjects & Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scenes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Prefabs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "C# Scripting in Unity",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Physics & Animation",
        topics: [
          {
            title: "Rigidbodies",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Colliders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Animator Controller",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UI System (UGUI)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Unity",
        topics: [
          {
            title: "ScriptableObjects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Coroutines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AssetBundles",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multiplayer (Netcode)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "unreal-engine",
    canonicalName: "Unreal Engine",
    type: "OTHER",
    aliases: [
      "unreal",
      "ue4",
      "ue5"
    ],
    curriculum: [
      {
        domain: "Unreal Basics",
        topics: [
          {
            title: "Actors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Levels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Blueprints Visual Scripting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "C++ in Unreal",
        topics: [
          {
            title: "UObject",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AActor",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Macros (UPROPERTY, UFUNCTION)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Unreal",
        topics: [
          {
            title: "Materials",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lumen & Nanite",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multiplayer & Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Animation Blueprints",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "embedded-systems-fundamentals",
    canonicalName: "Embedded Systems Fundamentals",
    type: "OTHER",
    aliases: [
      "embedded systems",
      "firmware",
      "microcontrollers"
    ],
    curriculum: [
      {
        domain: "Hardware Concepts",
        topics: [
          {
            title: "Microcontrollers vs Microprocessors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory (RAM, ROM, Flash)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Timers & Counters",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interrupts",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Communication Protocols",
        topics: [
          {
            title: "UART/USART",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SPI",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "I2C",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CAN bus",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Software",
        topics: [
          {
            title: "Bare-metal Programming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RTOS (Real-Time Operating Systems)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory-mapped I/O",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Low-power modes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "arduino",
    canonicalName: "Arduino",
    type: "OTHER",
    aliases: [
      "arduino"
    ],
    curriculum: [
      {
        domain: "Arduino Basics",
        topics: [
          {
            title: "Setup & Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Digital I/O",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Analog I/O",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PWM",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Sensors & Actuators",
        topics: [
          {
            title: "Reading Sensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Controlling Motors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Libraries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: "raspberry-pi",
    canonicalName: "Raspberry Pi",
    type: "OTHER",
    aliases: [
      "raspberry pi",
      "rpi"
    ],
    curriculum: [
      {
        domain: "Raspberry Pi Basics",
        topics: [
          {
            title: "OS Installation (Raspberry Pi OS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GPIO Pins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Python for Pi",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Projects",
        topics: [
          {
            title: "Camera Module",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Networking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "IoT Integration",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      }
    ]
  }
];

export const resolveSkill = (input: string): SkillDefinition => {
  const normalized = input.toLowerCase().trim()
  
  // Try exact match in aliases or id or canonical name
  const matched = SKILL_REGISTRY.find(s => s.aliases.includes(normalized) || s.id === normalized || s.canonicalName.toLowerCase() === normalized)
  if (matched) return matched

  // Try partial match on canonical name
  const partial = SKILL_REGISTRY.find(s => s.canonicalName.toLowerCase().includes(normalized))
  if (partial) return partial

  // Fallback / Unknown Custom Skill
  return {
    id: input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
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
    'computer-science-fundamentals': [
        'cpp',
        'c',
        'linux',
        'data-structures',
        'algorithms',
        'networking-fundamentals',
        'operating-systems-fundamentals',
        'machine-learning',
        'blockchain-fundamentals',
        'embedded-systems-fundamentals'
    ],
    'programming-languages': [
        'python',
        'javascript',
        'typescript',
        'java',
        'cpp',
        'c',
        'csharp',
        'go',
        'rust',
        'ruby',
        'php',
        'swift',
        'kotlin',
        'solidity'
    ],
    'data-structures-algorithms': [
        'data-structures',
        'algorithms'
    ],
    'frontend-development': [
        'javascript',
        'typescript',
        'html',
        'css',
        'react',
        'angular',
        'vue-js',
        'svelte',
        'tailwind-css',
        'graphql',
        'react-native',
        'flutter',
        'jest',
        'cypress'
    ],
    'backend-development': [
        'python',
        'javascript',
        'typescript',
        'java',
        'csharp',
        'go',
        'rust',
        'ruby',
        'php',
        'kotlin',
        'node-js',
        'express-js',
        'nestjs',
        'django',
        'flask',
        'spring-boot',
        'graphql',
        'rest-api',
        'grpc',
        'sql',
        'postgresql',
        'mysql',
        'mongodb',
        'redis',
        'elasticsearch',
        'apache-kafka',
        'docker',
        'aws',
        'nginx',
        'owasp-top-10',
        'jest'
    ],
    'full-stack-development': [
        'react',
        'angular',
        'vue-js',
        'node-js'
    ],
    'mobile-development': [
        'java',
        'csharp',
        'swift',
        'kotlin',
        'react-native',
        'flutter',
        'android-development',
        'ios-development'
    ],
    'databases': [
        'sql',
        'postgresql',
        'mysql',
        'mongodb',
        'redis',
        'elasticsearch',
        'cassandra'
    ],
    'data-engineering': [
        'sql',
        'postgresql',
        'cassandra',
        'apache-kafka',
        'apache-spark',
        'airflow',
        'google-cloud-platform',
        'pandas',
        'numpy'
    ],
    'data-science': [
        'python',
        'sql',
        'apache-spark',
        'machine-learning',
        'deep-learning',
        'tensorflow',
        'pytorch',
        'pandas',
        'numpy'
    ],
    'ai-machine-learning': [
        'python',
        'machine-learning',
        'deep-learning',
        'generative-ai',
        'tensorflow',
        'pytorch',
        'numpy'
    ],
    'deep-learning': [
        'deep-learning',
        'generative-ai',
        'tensorflow',
        'pytorch'
    ],
    'generative-ai-llms': [
        'generative-ai'
    ],
    'devops': [
        'git',
        'go',
        'redis',
        'elasticsearch',
        'docker',
        'kubernetes',
        'aws',
        'google-cloud-platform',
        'microsoft-azure',
        'terraform',
        'ci-cd',
        'linux',
        'nginx'
    ],
    'cloud-computing': [
        'go',
        'docker',
        'kubernetes',
        'aws',
        'google-cloud-platform',
        'microsoft-azure',
        'terraform'
    ],
    'cybersecurity': [
        'cybersecurity-fundamentals',
        'owasp-top-10',
        'penetration-testing'
    ],
    'networking': [
        'nginx',
        'networking-fundamentals',
        'cybersecurity-fundamentals'
    ],
    'operating-systems': [
        'c',
        'linux',
        'operating-systems-fundamentals',
        'raspberry-pi'
    ],
    'software-engineering': [
        'git',
        'java',
        'docker',
        'ci-cd',
        'data-structures',
        'algorithms',
        'design-patterns',
        'cybersecurity-fundamentals',
        'testing-fundamentals',
        'game-development-fundamentals'
    ],
    'system-design': [
        'rust',
        'system-design',
        'networking-fundamentals'
    ],
    'software-architecture': [
        'spring-boot',
        'system-design',
        'design-patterns'
    ],
    'testing-qa': [
        'testing-fundamentals',
        'jest',
        'cypress',
        'selenium'
    ],
    'version-control': [
        'git',
        'svn'
    ],
    'developer-tools': [],
    'apis': [
        'node-js',
        'express-js',
        'nestjs',
        'django',
        'flask',
        'spring-boot',
        'graphql',
        'rest-api',
        'grpc'
    ],
    'distributed-systems': [
        'rest-api',
        'grpc',
        'cassandra',
        'apache-kafka',
        'kubernetes',
        'system-design',
        'blockchain-fundamentals'
    ],
    'web-development': [
        'javascript',
        'typescript',
        'php',
        'html',
        'css',
        'react',
        'angular',
        'vue-js',
        'svelte',
        'owasp-top-10',
        'cypress',
        'selenium'
    ],
    'game-development': [
        'cpp',
        'csharp',
        'game-development-fundamentals',
        'unity',
        'unreal-engine'
    ],
    'blockchain-web3': [
        'rust',
        'blockchain-fundamentals',
        'solidity'
    ],
    'embedded-systems': [
        'cpp',
        'c',
        'embedded-systems-fundamentals',
        'arduino',
        'raspberry-pi'
    ],
    'iot': [
        'embedded-systems-fundamentals',
        'arduino',
        'raspberry-pi'
    ],
    'ui-ux-for-developers': [
        'html',
        'css',
        'tailwind-css',
        'figma'
    ],
    'automation-scripting': [
        'python',
        'ruby',
        'airflow',
        'terraform',
        'ci-cd',
        'linux',
        'pandas',
        'selenium'
    ]
};
  const ids = mapping[pathwayId] || [];
  return ids.map(id => resolveSkill(id)).filter(Boolean) as SkillDefinition[];
};