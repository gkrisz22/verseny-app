"use client"

import { useState, useCallback, useActionState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { uploadFiles } from "@/actions/media.actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface UploadTabProps {
  onUploadSuccess: () => void
  getFileIcon: (file: File, className: string) => React.JSX.Element
}

type FileWithPreview = {
  file: File
  id: string
  preview?: string
  progress: number
  error?: string
}

export function UploadTab({ onUploadSuccess, getFileIcon }: UploadTabProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [state, action, isPending] = useActionState(uploadFiles, { success: false, message: "" })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      progress: 0,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles]);
    console.log("Fájlok:", acceptedFiles);
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "video/*": [],
      "audio/*": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
      "application/zip": [],
    },
  })

  const removeFile = (id: string) => {
    setFiles((files) => {
      const updatedFiles = files.filter((file) => file.id !== id)
      return updatedFiles
    })
  }

  useEffect(() => {
    if (state.success) {
      onUploadSuccess()
      setFiles([])
    }
  }, [state.success, onUploadSuccess])

  const handleSubmit = async () => {
    const dataToSubmit = new FormData();
    
    files.forEach(fileItem => {
      dataToSubmit.append('files', fileItem.file);
    });
    
    return action(dataToSubmit);
  }

  return (
    <form className="flex flex-col h-full" action={handleSubmit}>
      <ScrollArea className="flex-1 px-6">
        <div className="py-6 space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center
              transition-colors cursor-pointer h-40
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              {isDragActive ? "Húzza ide a fájlokat..." : "Húzza ide a fájlokat, vagy kattintson ide, hogy kiválassza őket."}
            </p>
          </div>

          {files.length > 0 && (
            <div className="border rounded-lg">
              <div className="p-2 flex flex-col gap-2">
                {files.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-center gap-3 p-2 border rounded-md">
                    <div className="flex-shrink-0">
                      {fileItem.preview ? (
                        <div className="h-12 w-12 rounded overflow-hidden">
                          <Image
                            src={fileItem.preview || "/placeholder.svg"}
                            alt="Előnézet"
                            className="h-full w-full object-cover"
                            onLoad={() => {
                              URL.revokeObjectURL(fileItem.preview!)
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          {getFileIcon(fileItem.file, "h-6 w-6")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={fileItem.file.name}>{fileItem.file.name.length > 100 ? fileItem.file.name.slice(0, 30) + "..." : fileItem.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(fileItem.file.size / 1024).toFixed(1)} KB</p>
                      {fileItem.progress > 0 && <Progress value={fileItem.progress} className="h-1 mt-1" />}
                      {fileItem.error && <p className="text-xs text-destructive mt-1">{fileItem.error}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(fileItem.id)
                      }}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Fájl törlése</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 pt-0 mt-auto border-t">
        <Button disabled={files.length === 0 || isPending} className="w-full">
          {isPending ? "Feltöltés..." : "Feltöltés"}
        </Button>
      </div>
    </form>
  )
}