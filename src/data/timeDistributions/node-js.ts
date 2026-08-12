import type { SkillTimeDistribution } from "./types";

export const nodejsTimeDistribution: SkillTimeDistribution = {
  "Event Loop": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 81
    }
  },
  "V8 Engine": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 81
    }
  },
  "Single-Threaded Non-Blocking I/O": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 28,
      Hard: 65
    }
  },
  "fs (File System)": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 56
    }
  },
  "path": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 33,
      Hard: 60
    }
  },
  "http": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 20,
      Hard: 79
    }
  },
  "events (Event Emitter)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 71
    }
  },
  "crypto": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 74
    }
  },
  "stream": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 53
    }
  },
  "CommonJS (require)": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 87
    }
  },
  "ES Modules (import)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 33,
      Hard: 82
    }
  },
  "NPM / Package Management": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 58
    }
  },
  "Worker Threads": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 25,
      Hard: 46
    }
  },
  "Child Processes": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 86
    }
  },
  "Buffer": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 30,
      Hard: 49
    }
  },
  "Performance Profiling": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 83
    }
  },
};
