/* eslint-disable @typescript-eslint/restrict-template-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/await-thenable */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from 'next/server';

import { AIMessage, ChatMessage, HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { StreamingTextResponse, type Message as VercelChatMessage } from 'ai';

import { OPENAI_BASE_URL } from '@/config';

export const runtime = 'edge';

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === 'user') {
    return new HumanMessage(message.content);
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const AGENT_SYSTEM_TEMPLATE = `You are a computer professional， named ruan tongxue. All responses must be easy to understand.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === 'user' || message.role === 'assistant',
    );

    const previousMessages = messages
      .slice(0, -1)
      .map(convertVercelMessageToLangChainMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // Requires process.env.SERPAPI_API_KEY to be set: https://serpapi.com/
    // You can remove this or use a different tool instead.
    const chat = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      // IMPORTANT: Must "streaming: true" on OpenAI to enable final output streaming below.
      streaming: true,
      configuration: {
        baseURL: OPENAI_BASE_URL,
      },
    });

    const parser = new StringOutputParser();

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', AGENT_SYSTEM_TEMPLATE],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ]);

    const chain = prompt.pipe(chat).pipe(parser);

    const stream = await chain.stream({
      input: currentMessageContent,
      chat_history: previousMessages,
    });

    return new StreamingTextResponse(stream);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status ?? 500 },
    );
  }
}
