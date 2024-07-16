import { Badge } from '@/components/ui/badge';

import { CommentBox } from '@/components/comment/commentBox';
import { Comments } from '@/components/comment/comments';
import { GoBack } from '@/components/go-back';
import { IconSolarEyeBold } from '@/components/icons';
import Article from '@/components/mdeditor/article';
import Catalogue from '@/components/mdeditor/catalogue';

import { NICKNAME } from '@/constants';
import { toFromNow } from '@/lib/utils';
import { formatNum } from '@/utils';

import { BlogEventTracking } from '../components/blog-event-tracking';
import { type Blog } from '../types';

type BlogDetailProps = {
  blog: Blog;
  uv?: number;
};

export const BlogDetailPage = ({ blog, uv = 0 }: BlogDetailProps) => {
  return (
    <div className="md:max-w-screen-md 2xl:max-w-6xl md:px-0 md:mx-auto py-12 grid gap-9 px-6">
      <Catalogue content={blog.body || ''} />
      <article className="max-w-[calc(100vw-3rem)] md:max-w-[678px] mx-auto w-full">
        {blog.cover && (
          <img
            src={blog.cover}
            alt={blog.title}
            className="max-w-screen-md 2xl:max-w-6xl h-auto mb-16 w-full"
          />
        )}
        <div className="mb-4 text-2xl md:text-4xl font-extrabold ">
          {blog.title}
        </div>
        <div className="text-sm mb-4 flex flex-row items-center text-muted-foreground">
          <div>{blog.author ? blog.author : NICKNAME}</div>
          <span className="mx-2">·</span>
          <span>发布于 {toFromNow(blog.createdAt)}</span>
          <span className="mx-2">·</span>
          <div className="flex items-center space-x-1">
            <IconSolarEyeBold />
            <span>{formatNum(uv)} 人看过</span>
          </div>
        </div>
        {/* <BytemdViewer body={blog.body || ''} /> */}
        <Article content={blog.body || ''}></Article>
      </article>
      <div className="max-w-[678px] mx-auto w-full pl-2">
        <div className="flex flex-wrap gap-2">
          {blog.tags?.map((el) => (
            <Badge key={el.id} className="px-1">
              {el.name}
            </Badge>
          ))}
        </div>

        <GoBack />

        <CommentBox refId={blog.id} postId={blog.id}></CommentBox>
        <hr className="mt-4" />
        <div className="mt-4">
          <Comments refId={blog.id}></Comments>
        </div>
        <BlogEventTracking blogID={blog.id} />
      </div>
    </div>
  );
};
