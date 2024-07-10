'use server';

import { prisma } from '@/lib/prisma';
import { buildCommentTree } from '@/lib/utils';

import { type CreateCommentDTO, createCommentSchema } from '../types';

export const getCommentsByRefId = async (refId: string) => {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      refId: refId,
    },
  });

  // 调用函数并打印结果
  const commentsTree = buildCommentTree(comments);

  if (commentsTree) {
    return { commentsTree };
  } else {
    return null;
  }
};

// export const getCommentsByCommentId = async (commentId: string) => {
//   const message = await prisma.comment.findMany({
//     orderBy: {
//       createdAt: 'desc',
//     },
//     where: {
//       toCommentId: commentId,
//     },
//     select: {
//       author: true,
//       text: true,
//     },
//   });

//   return message;
// };

export const createComment = async (params: CreateCommentDTO) => {
  // if (await noPermission()) {
  //   return ERROR_NO_PERMISSION;
  // }
  const result = await createCommentSchema.safeParseAsync(params);

  if (!result.success) {
    const error = result.error.format()._errors?.join(';');
    // TODO: 记录日志
    throw new Error(error);
  }

  await prisma.comment.create({
    data: {
      author: result.data.author,
      email: result.data.email,
      url: result.data.url,
      parentId: result.data.parentId,
      toCommentId: result.data.toCommentId,
      refId: result.data.refId,
      text: result.data.text,
      type: result.data.type,
    },
  });
};
