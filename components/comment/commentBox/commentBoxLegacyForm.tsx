import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import dynamic from 'next/dynamic';

import { zodResolver } from '@hookform/resolvers/zod';
import { CommentTypeEnum } from '@prisma/client';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
// import { useIsLogged } from '~/atoms/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Portal from '@/components/ui/portal';
import { TextArea } from '@/components/ui/taxtarea';

import {
  IconMingcuteEmojiLine,
  IconMingcuteSendLine,
} from '@/components/icons';

import {
  type CreateCommentDTO,
  createCommentSchema,
  useCreateComment,
} from '@/features/comment';

// const taClassName =
//   'relative h-[150px] w-full rounded-xl bg-gray-200/50 dark:bg-zinc-800/50';

interface propsType {
  refId: string;
  parentId?: string;
  toCommentId?: string;
  postId?: string;
}

export const CommentBoxLegacyForm = ({
  refId,
  parentId = '',
  toCommentId = '',
  postId = '',
}: propsType) => {
  const EmojiPicker = dynamic(() =>
    import('./emojiPicker').then((mod) => mod.EmojiPicker),
  );
  const handleInsertEmoji = (emoji: string) => {
    if (!taRef.current) {
      return;
    }

    const $ta = taRef.current;
    const start = $ta.selectionStart;
    const end = $ta.selectionEnd;

    $ta.value = `${$ta.value.substring(
      0,
      start,
    )} ${emoji} ${$ta.value.substring(end, $ta.value.length)}`;
    setContent($ta.value);
    requestAnimationFrame(() => {
      const shouldMoveToPos = start + emoji.length + 2;
      $ta.selectionStart = shouldMoveToPos;
      $ta.selectionEnd = shouldMoveToPos;
      $ta.focus();
    });
  };
  const createBlogQuery = useCreateComment();

  const isTextOversize = (content: string) => {
    return content.length > MAX_COMMENT_TEXT_LENGTH;
  };

  const form = useForm<CreateCommentDTO>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      author: '',
      email: '',
      url: '',
      parentId: parentId, //一级评论的ID
      toCommentId: toCommentId,
      refId: postId,
      text: '',
      type: CommentTypeEnum.COMMENT,
    },
  });
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    form.setValue('text', content);
  }, [content, form]);

  const [open, setOpen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  // const containerRef = useRef(null);
  const MAX_COMMENT_TEXT_LENGTH = 500;

  // useEffect(() => {
  //   const div = document.getElementById('test');
  //   console.log(div);
  //   const targetDiv = document.createElement('div');
  //   targetDiv.id = 'target-div';
  //   div?.appendChild(targetDiv);
  //   // document.body.appendChild(targetDiv);
  // }, []);

  async function onSubmit(values: CreateCommentDTO) {
    try {
      await createBlogQuery.runAsync(values);
    } catch (error) {
      console.error('创建失败', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col space-y-4 px-2 pt-2"
      >
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="昵称*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="邮箱*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="地址"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormInput fieldKey="mail" required />
            <FormInput fieldKey="url" /> */}
        </div>
        <div className="relative h-[150px] w-full rounded-xl bg-gray-200/50 dark:bg-zinc-800/50">
          <TextArea
            bordered={false}
            wrapperClassName={`pb-8`}
            ref={taRef}
            // defaultValue={value}
            onChange={(e) => setContent(e.target.value)}
            // placeholder={placeholder}
            // onCmdEnter={(e) => {
            //   e.preventDefault();
            //   sendComment();
            // }}
          >
            <Portal containerId={refId}>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button aria-expanded={open} aria-label="表情" variant="link">
                    <IconMingcuteEmojiLine />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 bg-transparent border-0"
                  sideOffset={8}
                  align="start"
                >
                  <EmojiPicker onEmojiSelect={handleInsertEmoji} />
                </PopoverContent>
              </Popover>
            </Portal>
          </TextArea>
        </div>
        <footer
          className={clsx(
            'mt-3 flex h-5 w-full min-w-0 items-center justify-end absolute bottom-4 left-0 right-4 mb-2 ml-2 px-4',
          )}
        >
          <span
            className={clsx(
              'flex flex-1 items-center select-none text-[10px] text-zinc-500 transition-opacity',
            )}
          >
            <span className="hidden md:inline">
              暂不支持 <b>Markdown</b>
            </span>
            <div id={refId}></div>
          </span>
          <AnimatePresence>
            {content && (
              <motion.aside
                key="send-button-wrapper"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                className="flex select-none items-center gap-2.5"
              >
                <span
                  className={clsx(
                    'font-mono text-[10px]',
                    isTextOversize(content) ? 'text-red-500' : 'text-zinc-500',
                  )}
                >
                  {content.length}/{MAX_COMMENT_TEXT_LENGTH}
                </span>
                <motion.button
                  type="submit"
                  className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={createBlogQuery.loading}
                >
                  <IconMingcuteSendLine className="size-5 text-zinc-800 dark:text-zinc-200" />
                  <motion.span className="text-sm" layout="size">
                    {createBlogQuery.loading ? '送信...' : '送信'}
                  </motion.span>
                </motion.button>
              </motion.aside>
            )}
          </AnimatePresence>
        </footer>
      </form>
    </Form>
  );
};

// const LoggedForm = () => {
//   const user = useAggregationSelector((v) => v.user)!;

//   return (
//     <div className="flex space-x-4">
//       <div
//         className={clsx(
//           'mb-2 shrink-0 select-none self-end overflow-hidden rounded-full',
//           'dark:ring-zinc-800" bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
//           'backface-hidden ml-[2px]',
//         )}
//       >
//         <Image
//           className="rounded-full object-cover"
//           src={user.avatar}
//           alt={`${user.name || user.username}'s avatar`}
//           width={48}
//           height={48}
//         />
//       </div>
//       <div className={taClassName}>
//         <UniversalTextArea className="pb-5" />
//       </div>

//       <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
//     </div>
//   );
// };
