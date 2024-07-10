import { memo } from 'react';
import type { FC } from 'react';

import EmojiPicker$, { EmojiStyle, Theme } from 'emoji-picker-react';

import { useIsDark } from '@/hooks/use-is-dark';

export const EmojiPicker: FC<{
  onEmojiSelect: (emoji: string) => void;
}> = memo(({ onEmojiSelect }) => {
  const isDark = useIsDark();
  return (
    <EmojiPicker$
      theme={isDark ? Theme.DARK : Theme.LIGHT}
      onEmojiClick={(e) => {
        onEmojiSelect(e.emoji);
      }}
      emojiStyle={EmojiStyle.APPLE}
      searchDisabled={true}
      height={300}
      reactionsDefaultOpen={true}
    />
  );
});
EmojiPicker.displayName = 'EmojiPicker';
