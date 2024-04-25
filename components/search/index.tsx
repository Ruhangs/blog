'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { type Tag } from '@prisma/client';
import Fuse from 'fuse.js';
import type { FuseResult, IFuseOptions } from 'fuse.js';

import { Badge } from '@/components/ui/badge';

import { getPublishedBlogs } from '@/features/blog';

import { type Blog } from '../../features/blog/types';
import { IconEvaEnter, IconEvaSearch } from '../icons';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '../ui/dialog';

type HighlightProps = {
  text: string;
  keyword: string;
};

export default function Search() {
  const [allposts, setAllposts] = useState<Blog[]>([]);
  const [result, setResult] = useState<FuseResult<Blog>[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const fuseOptions: IFuseOptions<Blog> = {
    keys: ['title', 'tags.name', 'description'],
  };

  const getList = async () => {
    const { blogs } = await getPublishedBlogs();
    setAllposts(blogs);
    // if (!response?.ok) {
    //     return toast({
    //         title: "Something went wrong.",
    //         description: "Your post was not saved. Please try again.",
    //         variant: "destructive",
    //     })
    // }
    // response.json().then(res => {
    //     const list = res.filter((item: any) => item.published === true)
    //     setAllposts(list)
    // })
  };

  const fuse = new Fuse<Blog>(allposts, fuseOptions);
  let res: FuseResult<Blog>[] = [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    res = fuse.search(e.target.value);
    setResult(res);
    setKeyword(e.target.value);
  };

  const handleOpen = async () => {
    await getList();
    setResult([]);
  };

  const Highlight = ({ text, keyword }: HighlightProps): React.ReactNode[] => {
    return text.split(new RegExp(`(${keyword})`, 'gi')).map((c, i) =>
      c === keyword ? (
        <span className="text-yellow-500" key={i}>
          {c}
        </span>
      ) : (
        c
      ),
    );
  };

  return (
    <>
      <Dialog onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size={'icon'} aria-label="Search Icon">
            <IconEvaSearch className="text-base" />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="w-screen h-screen bg-slate-400 bg-opacity-20 fixed inset-0" />
          <DialogContent className="fixed top-96 p-10 rounded-xl max-w-screen-md">
            <DialogClose></DialogClose>
            <div>
              <input
                onChange={handleChange}
                type="text"
                placeholder="请输入"
                className="h-[2.5rem] w-full border rounded-xl bg-baseColor text-baseColor px-[10px] focus:outline-none"
              />
              {/* <button className="w-2/12 h-[2.5rem] bg-gray-500 text-baseColor rounded-e-xl">搜索</button> */}
            </div>

            <div className="flex-1 w-full mt-[20px] max-h-[30vh] overflow-y-auto scrollbar">
              {result ? (
                result.map((post: FuseResult<Blog>) => {
                  return (
                    <Link key={post.item.id} href={`/blog/${post.item.slug}`}>
                      <DialogClose asChild>
                        <div className="flex justify-between items-center mb-[1vh] px-4 py-2 mr-2 border-[1px] rounded-sm group">
                          <div>
                            <div className="text-2xl truncate">
                              <Highlight
                                text={post.item.title}
                                keyword={keyword}
                              ></Highlight>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1 truncate">
                              <Highlight
                                text={post.item.description}
                                keyword={keyword}
                              ></Highlight>
                            </div>
                            <div>
                              {post.item.tags ? (
                                post.item.tags.map((tag: Tag) => (
                                  <Badge key={tag.id}>
                                    <Highlight
                                      text={tag.name}
                                      keyword={keyword}
                                    ></Highlight>
                                  </Badge>
                                ))
                              ) : (
                                <span></span>
                              )}
                            </div>
                          </div>
                          <IconEvaEnter className="hidden text-3xl group-hover:block" />
                        </div>
                      </DialogClose>
                    </Link>
                  );
                })
              ) : (
                <div>暂无结果</div>
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
