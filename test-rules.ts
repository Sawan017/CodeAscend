
import { DETECTORS } from './src/lib/analyzer/index';
import { SKILL_REGISTRY } from './src/data/learningData';

for (const detector of DETECTORS) {
  const trackerSkill = SKILL_REGISTRY.find(s => s.canonicalName === detector.name);
  if (!trackerSkill) {
      console.log('Skill not found in registry:', detector.name);
      continue;
  }
  for (const rule of detector.rules) {
      let found = false;
      for (const domainGroup of trackerSkill.curriculum) {
          if (domainGroup.topics.some(t => {
               const official = t.title.toLowerCase();
               const ruleStr = rule.subtopic.toLowerCase();
               if (official === ruleStr) return true;
               if (official.includes(ruleStr) || ruleStr.includes(official)) return true;
               if (ruleStr.includes('array.') && official.includes('array')) return true;
               if (ruleStr === 'events' && official === 'event listeners') return true;
               if (ruleStr === 'fetch api' && official.includes('fetch')) return true;
               if (ruleStr === 'modules' && official.includes('modules')) return true;
               return false;
          })) {
              found = true;
              break;
          }
      }
      if (!found) {
          console.log('Rule NOT MATCHED:', detector.name, '->', rule.subtopic);
      }
  }
}

