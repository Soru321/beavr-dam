export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type FileObj = {
  id: string;
  name: string;
  tmpFileId?: number;
  referenceItemId?: number;
  file?: File;
  loading: boolean;
  error?: {
    message: string;
    instruction?: string;
  } | null;
  controller?: AbortController;
  abort?: () => void;
};
