import fs from 'fs'; 
import { SKILL_REGISTRY, PATHWAY_REGISTRY } from './src/data/learningData.ts'; 

let domains = PATHWAY_REGISTRY.map(p => ({ 
  id: p.id, 
  name: p.name, 
  primarySkills: [], 
  secondarySkills: [] 
})); 

let skills = SKILL_REGISTRY.filter(s => s.id !== 'independent-skill').map(s => { 
  return { 
    id: s.id, 
    name: s.canonicalName, 
    primary: s.primaryDomainId, 
    secondary: s.secondaryDomainIds || [] 
  } 
}); 

skills.forEach(s => { 
  let pDomain = domains.find(d => d.id === s.primary); 
  if (pDomain) pDomain.primarySkills.push(s.name); 
  
  s.secondary.forEach(sec => { 
    let sDomain = domains.find(d => d.id === sec); 
    if (sDomain) sDomain.secondarySkills.push(s.name); 
  }); 
}); 

let counts = domains.map(d => `- ${d.name}: ${d.primarySkills.length + d.secondarySkills.length} (${d.primarySkills.length} primary, ${d.secondarySkills.length} secondary)`); 
console.log(counts.join('\n'));
