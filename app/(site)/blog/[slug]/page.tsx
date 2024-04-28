import { notFound } from 'next/navigation';

import { isNil } from 'lodash-es';

// import { getBlogUV } from '@/features/statistics';
// import { PATHS } from '@/constants';
import { BlogDetailPage, getPlublishedBlogBySlug } from '@/features/blog';
import { getSimpleVisitorCount } from '@/lib/analysis';

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const { blog } = await getPlublishedBlogBySlug(params.slug);
  const uv = await getSimpleVisitorCount(`/blog/${params.slug}`);
  // const uv = await getBlogUV(blog?.id);

  if (isNil(blog)) {
    return notFound();
  }

  return <BlogDetailPage blog={blog} uv={uv} />;
}
