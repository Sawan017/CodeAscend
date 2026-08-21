
import { SKILL_REGISTRY } from "./src/data/learningData";
import { analyzeRepository } from "./src/lib/github-analyzer";
import { generateSubtopicsForSkill } from "./src/data/learningData";

async function run() {
  console.log("--- STARTING DIAGNOSTIC RUN ---");
  const token = ""; 
  const owner = "facebook";
  const repo = "react";
  
  console.log(`Analyzing ${owner}/${repo}...`);
  const analysis = await analyzeRepository(owner, repo, token);
  
  console.log(`Files analyzed: ${analysis.evidences.length > 0 ? "yes" : "no"}`);
  console.log(`Number of evidence objects produced: ${analysis.evidences.length}`);
  if (analysis.evidences.length > 0) {
    console.log("Sample evidence:", analysis.evidences[0]);
  }

  const uniqueSkillNames = Array.from(new Set(analysis.evidences.map((e: any) => e.skill)));
  console.log("Unique skills detected from evidence:", uniqueSkillNames);

  let mockSkillState: any[] = [];
  let totalXP = 0;
  
  uniqueSkillNames.forEach(skillName => {
    let existing = mockSkillState.find(s => s.canonicalName === skillName || s.name.toLowerCase() === skillName.toLowerCase());
    let subtopics = existing?.subtopics;
    
    if (!subtopics || subtopics.length === 0) {
      const resolved = SKILL_REGISTRY.find(s => s.canonicalName.toLowerCase() === skillName.toLowerCase() || s.aliases?.some(a => a.toLowerCase() === skillName.toLowerCase()));
      if (resolved) {
        subtopics = generateSubtopicsForSkill(resolved);
        console.log(`Created ${subtopics.length} official subtopics for ${skillName}`);
      } else {
        console.log(`COULD NOT RESOLVE SKILL: ${skillName}`);
      }
    }
    
    if (!subtopics || subtopics.length === 0) return;
    
    const skillEvidences = analysis.evidences.filter((ev: any) => ev.skill === skillName || (ev.skill && ev.skill.toLowerCase() === skillName.toLowerCase()));
    const completedThisRun = new Set<string>();
    let matchingCount = 0;
    let failingCount = 0;
    
    skillEvidences.forEach((ev: any) => {
      const st = subtopics!.find((t: any) => t.title === ev.subtopic);
      if (st) {
        matchingCount++;
        if (st.status !== "Completed" && !completedThisRun.has(st.id)) {
          completedThisRun.add(st.id);
          const baseXP = st.baseXP || 88;
          const averageXp = Math.floor((Math.floor(baseXP * 2.5) + Math.floor(baseXP * 1.75) + Math.floor(baseXP * 1.0)) / 3);
          totalXP += averageXp;
        }
      } else {
        failingCount++;
      }
    });
    
    console.log(`Skill ${skillName}: ${matchingCount} matched, ${failingCount} failed. Completed subtopics: ${completedThisRun.size}`);
  });
  
  console.log(`Final XP awarded: ${totalXP}`);
}

run().catch(console.error);

