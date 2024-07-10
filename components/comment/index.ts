// import { createElement } from 'react';
import dynamic from 'next/dynamic';

export const CommentsLazy = dynamic(
  () => import('./comments').then((mod) => mod.Comments),
  { ssr: false },
);
export const CommentBoxRootLazy = dynamic(
  () => import('./commentBox').then((mod) => mod.CommentBox),
  // {
  //   ssr: false,
  //   loading: () => createElement(Loading, { useDefaultLoadingText: true }),
  // },
);

// export { CommentAreaRootLazy } from './CommentRootLazy';
