import { analyzeRepository } from './src/lib/github-analyzer';
import { SKILL_REGISTRY } from './src/data/learningData';
import { DETECTORS } from './src/lib/analyzer/index';

async function runTests() {
  console.log("Starting tests...");
  let mockFiles: { path: string; content: string }[] = [];

  // Mock global fetch
  (global as any).fetch = async (url: string) => {
    if (url.includes('/git/trees/')) {
      return { ok: true, json: async () => ({ tree: mockFiles.map(f => ({ path: f.path, type: 'blob' })) }) };
    } else if (url.includes('/HEAD/')) {
      const path = url.substring(url.indexOf('/HEAD/') + 6);
      const file = mockFiles.find(f => f.path === path);
      if (file) return { ok: true, text: async () => file.content };
    }
    return { ok: false };
  };

  const verify = (testName: string, passed: boolean, details: any) => {
    console.log(`\n==================================================`);
    console.log(`TEST: ${testName}`);
    console.log(`RESULT: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`DETAILS:`, JSON.stringify(details, null, 2));
    console.log(`==================================================`);
  };

  try {
    // TEST 1
    mockFiles = [{ path: 'test1.jsx', content: 'useState(' }];
    let result = await analyzeRepository('test', 'repo', 'token');
    let passed = result.evidences.length > 0 && result.evidences[0].skill === 'React' && result.evidences[0].subtopic === 'useState';
    verify("1. Single recognized technology", passed, result.evidences);

    // TEST 2
    mockFiles = [{ path: 'App.spec.tsx', content: 'interface User {} useState(0); test("w", () => {});' }];
    result = await analyzeRepository('test', 'repo', 'token');
    const hasTypeScript = result.evidences.some(e => e.skill === 'TypeScript');
    const hasReact = result.evidences.some(e => e.skill === 'React');
    const hasJest = result.evidences.some(e => e.skill === 'Jest');
    passed = hasTypeScript && hasReact && hasJest;
    verify("2. Multi-technology file (App.spec.tsx)", passed, result.evidences.map(e => e.skill));

    // TEST 3
    mockFiles = [{ path: 'data.py', content: 'import pandas as pd' }];
    result = await analyzeRepository('test', 'repo', 'token');
    const pandasDomains = result.evidences.filter(e => e.skill === 'Pandas').map(e => e.domain);
    passed = pandasDomains.includes('data-science') && pandasDomains.includes('ai-ml');
    verify("3. Multi-domain skill (Pandas)", passed, pandasDomains);

    // TEST 4
    DETECTORS.push({
      name: 'FakeSkill', extensions: ['.fake'], stripComments: c=>c,
      rules: [{ topic: 'Fake', subtopic: 'FakeSub', pattern: /fake/g }]
    });
    mockFiles = [{ path: 'test.fake', content: 'fake' }];
    result = await analyzeRepository('test', 'repo', 'token');
    passed = result.evidences.length === 0;
    verify("4. Detector skill missing from SKILL_REGISTRY", passed, result.evidences);
    DETECTORS.pop();

    // TEST 5
    DETECTORS.find(d => d.name === 'React')!.rules.push({
      topic: 'State & Effects', subtopic: 'useFake', pattern: /useFake/g
    });
    mockFiles = [{ path: 'test5.jsx', content: 'useFake' }];
    result = await analyzeRepository('test', 'repo', 'token');
    passed = !result.evidences.some(e => e.subtopic === 'useFake');
    verify("5. Detector topic/subtopic missing from tracker curriculum", passed, result.evidences);
    DETECTORS.find(d => d.name === 'React')!.rules.pop();

    // TEST 6
    mockFiles = [{ path: 'test6.jsx', content: 'useState(' }];
    let result1 = await analyzeRepository('test', 'repo', 'token');
    let result2 = await analyzeRepository('test', 'repo', 'token');
    passed = result1.evidences[0].fingerprint === result2.evidences[0].fingerprint;
    verify("6. Same evidence analyzed twice", passed, result1.evidences[0].fingerprint);

    // TEST 7
    const reactSkill = SKILL_REGISTRY.find(s => s.canonicalName === 'React')!;
    const oldPrimary = reactSkill.primaryDomainId;
    reactSkill.primaryDomainId = 'new-mobile-domain';
    mockFiles = [{ path: 'test7.jsx', content: 'useState(' }];
    result = await analyzeRepository('test', 'repo', 'token');
    passed = result.evidences.some(e => e.skill === 'React' && e.domain === 'new-mobile-domain');
    verify("7. Temporarily change a skill's domain", passed, result.evidences.map(e => ({ skill: e.skill, domain: e.domain })));
    reactSkill.primaryDomainId = oldPrimary;

  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runTests();
