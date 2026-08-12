import type { SkillTimeDistribution } from "./types";

export const terraformTimeDistribution: SkillTimeDistribution = {
  "Providers": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 83
    }
  },
  "Resources": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 80
    }
  },
  "Data Sources": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 45
    }
  },
  "HCL Syntax": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 34,
      Hard: 65
    }
  },
  "Init, Plan, Apply, Destroy": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 82
    }
  },
  "State Files (terraform.tfstate)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 20,
      Hard: 45
    }
  },
  "Remote State (S3, Azure Blob)": {
    intentionalDifficulty: "Hard",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 26,
      Hard: 75
    }
  },
  "State Locking": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 8,
      Normal: 28,
      Hard: 59
    }
  },
  "Importing Resources": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 53
    }
  },
  "Input Variables": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 54
    }
  },
  "Local Values": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 31,
      Hard: 88
    }
  },
  "Outputs": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 12,
      Normal: 24,
      Hard: 81
    }
  },
  "Modules": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 84
    }
  },
  "Workspaces": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 10,
      Normal: 22,
      Hard: 45
    }
  },
  "Provisioners": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 56
    }
  },
  "Dynamic Blocks": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 11,
      Normal: 23,
      Hard: 58
    }
  },
  "Functions": {
    intentionalDifficulty: "Easy",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 9,
      Normal: 29,
      Hard: 78
    }
  },
  "Count & For_each": {
    intentionalDifficulty: "Normal",
    teachingMinutes: 60,
    solvingBaselineMinutes: {
      Easy: 14,
      Normal: 26,
      Hard: 79
    }
  },
};
