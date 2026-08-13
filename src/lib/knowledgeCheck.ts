import { supabase, isSupabaseConfigured } from './supabase'

export interface KnowledgeCheckEvaluation {
  score: number;
  passed: boolean;
  feedback: string;
  missingPoints: string[];
  correctAnswer?: string;
  aiGenerated?: boolean;
}

export type KnowledgeCheckPhase = 'theory' | 'coding'

export async function generateKnowledgeCheckQuestion(topic: string, subtopic: string, difficulty: string, phase: KnowledgeCheckPhase, recentQuestions: string[] = []): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    return _generateMockQuestion(topic, subtopic, difficulty, phase, recentQuestions);
  }

  try {
    let prompt = ''
    if (phase === 'theory') {
      // Detailed prompt to force topic‑specific, varied theory questions
      prompt = `You are generating a single concise theory question for a knowledge check.
Topic: ${topic}
Subtopic: ${subtopic}
Difficulty: ${difficulty}

Guidelines:
- The question must be directly about the given subtopic within the broader topic; avoid generic phrasing.
- Vary the question based on difficulty:
  * Easy (e.g., "What is the primary purpose of..."): Focused on definitions.
  * Medium (e.g., "Compare X and Y in the context of..."): Focused on relationships and usage.
  * Hard (e.g., "Explain the trade-offs of using X when..."): Focused on analysis and critical thinking.
- The wording should be natural and engaging.
- Provide ONLY the question text, no extra commentary.
${recentQuestions.length > 0 ? `
- IMPORTANT: Do NOT generate any of the following questions (or substantially similar variants):
${recentQuestions.map((q, i) => `  ${i + 1}. "${q}"`).join('\n')}
- Generate a genuinely DIFFERENT question that tests a different aspect of the subtopic.
` : ''}
`
    } else {
      // Detailed prompt for coding/practical questions
      prompt = `You are generating a single practical coding challenge for a knowledge check.
Topic: ${topic}
Subtopic: ${subtopic}
Difficulty: ${difficulty}

Guidelines:
- The task must require the learner to write actual code that uses the specified subtopic.
- Tailor the challenge to the difficulty level:
  * Easy (e.g., "Write a function that uses... to..."): Minimal syntax example.
  * Medium (e.g., "Implement a class/module to handle... using..."): Small functional snippet.
  * Hard (e.g., "Refactor this code to use... and handle potential edge cases for..."): Complex logic or debugging scenario.
- Return ONLY the question text and any minimal setup code needed; do NOT include the solution.
${recentQuestions.length > 0 ? `
- IMPORTANT: Do NOT generate any of the following questions (or substantially similar variants):
${recentQuestions.map((q, i) => `  ${i + 1}. "${q}"`).join('\n')}
- Generate a genuinely DIFFERENT coding challenge that tests a different aspect of the subtopic.
` : ''}
`
    }

    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        messages: [{ role: 'user', content: prompt }] 
      }
    });

    if (error || !data?.content) {
      console.warn(`AI ${phase} question generation failed, falling back to mock.`, error);
    return _generateMockQuestion(topic, subtopic, difficulty, phase, recentQuestions);
    }

    return data.content.trim();
  } catch (e) {
    console.warn(`Exception in AI ${phase} question generation, falling back to mock.`, e);
    return _generateMockQuestion(topic, subtopic, difficulty, phase, recentQuestions);
  }
}

export async function evaluateKnowledgeCheckAnswer(
  topic: string, 
  subtopic: string, 
  difficulty: string, 
  question: string, 
  answer: string,
  phase: KnowledgeCheckPhase
): Promise<KnowledgeCheckEvaluation> {
  if (!isSupabaseConfigured() || !supabase) {
    return _evaluateMockAnswer(question, answer, phase);
  }

  try {
    let prompt = ''
    if (phase === 'theory') {
      prompt = `You are evaluating a learner's answer to a theory knowledge check question.
Topic: ${topic}
Subtopic: ${subtopic}
Difficulty: ${difficulty}

Question: ${question}
Learner's Answer: ${answer}

Task:
1. Evaluate whether the answer demonstrates genuine understanding of the topic conceptually. Be tolerant of wording and minor spelling mistakes.
2. Evaluate whether the answer appears to be naturally written by the learner or AI-generated/copied.

Respond ONLY with a JSON object in this exact format, with no markdown formatting or extra text:
{
  "score": <0-100>,
  "passed": <true if score >= 70 AND it doesn't appear heavily AI generated/copied, false otherwise>,
  "feedback": "<1-2 sentence explanation of what they got right or wrong. Mention if it looks copied/AI generated if applicable.>",
  "missingPoints": ["<missing point 1>", "<missing point 2>"],
  "aiGenerated": <true if highly likely to be AI-generated/copied, false otherwise>
}`
    } else {
      prompt = `You are evaluating a learner's solution to a practical/coding question.
Topic: ${topic}
Subtopic: ${subtopic}
Difficulty: ${difficulty}

Question: ${question}
Learner's Solution: ${answer}

Task:
1. Evaluate the code for correctness, logic, implementation, and whether it solves the requested functionality.
2. Do not require an identical code solution to a reference. Different valid implementations must pass.
3. Minor syntax/style differences should not automatically fail if it demonstrates correct understanding.

Respond ONLY with a JSON object in this exact format, with no markdown formatting or extra text:
{
  "score": <0-100>,
  "passed": <true if score >= 70, false otherwise>,
  "feedback": "<1-2 sentence explanation of what works or needs fixing in their code.>",
  "missingPoints": ["<missing logic 1>", "<missing logic 2>"],
  "correctAnswer": "<an example of a correct approach/code snippet>"
}`
    }

    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        messages: [{ role: 'user', content: prompt }] 
      }
    });

    if (error || !data?.content) {
      console.warn(`AI ${phase} evaluation failed, falling back to mock.`, error);
      return _evaluateMockAnswer(question, answer, phase);
    }

    try {
      let content = data.content.trim();
      if (content.startsWith('\`\`\`json')) {
        content = content.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      }
      return JSON.parse(content) as KnowledgeCheckEvaluation;
    } catch (parseError) {
      console.warn(`Failed to parse AI ${phase} evaluation JSON, falling back to mock.`, parseError);
      return _evaluateMockAnswer(question, answer, phase);
    }
  } catch (e) {
    console.warn(`Exception in AI ${phase} evaluation, falling back to mock.`, e);
    return _evaluateMockAnswer(question, answer, phase);
  }
}


function _generateMockQuestion(
  topic: string,
  subtopic: string,
  difficulty: string,
  phase: KnowledgeCheckPhase,
  recentQuestions: string[] = []
): string {
  // Define template pools for each phase and difficulty level
  const theoryTemplates: Record<string, string[]> = {
    easy: [
      `What is the purpose of ${subtopic} in ${topic}?`,
      `Briefly describe how ${subtopic} works within ${topic}.`,
      `Identify one key benefit of using ${subtopic} when working with ${topic}.`,
      `What problem does ${subtopic} solve in the context of ${topic}?`,
      `In your own words, define what ${subtopic} means in ${topic}.`,
      `Name one situation where you would use ${subtopic} in ${topic}.`,
    ],
    medium: [
      `Compare ${subtopic} with another common approach in ${topic}.`,
      `Predict the outcome when ${subtopic} is applied to a typical ${topic} scenario.`,
      `Explain why ${subtopic} is preferred over alternatives in ${topic}.`,
      `What happens if you misuse ${subtopic} in ${topic}? Describe a likely issue.`,
      `How does ${subtopic} interact with other features of ${topic}?`,
      `Explain how ${subtopic} affects the structure or behavior of a ${topic} project.`,
    ],
    hard: [
      `Given a complex ${topic} situation, reason how ${subtopic} should be used to solve a specific problem.`,
      `Identify a potential error when ${subtopic} is misapplied in ${topic} and propose a fix.`,
      `Design a small experiment to test the effectiveness of ${subtopic} in ${topic}.`,
      `Critique a naive use of ${subtopic} in ${topic} and suggest a better approach.`,
      `Compare the trade-offs of two different ways to implement ${subtopic} in ${topic}.`,
      `Explain how ${subtopic} would behave differently in an edge case within ${topic}.`,
    ],
  };

  const codingTemplates: Record<string, string[]> = {
    easy: [
      `Write a minimal example showing how to use ${subtopic} in ${topic}.`,
      `Create a simple ${subtopic} snippet for a basic ${topic} task.`,
      `Demonstrate the core syntax of ${subtopic} within a ${topic} context.`,
      `Write the shortest valid code that uses ${subtopic} in ${topic}.`,
      `Show how to set up ${subtopic} for a beginner-level ${topic} example.`,
    ],
    medium: [
      `Implement a ${subtopic} solution that solves a typical ${topic} problem.`,
      `Write code using ${subtopic} to manipulate data as commonly done in ${topic}.`,
      `Build a small feature employing ${subtopic} that fits into a ${topic} workflow.`,
      `Write a function that uses ${subtopic} to handle a common ${topic} scenario.`,
      `Create a reusable ${subtopic} component or utility for ${topic}.`,
    ],
    hard: [
      `Develop a ${subtopic} implementation that handles edge cases in a ${topic} application.`,
      `Debug a faulty ${subtopic} snippet for ${topic} and correct the errors.`,
      `Optimize a ${subtopic} solution for performance within a ${topic} scenario.`,
      `Write a ${subtopic} implementation for ${topic} that includes proper error handling.`,
      `Refactor a naive ${subtopic} approach in ${topic} for better maintainability.`,
    ],
  };

  const diff = difficulty.toLowerCase();
  const level = diff.includes('hard') ? 'hard' : diff.includes('medium') ? 'medium' : 'easy';

  const templates = phase === 'theory' ? theoryTemplates : codingTemplates;
  const pool = (templates[level] || templates['easy']).slice();
  
  // Filter out questions that match recently shown questions
  const available = pool.filter(q => !recentQuestions.some(prev => {
    const na = prev.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nb = q.toLowerCase().replace(/[^a-z0-9]/g, '');
    return na === nb;
  }));
  
  const finalPool = available.length > 0 ? available : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}


function _evaluateMockAnswer(_question: string, answer: string, phase: KnowledgeCheckPhase): KnowledgeCheckEvaluation {
  const words = answer.trim().split(/\s+/).length;
  
  if (phase === 'theory') {
    if (words > 4) {
      return {
        score: 85,
        passed: true,
        feedback: "Good explanation. You correctly identified the core purpose in your own words.",
        missingPoints: [],
        aiGenerated: false
      };
    } else {
      return {
        score: 40,
        passed: false,
        feedback: "Your answer is too brief or missing key details. Try explaining how it works.",
        missingPoints: ["How it operates", "Primary use case"],
        aiGenerated: false
      };
    }
  } else {
    // Coding mock
    if (answer.includes('{') || answer.includes('=')) {
      return {
        score: 90,
        passed: true,
        feedback: "Your implementation looks solid and solves the core problem.",
        missingPoints: [],
        correctAnswer: "// Good approach shown here"
      };
    } else {
      return {
        score: 50,
        passed: false,
        feedback: "The code seems to be missing the correct syntax or logic.",
        missingPoints: ["Implementation logic", "Syntax requirements"],
        correctAnswer: "// Example showing the correct approach"
      };
    }
  }
}
