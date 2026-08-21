// mock env
const _process = process;
Object.defineProperty(globalThis, 'import', { value: { meta: { env: { VITE_SUPABASE_URL: 'http://localhost', VITE_SUPABASE_ANON_KEY: 'key' } } }, writable: true });
import { resolveSkill, generateSubtopicsForSkill } from './src/data/learningData'

const evidences = [
  {
    domain: 'programming-languages',
    skill: 'JavaScript',
    topic: 'Variables',
    subtopic: 'Variables (let/const)',
    filename: 'test.js',
    evidenceType: 'structural',
    strength: 'strong',
    fingerprint: 'github|test',
    matchSnippet: 'const ref ='
  }
];

const p = {
  claimedRewards: [],
  xp: 0
};
let finalXpToAward = 0;
const newClaims: string[] = [];

const uniqueSkillNames = Array.from(new Set(evidences.map(e => e.skill)));

uniqueSkillNames.forEach(skillName => {
  let subtopics = [];
  const resolved = resolveSkill(skillName);
  if (resolved) {
      subtopics = generateSubtopicsForSkill(resolved);
  }
  
  if (!subtopics || subtopics.length === 0) return;
  
  const skillEvidences = evidences.filter(ev => ev.skill === skillName || (ev.skill && ev.skill.toLowerCase() === skillName.toLowerCase()));
  const completedThisRun = new Set<string>();
  
  skillEvidences.forEach(ev => {
      const st = subtopics.find(t => t.title === ev.subtopic);
      if (st) {
        const rewardKey = `subtopic_${st.id}`;
        const alreadyClaimed = p.claimedRewards.includes(rewardKey);
        
        console.log(`Found st: ${st.title} (id: ${st.id}). status: ${st.status}, alreadyClaimed: ${alreadyClaimed}`);
        if (st.status !== 'Completed' && !completedThisRun.has(st.id) && !alreadyClaimed) {
            completedThisRun.add(st.id);
            const baseXP = st.baseXP || 88;
            const prime = Math.floor(baseXP * 2.5);
            const focused = Math.floor(baseXP * 1.75);
            const extended = Math.floor(baseXP * 1.0);
            const averageXp = Math.floor((prime + focused + extended) / 3);
            
            finalXpToAward += averageXp;
            newClaims.push(rewardKey);
        } else {
            console.log(`Skipped because status=${st.status}, completedThisRun=${completedThisRun.has(st.id)}, alreadyClaimed=${alreadyClaimed}`);
        }
      } else {
          console.log(`No st matched for ev.subtopic: ${ev.subtopic}`);
          console.log(`Available subtopics:`, subtopics.map(s => s.title).join(', '));
      }
  });
});

console.log(`Final XP: ${finalXpToAward}`);
console.log(`New Claims:`, newClaims);
