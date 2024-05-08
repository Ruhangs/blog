'use client';

import { useEffect, useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { showErrorToast, showSuccessToast } from './toast';

const CopyButton = ({ id }: { id: string }) => {
  const [copied, setCopited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCopy = async () => {
    try {
      if (mounted) {
        setCopited(true);
        const text = document.getElementById(id)!.innerText;
        await navigator.clipboard.writeText(text);
        showSuccessToast('已复制');
        setTimeout(() => {
          setCopited(false);
        }, 1000);
      }
    } catch (error) {
      setCopited(false);
      showErrorToast('复制失败');
    }
  };

  return (
    <button onClick={onCopy} className="inline-flex rounded-md p-2 ">
      <Copy
        size={16}
        className={`transition-all
        ${copied ? 'scale-0' : 'scale-100'}
      `}
      />
      <Check
        size={16}
        className={`absolute transition-all ${
          copied ? 'scale-100' : 'scale-0'
        }`}
      />
    </button>
  );
};

export default CopyButton;
