'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

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
  type UpdateSnippetDTO,
  updateSnippetSchema,
  useGetSnippet,
  useUpdateSnippet,
} from '@/features/snippet';
import { useGetAllTags } from '@/features/tag';
import { toSlug } from '@/lib/utils';

export const EditSnippetForm = () => {
  const getTagsQuery = useGetAllTags(TagTypeEnum.SNIPPET);
  const tags = React.useMemo(() => {
    return getTagsQuery.data?.tags ?? [];
  }, [getTagsQuery]);
  const [body, setBody] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const { id } = useParams<{ id: string }>();
  const getSnippetQuery = useGetSnippet(id, Boolean(id));
  const snippet = React.useMemo(() => {
    return getSnippetQuery.data?.snippet;
  }, [getSnippetQuery]);
  const defaultValues = React.useMemo(
    () => ({
      title: '',
      id: '',
      slug: '',
      description: '',
      published: false,
      body: '',
      tags: [],
    }),
    [],
  );

  const updateSnippetQuery = useUpdateSnippet();

  const router = useRouter();
  const form = useForm<UpdateSnippetDTO>({
    resolver: zodResolver(updateSnippetSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.setValue('title', snippet?.title ?? '');
    form.setValue('id', snippet?.id ?? '');
    form.setValue('slug', snippet?.slug ?? '');
    form.setValue('description', snippet?.description ?? '');
    form.setValue('body', snippet?.body ?? '');
    form.setValue('published', snippet?.published ?? false);
    form.setValue('tags', snippet?.tags?.map((el) => el.id) ?? []);
    setBody(snippet?.body ?? '');
  }, [snippet, form]);

  const onChange = (value: string) => {
    form.setValue('body', value);
  };

  React.useEffect(() => {
    if (open) {
      form.setValue('title', snippet?.title ?? '');
      form.setValue('id', snippet?.id ?? '');
      form.setValue('slug', snippet?.slug ?? '');
      form.setValue('description', snippet?.description ?? '');
      form.setValue('published', snippet?.published ?? false);
      form.setValue('tags', snippet?.tags?.map((el) => el.id) ?? []);
      form.clearErrors();
    }
  }, [form, open, snippet, defaultValues]);

  return (
    <>
      <div id="content-editor">
        <VEditor body={body} setContent={onChange} />
      </div>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogTrigger asChild>
          <div className="fixed z-10 bottom-[3rem] right-12 md:right-[3rem] flex items-center">
            <Button
              className="w-60 "
              type="button"
              onClick={() => setOpen(true)}
            >
              保 存
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑</DialogTitle>
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
                        <Input {...field} placeholder="请输入标题..." />
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
                      <FormLabel>slug</FormLabel>
                      <FormControl>
                        <div className="flex items-center w-full gap-4">
                          <Input {...field} placeholder="请输入slug" disabled />
                          <Button
                            type="button"
                            onClick={handleFormatSlug}
                            disabled
                          >
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
                          <div className="w-full">
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
                        <Textarea {...field} placeholder="请输入描述..." />
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
                    disabled={updateSnippetQuery.loading}
                    className="w-60 "
                  >
                    {updateSnippetQuery.loading && (
                      <IconMingcuteLoadingLine className="mr-2 text-base animate-spin" />
                    )}
                    确认
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );

  async function handleSubmit(values: UpdateSnippetDTO) {
    await updateSnippetQuery.runAsync(values);
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
