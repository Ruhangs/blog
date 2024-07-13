'use client';

import { memo } from 'react';
import type { FC } from 'react';

import { useAsyncEffect } from 'ahooks';

import { useCommentStore } from '@/context/comment';
import { type CommentsDTO, useGetComments } from '@/features/comment';

import { Comment } from './comment';
import { CommentSkeleton } from './commentSkeleton';

import { IllustrationNoComments } from '../illustrations';

export const Comments = ({ refId }: { refId: string }) => {
  const getBlogQuery = useGetComments(refId, true);
  const comments = useCommentStore((state) => state.comments);
  const addComments = useCommentStore((state) => state.addComments);

  useAsyncEffect(async () => {
    const data = await getBlogQuery.runAsync();

    if (data) {
      addComments(data.commentsTree);
      // setIsLoading(false);
    }
  }, []);
  if (getBlogQuery.loading) {
    return <CommentSkeleton />;
  } else {
    if (!comments?.length)
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <IllustrationNoComments className="w-[10vh] h-[10vh]" />
          <span className="text-1xl text-center text-[#dbdbdb]">
            还没有任何评论~
          </span>
        </div>
      );
    return (
      <ul className="min-h-[400px] list-none space-y-4">
        {comments?.map((comment) => {
          return (
            <CommentListItem
              comment={comment}
              key={comment.id}
              postId={refId}
            />
          );
        })}
      </ul>
    );
  }
};

const CommentListItem: FC<{
  comment: CommentsDTO;
  postId: string;
}> = memo(function CommentListItem({ comment, postId }) {
  return <Comment comment={comment} postId={postId} parentId={comment.id} />;
});
