import type { SkillTimeDistribution } from "./types";

export const postgresqlTimeDistribution: SkillTimeDistribution = {
  "Numeric": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 78
    }
  },
  "String": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 27,
      Hard: 78
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
  "Arrays": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 73
    }
  },
  "JSON & JSONB": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 59
    }
  },
  "UUID": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 27,
      Hard: 80
    }
  },
  "Full-Text Search": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 72
    }
  },
  "Recursive CTEs": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 27,
      Hard: 76
    }
  },
  "Lateral Joins": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 28,
      Hard: 59
    }
  },
  "Materialized Views": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 52
    }
  },
  "EXPLAIN ANALYZE": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 25,
      Hard: 80
    }
  },
  "Index Types (B-Tree, GIN, GiST)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 30,
      Hard: 63
    }
  },
  "Vacuuming & Autovacuum": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 86
    }
  },
  "Connection Pooling (PgBouncer)": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 53
    }
  },
  "Roles & Permissions": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 27,
      Hard: 50
    }
  },
  "Backup & Restore (pg_dump)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 33,
      Hard: 46
    }
  },
  "Replication (Logical vs Physical)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 47
    }
  },
  "Partitioning": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 28,
      Hard: 75
    }
  },
};
