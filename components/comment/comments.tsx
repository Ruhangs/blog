'use client';

import { memo, useState } from 'react';
import type { FC } from 'react';

import { useAsyncEffect } from 'ahooks';

import { type CommentsDTO, getCommentsByRefId } from '@/features/comment';

import { Comment } from './comment';
import { CommentSkeleton } from './commentSkeleton';

export const Comments = ({ refId }: { refId: string }) => {
  const [comments, setComments] = useState<CommentsDTO[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useAsyncEffect(async () => {
    const data = await getCommentsByRefId(refId);
    if (data) {
      setComments(data.commentsTree);
      setIsLoading(false);
    }
  }, []);
  if (isLoading) {
    return <CommentSkeleton />;
  }

  console.log('xxx', comments);

  if (!comments?.length)
    return (
      <div className="flex min-h-[400px] center">
        <div className="flex h-[100px] items-center justify-center text-lg font-medium">
          {'这里还没有评论呢'}
        </div>
      </div>
    );
  return (
    <ul className="min-h-[400px] list-none space-y-4">
      {comments?.map(
        (comment) => {
          return (
            <CommentListItem
              comment={comment}
              key={comment.id}
              postId={refId}
            />
          );
        },
        // <BottomToUpSoftScaleTransitionView key={index}>
        // </BottomToUpSoftScaleTransitionView>
      )}
    </ul>
  );
};

const CommentListItem: FC<{
  comment: CommentsDTO;
  postId: string;
}> = memo(function CommentListItem({ comment, postId }) {
  return <Comment comment={comment} postId={postId} parentId={comment.id} />;
});
