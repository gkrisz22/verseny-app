"use client";

import { assignTask } from "@/app/_actions/stage.action";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { MediaLibrary } from "@/app/(dashboard)/_components/media-library/media-library";
import { MediaFile } from "@/types/media";
import { File } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FilesIcon } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};

const TaskUploader = ({
  stageId,
  files,
}: {
  stageId: string;
  files: File[];
}) => {
  const [state, action, _] = useActionState(assignTask, initialState);
  console.log(state);

  const formRef = React.useRef<HTMLFormElement>(null);

  const [localFiles, setLocalFiles] = React.useState<MediaFile[]>(files);
  const [modified, setModified] = React.useState(false);

  const handleAssign = async (_: FormData) => {
    const dataToSend = new FormData();

    dataToSend.append("stageId", stageId);
    localFiles.forEach((file) => {
      dataToSend.append("files_new", file.id);
    });

    await action(dataToSend);
    if (state.success) {
      toast.success("Feladatok frissítve.");
      setLocalFiles([]);
    }
  };

  useEffect(() => {
    if (localFiles.length > 0 || modified) {
      formRef.current?.requestSubmit();
      setModified(false);
    }
  }, [localFiles, modified]);

  return (
    <form action={handleAssign} ref={formRef} className="w-full">
      <input type="hidden" name="stageId" value={stageId} />
      <MediaLibrary
        onFilesSelected={(newFiles) => {
          setLocalFiles(newFiles);
          setModified(true);
        }}
        selectedDefault={files}
        trigger={
          <Button variant="outline" className="w-fit ml-auto">
            <FilesIcon />
            Feladatok szerkesztése
          </Button>
        }
      />
    </form>
  );
};

export default TaskUploader;
