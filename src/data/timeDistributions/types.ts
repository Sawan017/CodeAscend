
export interface SkillTimeDistribution {
  [subtopicTitle: string]: {
    intentionalDifficulty: "Easy" | "Normal" | "Hard";
    teachingMinutes: number;
    solvingBaselineMinutes: {
      Easy: number;
      Normal: number;
      Hard: number;
    };
  }
}
