'use client';

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { TagTypeEnum } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// import { BytemdEditor } from '@/components/bytemd';
import { IconMingcuteLoadingLine } from '@/components/icons';
import { VEditor } from '@/components/mdeditor/create-editor';

import { PATHS } from '@/constants';
import { CreateTagButton } from '@/features/admin';
import {
  type CreateSnippetDTO,
  createSnippetSchema,
  useCreateSnippet,
} from '@/features/snippet';
import { useGetAllTags } from '@/features/tag';
import { toSlug } from '@/lib/utils';

export const CreateSnippetForm = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const getTagsQuery = useGetAllTags(TagTypeEnum.SNIPPET);
  const tags = React.useMemo(() => {
    return getTagsQuery.data?.tags ?? [];
  }, [getTagsQuery]);

  const createSnippetQuery = useCreateSnippet();

  const defaultValues = useMemo(
    () => ({
      title: '',
      slug: '',
      description: '',
      published: false,
      body: '',
      tags: [],
    }),
    [],
  );

  const form = useForm<CreateSnippetDTO>({
    resolver: zodResolver(createSnippetSchema),
    defaultValues,
  });

  const setContent = useCallback(
    (value: string) => {
      form.setValue('body', value);
    },
    [form],
  );

  React.useEffect(() => {
    if (open) {
      for (const key in defaultValues) {
        if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
          if (key !== 'body') {
            form.resetField(
              key as
                | 'title'
                | 'slug'
                | 'description'
                | 'published'
                | 'tags'
                | `tags.${number}`,
            );
          }
        }
      }
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, open]);

  return (
    <>
      <div id="content-editor">
        {/* <BytemdEditor body={body} setContent={_.debounce(onChange, 500)} /> */}
        <VEditor setContent={setContent} />
      </div>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogTrigger asChild>
          <div className="fixed z-10 bottom-[3rem] right-12 md:right-[3rem] flex items-center">
            <Button
              className="w-60 "
              type="button"
              onClick={() => setOpen(true)}
            >
              保存
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form autoComplete="off">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标题</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="请输入标题" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>路由</FormLabel>
                      <FormControl>
                        <div className="flex items-center w-full gap-4">
                          <Input {...field} placeholder="请输入slug" />
                          <Button type="button" onClick={handleFormatSlug}>
                            格式化
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标签</FormLabel>
                      <FormControl>
                        <div className="flex items-center w-full gap-4">
                          <div className=" w-full ">
                            <Combobox
                              options={
                                tags?.map((el) => ({
                                  label: el.name,
                                  value: el.id,
                                })) ?? []
                              }
                              multiple
                              clearable
                              selectPlaceholder="请选择标签"
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </div>
                          <CreateTagButton
                            refreshAsync={getTagsQuery.refreshAsync}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="请输入描述" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>是否发布</FormLabel>
                      <FormControl>
                        <div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => form.handleSubmit(handleSubmit)()}
                    variant={'default'}
                    className="w-60 "
                  >
                    {createSnippetQuery.loading && (
                      <IconMingcuteLoadingLine className="mr-2 text-base animate-spin" />
                    )}
                    确认创建
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );

  async function handleSubmit(values: CreateSnippetDTO) {
    await createSnippetQuery.runAsync(values);
    router.push(PATHS.ADMIN_SNIPPET);
  }

  function handleFormatSlug() {
    const tmp = form.getValues().slug?.trim();
    if (tmp) {
      const formatted = toSlug(tmp);
      form.setValue('slug', formatted);
    }
  }
};
