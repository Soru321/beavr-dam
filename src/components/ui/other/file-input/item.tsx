import { AnimatePresence, motion as m } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { opacityVariants, scaleOpacityVariants } from '@/lib/motion-variants';
import { FileObj } from '@/lib/types/index';
import { cn, formatFileSize } from '@/lib/utils';

import Button from './button';

interface ItemProps {
  item: FileObj;
  index: number;
  multiple?: boolean;
  onFileDelete: (fileObj: FileObj) => void;
}

export default function Item({
  item,
  index,
  multiple = false,
  onFileDelete,
}: ItemProps) {
  const [itemBg, setItemBg] = useState<string>("");

  useEffect(() => {
    if (!!item.tmpFileId) setItemBg("bg-green-600");
    else if (!!item.referenceItemId) setItemBg("bg-blue-600");
    else if (!!item.error) setItemBg("bg-destructive");
    else setItemBg("bg-muted");
  }, [item.tmpFileId, item.referenceItemId, item.error]);

  return (
    <div>
      <m.div
        layout
        variants={scaleOpacityVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
        custom={index}
        className={cn(
          "relative flex h-14 w-full items-center gap-3 overflow-hidden rounded-xl px-3",
          itemBg,
        )}
      >
        {!item.loading && (
          <m.div
            variants={opacityVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Button onClick={() => onFileDelete(item)}>
              <X size={14} strokeWidth={4} className="text-white" />
            </Button>
          </m.div>
        )}
        <m.div
          animate={{ paddingLeft: !item.loading ? "2.75rem" : 0 }}
          transition={{ type: "spring", duration: 0.2 }}
          className="flex w-full justify-between gap-4"
        >
          <div className="flex flex-col">
            <p
              className={cn(
                "line-clamp-1 text-[12px]",
                item.loading ? "text-foreground" : "text-white",
              )}
            >
              {item.name}
            </p>
            <p
              className={cn(
                "text-[10px]",
                item.loading ? "text-foreground/60" : "text-white/80",
              )}
            >
              {!!item.file?.size ? formatFileSize(item.file.size) : ""}
            </p>
          </div>
          {(item.loading || !!item.error) && (
            <div className="flex flex-col text-right">
              <p
                className={cn(
                  "whitespace-nowrap text-[12px] font-medium text-white",
                  item.loading ? "text-foreground" : "text-white",
                )}
              >
                {item.loading ? "Uploading" : item.error?.message}
              </p>
              <p
                className={cn(
                  "whitespace-nowrap text-[10px]",
                  item.loading ? "text-foreground/60" : "text-white/80",
                )}
              >
                {item.loading ? "tap to cancel" : item.error?.instruction}
              </p>
            </div>
          )}
        </m.div>
        <AnimatePresence>
          {item.loading && (
            <m.div
              variants={opacityVariants}
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <Button onClick={item.abort}>
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
