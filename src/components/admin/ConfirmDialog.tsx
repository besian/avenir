'use client';

import { useEffect, useRef } from 'react';
import { useModal } from '@/lib/useModal';

interface Props {
  title: string;
  body: string;
  confirm: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, body, confirm, busy, onConfirm, onCancel }: Props) {
  useModal(onCancel);
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);
  return (
    <div className="pal-backdrop" onClick={onCancel} style={{ alignItems: 'center' }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-body" className="adm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 id="cd-title" className="adm-h2">{title}</h2>
        <p id="cd-body">{body}</p>
        <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
          <button ref={cancelRef} type="button" className="btn btn--outline btn--sm" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger btn--sm" onClick={onConfirm} aria-disabled={busy}>
            {busy ? 'Deleting…' : confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
