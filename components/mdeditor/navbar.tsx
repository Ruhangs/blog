'use client';

import React, { useEffect, useRef, useState } from 'react';

import { throttle } from 'lodash-es';

interface MarkdownNavbarProps {
  source: string;
  ordered?: boolean;
  headingTopOffset?: number;
  updateHashAuto?: boolean;
  declarative?: boolean;
  className?: string;
  onNavItemClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    target: HTMLElement,
    hash: string,
  ) => void;
  onHashChange?: (newHash: string, oldHash: string) => void;
}

interface NavData {
  index: number;
  level: number;
  text: string;
  listNo: string;
}

export const MarkdownNavbar: React.FC<MarkdownNavbarProps> = ({
  source,
  ordered = true,
  headingTopOffset = 0,
  updateHashAuto = true,
  declarative = false,
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onNavItemClick = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHashChange = () => {},
}) => {
  const [currentListNo, setCurrentListNo] = useState<string>('');
  const [navStructure, setNavStructure] = useState<NavData[]>([]);
  const addTargetTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollEventLockTimer = useRef<NodeJS.Timeout | null>(null);
  const updateHashTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollEventLock = useRef<boolean>(false);

  const initHeadingsId = () => {
    const headingId = decodeURIComponent(
      declarative
        ? window.location.hash.replace(/^#/, '').trim()
        : (window.location.hash.match(/heading-\d+/g) ?? [''])[0],
    );

    navStructure.forEach((t: NavData) => {
      const headings = document.querySelectorAll(`h${t.level}`);
      const curHeading = Array.prototype.slice
        .apply(headings)
        .find(
          (h: HTMLElement) =>
            h.innerText.trim() === t.text.trim() && !h.dataset?.id,
        ) as HTMLElement | undefined;

      if (curHeading) {
        curHeading.dataset.id = declarative
          ? `${t.listNo}-${t.text}`
          : `heading-${t.index}`;

        if (headingId && headingId === curHeading.dataset.id) {
          scrollToTarget(headingId);
          setCurrentListNo(t.listNo);
        }
      }
    });
  };

  const safeScrollTo = (
    element: Window | Element,
    top: number,
    left = 0,
    smooth = false,
  ) => {
    if (!element) return;
    const scrollConfig: ScrollToOptions = {
      top,
      left,
    };
    if (smooth) {
      scrollConfig.behavior = 'smooth';
    }
    if (typeof element.scrollTo === 'function') {
      element.scrollTo(scrollConfig);
    } else {
      if (element === window) {
        document.documentElement.scrollTop = top;
        document.documentElement.scrollLeft = left;
      }
    }
  };

  const getNavStructure = (source: string): NavData[] => {
    const contentWithoutCode = source
      .replace(/^[^#]+\n/g, '')
      .replace(/(?:[^\n#]+)#+\s([^#\n]+)\n*/g, '')
      // .replace(/^#\s[^#\n]*\n+/, '')
      .replace(/```[^`\n]*\n+[^```]+```\n+/g, '')
      .replace(/`([^`\n]+)`/g, '$1')
      .replace(/\*\*?([^*\n]+)\*\*?/g, '$1')
      .replace(/__?([^_\n]+)__?/g, '$1')
      .trim();
    const pattOfTitle = /#+\s([^#\n]+)\n*/g;
    const matchResult = contentWithoutCode.match(pattOfTitle) ?? [];

    if (!matchResult) {
      return [];
    }

    const navData = matchResult.map((r, i) => ({
      index: i,
      level: (r.match(/^#+/g) ?? [''])[0].length,
      text: r.replace(pattOfTitle, '$1'),
      listNo: '',
    }));

    let maxLevel = 0;
    navData.forEach((t) => {
      if (t.level > maxLevel) {
        maxLevel = t.level;
      }
    });
    const matchStack: {
      level: number;
      arr: number[];
    }[] = [];

    // 此部分重构，原有方法会出现次级标题后再次出现高级标题时，listNo重复的bug
    for (const item of navData) {
      const t = navData[item.index]!;
      const { level } = t;

      while (
        matchStack.length &&
        matchStack[matchStack.length - 1]!.level > level
      ) {
        matchStack.pop();
      }
      if (matchStack.length === 0) {
        const arr = new Array<number>(maxLevel).fill(0);
        arr[level - 1] += 1;
        matchStack.push({
          level,
          arr,
        });
        t.listNo = trimArrZero(arr).join('.');
        continue;
      }
      const { arr } = matchStack[matchStack.length - 1]!;
      const newArr = arr.slice();
      newArr[level - 1] += 1;
      matchStack.push({
        level,
        arr: newArr,
      });
      t.listNo = trimArrZero(newArr).join('.');
    }
    return navData;
  };

  const refreshNav = (source: string) => {
    if (addTargetTimeout.current) clearTimeout(addTargetTimeout.current);
    setNavStructure(getNavStructure(source));
  };

  const trimArrZero = (arr: number[]) => {
    const start = arr.findIndex((num) => num !== 0);
    const end =
      arr.length -
      arr
        .slice()
        .reverse()
        .findIndex((num) => num !== 0);
    return arr.slice(start, end);
  };

  const scrollToTarget = (dataId: string) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const target: HTMLElement = document.querySelector(
        `[data-id="${dataId}"]`,
      )!;
      if (target && typeof target.offsetTop === 'number') {
        safeScrollTo(window, target.offsetTop - (headingTopOffset || 0), 0);
      }
    }, 0);
  };

  const getHeadingList = () => {
    const headingList: { dataId: string; listNo: string; offsetTop: number }[] =
      [];

    navStructure.forEach((t: NavData) => {
      const headings = document.querySelectorAll(`h${t.level}`);
      const curHeading = Array.prototype.slice
        .apply(headings)
        .find(
          (h: HTMLElement) =>
            h.innerText.trim() === t.text.trim() &&
            !headingList.find((x) => x.offsetTop === h.offsetTop),
        ) as HTMLElement | undefined;
      if (curHeading) {
        headingList.push({
          dataId: declarative ? t.text : `heading-${t.index}`,
          listNo: t.listNo,
          offsetTop: curHeading.offsetTop,
        });
      }
    });

    return headingList;
  };

  const getCurrentHashValue = () =>
    decodeURIComponent(window.location.hash.replace(/^#/, ''));

  const winScroll = () => {
    if (scrollEventLock.current) return;
    const scrollTop: number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const newHeadingList = getHeadingList().map((h) => ({
      ...h,
      distanceToTop: Math.abs(scrollTop + headingTopOffset - h.offsetTop),
    }));
    const distanceList = newHeadingList.map((h) => h.distanceToTop);
    const minDistance = Math.min(...distanceList);
    const curHeading = newHeadingList.find(
      (h) => h.distanceToTop === minDistance,
    );
    if (!curHeading) return;
    if (updateHashAuto) {
      // Hash changing callback
      if (curHeading.dataId !== getCurrentHashValue()) {
        onHashChange(curHeading.dataId, getCurrentHashValue());
      }
      updateHash(curHeading.dataId);
    }
    setCurrentListNo(curHeading.listNo);
  };

  const winHashChange = () => {
    // console.log('winHashChange');
    // scrollToTarget(navStructure);
    /* Handle window hash change event */
  };

  const updateHash = (value: string) => {
    if (updateHashTimeout.current) clearTimeout(updateHashTimeout.current);
    updateHashTimeout.current = setTimeout(() => {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${window.location.search}#${value}`,
      );
    }, 0);
  };

  useEffect(() => {
    if (scrollEventLockTimer.current) {
      clearTimeout(scrollEventLockTimer.current);
    }
    scrollEventLock.current = true;

    safeScrollTo(window, 0, 0);
    // safeScrollTo(this.refs.container, 0, 0);
    setCurrentListNo('');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    Array.prototype.slice
      .apply(headings)
      .forEach((h: HTMLElement) => (h.dataset.id = ''));

    scrollEventLockTimer.current = setTimeout(() => {
      scrollEventLock.current = false;
    }, 500);

    refreshNav(source);
  }, [source]);

  // 添加data-id
  useEffect(() => {
    addTargetTimeout.current = setTimeout(() => {
      initHeadingsId();
      if (navStructure.length && navStructure[0]) {
        const listNo: string = navStructure[0].listNo;
        setCurrentListNo(listNo);
      }
      const handleScroll = throttle(winScroll, 300);
      document.addEventListener('scroll', handleScroll, false);
      window.addEventListener('hashchange', winHashChange, false);
      return () => {
        clearTimeout(scrollTimeout.current!);
        clearTimeout(addTargetTimeout.current!);
        clearTimeout(updateHashTimeout.current!);
        document.removeEventListener('scroll', handleScroll, false);
        window.removeEventListener('hashchange', winHashChange, false);
      };
    }, 500);
  }, [navStructure]);

  const tBlocks = getNavStructure(source).map((t) => {
    const cls = `title-anchor title-level${t.level} ${
      currentListNo === t.listNo ? 'active' : ''
    }`;

    return (
      <div
        className={cls}
        onClick={(evt) => {
          const currentHash = declarative
            ? `${t.listNo}-${t.text}` // 加入listNo确保hash唯一ZZ
            : `heading-${t.index}`;
          // Avoid execution the callback `onHashChange` when clicking current nav item
          if (t.listNo !== currentListNo) {
            // Hash changing callback
            onHashChange(currentHash, getCurrentHashValue());
          }

          // Nav item clicking callback
          onNavItemClick(evt, evt.target as HTMLElement, currentHash);

          updateHash(currentHash);
          scrollToTarget(currentHash);
          setCurrentListNo(t.listNo);
        }}
        key={`title_anchor_${Math.random().toString(36).substring(2)}`}
      >
        {ordered ? <small>{t.listNo}</small> : null}
        {t.text}
      </div>
    );
  });

  return <div className={`markdown-navigation ${className}`}>{tBlocks}</div>;
};
