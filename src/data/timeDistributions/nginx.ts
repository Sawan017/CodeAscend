import type { SkillTimeDistribution } from "./types";

export const nginxTimeDistribution: SkillTimeDistribution = {
  "nginx.conf Structure": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 46
    }
  },
  "Contexts (main, http, server, location)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 89
    }
  },
  "Directives": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 75
    }
  },
  "Serving Static Content": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 74
    }
  },
  "Index Files": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 68
    }
  },
  "Error Pages": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 30,
      Hard: 83
    }
  },
  "MIME Types": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 33,
      Hard: 78
    }
  },
  "proxy_pass": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 28,
      Hard: 53
    }
  },
  "Upstream Blocks": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 60
    }
  },
  "Load Balancing Algorithms": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 46
    }
  },
  "Sticky Sessions": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 45
    }
  },
  "SSL/TLS Configuration": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 45
    }
  },
  "Gzip Compression": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 47
    }
  },
  "Caching (proxy_cache)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 84
    }
  },
  "Rate Limiting": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 60
    }
  },
};
