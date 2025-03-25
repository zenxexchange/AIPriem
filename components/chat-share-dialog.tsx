'use client';

import * as React from 'react';
import { ChatsCircle, CircleNotch } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { type Chat } from '@/lib/types';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ChatShareDialogProps {
  chat?: Pick<Chat, 'id' | 'title' | 'shared'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatShareDialog({
  chat,
  open,
  onOpenChange
}: ChatShareDialogProps) {
  const { updateChat } = useStore();
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const [isSharePending, startShareTransition] = React.useTransition();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  // ✅ Optimized copy function with proper URL handling
  const copyShareLink = React.useCallback(
    async (sharePath: string) => {
      try {
        const url = new URL(window.location.href);
        url.pathname = sharePath;
        copyToClipboard(url.toString());
        toast.success('✅ Share link copied to clipboard', { duration: 2000 });
        onOpenChange(false);
      } catch (error) {
        console.error('❌ Error copying share link:', error);
        toast.error('Failed to copy link');
      }
    },
    [copyToClipboard, onOpenChange]
  );

  if (!chat) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share link to chat</DialogTitle>
          <DialogDescription>
            Anyone with the link will be able to view this shared chat.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 rounded-md border p-2 text-sm font-medium shadow-sm">
          <ChatsCircle className="size-4" />
          <div>{chat.title}</div>
        </div>
        <DialogFooter>
          {chat.shared && (
            <Button
              variant="link"
              disabled={isDeletePending}
              onClick={() => {
                startDeleteTransition(async () => {
                  try {
                    const result = await api.updateChat({
                      id: chat.id,
                      shared: false
                    });

                    if (result && 'error' in result) {
                      toast.error(`❌ ${result.error}`);
                      return;
                    }

                    toast.success('✅ Shared link deleted successfully', {
                      duration: 2000
                    });

                    updateChat({ id: chat.id, shared: false });
                    onOpenChange(false);
                  } catch (error) {
                    console.error('❌ Error deleting share link:', error);
                    toast.error('Failed to delete share link');
                  }
                });
              }}
            >
              {isDeletePending ? (
                <>
                  <CircleNotch className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete this share link</>
              )}
            </Button>
          )}
          <Button
            disabled={isSharePending || isDeletePending}
            onClick={() => {
              startShareTransition(async () => {
                try {
                  const sharePath = `/share/${chat.id}`;

                  if (!chat.shared) {
                    const result = await api.updateChat({
                      id: chat.id,
                      shared: true
                    });

                    if (result && 'error' in result) {
                      toast.error(`❌ ${result.error}`);
                      return;
                    }

                    updateChat({ id: chat.id, shared: true });
                  }

                  copyShareLink(sharePath);
                } catch (error) {
                  console.error('❌ Error sharing chat:', error);
                  toast.error('Failed to generate share link');
                }
              });
            }}
          >
            {isSharePending ? (
              <>
                <CircleNotch className="animate-spin" />
                Copying...
              </>
            ) : (
              <>Copy link</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}