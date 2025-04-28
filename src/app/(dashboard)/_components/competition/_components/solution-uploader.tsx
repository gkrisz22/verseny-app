"use client";

import { assignSolutionToStudent, assignTask } from "@/app/_actions/stage.action";
import React from "react";
import { toast } from "sonner";
import { MediaLibrary } from "@/app/(dashboard)/_components/media-library/media-library";
import { MediaFile } from "@/types/media";
import { File } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

const StudentSolutionUploader = ({
  studentStageId,
  files
}: {
  studentStageId: string;
  files: File[];
}) => {

  const handleAssign = async (localFiles:MediaFile[]) => {
    console.log("Fájlok: ", localFiles);
    toast.promise(assignSolutionToStudent(studentStageId, localFiles.map((file) => file.id)), {
      loading: "Feltöltés...",
      success: () => {
        return "Feltöltés sikeres!";
      }
    });
    
  };

  return (
    <div className="w-full">
      <MediaLibrary
        onFilesSelected={(newFiles) => {
          handleAssign(newFiles);
        }}
        selectedDefault={files}
        mode="multiple"
        trigger={
          <Button variant="outline" className="w-fit ml-auto" size="sm">
            <UploadIcon />
            {files.length > 0 ? "Módosítás" : "Feltöltés"}
          </Button>
        }
      />
    </div>
  );
};

export default StudentSolutionUploader;
