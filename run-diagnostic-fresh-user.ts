
// mock env
const _process = process;
Object.defineProperty(globalThis, 'import', {
  value: { meta: { env: { VITE_SUPABASE_URL: 'http://localhost', VITE_SUPABASE_ANON_KEY: 'key' } } },
  writable: true
});
import { analyzeRepository } from './src/lib/github-analyzer'
import { SKILL_REGISTRY, generateSubtopicsForSkill } from './src/data/learningData'
import { fetchRepoLanguages } from './src/lib/github'

async function run() {
  // Use a public repo without token to simulate public access
  const token = ''
  const owner = 'facebook'
  const repo = 'react'
  console.log(`Starting mock fresh-user sync for ${owner}/${repo}`)
  
  let allEvidences: any[] = []
  let allNewLanguages = new Set<string>()
  
  // 1. fetch languages
  console.log('Fetching languages...')
  const languages = await fetchRepoLanguages(token, owner, repo)
  const techList = Object.keys(languages).slice(0, 5)
  console.log(`Top 5 languages extracted:`, techList)
  techList.forEach(l => allNewLanguages.add(l))

  // 2. analyze repository
  console.log('Analyzing repository...')
  const analysis = await analyzeRepository(owner, repo, token)
  allEvidences.push(...analysis.evidences)
  console.log(`Files processed (implicitly by returning evidences): ${analysis.evidences.length > 0 ? "some" : "none"}`)
  console.log(`Number of matched structural evidences: ${analysis.evidences.length}`)

  let staleSkillStateForProgression: any[] = [] 
  const uniqueSkillNames = Array.from(new Set(allEvidences.map(e => e.skill)));
  
  let finalXpToAward = 0;
  uniqueSkillNames.forEach(skillName => {
     let existing = staleSkillStateForProgression.find((s: any) => s.canonicalName === skillName || (s.name && s.name.toLowerCase() === skillName.toLowerCase()));
     let subtopics = existing?.subtopics;
     if (!subtopics || subtopics.length === 0) {
        const resolved = SKILL_REGISTRY.find(s => s.canonicalName.toLowerCase() === skillName.toLowerCase() || s.aliases?.some(a => a.toLowerCase() === skillName.toLowerCase()));
        if (resolved) subtopics = generateSubtopicsForSkill(resolved);
     }
     if (!subtopics || subtopics.length === 0) return;
     
     const skillEvidences = allEvidences.filter(ev => ev.skill === skillName);
     const completedThisRun = new Set<string>();
     
     skillEvidences.forEach(ev => {
        const st = subtopics!.find(t => t.title === ev.subtopic);
        if (st) {
           if (st.status !== 'Completed' && !completedThisRun.has(st.id)) {
              completedThisRun.add(st.id);
              finalXpToAward += 100;
           }
        }
     });
  });
  
  console.log(`finalXpToAward calculated inside setProgression: ${finalXpToAward}`)
}

run().catch(console.error)
