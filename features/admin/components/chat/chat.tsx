'use client';

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormEvent, type ReactElement, useRef, useState } from 'react';

import type { AgentStep } from 'langchain/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showErrorToast } from '@/components/ui/toast';

import { IconMingcuteLoadingLine } from '@/components/icons';

import { ChatMessageBubble } from './ChatMessageBubble';
import { IntermediateStep } from './IntermediateStep';

import { useChat } from 'ai/react';

export function Chat(props: {
  endpoint: string;
  emptyStateComponent?: ReactElement;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    endpoint,
    emptyStateComponent,
    placeholder,
    titleText = 'An LLM',
    showIntermediateStepsToggle,
    emoji,
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input
        type="checkbox"
        id="show_intermediate_steps"
        name="show_intermediate_steps"
        checked={showIntermediateSteps}
        onChange={(e) => setShowIntermediateSteps(e.target.checked)}
      ></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, 'base64').toString('utf8'))
        : [];
      const messageIndexHeader = response.headers.get('x-message-index');

      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    onError: (e) => {
      showErrorToast(e.message);
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 添加类
    // if (messageContainerRef.current) {
    //   messageContainerRef.current.classList.add('grow');
    // }
    // 没有信息
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput('');
      const messagesWithUserReply = messages.concat({
        id: messages.length.toString(),
        content: input,
        role: 'user',
      });

      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true,
        }),
      });
      console.log('res', response);
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        // Represent intermediate steps as system messages for display purposes
        const intermediateStepMessages = (json.intermediate_steps ?? []).map(
          (intermediateStep: AgentStep, i: number) => {
            return {
              id: (messagesWithUserReply.length + i).toString(),
              content: JSON.stringify(intermediateStep),
              role: 'system',
            };
          },
        );
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000),
          );
        }
        setMessages([
          ...newMessages,
          {
            id: (
              newMessages.length + intermediateStepMessages.length
            ).toString(),
            content: json.output,
            role: 'assistant',
          },
        ]);
      } else {
        if (json.error) {
          console.log('json', json.error);
          showErrorToast(json.error);
          throw new Error(json.error);
        }
      }
    }
  }

  return (
    <div
      className={`flex flex-col h-full items-center rounded grow overflow-hidden border`}
    >
      <h2 className={`text-2xl p-4 md:p-8`}>
        {emoji} {titleText}
      </h2>
      {messages.length === 0 ? emptyStateComponent : ''}
      <div
        className="flex flex-col-reverse h-full w-full mb-4 p-4 md:p-8 overflow-auto scrollbar transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return m.role === 'system' ? (
                <IntermediateStep key={m.id} message={m}></IntermediateStep>
              ) : (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiEmoji={emoji}
                  sources={sourcesForMessages[sourceKey]}
                />
              );
            })
          : ''}
      </div>

      <form onSubmit={sendMessage} className="flex w-full flex-col ">
        <div className="flex">{intemediateStepsToggle}</div>
        <div className="flex w-full mt-4 p-4 md:p-8">
          <Input
            className="grow mr-8 p-4 rounded"
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <Button type="submit" className="shrink-0 px-8 py-4 rounded w-28">
            <div
              role="status"
              className={`${chatEndpointIsLoading || intermediateStepsLoading ? '' : 'hidden'} flex justify-center`}
            >
              <IconMingcuteLoadingLine className="animate-spin text-base" />
              <span className="sr-only">Loading...</span>
            </div>
            <span
              className={
                chatEndpointIsLoading || intermediateStepsLoading
                  ? 'hidden'
                  : ''
              }
            >
              发送
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
