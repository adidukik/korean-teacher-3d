import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const formalExample = {
  korean: [
    { word: '한국', reading: '한국' },
    { word: '에' },
    { word: '살고', reading: '살고' },
    { word: '있습니까' },
    { word: '?' },
  ],
  grammarBreakdown: [
    {
      english: '한국에 살고 있습니까?',
      korean: [
        { word: '한국', reading: '한국' },
        { word: '에' },
        { word: '살고', reading: '살고' },
        { word: '있습니까' },
        { word: '?' },
      ],
      chunks: [
        {
          korean: [{ word: '한국', reading: '한국' }],
          meaning: 'Korea',
          grammar: 'Noun',
        },
        {
          korean: [{ word: '에' }],
          meaning: 'in',
          grammar: 'Particle',
        },
        {
          korean: [{ word: '살고', reading: '살고' }, { word: '있습니까' }],
          meaning: 'live',
          grammar: 'Verb + 고 form + 있습니까',
        },
        {
          korean: [{ word: '?' }],
          meaning: 'question',
          grammar: 'Punctuation',
        },
      ],
    },
  ],
};

const casualExample = {
  korean: [
    { word: '한국', reading: '한국' },
    { word: '에' },
    { word: '살고', reading: '살고' },
    { word: '있어' },
    { word: '?' },
  ],
  grammarBreakdown: [
    {
      english: '한국에 살고 있어?',
      korean: [
        { word: '한국', reading: '한국' },
        { word: '에' },
        { word: '살고', reading: '살고' },
        { word: '있어' },
        { word: '?' },
      ],
      chunks: [
        {
          korean: [{ word: '한국', reading: '한국' }],
          meaning: 'Korea',
          grammar: 'Noun',
        },
        {
          korean: [{ word: '에' }],
          meaning: 'in',
          grammar: 'Particle',
        },
        {
          korean: [{ word: '살고', reading: '살고' }, { word: '있어' }],
          meaning: 'live',
          grammar: 'Verb + 고 form + 있어',
        },
        {
          korean: [{ word: '?' }],
          meaning: 'question',
          grammar: 'Punctuation',
        },
      ],
    },
  ],
};

export async function GET(req: NextRequest) {
  const speech = req.nextUrl.searchParams.get('speech') || 'formal';
  const speechExample = speech === 'formal' ? formalExample : casualExample;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a Korean language teacher. 
Your student asks you how to say something from English to Korean.
You should respond with: 
- english: the english version ex: "Do you live in Korea?"
- korean: the korean translation in split into words ex: ${JSON.stringify(
          speechExample.korean
        )}
- grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
          speechExample.grammarBreakdown
        )}
`,
      },
      {
        role: 'system',
        content: `You always respond with a JSON object with the following format: 
        {
          "english": "",
          "korean": [{
            "word": "",
            "reading": ""
          }],
          "grammarBreakdown": [{
            "english": "",
            "korean": [{
              "word": "",
              "reading": ""
            }],
            "chunks": [{
              "korean": [{
                "word": "",
                "reading": ""
              }],
              "meaning": "",
              "grammar": ""
            }]
          }]
        }`,
      },
      {
        role: 'user',
        content: `How to say ${
          req.nextUrl.searchParams.get('question') ||
          'Have you ever been to Korea?'
        } in Korean in ${speech} speech?`,
      },
    ],
    model: 'gpt-4o-mini',
    response_format: {
      type: 'json_object',
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content;
  if (content === null) {
    return Response.json({ error: "No content received from AI" });
  }
  return Response.json(JSON.parse(content));
}
