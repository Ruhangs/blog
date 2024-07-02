import { Badge } from '@/components/ui/badge';

// import { BytemdViewer } from '@/components/bytemd';
import { GoBack } from '@/components/go-back';
import { IconSolarEyeBold } from '@/components/icons';
import Article from '@/components/mdeditor/article';
import Catalogue from '@/components/mdeditor/catalogue';

import { toFromNow } from '@/lib/utils';
import { formatNum } from '@/utils';

import { SnippetEventTracking } from '../components/snippet-event-tracking';
import { type Snippet } from '../types';

type SnippetDetailProps = {
  snippet: Snippet;
  uv?: number;
};

export const SnippetDetailPage = ({ snippet, uv = 0 }: SnippetDetailProps) => {
  return (
    <div className="md:max-w-screen-md 2xl:max-w-6xl md:px-0 md:mx-auto py-12 grid gap-9 px-6">
      <Catalogue content={snippet.body || ''} />
      <article className="max-w-[calc(100vw-3rem)] md:max-w-[678px] mx-auto w-full">
        <h1 className="mb-4 text-2xl md:text-4xl font-extrabold ">
          {snippet.title}
        </h1>
        <div className="text-sm flex flex-row items-center text-muted-foreground mb-4">
          <span>发布于 {toFromNow(snippet.createdAt)}</span>
          <span className="mx-2">·</span>
          <div className="flex items-center space-x-1">
            <IconSolarEyeBold />
            <span>{formatNum(uv)} 人看过</span>
          </div>
        </div>
        <Article content={snippet.body || ''} />
      </article>
      <div className="max-w-[678px] mx-auto w-full pl-2">
        <div className="flex flex-wrap gap-2">
          {snippet.tags?.map((el) => (
            <Badge key={el.id} className="md:px-2 md:py-1 md:text-base">
              {el.name}
            </Badge>
          ))}
        </div>
        <GoBack />
        <SnippetEventTracking snippetID={snippet.id} />
      </div>
    </div>
  );
};
