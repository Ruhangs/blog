import { memo, useCallback, useState } from 'react';
import type { FC } from 'react';

import clsx from 'clsx';
import { m } from 'framer-motion';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Portal from '@/components/ui/portal';

import { softSpringPreset } from '@/constants';
import { type CommentsDTO } from '@/features/comment';
import { toSlashDateString } from '@/lib/utils';

// import { CommentMarkdown } from './CommentMarkdown';
import { CommentBox } from './commentBox';

export const Comment = memo(function Comment(props: {
  comment: CommentsDTO;
  postId: string;
  parentId: string;
  className?: string;
}) {
  const { comment, className, postId, parentId } = props;
  const { id: cid, author, text, url } = comment;
  const authorElement = url ? (
    <a
      href={url}
      className="ml-2 max-w-full shrink-0 break-all"
      target="_blank"
      rel="noreferrer"
    >
      {author}
    </a>
  ) : (
    <span className="ml-2 max-w-full shrink-0 break-all">{author}</span>
  );
  return (
    <>
      <m.li
        transition={softSpringPreset}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        data-comment-id={cid}
        data-parent-id={parentId}
        className={clsx('relative my-2', className)}
      >
        <div className="group flex w-full items-stretch gap-4">
          <div className="relative flex w-9 shrink-0 self-end">
            <Avatar>
              <AvatarImage
                width={24}
                height={24}
                src={url ? url : ''}
                alt={`${1}'s avatar`}
                className="size-9 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
              ></AvatarImage>
              <AvatarFallback className="bg-amber-400">
                {author.split('')[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div
            className={clsx(
              'flex flex-1 flex-col',
              'w-full min-w-0 items-start',
            )}
          >
            <span
              className={clsx(
                'flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200',
                'relative mb-2 w-full min-w-0 justify-center',
              )}
            >
              <span className="flex grow flex-wrap items-center gap-2">
                {authorElement}
                <span className="flex min-w-0 shrink select-none flex-wrap items-center space-x-2 self-end">
                  <span className="inline-flex shrink-0 text-[0.71rem] font-medium opacity-40">
                    {toSlashDateString(comment.createdAt)}
                  </span>
                  {/* <span className="break-all text-[0.71rem] opacity-30">
                    {key}
                  </span> */}
                  {/* {!!location && (
                    <span className="min-w-0 max-w-full truncate break-all text-[0.71rem] opacity-35">
                      来自：{location}
                    </span>
                  )} */}
                </span>
              </span>
            </span>

            {/* Content */}
            <div
              className={clsx(
                'relative inline-block rounded-xl px-2 py-1 text-zinc-800 dark:text-zinc-200',
                'rounded-bl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                'max-w-[calc(100%-3rem)]',
              )}
            >
              {/* TODO:支持markdown */}
              {/* <CommentMarkdown>{text}</CommentMarkdown> */}
              {comment.parentAuthor ? (
                <div className="border-l-2 border-l-orange-300 px-2 my-2 rounded-e-sm">
                  {comment.parentAuthor + ':  ' + comment.parentText}
                </div>
              ) : (
                <></>
              )}
              {text}
              <CommentReplyButton
                commentId={comment.id}
                parentId={parentId}
                postId={postId}
              />
            </div>
          </div>
        </div>
      </m.li>
      <div>
        <span id={comment.id + 'text'}></span>
      </div>

      {comment.children && comment.children.length > 0 && (
        <ul className="my-2 space-y-2">
          {comment.children.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              postId={postId}
              parentId={parentId}
              className="ml-9"
            />
          ))}
        </ul>
      )}
    </>
  );
});

const CommentReplyButton: FC<{
  commentId: string;
  parentId: string;
  postId: string;
}> = ({ commentId, postId, parentId }) => {
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  // const originalRefId = useCommentBoxRefIdValue()
  const onReplyCompleted = useCallback(() => {
    setReplyFormOpen(false);
  }, []);
  return (
    <>
      <button
        aria-label="回复"
        className={clsx(
          'absolute bottom-0 right-0 translate-x-2/3 translate-y-1/4 text-xs',
          'aspect-square rounded-full',
          'box-content flex size-6 p-[2px] center',
          'border border-slate-200 bg-zinc-100 dark:border-neutral-700 dark:bg-gray-800',
          'invisible cursor-pointer opacity-0',
          'group-[:hover]:visible group-[:hover]:opacity-70',
        )}
        onClick={() => {
          setReplyFormOpen((o) => !o);
        }}
      >
        <i className="icon-[mingcute--comment-line]" />
      </button>
      {replyFormOpen && (
        <Portal containerId={commentId + 'text'}>
          <div className="h-6" />
          <CommentBox
            className=" block"
            refId={commentId}
            parentId={parentId}
            toCommentId={commentId}
            postId={postId}
            onReplyCompleted={onReplyCompleted}
          />
          <div className="h-6" />
        </Portal>
      )}
    </>
  );
};
