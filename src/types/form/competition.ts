import { File } from "@prisma/client";

export interface CompetitionFormData {
  name: string;
  from: string;
  to: string;
  type: string;
}

export interface CategoryFormData {
  competitionId: string;
  name: string;
}

export interface StageFormData {
  categoryId: string;
  name: string;
}

export interface TaskFormData {
  stageId: string;
  files: File
}
