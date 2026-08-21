
import { analyzeRepository } from './src/lib/github-analyzer';
async function run() {
  const result = await analyzeRepository('facebook', 'react', '');
  console.log('Evidences count:', result.evidences.length);
  if (result.evidences.length > 0) {
    console.log(result.evidences[0]);
  }
}
run();

