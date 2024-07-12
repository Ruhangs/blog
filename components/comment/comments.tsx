'use client';

import { memo } from 'react';
import type { FC } from 'react';

import { useAsyncEffect } from 'ahooks';

import { useCommentStore } from '@/context/comment';
import { type CommentsDTO, useGetComments } from '@/features/comment';

import { Comment } from './comment';
import { CommentSkeleton } from './commentSkeleton';

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
  }
};

const CommentListItem: FC<{
  comment: CommentsDTO;
  postId: string;
}> = memo(function CommentListItem({ comment, postId }) {
  return <Comment comment={comment} postId={postId} parentId={comment.id} />;
});
