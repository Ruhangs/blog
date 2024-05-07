import { notFound } from 'next/navigation';

import { isNil } from 'lodash-es';

import { PATHS } from '@/constants';
import { BlogDetailPage, getPlublishedBlogBySlug } from '@/features/blog';
import { getSimpleVisitorCount } from '@/features/statistics';

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const { blog } = await getPlublishedBlogBySlug(params.slug);
  const uv = await getSimpleVisitorCount(`${PATHS.SITE_BLOG}/${params.slug}`);

  if (isNil(blog)) {
    return notFound();
  }

  return <BlogDetailPage blog={blog} uv={uv} />;
}
