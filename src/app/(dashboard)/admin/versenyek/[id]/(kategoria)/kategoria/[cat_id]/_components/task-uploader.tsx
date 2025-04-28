"use client";

import { assignTask } from "@/app/_actions/stage.action";
import React from "react";
import { toast } from "sonner";
import { MediaLibrary } from "@/app/(dashboard)/_components/media-library/media-library";
import { MediaFile } from "@/types/media";
import { File } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FilesIcon } from "lucide-react";

const TaskUploader = ({
  stageId,
  files,
}: {
  stageId: string;
  files: File[];
}) => {

  const handleAssign = async (localFiles:MediaFile[]) => {
    const dataToSend = new FormData();
    dataToSend.append("stageId", stageId);
    localFiles.forEach((file) => {
      dataToSend.append("files_new", file.id);
    });

    const result = await assignTask(dataToSend);
    if (result.success) {
      toast.success("Feladatok frissítve.");
    }
  };

  return (
    <div className="w-full">
      <MediaLibrary
        onFilesSelected={(newFiles) => {
          //setLocalFiles(newFiles);
          handleAssign(newFiles);
        }}
        selectedDefault={files}
        trigger={
          <Button variant="outline" className="w-fit ml-auto">
            <FilesIcon />
            Feladatok szerkesztése
          </Button>
        }
      />
    </div>
  );
};

export default TaskUploader;
