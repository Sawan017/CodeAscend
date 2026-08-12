import type { SkillTimeDistribution } from "./types";

export const grpcTimeDistribution: SkillTimeDistribution = {
  "Message Definitions": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 48
    }
  },
  "Data Types": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 68
    }
  },
  "Compiling Protoc": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 74
    }
  },
  "Unary RPC": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 51
    }
  },
  "Server Streaming": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 21,
      Hard: 82
    }
  },
  "Client Streaming": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 58
    }
  },
  "Bidirectional Streaming": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 52
    }
  },
  "Interceptors": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 85
    }
  },
  "Deadlines & Timeouts": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 70
    }
  },
  "Error Handling": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 70
    }
  },
  "Load Balancing": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 15,
      Normal: 35,
      Hard: 68
    }
  },
};
