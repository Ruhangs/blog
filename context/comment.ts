import { cloneDeep } from 'lodash-es';
import { create } from 'zustand';

import { type CommentsDTO } from '@/features/comment';

interface commentState {
  comments: CommentsDTO[];
  addComments: (comments: CommentsDTO[]) => void;
  addNewComment: (comment: CommentsDTO) => void;
}

export const useCommentStore = create<commentState>()((set) => ({
  comments: [],
  addComments: (comments) => set(() => ({ comments: [...comments] })),
  addNewComment: (comment) =>
    set((state) => {
      const comments = state.comments;
      if (comment.parentId === '') {
        comments.unshift(comment);
      } else {
        comments.forEach((item) => {
          if (item.id === comment.parentId) {
            if (comment.parentId !== comment.toCommentId) {
              // console.log(item.toCommentId);
              item.children.forEach((i) => {
                if (comment.toCommentId === i.id) {
                  comment.parentAuthor = i.author;
                  comment.parentText = i.text;
                }
              });
            }
            item.children.push(comment);
          }
        });
      }
      return {
        comments: cloneDeep(comments),
      };
    }),
}));
