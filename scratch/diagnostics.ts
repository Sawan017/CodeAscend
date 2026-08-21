import { evaluateAchievementsAndBadges } from '../src/lib/progression';
import { achievements, initialProgression, projects, skills, goals, badges } from '../src/data/journeyData';

console.log('MASTER DEFINITIONS:', achievements.length);
console.log(achievements.map(a => a.id));

console.log('\nUSER PROGRESS / ACTIVITY:');
console.log('xp:', initialProgression.xp);
console.log('projectsCompleted:', initialProgression.projectsCompleted);
console.log('skillsMastered:', initialProgression.skillsMastered);
console.log('goalsCompleted:', initialProgression.goalsCompleted);

console.log('\nEVALUATION:');
// reset unlocked status for accurate test
const cleanAchievements = achievements.map(a => ({...a, unlocked: false}));
const result = evaluateAchievementsAndBadges(initialProgression, goals, projects, skills, cleanAchievements, badges);

result.updatedAchievements.forEach(a => {
  console.log(a.id, '->', a.unlocked ? 'UNLOCKED' : 'LOCKED');
});

const unlockedAfter = result.updatedAchievements.filter(a => a.unlocked);
console.log('\nUNLOCKED AFTER EVALUATION:', unlockedAfter.length);
console.log(unlockedAfter.map(a => a.id));

