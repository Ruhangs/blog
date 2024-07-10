'use client';

// import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { CommentBoxLegacyForm } from './commentBoxLegacyForm';

// import { CommentBoxSignedOutContent } from './SignedOutContent';
// import { SwitchCommentMode } from './SwitchCommentMode';
// import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight';

export const enum CommentBoxMode {
  'legacy',
  'with-auth',
}

export const CommentBox = ({
  className,
  refId,
  parentId,
  toCommentId,
  postId,
}: {
  className?: string;
  refId: string;
  parentId?: string;
  toCommentId?: string;
  postId?: string;
}) => {
  // const [mode, setMode] = useState();
  const mode = CommentBoxMode.legacy;
  // useEffect(() => {
  //   if (isLogged) setMode(CommentBoxMode.legacy);
  // }, [isLogged]);

  return (
    <div
      className={clsx('group relative w-full min-w-0', className)}
      data-hide-print
    >
      {/* <SwitchCommentMode /> */}

      <div className="relative w-full">
        {mode === CommentBoxMode.legacy ? (
          // <AutoResizeHeight>
          <CommentBoxLegacyForm
            refId={refId}
            postId={postId}
            parentId={parentId}
            toCommentId={toCommentId}
          />
        ) : (
          //     <AutoResizeHeight>
          //       {/* 未登录的时候 */}
          //       <CommentBoxSignedOutContent />
          //       {/* 已登录的时候 */}
          //       <CommentBoxAuthedInput />
          //     </AutoResizeHeight>
          <></>
        )}
      </div>
    </div>
  );
};
