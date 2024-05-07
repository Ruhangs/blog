import { notFound } from 'next/navigation';

import { isNil } from 'lodash-es';

import { PATHS } from '@/constants';
import { SnippetDetailPage, getSnippetBySlug } from '@/features/snippet';
import { getSimpleVisitorCount } from '@/features/statistics';

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const { snippet } = await getSnippetBySlug(params.slug);
  const uv = await getSimpleVisitorCount(
    `${PATHS.SITE_SNIPPET}/${params.slug}`,
  );

  if (isNil(snippet)) {
    return notFound();
  }

  return <SnippetDetailPage snippet={snippet} uv={uv} />;
}
