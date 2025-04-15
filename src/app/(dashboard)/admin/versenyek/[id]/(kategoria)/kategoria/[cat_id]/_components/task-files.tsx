"use client";
import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import { FileDownIcon } from "lucide-react";
import React from "react";
import TaskUploader from "./task-uploader";
import { useDownload } from "@/hooks/use-download";

const TaskFiles = ({ stageId, files }: { stageId: string; files: File[] }) => {
  const { handleDownload, isPending } = useDownload();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-2">
        {files.map((file: File) => (
          <div
            key={file.id}
            className="flex items-center justify-between bg-background p-4 rounded-lg"
          >
            <div className="text-muted-foreground">
              <p title={file.name} className="uppercase text-sm">
                {file.name.length > 100
                  ? file.name.substring(0, 100) + "..."
                  : file.name}
              </p>
              <p className="text-xs">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleDownload(file.id)}
              disabled={isPending}
            >
              <FileDownIcon /> Letöltés
            </Button>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <p className="text-sm">Nincsenek feltöltött fájlok.</p>
      )}

      <TaskUploader stageId={stageId} files={files} />
    </div>
  );
};

export default TaskFiles;
