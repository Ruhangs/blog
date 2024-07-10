import { CommentTypeEnum } from '@prisma/client';
import { z } from 'zod';

import { REGEX } from '@/constants';

// import { type getBlogs } from '../actions';

export const createCommentSchema = z.object({
  author: z
    .string()
    .min(1, {
      message: '昵称长度应在 1-20 之间',
    })
    .max(20, { message: '昵称长度应在 1-20 之间' }),
  email: z.string().regex(REGEX.EMAIL, {
    message: '邮箱格式不正确',
  }),
  url: z
    .string()
    .regex(REGEX.URL, {
      message: '网址格式不正确',
    })
    .optional(),
  parentId: z.string().optional(), //一级评论的ID
  toCommentId: z.string().optional(),
  refId: z.string(),
  text: z.string(),
  type: z.enum([CommentTypeEnum.COMMENT, CommentTypeEnum.REPLY]),
});

export const getCommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  email: z.string(),
  url: z.string().nullable(),
  refId: z.string(),
  parentId: z.string().nullable(),
  toCommentId: z.string().nullable(),
  text: z.string(),
  type: z.enum([CommentTypeEnum.COMMENT, CommentTypeEnum.REPLY]),
  createdAt: z.date(),
});

interface Comment {
  id: string;
  author: string;
  email: string;
  url: string | null;
  refId: string;
  parentId: string | null;
  toCommentId: string | null;
  text: string;
  type: CommentTypeEnum;
  parentText?: string;
  parentAuthor?: string;
  createdAt: Date;
  children: Comment[];
}

export const CommentSchema: z.ZodSchema<Comment> = z.lazy(() =>
  z.object({
    id: z.string(),
    author: z.string(),
    email: z.string(),
    url: z.string().nullable(),
    refId: z.string(),
    parentId: z.string().nullable(),
    toCommentId: z.string().nullable(),
    text: z.string(),
    type: z.enum([CommentTypeEnum.COMMENT, CommentTypeEnum.REPLY]),
    parentText: z.string().optional(),
    parentAuthor: z.string().optional(),
    createdAt: z.date(),
    children: z.array(CommentSchema),
  }),
);

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type GetCommentsDTO = z.infer<typeof getCommentSchema>;

export type CommentsDTO = z.infer<typeof CommentSchema>;
// export type Blog = Awaited<ReturnType<typeof getBlogs>>['blogs'][number];
