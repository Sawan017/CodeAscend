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
        domain: "Core Operations",
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
            title: "Staging Area",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Diffs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Status",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Branching & Merging",
        topics: [
          {
            title: "Branch Creation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fast-Forward Merges",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "3-Way Merges",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merge Conflicts",
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
        domain: "Remote Collaboration",
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
          },
          {
            title: "Upstreams",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "History & Diagnostics",
        topics: [
          {
            title: "Git Log",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Blame",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bisect",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reflog",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Configuration & Automation",
        topics: [
          {
            title: "Git Config",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Aliases",
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
            title: "Gitattributes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gitignore",
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
        domain: "Centralized Version Control",
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
          },
          {
            title: "Tags",
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
    id: "python",
    canonicalName: "Python",
    type: "OTHER",
    aliases: [
      "python",
      "py"
    ],
    curriculum: [
      {
        domain: "Syntax & Types",
        topics: [
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Numbers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Booleans",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Hinting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Control Flow",
        topics: [
          {
            title: "Conditionals",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "For Loops",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "While Loops",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exception Handling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Structures",
        topics: [
          {
            title: "Lists",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tuples",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dictionaries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "List Comprehensions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dict Comprehensions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Functions & Modules",
        topics: [
          {
            title: "Function Definition",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arguments & kwargs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambda Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Decorators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Imports",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Virtual Environments",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented Programming",
        topics: [
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Objects",
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
            title: "Dunder Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Properties",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "File I/O & Concurrency",
        topics: [
          {
            title: "Reading/Writing Files",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context Managers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multithreading",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multiprocessing",
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
        domain: "Language Primitives",
        topics: [
          {
            title: "Variables (let/const)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Coercion",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template Literals",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Functions & Scope",
        topics: [
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
            title: "Lexical Scope",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hoisting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "IIFEs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Objects & Arrays",
        topics: [
          {
            title: "Object Destructuring",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spread/Rest Operators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Array Methods (map, filter, reduce)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Maps & Sets",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Asynchronous Execution",
        topics: [
          {
            title: "Event Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Callbacks",
            complexity: "Medium",
            size: "Medium"
          },
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
            title: "Microtasks",
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
            title: "Prototypal Inheritance",
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
            title: "Bind/Call/Apply",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Modules & Ecosystem",
        topics: [
          {
            title: "ES Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CommonJS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NPM/Yarn",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Package.json",
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
        domain: "Type System",
        topics: [
          {
            title: "Primitive Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays & Tuples",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Any & Unknown",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Void & Never",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Enums",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Interfaces & Aliases",
        topics: [
          {
            title: "Interface Declarations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Aliases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Extending Interfaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Intersection Types",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Type Narrowing",
        topics: [
          {
            title: "Type Guards",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "typeof / instanceof",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Discriminated Unions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Assertion Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Generics",
        topics: [
          {
            title: "Generic Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generic Interfaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generic Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generic Constraints",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Types",
        topics: [
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
            title: "Utility Types (Partial, Pick, Omit)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template Literal Types",
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
          },
          {
            title: "Declaration Files (.d.ts)",
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
        domain: "Core Syntax",
        topics: [
          {
            title: "Primitives",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Control Flow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Methods",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented Design",
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
            title: "Encapsulation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interfaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Abstract Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Records",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Collections Framework",
        topics: [
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
            title: "Maps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Queues",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Iterators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Comparators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Error Handling",
        topics: [
          {
            title: "Checked vs Unchecked Exceptions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Try-Catch-Finally",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Exceptions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Functional Programming",
        topics: [
          {
            title: "Lambdas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Method References",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Streams API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Optional",
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
            title: "Synchronization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Locks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CompletableFuture",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "JVM Ecosystem",
        topics: [
          {
            title: "Garbage Collection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classloaders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JAR/WAR Files",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Maven/Gradle",
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
        domain: "Core Language",
        topics: [
          {
            title: "Types",
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
            title: "Namespaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Header Files",
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
            title: "References",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Memory Allocation (new/delete)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Smart Pointers (unique_ptr, shared_ptr)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RAII",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented C++",
        topics: [
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Constructors/Destructors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inheritance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Virtual Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Operator Overloading",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multiple Inheritance",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Templates & STL",
        topics: [
          {
            title: "Function Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Class Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "STL Containers (vector, map, set)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "STL Algorithms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Iterators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Modern C++",
        topics: [
          {
            title: "Move Semantics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rvalue References",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambda Expressions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "constexpr",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Auto Type Deduction",
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
        domain: "Core Syntax",
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
        domain: "Pointers & Memory",
        topics: [
          {
            title: "Pointers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pointer Arithmetic",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Memory (malloc/calloc/free)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Function Pointers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Structures",
        topics: [
          {
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Unions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Typedefs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bit Fields",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Preprocessor & I/O",
        topics: [
          {
            title: "Macros",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Header Files",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "File I/O (fopen, fread)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Standard I/O",
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
        domain: "Core Language",
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
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interfaces",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Properties",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Collections & Generics",
        topics: [
          {
            title: "Lists",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dictionaries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generic Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Generic Methods",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Language Features",
        topics: [
          {
            title: "Delegates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Events",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Attributes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Extension Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pattern Matching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Records",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Querying",
        topics: [
          {
            title: "LINQ to Objects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LINQ Syntax",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambda Expressions in LINQ",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Asynchronous Programming",
        topics: [
          {
            title: "Tasks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Async/Await",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cancellation Tokens",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Thread Pool",
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
        domain: "Core Syntax",
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
            title: "Pointers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Collections",
        topics: [
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slices",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Maps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Make & Append",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Interfaces & Errors",
        topics: [
          {
            title: "Interface Implementation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Assertions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Type Switches",
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
            title: "Buffered Channels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Select Statements",
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
        domain: "Tooling",
        topics: [
          {
            title: "go mod",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "go test",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "go build",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "go fmt",
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
        domain: "Core Concepts",
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
        domain: "Memory Safety",
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
        domain: "Data Structures",
        topics: [
          {
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Option & Result",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vectors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "HashMaps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strings",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Constructs",
        topics: [
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
            title: "Generics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Closures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Iterators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency & Ecosystem",
        topics: [
          {
            title: "Threads",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Message Passing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shared State",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cargo",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Crates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Macros",
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
        domain: "Language Fundamentals",
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
            title: "Symbols",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays & Hashes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Blocks & Closures",
        topics: [
          {
            title: "Blocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Procs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambdas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Yield",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented Ruby",
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
            title: "Modules (Mixins)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Access Control",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Metaprogramming",
        topics: [
          {
            title: "Method Missing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Define Method",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Eval",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Class Macros",
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
        domain: "Core PHP",
        topics: [
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays (Indexed & Associative)",
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
            title: "Superglobals",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented PHP",
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
            title: "Interfaces",
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
            title: "Magic Methods",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Database & Ecosystem",
        topics: [
          {
            title: "PDO",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Prepared Statements",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Composer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Autoloading",
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
    id: "swift",
    canonicalName: "Swift",
    type: "OTHER",
    aliases: [
      "swift",
      "ios"
    ],
    curriculum: [
      {
        domain: "Swift Core",
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
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Closures",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Structures",
        topics: [
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dictionaries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tuples",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strings",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Object-Oriented & Protocol-Oriented",
        topics: [
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Structs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Properties",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Methods",
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
          },
          {
            title: "Generics",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Memory Management",
        topics: [
          {
            title: "ARC (Automatic Reference Counting)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Strong/Weak/Unowned References",
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
        domain: "Kotlin Core",
        topics: [
          {
            title: "Basic Syntax",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "Null Safety (? & !!)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambdas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Collections",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Classes & Types",
        topics: [
          {
            title: "Classes & Inheritance",
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
          },
          {
            title: "Enum Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Object Declarations",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Features",
        topics: [
          {
            title: "Extension Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Higher-Order Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scope Functions (let, run, apply)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Inline Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency",
        topics: [
          {
            title: "Coroutines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Suspend Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dispatchers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Channels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Flows",
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
        domain: "Document Structure",
        topics: [
          {
            title: "Doctype",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Head & Body",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Meta Tags",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Linking Assets",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Semantic Markup",
        topics: [
          {
            title: "Header, Main, Footer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Section & Article",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Nav & Aside",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Headings",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Forms & Input",
        topics: [
          {
            title: "Form Attributes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Input Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Labels",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Validation Attributes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Multimedia",
        topics: [
          {
            title: "Images",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Audio",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Video",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Iframes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Canvas/SVG Basics",
            complexity: "Simple",
            size: "Small"
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
        domain: "Styling Fundamentals",
        topics: [
          {
            title: "Selectors & Specificity",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Box Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Colors & Gradients",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Typography",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Layout Systems",
        topics: [
          {
            title: "Flexbox",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CSS Grid",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Positioning (Static, Relative, Absolute, Fixed)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Z-Index",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Responsive Design",
        topics: [
          {
            title: "Media Queries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Relative Units (rem, em, vh, vw)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Container Queries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Visual Effects",
        topics: [
          {
            title: "Transitions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Keyframe Animations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transforms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Filters",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shadows",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture",
        topics: [
          {
            title: "CSS Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "BEM Methodology",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sass/Less Preprocessors",
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
        domain: "Component Architecture",
        topics: [
          {
            title: "JSX Syntax",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functional Components",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Props",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Component Lifecycle",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "State & Effects",
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
            title: "State Lifting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Immutability",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Hooks",
        topics: [
          {
            title: "useContext",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useReducer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useRef",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useMemo",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "useCallback",
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
        domain: "Routing & Ecosystem",
        topics: [
          {
            title: "React Router",
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
          },
          {
            title: "Suspense & Lazy Loading",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "State Management Libraries",
        topics: [
          {
            title: "Redux Toolkit",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Zustand",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "React Query / SWR",
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
        domain: "Core Architecture",
        topics: [
          {
            title: "Modules (NgModules vs Standalone)",
            complexity: "Medium",
            size: "Medium"
          },
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
            title: "Data Binding",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Directives & Pipes",
        topics: [
          {
            title: "Structural Directives",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Attribute Directives",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Built-in Pipes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Pipes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Services & State",
        topics: [
          {
            title: "Dependency Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RxJS Observables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Signals",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Routing & Forms",
        topics: [
          {
            title: "Router Setup",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Route Guards",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reactive Forms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template-driven Forms",
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
        domain: "Vue Core",
        topics: [
          {
            title: "Vue Instance",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Template Syntax",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reactivity Fundamentals",
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
        domain: "Component System",
        topics: [
          {
            title: "Props & Events",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slots",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Provide / Inject",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Components",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Composition API",
        topics: [
          {
            title: "setup()",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Refs & Reactive",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lifecycle Hooks in Composition",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Composables",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ecosystem",
        topics: [
          {
            title: "Vue Router",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pinia (State Management)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transitions & Animations",
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
        domain: "Reactivity",
        topics: [
          {
            title: "Reactive Assignments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reactive Declarations ($:)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reactive Statements",
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
            title: "Logic Blocks (if/each/await)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Events (Forwarding/Modifiers)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slots",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "State & Ecosystem",
        topics: [
          {
            title: "Writable/Readable Stores",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Derived Stores",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lifecycle Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SvelteKit Basics",
            complexity: "Simple",
            size: "Small"
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
        domain: "Utility Classes",
        topics: [
          {
            title: "Spacing",
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
          },
          {
            title: "Flexbox/Grid Utilities",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Responsive & States",
        topics: [
          {
            title: "Breakpoints",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hover/Focus/Active States",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dark Mode",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Configuration",
        topics: [
          {
            title: "tailwind.config.js",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Themes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Directives (@apply, @layer)",
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
        domain: "Design Fundamentals",
        topics: [
          {
            title: "Frames",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vectors & Shapes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Typography",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Color Styles",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Layout & Structure",
        topics: [
          {
            title: "Auto Layout",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Constraints",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Grids",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Design Systems",
        topics: [
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
            title: "Design Tokens",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Libraries",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Prototyping",
        topics: [
          {
            title: "Interactions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Smart Animate",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Overlays",
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
        domain: "Node Architecture",
        topics: [
          {
            title: "Event Loop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "V8 Engine",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Single-Threaded Non-Blocking I/O",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Core Modules",
        topics: [
          {
            title: "fs (File System)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "path",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "http",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "events (Event Emitter)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "crypto",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "stream",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Module Systems",
        topics: [
          {
            title: "CommonJS (require)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ES Modules (import)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NPM / Package Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Node",
        topics: [
          {
            title: "Worker Threads",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Child Processes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Buffer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Performance Profiling",
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
        domain: "Routing",
        topics: [
          {
            title: "Route Methods",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Route Parameters",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Query Strings",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Express Router",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Middleware",
        topics: [
          {
            title: "Application-Level",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Router-Level",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error-Handling Middleware",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Built-in Middleware",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Third-Party Middleware",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Request & Response",
        topics: [
          {
            title: "Req Object",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Res Object",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Status Codes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sending JSON/HTML",
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
        domain: "Nest Architecture",
        topics: [
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          },
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
            title: "Dependency Injection",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Request Lifecycle",
        topics: [
          {
            title: "Middleware",
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
          },
          {
            title: "Pipes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exception Filters",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data & Integrations",
        topics: [
          {
            title: "TypeORM / Prisma Integration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GraphQL Setup",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Microservices Basics",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "WebSockets",
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
        domain: "Django Core",
        topics: [
          {
            title: "MVT Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Project vs App",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "settings.py",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "manage.py",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Models & Databases",
        topics: [
          {
            title: "Model Fields",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Migrations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "QuerySets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Relationships (ForeignKey, M2M)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Views & Templates",
        topics: [
          {
            title: "Function-Based Views",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Class-Based Views",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "URL Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jinja Templates",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Django REST Framework",
        topics: [
          {
            title: "Serializers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ViewSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Routers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authentication & Permissions",
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
        domain: "Flask Core",
        topics: [
          {
            title: "App Initialization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Request Object",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Responses & JSON",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Templating & Static",
        topics: [
          {
            title: "Jinja2 Templates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Static Files",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context Processors",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Application Structure",
        topics: [
          {
            title: "Blueprints",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Application Factory",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "App Context vs Request Context",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Extensions",
        topics: [
          {
            title: "Flask-SQLAlchemy",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Flask-Migrate",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Flask-Login",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Flask-RESTful",
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
        domain: "Spring Core",
        topics: [
          {
            title: "Inversion of Control (IoC)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dependency Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Application Context",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Beans & Scopes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Spring Web",
        topics: [
          {
            title: "REST Controllers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Request Mapping",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Path Variables & Query Params",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exception Handling (@ControllerAdvice)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Access",
        topics: [
          {
            title: "Spring Data JPA",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Entities & Repositories",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JPQL",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transactions (@Transactional)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security & Ops",
        topics: [
          {
            title: "Spring Security Basics",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "JWT Authentication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spring Boot Actuator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Profiles",
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
        domain: "Schema Definition",
        topics: [
          {
            title: "Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scalars",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Input Types",
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
        domain: "Operations",
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
            title: "Subscriptions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Aliases & Fragments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Server Implementation",
        topics: [
          {
            title: "Resolvers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DataLoaders (N+1 Problem)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Handling",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Client Integration",
        topics: [
          {
            title: "Apollo Client",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Optimistic UI Updates",
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
        domain: "Architectural Constraints",
        topics: [
          {
            title: "Client-Server",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stateless",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cacheable",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Uniform Interface",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layered System",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "HTTP Fundamentals",
        topics: [
          {
            title: "Methods (GET, POST, PUT, PATCH, DELETE)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Status Codes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Headers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Content Negotiation",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "API Design Principles",
        topics: [
          {
            title: "Resource Naming",
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
            title: "HATEOAS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Versioning",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security",
        topics: [
          {
            title: "Authentication (Tokens/OAuth)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authorization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rate Limiting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CORS",
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
        domain: "Protocol Buffers",
        topics: [
          {
            title: "Message Definitions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Compiling Protoc",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Service Types",
        topics: [
          {
            title: "Unary RPC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Server Streaming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Client Streaming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bidirectional Streaming",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced gRPC",
        topics: [
          {
            title: "Interceptors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Deadlines & Timeouts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Handling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Load Balancing",
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
        domain: "Data Querying (DQL)",
        topics: [
          {
            title: "SELECT Statements",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Filtering (WHERE, LIKE, IN)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sorting (ORDER BY)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Limiting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Manipulation (DML)",
        topics: [
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
          },
          {
            title: "Upserts (MERGE/ON CONFLICT)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Definition (DDL)",
        topics: [
          {
            title: "CREATE TABLE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ALTER TABLE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DROP TABLE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Constraints (Primary/Foreign Keys)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Aggregations & Grouping",
        topics: [
          {
            title: "GROUP BY",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "HAVING",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Aggregate Functions (SUM, COUNT, AVG)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Joins & Set Operations",
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
            title: "FULL JOIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CROSS JOIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UNION",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "INTERSECT",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced SQL",
        topics: [
          {
            title: "Subqueries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CTEs (Common Table Expressions)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Window Functions (ROW_NUMBER, RANK)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Indexes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transactions (ACID)",
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
        domain: "Data Types",
        topics: [
          {
            title: "Numeric",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "String",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Date/Time",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JSON & JSONB",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UUID",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Queries",
        topics: [
          {
            title: "Full-Text Search",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Recursive CTEs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lateral Joins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Materialized Views",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Performance Tuning",
        topics: [
          {
            title: "EXPLAIN ANALYZE",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Index Types (B-Tree, GIN, GiST)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vacuuming & Autovacuum",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Connection Pooling (PgBouncer)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Administration",
        topics: [
          {
            title: "Roles & Permissions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Backup & Restore (pg_dump)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication (Logical vs Physical)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partitioning",
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
        domain: "Storage Engines",
        topics: [
          {
            title: "InnoDB vs MyISAM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory Engine",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Types & Constraints",
        topics: [
          {
            title: "Numeric",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "String (VARCHAR, TEXT)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Date/Time",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Foreign Key Constraints",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Performance & Optimization",
        topics: [
          {
            title: "EXPLAIN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Query Caching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Indexing Strategies",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Slow Query Log",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Administration",
        topics: [
          {
            title: "User Management",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication (Master-Slave)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Clustering Basics",
            complexity: "Simple",
            size: "Small"
          },
          {
            title: "mysqldump",
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
        domain: "Document Model",
        topics: [
          {
            title: "Databases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Collections",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "BSON Documents",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "_id Field",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "CRUD Operations",
        topics: [
          {
            title: "insertOne/Many",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "find",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Query Operators ($eq, $gt, $in)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "updateOne/Many",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Update Operators ($set, $inc)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "delete",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Aggregation Pipeline",
        topics: [
          {
            title: "Pipeline Stages ($match, $group, $project, $lookup)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Expressions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Modeling",
        topics: [
          {
            title: "Embedding vs Referencing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Schema Validation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "One-to-Many / Many-to-Many in NoSQL",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Performance & Scale",
        topics: [
          {
            title: "Indexing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Compound Indexes",
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
        domain: "Data Structures",
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
          },
          {
            title: "Bitmaps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "HyperLogLog",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Key Management",
        topics: [
          {
            title: "Expiration (TTL)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Eviction Policies (LRU, LFU)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Key Naming Conventions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Features",
        topics: [
          {
            title: "Pub/Sub",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transactions (MULTI/EXEC)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lua Scripting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipelining",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "High Availability",
        topics: [
          {
            title: "Persistence (RDB vs AOF)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Redis Sentinel",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Redis Cluster",
            complexity: "Very Hard",
            size: "Very Large"
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
        domain: "Core Concepts",
        topics: [
          {
            title: "Indices",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Documents",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shards",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replicas",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Nodes & Clusters",
            complexity: "Very Hard",
            size: "Very Large"
          }
        ]
      },
      {
        domain: "Mapping & Analysis",
        topics: [
          {
            title: "Dynamic vs Explicit Mapping",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Field Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Analyzers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tokenizers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Search API",
        topics: [
          {
            title: "Query DSL",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Match/Term Queries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bool Queries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Highlighting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pagination",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Aggregations",
        topics: [
          {
            title: "Metric Aggregations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bucket Aggregations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipeline Aggregations",
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
        domain: "Architecture",
        topics: [
          {
            title: "Ring Topology",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gossip Protocol",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Snitches",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Virtual Nodes (Vnodes)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Modeling",
        topics: [
          {
            title: "CQL",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partition Keys",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Clustering Columns",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Primary Keys",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Denormalization",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Read/Write Paths",
        topics: [
          {
            title: "Memtables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SSTables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Commit Log",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Compaction",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tombstones",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bloom Filters",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Consistency & Replication",
        topics: [
          {
            title: "Replication Factor",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consistency Levels (ONE, QUORUM, ALL)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hinted Handoff",
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
        domain: "Architecture",
        topics: [
          {
            title: "Brokers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Topics",
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
          },
          {
            title: "Zookeeper/KRaft",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Producers & Consumers",
        topics: [
          {
            title: "Producer Acks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Message Key & Routing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consumer Groups",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rebalancing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Reliability",
        topics: [
          {
            title: "Replication Factor",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "In-Sync Replicas (ISR)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Exactly-Once Semantics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Retention Policies",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ecosystem",
        topics: [
          {
            title: "Kafka Connect",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Schema Registry",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Kafka Streams",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ksqlDB",
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
        domain: "Core Architecture",
        topics: [
          {
            title: "Driver",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cluster Managers (YARN, K8s, Standalone)",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "DAGs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Abstractions",
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
            title: "Transformations (Lazy) vs Actions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Spark SQL",
        topics: [
          {
            title: "Querying DataFrames",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UDFs (User Defined Functions)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Catalyst Optimizer",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Spark",
        topics: [
          {
            title: "Spark Streaming (Structured Streaming)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Broadcast Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Accumulators",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Partition Tuning",
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
        domain: "Core Concepts",
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
            title: "Task Dependencies (Bitshift Operators)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Execution Dates",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Components",
        topics: [
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
            title: "Hooks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Connections",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture",
        topics: [
          {
            title: "Scheduler",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Webserver",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Workers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executors (Local, Celery, Kubernetes)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced DAGs",
        topics: [
          {
            title: "XComs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Branching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Task Groups",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic DAGs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SLAs & Alerts",
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
        domain: "Container Fundamentals",
        topics: [
          {
            title: "Containers vs VMs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Namespaces & Cgroups",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Docker Daemon",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Docker CLI",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Image Building",
        topics: [
          {
            title: "Dockerfile Instructions (FROM, RUN, CMD, ENTRYPOINT)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multi-stage Builds",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caching",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & Networking",
        topics: [
          {
            title: "Volumes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bind Mounts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bridge Networks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Host Networks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Overlay Networks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Docker Compose",
        topics: [
          {
            title: "Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Networks & Volumes in Compose",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Environment Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Overrides",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Registry & Security",
        topics: [
          {
            title: "Docker Hub",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Private Registries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scanning Images",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Running as Non-Root",
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
        domain: "Architecture",
        topics: [
          {
            title: "Control Plane (API Server, etcd, Scheduler, Controller Manager)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Worker Nodes (Kubelet, Kube-proxy)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Core Workloads",
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
            title: "StatefulSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DaemonSets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jobs & CronJobs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking",
        topics: [
          {
            title: "Services (ClusterIP, NodePort, LoadBalancer)",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "Ingress",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Ingress Controllers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Network Policies",
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
            title: "PersistentVolumes (PV)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PersistentVolumeClaims (PVC)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "StorageClasses",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Scheduling & Scaling",
        topics: [
          {
            title: "Node Selectors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Taints & Tolerations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Node/Pod Affinity",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "HPA (Horizontal Pod Autoscaler)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security & Observability",
        topics: [
          {
            title: "RBAC (Role-Based Access Control)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Service Accounts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Liveness/Readiness Probes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Resource Requests & Limits",
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
            title: "EC2 (Instances, AMIs, Auto Scaling)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lambda",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ECS & EKS",
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
        domain: "Storage",
        topics: [
          {
            title: "S3 (Buckets, Classes, Policies)",
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
            title: "Glacier",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking",
        topics: [
          {
            title: "VPC (Subnets, Route Tables, IGW, NAT)",
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
            title: "Elastic Load Balancing (ALB, NLB)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Databases",
        topics: [
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
          },
          {
            title: "Redshift",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security & Management",
        topics: [
          {
            title: "IAM (Users, Roles, Policies)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "KMS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CloudWatch",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CloudTrail",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CloudFormation",
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
            title: "Compute Engine (VMs)",
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
            title: "Cloud Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Storage & Databases",
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
            title: "Cloud CDN",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cloud IAM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Secret Manager",
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
        domain: "Storage & Databases",
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
        domain: "Networking & Identity",
        topics: [
          {
            title: "Virtual Network (VNet)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Load Balancer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Application Gateway",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Active Directory (Entra ID)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Management & Dev",
        topics: [
          {
            title: "Azure Resource Manager (ARM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure DevOps",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Azure Monitor",
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
        domain: "Terraform Core",
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
            title: "HCL Syntax",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Init, Plan, Apply, Destroy",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "State Management",
        topics: [
          {
            title: "State Files (terraform.tfstate)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Remote State (S3, Azure Blob)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State Locking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Importing Resources",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Modularity & Variables",
        topics: [
          {
            title: "Input Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Local Values",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Outputs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Workspaces",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Features",
        topics: [
          {
            title: "Provisioners",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Blocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Count & For_each",
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
        domain: "Core Principles",
        topics: [
          {
            title: "Continuous Integration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Continuous Delivery vs Deployment",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipeline Stages",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Artifact Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Build & Test Automation",
        topics: [
          {
            title: "Running Unit Tests",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Linting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Code Coverage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Container Builds",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Deployment Strategies",
        topics: [
          {
            title: "Rolling Updates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Blue-Green Deployment",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Canary Releases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Feature Flags",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Tooling Specifics",
        topics: [
          {
            title: "GitHub Actions (Workflows, Runners)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GitLab CI (.gitlab-ci.yml)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Jenkins (Pipelines, Plugins)",
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
        domain: "File System & Navigation",
        topics: [
          {
            title: "Directory Structure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "cd, ls, pwd",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "File Permissions (chmod, chown, umask)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Symlinks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Process Management",
        topics: [
          {
            title: "ps, top, htop",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "kill, pkill",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Background/Foreground (bg, fg, jobs)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Systemd & Services",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Text Processing",
        topics: [
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
            title: "cut",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "sort",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "uniq",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pipes & Redirection",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Security",
        topics: [
          {
            title: "ip, ifconfig",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "netstat, ss",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "curl, wget",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SSH",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Firewalls (ufw, iptables)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Bash Scripting",
        topics: [
          {
            title: "Variables & Environments",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Conditionals & Loops",
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
        domain: "Configuration Basics",
        topics: [
          {
            title: "nginx.conf Structure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Contexts (main, http, server, location)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Directives",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Web Serving",
        topics: [
          {
            title: "Serving Static Content",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Index Files",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Error Pages",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "MIME Types",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Reverse Proxy & Load Balancing",
        topics: [
          {
            title: "proxy_pass",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Upstream Blocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Load Balancing Algorithms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sticky Sessions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Security & Performance",
        topics: [
          {
            title: "SSL/TLS Configuration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gzip Compression",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caching (proxy_cache)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rate Limiting",
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
            title: "Arrays & Dynamic Arrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Linked Lists (Singly, Doubly)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stacks (LIFO)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Queues (FIFO, Deque)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Trees",
        topics: [
          {
            title: "Binary Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Binary Search Trees (BST)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AVL Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Red-Black Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Heaps (Min/Max)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graphs",
        topics: [
          {
            title: "Directed & Undirected Graphs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Adjacency Matrix",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Adjacency List",
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
            title: "Collision Resolution (Chaining, Probing)",
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
        domain: "Algorithm Analysis",
        topics: [
          {
            title: "Big O Notation (Time/Space Complexity)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Best, Worst, Average Cases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Recursion",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Sorting & Searching",
        topics: [
          {
            title: "Bubble, Selection, Insertion Sort",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merge Sort",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Quick Sort",
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
            title: "Breadth-First Search (BFS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Depth-First Search (DFS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dijkstra's Algorithm",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "A* Search",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Topological Sort",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Algorithm Paradigms",
        topics: [
          {
            title: "Divide and Conquer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dynamic Programming (Memoization, Tabulation)",
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
        domain: "Design Fundamentals",
        topics: [
          {
            title: "Vertical vs Horizontal Scaling",
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
        domain: "Architecture Components",
        topics: [
          {
            title: "Load Balancers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "API Gateways",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Caches (Write-through, Write-behind)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Content Delivery Networks (CDN)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Database Scaling",
        topics: [
          {
            title: "SQL vs NoSQL Selection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sharding & Partitioning",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Replication (Master-Slave, Master-Master)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Consistent Hashing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Communication & Processing",
        topics: [
          {
            title: "Synchronous vs Asynchronous",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Message Queues",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Event Sourcing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Batch vs Stream Processing",
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
          },
          {
            title: "Iterator",
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
        domain: "Network Models",
        topics: [
          {
            title: "OSI 7-Layer Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TCP/IP Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Encapsulation & Decapsulation",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Transport Layer",
        topics: [
          {
            title: "TCP (Handshake, Windowing, Congestion Control)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UDP",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Ports & Sockets",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Network Layer",
        topics: [
          {
            title: "IP Addressing (IPv4 vs IPv6)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Subnetting & CIDR",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Routing Protocols",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NAT (Network Address Translation)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Application Layer",
        topics: [
          {
            title: "HTTP/1.1 vs HTTP/2 vs HTTP/3",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DNS Resolution",
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
        domain: "Process & Thread Management",
        topics: [
          {
            title: "Process States",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Context Switching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Process Scheduling Algorithms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "User Threads vs Kernel Threads",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency & Synchronization",
        topics: [
          {
            title: "Race Conditions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Critical Sections",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mutexes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Semaphores",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Deadlocks (Prevention, Avoidance)",
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
            title: "Paging & Segmentation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Page Replacement Algorithms (LRU, FIFO)",
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
            title: "Inodes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Disk Scheduling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RAID Levels",
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
        domain: "Core Principles",
        topics: [
          {
            title: "CIA Triad (Confidentiality, Integrity, Availability)",
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
            title: "Defense in Depth",
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
            title: "Asymmetric Encryption (RSA, ECC)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hashing (SHA-256)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Digital Signatures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PKI & Certificates",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Network Security",
        topics: [
          {
            title: "Firewalls (Stateful vs Stateless)",
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
            title: "DMZ",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Network Segmentation",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Threat Modeling",
        topics: [
          {
            title: "Malware Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Social Engineering / Phishing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DDoS Attacks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Man-in-the-Middle (MitM)",
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
        domain: "Injection Vulnerabilities",
        topics: [
          {
            title: "SQL Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NoSQL Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Command Injection",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cross-Site Scripting (XSS)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Authentication & Access",
        topics: [
          {
            title: "Broken Access Control",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Session Hijacking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Credential Stuffing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Insecure Direct Object References (IDOR)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Configuration & Logic",
        topics: [
          {
            title: "Security Misconfiguration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "XML External Entities (XXE)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Server-Side Request Forgery (SSRF)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Insecure Deserialization",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Protection",
        topics: [
          {
            title: "Sensitive Data Exposure",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cryptographic Failures",
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
            title: "Reconnaissance (OSINT)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Scanning & Enumeration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vulnerability Assessment",
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
        domain: "Network & Infrastructure",
        topics: [
          {
            title: "Port Scanning (Nmap)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Network Sniffing (Wireshark)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Man-in-the-Middle Frameworks",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Web Application Pentesting",
        topics: [
          {
            title: "Intercepting Proxies (Burp Suite, ZAP)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Directory Brute Forcing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Payload Generation",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Exploitation Frameworks",
        topics: [
          {
            title: "Metasploit",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Privilege Escalation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Password Cracking (Hashcat, John the Ripper)",
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
            title: "Support Vector Machines (SVM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Naive Bayes",
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
            title: "Hierarchical Clustering",
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
        domain: "Data Preprocessing",
        topics: [
          {
            title: "Feature Scaling",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Missing Data",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "One-Hot Encoding",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Feature Engineering",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Model Evaluation",
        topics: [
          {
            title: "Train/Test Split",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cross-Validation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Confusion Matrix",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Precision, Recall, F1-Score",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ROC & AUC",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Overfitting vs Underfitting",
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
        domain: "Neural Network Foundations",
        topics: [
          {
            title: "Perceptrons",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Activation Functions (ReLU, Sigmoid, Tanh)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Forward Propagation",
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
          }
        ]
      },
      {
        domain: "Optimization",
        topics: [
          {
            title: "Gradient Descent",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stochastic Gradient Descent (SGD)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Adam Optimizer",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Learning Rates",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Dropout & Regularization",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Computer Vision Architectures",
        topics: [
          {
            title: "Convolutional Neural Networks (CNNs)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pooling Layers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ResNet",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Object Detection (YOLO)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Sequence Models",
        topics: [
          {
            title: "Recurrent Neural Networks (RNNs)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LSTMs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GRUs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Attention Mechanisms",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transformers",
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
        domain: "Core Architectures",
        topics: [
          {
            title: "Transformer Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Self-Attention",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tokenization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Vector Embeddings",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Prompt Engineering",
        topics: [
          {
            title: "Zero-Shot Prompting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Few-Shot Prompting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Chain of Thought",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "System Prompts",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Retrieval-Augmented Generation",
        topics: [
          {
            title: "RAG Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Vector Databases",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Semantic Search",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Chunking Strategies",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Model Fine-Tuning",
        topics: [
          {
            title: "Supervised Fine-Tuning (SFT)",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "PEFT (Parameter-Efficient Fine-Tuning)",
            complexity: "Very Hard",
            size: "Very Large"
          },
          {
            title: "LoRA / QLoRA",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RLHF (Reinforcement Learning from Human Feedback)",
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
        domain: "TensorFlow Foundations",
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
            title: "Autodiff (GradientTape)",
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
            title: "Model Subclassing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Built-in Layers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Custom Layers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Training & Evaluation",
        topics: [
          {
            title: "Compiling Models",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fit/Evaluate/Predict",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Callbacks (EarlyStopping, Checkpoints)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TensorBoard",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Pipelines",
        topics: [
          {
            title: "tf.data API",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Datasets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mapping & Batching",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Prefetching",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Deployment",
        topics: [
          {
            title: "SavedModel Format",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TensorFlow Serving",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "TensorFlow Lite",
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
        domain: "PyTorch Foundations",
        topics: [
          {
            title: "Tensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Broadcasting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Autograd Mechanics",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Computation Graphs",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Neural Networks (torch.nn)",
        topics: [
          {
            title: "Modules (nn.Module)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layers (Linear, Conv2d)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Loss Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Parameters & Buffers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Optimization (torch.optim)",
        topics: [
          {
            title: "Optimizers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Learning Rate Schedulers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gradient Clipping",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Handling",
        topics: [
          {
            title: "Datasets (torch.utils.data.Dataset)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "DataLoaders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Transforms (torchvision)",
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
            title: "Distributed Data Parallel (DDP)",
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
        domain: "Core Structures",
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
            title: "Index Objects",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data I/O",
        topics: [
          {
            title: "Reading CSV/Excel/JSON",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Writing Data",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Connecting to SQL",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Data Manipulation",
        topics: [
          {
            title: "Indexing (.loc, .iloc)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Filtering & Boolean Masking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Missing Data (dropna, fillna)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "String Operations",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Aggregation & Grouping",
        topics: [
          {
            title: "GroupBy",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Aggregations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pivot Tables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Cross Tabulations",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Merging Data",
        topics: [
          {
            title: "Merge",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Join",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Concat",
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
        domain: "Core Concepts",
        topics: [
          {
            title: "Ndarrays",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Array Creation (arange, linspace, zeros)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types (dtypes)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Array Manipulation",
        topics: [
          {
            title: "Indexing & Slicing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reshaping",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Concatenation & Splitting",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Operations",
        topics: [
          {
            title: "Vectorized Operations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Broadcasting Rules",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Universal Functions (ufuncs)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Linear Algebra & Stats",
        topics: [
          {
            title: "Dot Products",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Matrix Inverses (numpy.linalg)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Statistical Functions (mean, std, var)",
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
        domain: "Core Components",
        topics: [
          {
            title: "View",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Text",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Image",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ScrollView",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "FlatList",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SectionList",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Styling & Layout",
        topics: [
          {
            title: "StyleSheet",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Flexbox in React Native",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Responsive Layouts",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Navigation",
        topics: [
          {
            title: "React Navigation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stack Navigator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Tab Navigator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Drawer Navigator",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Deep Linking",
            complexity: "Very Hard",
            size: "Very Large"
          }
        ]
      },
      {
        domain: "Native Integration",
        topics: [
          {
            title: "AsyncStorage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Permissions",
            complexity: "Medium",
            size: "Medium"
          },
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
            title: "Push Notifications",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture & Build",
        topics: [
          {
            title: "Metro Bundler",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JSI / Fabric",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Expo Managed vs Bare Workflow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Building APK/IPA",
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
        domain: "Dart Language",
        topics: [
          {
            title: "Dart Types",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Classes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Null Safety",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Futures & Streams",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Widgets",
        topics: [
          {
            title: "Stateless Widgets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stateful Widgets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Material & Cupertino Widgets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layout Widgets (Row, Column, Stack)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "State Management",
        topics: [
          {
            title: "setState",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "InheritedWidget",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Provider",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Riverpod",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "BLoC",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Navigation & Routing",
        topics: [
          {
            title: "Navigator 1.0",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Navigator 2.0 (Router API)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Passing Data",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & Data",
        topics: [
          {
            title: "HTTP Requests",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "JSON Serialization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Shared Preferences",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SQLite (sqflite)",
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
        domain: "App Components",
        topics: [
          {
            title: "Activities & Lifecycle",
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
            title: "Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Broadcast Receivers",
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
            title: "ViewBinding",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Jetpack Compose",
        topics: [
          {
            title: "Composable Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State in Compose",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Modifiers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Compose Layouts",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture & Data",
        topics: [
          {
            title: "MVVM Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "ViewModel",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "LiveData / StateFlow",
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
      },
      {
        domain: "Ecosystem",
        topics: [
          {
            title: "AndroidManifest.xml",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gradle Build Scripts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Permissions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Play Store Deployment",
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
        domain: "App Architecture",
        topics: [
          {
            title: "App Lifecycle",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "AppDelegate & SceneDelegate",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "MVC vs MVVM",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "UIKit",
        topics: [
          {
            title: "UIViewControllers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Storyboards",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Auto Layout",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UITableView & UICollectionView",
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
            title: "ObservableObject",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "NavigationStack",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GeometryReader",
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
            title: "Codable Protocol",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "UserDefaults",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Concurrency",
        topics: [
          {
            title: "GCD (Grand Central Dispatch)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Operations",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Async/Await in Swift",
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
        domain: "Test Types",
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
            title: "Regression Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Performance Testing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Testing Paradigms",
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
            title: "Black Box vs White Box Testing",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Testing Concepts",
        topics: [
          {
            title: "Mocking & Stubbing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spies",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fixtures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Code Coverage",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Assertions",
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
        domain: "Test Structure",
        topics: [
          {
            title: "describe, it, test",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Setup & Teardown (beforeEach, afterAll)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Matchers (expect)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Mocking",
        topics: [
          {
            title: "Mock Functions (jest.fn)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Mocking Modules (jest.mock)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Timer Mocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Spying (jest.spyOn)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Jest",
        topics: [
          {
            title: "Snapshot Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Asynchronous Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Coverage Reporting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Configuration",
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
            title: "Test Runner",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Writing Specs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Selectors (cy.get)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Assertions (should, expect)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Interactions",
        topics: [
          {
            title: "Clicking",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Typing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Checking Boxes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Alerts & Modals",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Network & APIs",
        topics: [
          {
            title: "cy.intercept",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Stubbing Responses",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Waiting for Requests (cy.wait)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "API Testing (cy.request)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture",
        topics: [
          {
            title: "Custom Commands",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Page Object Model",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fixtures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "CI/CD Integration",
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
        domain: "WebDriver Basics",
        topics: [
          {
            title: "Driver Instantiation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Browser Navigation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Finding Elements (By.id, By.xpath)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interactions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Synchronization",
        topics: [
          {
            title: "Implicit Waits",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Explicit Waits",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fluent Waits",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Interactions",
        topics: [
          {
            title: "Action Chains",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Handling Alerts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Switching Frames & Windows",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Executing JavaScript",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Architecture",
        topics: [
          {
            title: "Page Object Model (POM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data-Driven Testing",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Selenium Grid",
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
        domain: "Core Architecture",
        topics: [
          {
            title: "Blocks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hashes",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Merkle Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Distributed Ledgers",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "Nodes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Cryptography",
        topics: [
          {
            title: "Public/Private Keys",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Digital Signatures",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Hash Functions",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Consensus Mechanisms",
        topics: [
          {
            title: "Proof of Work (PoW)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Proof of Stake (PoS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Delegated PoS",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Byzantine Fault Tolerance (BFT)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ecosystem Concepts",
        topics: [
          {
            title: "Wallets",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gas & Fees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Layer 1 vs Layer 2",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Smart Contracts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "dApps",
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
        domain: "Syntax & Types",
        topics: [
          {
            title: "State Variables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Data Types (uint, address, mapping)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Structs & Enums",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Functions & Modifiers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Smart Contract Architecture",
        topics: [
          {
            title: "Constructors",
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
          },
          {
            title: "Payable Functions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Fallback/Receive",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Memory & Execution",
        topics: [
          {
            title: "Storage vs Memory vs Calldata",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Gas Optimization",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "EVM (Ethereum Virtual Machine) Basics",
            complexity: "Simple",
            size: "Small"
          }
        ]
      },
      {
        domain: "Security",
        topics: [
          {
            title: "Reentrancy Attacks",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Integer Overflow/Underflow",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Access Control",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "tx.origin vs msg.sender",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Ecosystem Tooling",
        topics: [
          {
            title: "Hardhat",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Truffle",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Ethers.js / Web3.js Integration",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ERC Standards (ERC-20, ERC-721)",
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
        domain: "Architecture",
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
            title: "Entity Component System (ECS)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "State Management",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Mathematics for Games",
        topics: [
          {
            title: "Vectors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Matrices",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Quaternions",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Trigonometry",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Physics & Collision",
        topics: [
          {
            title: "Bounding Boxes (AABB)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Raycasting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rigidbodies",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Collision Resolution",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graphics & Rendering",
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
            title: "Textures & Sprites",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Lighting & Shadows",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Camera Systems",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Game AI",
        topics: [
          {
            title: "Finite State Machines (FSM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Behavior Trees",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Pathfinding (A*, NavMesh)",
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
        domain: "Engine Basics",
        topics: [
          {
            title: "Editor Interface",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GameObjects",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Components",
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
          }
        ]
      },
      {
        domain: "Scripting (C#)",
        topics: [
          {
            title: "MonoBehaviour Lifecycle",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Update vs FixedUpdate",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Coroutines",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ScriptableObjects",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Physics & UI",
        topics: [
          {
            title: "Colliders & Triggers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Rigidbodies",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Raycasts",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Unity UI (UGUI)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Canvas",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graphics & Animation",
        topics: [
          {
            title: "Materials & Shaders",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Particle Systems",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Animator Controller",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Animation Curves",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Systems",
        topics: [
          {
            title: "NavMesh (Pathfinding)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Addressables",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Multiplayer (Netcode for GameObjects)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Build Settings",
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
        domain: "Engine Fundamentals",
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
            title: "Pawn vs Character",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "GameMode",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Blueprints",
        topics: [
          {
            title: "Visual Scripting",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Event Graph",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Variables & Macros",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Blueprint Interfaces",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "C++ in Unreal",
        topics: [
          {
            title: "UObject Architecture",
            complexity: "Hard",
            size: "Large"
          },
          {
            title: "UPROPERTY & UFUNCTION Macros",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory Management (Garbage Collection)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Delegates",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Graphics (UE5)",
        topics: [
          {
            title: "Lumen (Global Illumination)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Nanite (Virtual Geometry)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Materials",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Niagara (Particles)",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Multiplayer",
        topics: [
          {
            title: "Replication",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RPCs (Remote Procedure Calls)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Authority vs Client",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Session Management",
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
        domain: "Hardware Architecture",
        topics: [
          {
            title: "Microcontrollers vs Microprocessors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Memory (RAM, ROM, EEPROM, Flash)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Registers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Clocks & Oscillators",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "I/O & Interrupts",
        topics: [
          {
            title: "GPIO (General Purpose I/O)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interrupt Service Routines (ISRs)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Timers & Counters",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PWM",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "ADC/DAC",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Communication Protocols",
        topics: [
          {
            title: "UART",
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
            title: "CAN Bus",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "1-Wire",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Software & OS",
        topics: [
          {
            title: "Bare-metal Programming",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RTOS (Tasks, Schedulers, Mutexes, Queues)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Watchdog Timers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Power Management",
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
        domain: "Arduino Environment",
        topics: [
          {
            title: "IDE Setup",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Sketches",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "setup() and loop()",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Serial Monitor",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Digital & Analog I/O",
        topics: [
          {
            title: "digitalRead/Write",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "analogRead/Write (PWM)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "PinModes",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Sensors & Actuators",
        topics: [
          {
            title: "Interfacing LEDs & Buttons",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Reading Temperature/Humidity Sensors",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Controlling Servos & Steppers",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Advanced Arduino",
        topics: [
          {
            title: "Libraries",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Direct Port Manipulation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Interrupts (attachInterrupt)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "EEPROM Usage",
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
        domain: "Setup & OS",
        topics: [
          {
            title: "Raspberry Pi OS Installation",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Headless Setup",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "SSH Access",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "raspi-config",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Hardware Interfacing",
        topics: [
          {
            title: "GPIO Pins",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Python RPi.GPIO Library",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "I2C/SPI on Pi",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Camera Module",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Networking & IoT",
        topics: [
          {
            title: "Setting up Web Servers (Flask/Node)",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "MQTT Protocols",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Bluetooth/Wi-Fi Config",
            complexity: "Medium",
            size: "Medium"
          }
        ]
      },
      {
        domain: "Projects & Automation",
        topics: [
          {
            title: "Cron Jobs",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Systemd Services",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "Media Centers",
            complexity: "Medium",
            size: "Medium"
          },
          {
            title: "RetroPie",
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
  
  const matched = SKILL_REGISTRY.find(s => s.aliases.includes(normalized) || s.id === normalized || s.canonicalName.toLowerCase() === normalized)
  if (matched) return matched

  const partial = SKILL_REGISTRY.find(s => s.canonicalName.toLowerCase().includes(normalized))
  if (partial) return partial

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
