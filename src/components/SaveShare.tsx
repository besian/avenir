'use client';

import { Icon } from './Icon';
import { HeartIcon } from './HeartIcon';
import { useUI } from './UIProvider';
import { IC } from '@/lib/icons';
import { useSaved } from '@/lib/storage';

export function SaveShare({ id, title }: { id: string; title: string }) {
  const { isSaved, toggle } = useSaved();
  const { toast } = useUI();
  const saved = isSaved(id);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    toast('Link copied');
  };

  return (
    <div className="pd-actions">
      <button
        type="button"
        className="pd-action"
        aria-pressed={saved}
        onClick={() => {
          toggle(id);
          toast(saved ? 'Removed from saved' : 'Saved to your shortlist');
        }}
      >
        <HeartIcon size={18} filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </button>
      <button type="button" className="pd-action" onClick={share}>
        <Icon d={IC.share} size={18} />
        Share
      </button>
    </div>
  );
}
