"use client";

import { inferRouterOutputs } from "@trpc/server";
import { AnimatePresence, motion as m } from "framer-motion";
import { UploadCloud } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useUploadFiles } from "@/lib/hooks/use-upload-files";
import { upOpacityVariants } from "@/lib/motion-variants";
import { FileObj } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AppRouter } from "@/server/routers";

import Item from "./item";

type FileInputProps = {
  product?: inferRouterOutputs<AppRouter>["admin"]["product"]["getById"];
  onFilesChange: (field: number | (number | undefined)[] | undefined) => void;
  onFileDelete?: (ids: number[]) => void;
  limit?: number;
  className?: string;
};

export default function FileInput({
  product,
  onFilesChange,
  onFileDelete,
  limit = 1,
  className,
}: FileInputProps) {
  const multiple = useRef<boolean>(limit > 1);
  const filesContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { files, setFiles, uploadFiles, deleteFile, deletedReferencedFiles } =
    useUploadFiles();

  useLayoutEffect(() => {
    if (!!product?.productFiles.length) {
      const files: FileObj[] = product.productFiles.map((item) => ({
        id: `file-${item.id}`,
        referenceItemId: item.id,
        name: item.file.name,
        loading: false,
      }));

      setFiles(files);

      if (
        filesContainerRef.current &&
        filesContainerRef.current.scrollTop > 0
      ) {
        filesContainerRef.current.scrollTop = 0;
      }
    }
  }, [product?.productFiles, setFiles]);

  useEffect(() => {
    if (!!files.length) {
      const filteredFiles = files.filter((file) => !!file.tmpFileId);
      if (!filteredFiles.length) return;

      onFilesChange(
        multiple.current
          ? filteredFiles.map((file) => file.tmpFileId)
          : filteredFiles[0].tmpFileId,
      );
    } else {
      onFilesChange([]);
    }

    if (filesContainerRef.current && filesContainerRef.current.scrollTop > 0) {
      filesContainerRef.current.scrollTop = 0;
    }
  }, [files, onFilesChange]);

  useEffect(() => {
    if (!!deletedReferencedFiles.length && !!onFileDelete) {
      onFileDelete(deletedReferencedFiles);
    }
  }, [deletedReferencedFiles, onFileDelete]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;

    if (inputFiles) {
      uploadFiles(inputFiles);
      e.target.value = ""; // reset input file field
    }
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const draggedFiles = e.dataTransfer.files;

    if (draggedFiles) uploadFiles(draggedFiles);
  };

  return (
    <div
      className={cn(
        "flex w-72 flex-col items-center gap-4 scroll-smooth rounded-md border",
        multiple.current && "h-[26rem]",
        !!files.length && multiple.current && "py-6",
        !files.length && isDragging && "border-2 border-white duration-150",
        className,
      )}
    >
      {(multiple.current || (!multiple.current && !files.length)) && (
        <m.div
          initial={multiple.current && { height: "100%" }}
          animate={
            multiple.current && { height: !!files.length ? "6rem" : "100%" }
          }
          // exit={{ y: 50, opacity: 0 }}
          className={cn(
            "w-full",
            !!files.length && "px-6",
            !multiple.current && "h-14",
          )}
        >
          <label
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            htmlFor="file"
            className={cn(
              "flex h-full cursor-pointer flex-col items-center justify-center rounded-xl px-4 py-6 opacity-70",
              !!files.length && "border",
              !!files.length && isDragging && "border-white duration-150",
              isDragging && "text-white opacity-100",
            )}
          >
            {!files.length && multiple.current && (
              <m.div
                variants={upOpacityVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <UploadCloud size={80} />
              </m.div>
            )}
            <span className="text-base">
              Drag & Drop your file{multiple.current && "s"} or Browse
            </span>
          </label>
          <input
            onChange={onChange}
            multiple={multiple.current}
            type="file"
            id="file"
            className="hidden"
          />
        </m.div>
      )}

      {!!files.length ? (
        <div
          ref={filesContainerRef}
          className={cn(
            "flex h-full w-full flex-col gap-4 overflow-auto",
            multiple.current && "px-6",
          )}
        >
          <AnimatePresence>
            {[...files].reverse().map((item, index) => (
              <Item
                key={item.id}
                item={item}
                onFileDelete={deleteFile}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
