import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { prompt: salary }: { prompt: string } = await req.json()

  const prompt = `
    Given a monthly net salary of €${salary}, write a short, practical summary about what kind of lifestyle is possible in Estonia.
    Use bullet points and format your response in Markdown.
    `

  const result = streamText({
    model: openai.responses('gpt-4'),
    system:
      'You are an expert in Estonian living costs and lifestyle using the latest information available.',
    prompt,
  })

  return result.toDataStreamResponse()
}
