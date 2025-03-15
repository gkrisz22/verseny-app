
export type FileType = "image" | "document" | "video" | "audio" | "other";
export type ViewMode = "grid" | "list";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  date: string;
  thumbnail: string;
}
