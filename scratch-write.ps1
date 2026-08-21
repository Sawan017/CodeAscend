$content = @"
import type { ConceptEvidence, AnalysisResult } from './analyzer/types'
import { getDetectorsForFile } from './analyzer/index'
import { SKILL_REGISTRY, resolveSkill } from '../data/learningData.ts'

export type { ConceptEvidence, AnalysisResult }

const IGNORED_PATHS = [
  'node_modules', 'vendor', 'dist', 'build', 'out', 'bin', 'obj',
  'coverage', '.git', '.next', 'public', 'assets', 'min.js'
];

const GENERIC_STOP_WORDS = new Set([
  'and', 'or', 'the', 'in', 'of', 'with', 'to', 'for', 'a', 'an', 
  'basic', 'advanced', 'core', 'concepts', 'fundamentals', 'introduction', 
  'getting', 'started', 'setup', 'environment', 'usage', 'techniques', 
  'best', 'practices', 'topics', 'architecture', 'ecosystem', 'common',
  'patterns', 'integration', 'production'
]);

function extractKeywords(title: string): string[] {
  return title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !GENERIC_STOP_WORDS.has(w));
}

export async function analyzeRepository(owner: string, repo: string, token: string): Promise<AnalysisResult> {
  const result: AnalysisResult = { languagesDetected: [], evidences: [] };
  const languageSet = new Set<string>();

  try {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const treeRes = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/git/trees/HEAD?recursive=1', {
      headers
    });
    if (!treeRes.ok) return result;
    
    const treeData = await treeRes.json();
    
    const filesByExt = new Map<string, any[]>();
    for (const item of (treeData.tree || [])) {
      if (item.type !== 'blob') continue;
      if (IGNORED_PATHS.some(ignored => item.path.includes(ignored))) continue;
      
      const extMatch = item.path.match(/\.([0-9a-z]+)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'no-ext';
      
      if (!filesByExt.has(ext)) filesByExt.set(ext, []);
      filesByExt.get(ext)!.push(item);
    }

    for (const extFiles of filesByExt.values()) {
      extFiles.sort((a: any, b: any) => {
        const aSrc = a.path.match(/src|lib|components|pages|app|api/i) ? 1 : 0;
        const bSrc = b.path.match(/src|lib|components|pages|app|api/i) ? 1 : 0;
        if (aSrc !== bSrc) return bSrc - aSrc;
        return 0.5 - Math.random();
      });
    }

    const filesToAnalyze: any[] = [];
    let added = true;
    let idx = 0;
    while (added && filesToAnalyze.length < 120) {
      added = false;
      for (const extFiles of filesByExt.values()) {
        if (idx < extFiles.length) {
          filesToAnalyze.push(extFiles[idx]);
          added = true;
          if (filesToAnalyze.length >= 120) break;
        }
      }
      idx++;
    }

    let filesFetched = 0;
    let filesFailed = 0;
    
    for (const file of filesToAnalyze) {
      const hardcodedDetectors = getDetectorsForFile(file.path);
      const extMatch = file.path.match(/\.([0-9a-z]+)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      
      const genuineSkills = new Map<string, any>();
      const subTechDetectors = new Set<any>();
      
      for (const d of hardcodedDetectors) {
        const registeredSkill = SKILL_REGISTRY.find(s => s.canonicalName === d.name);
        if (registeredSkill) {
          genuineSkills.set(registeredSkill.canonicalName, registeredSkill);
        } else {
          subTechDetectors.add(d);
        }
      }
      
      if (ext) {
        const extSkill = resolveSkill(ext);
        if (extSkill.type !== 'OTHER' || SKILL_REGISTRY.some(s => s.id === extSkill.id)) {
          genuineSkills.set(extSkill.canonicalName, extSkill);
        }
      }
      
      if (genuineSkills.size === 0) continue;

      try {
        const contentRes = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + file.path, {
          headers: {
            ...headers,
            'Accept': 'application/vnd.github.v3.raw'
          }
        });
        
        if (!contentRes.ok) {
          filesFailed++;
          console.warn(`[GitHub Analyzer] Failed to fetch content for ${file.path}: ${contentRes.status}`);
          continue;
        }
        
        filesFetched++;
        let rawContent = await contentRes.text();
        const content = rawContent.replace(/[\x00]/g, '').replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
        const genericStripped = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/<!--[\s\S]*?-->/g, '');
        const isWeakByLength = genericStripped.length < 100;
      
        if (genericStripped.length < 20) continue; 

        for (const [skillName, trackerSkill] of genuineSkills.entries()) {
          languageSet.add(skillName);
          
          const candidateDomains = [trackerSkill.primaryDomainId];
          if (trackerSkill.secondaryDomainIds) {
            candidateDomains.push(...trackerSkill.secondaryDomainIds);
          }
          
          const detector = hardcodedDetectors.find(d => d.name === skillName);
          const strippedContent = detector && detector.stripComments ? detector.stripComments(content) : genericStripped;
          
          const matchedSubtopics = new Set<string>();

          if (detector) {
            for (const rule of detector.rules) {
              let trackerSubtopic = null;
              for (const domainGroup of trackerSkill.curriculum) {
                trackerSubtopic = domainGroup.topics.find((t: any) => {
                   const official = t.title.toLowerCase();
                   const ruleStr = rule.subtopic.toLowerCase();
                   if (official === ruleStr) return true;
                   try {
                     const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                     const ruleRegex = new RegExp(`\\b${escapeRegExp(ruleStr)}\\b`, 'i');
                     const officialRegex = new RegExp(`\\b${escapeRegExp(official)}\\b`, 'i');
                     if (ruleRegex.test(official) || officialRegex.test(ruleStr)) return true;
                   } catch (e) {
                     if (official.includes(ruleStr) || ruleStr.includes(official)) return true;
                   }
                   if (ruleStr.includes('array.') && official.includes('array')) return true;
                   if (ruleStr === 'events' && official === 'event listeners') return true;
                   if (ruleStr === 'fetch api' && official.includes('fetch')) return true;
                   if (ruleStr === 'modules' && official.includes('modules')) return true;
                   return false;
                });
                if (trackerSubtopic) break;
              }
              
              if (!trackerSubtopic) continue;

              const matches = strippedContent.match(rule.pattern);
              if (matches && matches.length > 0) {
                matchedSubtopics.add(trackerSubtopic.title);
                const strength = isWeakByLength ? 'weak' : 'strong';
                for (const parentDomain of candidateDomains) {
                  result.evidences.push({
                    domain: parentDomain,
                    skill: skillName,
                    topic: rule.topic,
                    subtopic: trackerSubtopic.title,
                    filename: file.path,
                    evidenceType: 'structural',
                    strength,
                    fingerprint: `github|${owner}|${repo}|${file.path}|${parentDomain}|${skillName}|${trackerSubtopic.title}`,
                    matchSnippet: matches[0]
                  });
                }
              }
            }
          }
          
          for (const domainGroup of trackerSkill.curriculum) {
            for (const topic of domainGroup.topics) {
              if (matchedSubtopics.has(topic.title)) continue;
              
              const keywords = extractKeywords(topic.title);
              let hasEvidence = false;
              let matchSnippet = '';
              
              if (keywords.length === 0) {
                hasEvidence = true;
                matchSnippet = genericStripped.slice(0, 50).trim() + '...';
              } else {
                for (const kw of keywords) {
                  try {
                    const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
                    const match = genericStripped.match(kwRegex);
                    if (match) {
                      hasEvidence = true;
                      const matchIdx = match.index || 0;
                      matchSnippet = genericStripped.substring(Math.max(0, matchIdx - 20), Math.min(genericStripped.length, matchIdx + 40)).replace(/\n/g, ' ');
                      break;
                    }
                  } catch(e) {}
                }
              }
              
              if (hasEvidence) {
                const strength = isWeakByLength ? 'weak' : 'strong';
                for (const parentDomain of candidateDomains) {
                  result.evidences.push({
                    domain: parentDomain,
                    skill: skillName,
                    topic: domainGroup.domain,
                    subtopic: topic.title,
                    filename: file.path,
                    evidenceType: 'structural',
                    strength,
                    fingerprint: `github|${owner}|${repo}|${file.path}|${parentDomain}|${skillName}|${topic.title}`,
                    matchSnippet: matchSnippet.trim()
                  });
                }
              }
            }
          }
          
          for (const subDetector of subTechDetectors) {
            const subStrippedContent = subDetector.stripComments ? subDetector.stripComments(content) : genericStripped;
            for (const rule of subDetector.rules) {
              const matches = subStrippedContent.match(rule.pattern);
              if (matches && matches.length > 0) {
                const subtopicName = `${subDetector.name}: ${rule.subtopic}`;
                const strength = isWeakByLength ? 'weak' : 'strong';
                for (const parentDomain of candidateDomains) {
                  result.evidences.push({
                    domain: parentDomain,
                    skill: skillName,
                    topic: rule.topic || "Ecosystem & Tooling",
                    subtopic: subtopicName,
                    filename: file.path,
                    evidenceType: 'structural',
                    strength,
                    fingerprint: `github|${owner}|${repo}|${file.path}|${parentDomain}|${skillName}|${subtopicName}`,
                    matchSnippet: matches[0]
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn(`[GitHub Analyzer] Failed to process file ${file.path}:`, err);
        filesFailed++;
      }
    }

    console.log(`[GitHub Analyzer] Analysis Complete for ${owner}/${repo}:`);
    console.log(`[GitHub Analyzer] - Files selected: ${filesToAnalyze.length}`);
    console.log(`[GitHub Analyzer] - Files fetched successfully: ${filesFetched}`);
    console.log(`[GitHub Analyzer] - Files failed to fetch: ${filesFailed}`);
    console.log(`[GitHub Analyzer] - Total evidences generated: ${result.evidences.length}`);
    
  } catch (err) {
    console.error('[GitHub Analyzer] Failed to analyze repository', err);
  }

  result.languagesDetected = Array.from(languageSet);
  return result;
}
"@
Set-Content src\lib\github-analyzer.ts -Value $content
