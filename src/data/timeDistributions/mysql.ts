import type { SkillTimeDistribution } from "./types";

export const mysqlTimeDistribution: SkillTimeDistribution = {
  "InnoDB vs MyISAM": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 88
    }
  },
  "Memory Engine": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 66
    }
  },
  "Numeric": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 78
    }
  },
  "String (VARCHAR, TEXT)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 20,
      Hard: 53
    }
  },
  "Date/Time": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 45
    }
  },
  "Foreign Key Constraints": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 88
    }
  },
  "EXPLAIN": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 68
    }
  },
  "Query Caching": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 54
    }
  },
  "Indexing Strategies": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 64
    }
  },
  "Slow Query Log": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 33,
      Hard: 66
    }
  },
  "User Management": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 87
    }
  },
  "Replication (Master-Slave)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 84
    }
  },
  "Clustering Basics": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 25,
      Hard: 74
    }
  },
  "mysqldump": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 83
    }
  },
};
