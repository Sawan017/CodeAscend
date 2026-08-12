import type { SkillTimeDistribution } from "./types";

export const owasptop10TimeDistribution: SkillTimeDistribution = {
  "SQL Injection": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 52
    }
  },
  "NoSQL Injection": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 20,
      Hard: 57
    }
  },
  "Command Injection": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 55
    }
  },
  "Cross-Site Scripting (XSS)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 63
    }
  },
  "Broken Access Control": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 71
    }
  },
  "Session Hijacking": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 32,
      Hard: 65
    }
  },
  "Credential Stuffing": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 48
    }
  },
  "Insecure Direct Object References (IDOR)": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 72
    }
  },
  "Security Misconfiguration": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 54
    }
  },
  "XML External Entities (XXE)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 80
    }
  },
  "Server-Side Request Forgery (SSRF)": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 48
    }
  },
  "Insecure Deserialization": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 13,
      Normal: 25,
      Hard: 90
    }
  },
  "Sensitive Data Exposure": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 46
    }
  },
  "Cryptographic Failures": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 30,
      Hard: 71
    }
  },
  "Insufficient Logging & Monitoring": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 30,
      Hard: 79
    }
  },
};
