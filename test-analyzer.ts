// mock env
const _process = process;
Object.defineProperty(globalThis, 'import', { value: { meta: { env: { VITE_SUPABASE_URL: 'http://localhost', VITE_SUPABASE_ANON_KEY: 'key' } } }, writable: true });
import { analyzeRepository } from './src/lib/github-analyzer'

async function test() {
  const token = '';
  const analysis = await analyzeRepository('facebook', 'react', token);
  console.log('Evidences count:', analysis.evidences.length);
  if (analysis.evidences.length > 0) {
    console.log(analysis.evidences[0]);
  }
}

test();
