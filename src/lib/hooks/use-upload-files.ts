import { useState } from 'react';

import { FileObj, Optional } from '@/lib/types/index';
import { fileSchema } from '@/lib/zod/file';

import { axiosClient, generateRandomString } from '../utils';

type TNewState = Optional<
  Pick<FileObj, "loading" | "error" | "tmpFileId">,
  "error" | "tmpFileId"
>;

export function useUploadFiles() {
  const [files, setFiles] = useState<FileObj[]>([]);
  const [deletedReferencedFiles, setDeletedReferencedFiles] = useState<
    number[]
  >([]);

  const updateFileState = (fileObj: FileObj, newState: TNewState) => {
    setFiles((prevFiles) => {
      return prevFiles.map((file) =>
        file.id === fileObj.id ? { ...file, ...newState } : file,
      );
    });
  };

  const uploadFile = async (fileObj: FileObj) => {
    if (!fileObj.file) {
      updateFileState(fileObj, {
        loading: false,
        error: { message: "Upload Error!" },
      });

      return;
    }

    const validatedData = fileSchema.safeParse({ file: fileObj.file });
    if (!validatedData.success) {
      const error = validatedData.error.issues[0];

      updateFileState(fileObj, {
        loading: false,
        error: {
          message: error.message,
          // @ts-ignore
          instruction: error?.params?.instruction,
        },
      });

      return;
    }

    const formData = new FormData();
    formData.append("file", fileObj.file);

    axiosClient
      .post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        updateFileState(fileObj, {
          loading: false,
          tmpFileId: res.data.id,
        });
      })
      .catch((error: any) => {
        updateFileState(fileObj, {
          loading: false,
          error: { message: "Upload Error!" },
        });
      });
  };

  const getFilesObj = (selectedFiles: FileList) => {
    return Array.from(selectedFiles).map((file) => {
      const controller = new AbortController();
      let isDuplicate = files.some((item) => item.name === file.name);

      return {
        id: generateRandomString(),
        name: file.name,
        file,
        loading: isDuplicate ? false : true,
        error: isDuplicate
          ? {
              message: "File already exists",
            }
          : null,
        controller,
        abort() {
          controller.abort();
        },
      };
    });
  };

  const uploadFiles = async (selectedFiles: FileList) => {
    const filesObj: FileObj[] = getFilesObj(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...filesObj]);
    await Promise.all(
      filesObj.map((file) => (file.error ? null : uploadFile(file))),
    );
  };

  const deleteFile = (fileObj: FileObj) => {
    if (!!fileObj.referenceItemId) {
      setDeletedReferencedFiles((state) =>
        Array.from(new Set([...state, fileObj.referenceItemId!])),
      );
    }

    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileObj.id));
  };

  return { files, setFiles, uploadFiles, deleteFile, deletedReferencedFiles };
}
