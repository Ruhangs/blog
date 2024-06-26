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
import {
  hideToast,
  showErrorToast,
  showInfoToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/toast';

// import { BytemdEditor } from '@/components/bytemd';
import { IconEvaUpload, IconMingcuteLoadingLine } from '@/components/icons';
import { VEditor } from '@/components/mdeditor/create-editor';

import { PATHS } from '@/constants';
import { CreateTagButton } from '@/features/admin';
import {
  type UpdateBlogDTO,
  updateBlogSchema,
  useGetBlog,
  useUpdateBlog,
} from '@/features/blog';
import { useGetAllTags } from '@/features/tag';
import { uploadFile } from '@/features/upload';
import { toSlug } from '@/lib/utils';

export const EditBlogForm = () => {
  const [open, setOpen] = React.useState(false);

  const getTagsQuery = useGetAllTags(TagTypeEnum.BLOG);
  const tags = React.useMemo(() => {
    return getTagsQuery.data?.tags ?? [];
  }, [getTagsQuery]);

  const { id } = useParams<{ id: string }>();
  const getBlogQuery = useGetBlog(id, Boolean(id));
  const blog = React.useMemo(() => {
    return getBlogQuery.data?.blog;
  }, [getBlogQuery]);

  const updateBlogQuery = useUpdateBlog();

  const router = useRouter();
  const [cover, setCover] = React.useState('');
  const [body, setBody] = React.useState('');
  const defaultValues = React.useMemo(
    () => ({
      title: '',
      slug: '',
      description: '',
      body: '',
      published: false,
      cover: '',
      author: '',
      tags: [],
    }),
    [],
  );
  const form = useForm<UpdateBlogDTO>({
    resolver: zodResolver(updateBlogSchema),
  });

  React.useEffect(() => {
    form.setValue('title', blog?.title ?? '');
    form.setValue('id', blog?.id ?? '');
    form.setValue('slug', blog?.slug ?? '');
    form.setValue('description', blog?.description ?? '');
    form.setValue('body', blog?.body ?? '');
    form.setValue('author', blog?.author ?? '');
    form.setValue('published', blog?.published ?? true);
    form.setValue('cover', blog?.cover ?? '');
    form.setValue('tags', blog?.tags?.map((el) => el.id) ?? []);
    setBody(blog?.body ?? '');
    setCover(blog?.cover ?? '');
  }, [blog, form]);

  const onChange = (value: string) => {
    form.setValue('body', value);
  };

  React.useEffect(() => {
    if (open) {
      form.setValue('title', blog?.title ?? '');
      form.setValue('id', blog?.id ?? '');
      form.setValue('slug', blog?.slug ?? '');
      form.setValue('description', blog?.description ?? '');
      form.setValue('author', blog?.author ?? '');
      form.setValue('published', blog?.published ?? true);
      form.setValue('cover', blog?.cover ?? '');
      form.setValue('tags', blog?.tags?.map((el) => el.id) ?? []);
      setCover(blog?.cover ?? '');
      form.clearErrors();
    }
  }, [form, open, blog, defaultValues]);

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
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>作者</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder="请输入作者"
                        />
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
                        <Textarea {...field} placeholder="请输入描述" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>封面</FormLabel>
                      <FormControl>
                        <div className="flex items-center w-full gap-4">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="点击上传按钮上传图像后显示图像链接"
                            readOnly
                          />
                          <label
                            className="w-20 h-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-3xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary !text-primary-foreground hover:bg-primary/90"
                            htmlFor="upload"
                          >
                            <IconEvaUpload />
                          </label>
                          <Input
                            type="file"
                            id="upload"
                            className="hidden"
                            onChange={async (e) => {
                              try {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  const toastID = showLoadingToast('上传中');
                                  const { url, error } = await uploadFile(fd);
                                  hideToast(toastID);

                                  if (error) {
                                    showErrorToast(error);
                                    return [];
                                  }

                                  if (url) {
                                    showSuccessToast('上传成功');
                                  }

                                  setCover(url ?? '');
                                  form.setValue('cover', url ?? '');
                                } else {
                                  showInfoToast('请选择一个文件');
                                }
                              } catch (error) {
                                showErrorToast(error as string);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {Boolean(cover) && (
                        <img
                          src={cover}
                          className="h-24 object-scale-down"
                          alt={''}
                        />
                      )}
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
                    disabled={updateBlogQuery.loading}
                    className="w-60 "
                  >
                    {updateBlogQuery.loading && (
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

  async function handleSubmit(values: UpdateBlogDTO) {
    await updateBlogQuery.runAsync(values);
    router.push(PATHS.ADMIN_BLOG);
  }

  function handleFormatSlug() {
    const tmp = form.getValues().slug?.trim();
    if (tmp) {
      const formatted = toSlug(tmp);
      form.setValue('slug', formatted);
    }
  }
};
