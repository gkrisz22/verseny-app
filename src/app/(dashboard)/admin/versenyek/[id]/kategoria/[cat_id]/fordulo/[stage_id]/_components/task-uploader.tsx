"use client";

import { assignTask } from "@/actions/stage.action";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { MediaLibrary } from "@/app/dashboard/_components/media-library/media-library";
import { MediaFile } from "@/types/media";
import { File } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  const [state, action, isPending] = useActionState(assignTask, initialState);
  const [open, setOpen] = React.useState(false);
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
      toast.success("Feladatok sikeresen hozzárendelve.");
      setOpen(false);
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
          <Button variant="outline" className="w-full">
            Szerkesztés
          </Button>
        }
      />
    </form>
  )
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Szerkesztés</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feladatok hozzárendelése</DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-2">
          <DialogDescription>
            Feltöltött fájlok:
          </DialogDescription>
          {files.map((file: File) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-background p-4 rounded-lg border-b"
            >
              <div className="text-foreground">
                <p title={file.name} className="uppercase text-sm">
                  {file.name.length > 40
                    ? file.name.substring(0, 40) + "..."
                    : file.name}
                </p>
                <p className="text-xs">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex flex-col gap-2">
          <DialogDescription>
            Új fájlok:
          </DialogDescription>
          {localFiles.map((file: MediaFile) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-background p-4 rounded-lg border-b"
            >
              <div className="text-foreground">
                <p title={file.name} className="uppercase text-sm">
                  {file.name.length > 40
                    ? file.name.substring(0, 40) + "..."
                    : file.name}
                </p>
                <p className="text-xs">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() =>
                  setLocalFiles(localFiles.filter((f) => f.id !== file.id))
                }
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <MediaLibrary
          onFilesSelected={(newFiles) => {
            setLocalFiles(
              newFiles.filter((file) => !files.includes(file as File))
            );
          }}
          selectedDefault={files}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Mégsem
          </Button>
          <form action={handleAssign}>
            <input type="hidden" name="stageId" value={stageId} />
            <Button disabled={isPending} className="w-full">
              {isPending ? "Mentés..." : "Mentés"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskUploader;
