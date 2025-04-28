"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UploadTab } from "./upload-tab"
import { LibraryTab } from "./library-tab"
import type { MediaFile } from "@/types/media"
import { FileIcon, FileTextIcon, FileVideoIcon, FolderArchiveIcon } from "lucide-react"

interface MediaLibraryProps {
  onFilesSelected: (files: MediaFile[]) => void;
  selectedDefault?: MediaFile[];
  trigger?: React.ReactNode;
  mode?: "multiple" | "single";
}

export function MediaLibrary({ onFilesSelected, trigger, selectedDefault, mode = "multiple" }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState("library")
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>(selectedDefault || [])

  const handleUploadSuccess = useCallback(() => {
    setActiveTab("library")
  }, [])

  const handleSelect = useCallback(() => {
    onFilesSelected(selectedFiles)
    setOpen(false)
  }, [onFilesSelected, selectedFiles])

  const getFileIcon = (file: MediaFile | File, className: string): React.JSX.Element => {
    if (file.type.startsWith("image/")) return <FileVideoIcon className={className} />
    if (file.type.startsWith("video/")) return <FileIcon className={className} />
    if (file.type === "application/pdf") return <FileTextIcon className={className} />
    if (file.type === "application/zip") return <FolderArchiveIcon className={className} />
    return <FileIcon className={className} />
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Fájlkezelő</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[800px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-6">
          <DialogTitle>Média könyvtár</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden px-6">
          <TabsList className="px-6 grid w-full grid-cols-2">
            <TabsTrigger value="upload">Feltöltés</TabsTrigger>
            <TabsTrigger value="library">Könyvtár</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="flex-1 overflow-hidden p-0 m-0 border-0">
            <UploadTab onUploadSuccess={handleUploadSuccess} getFileIcon={getFileIcon} />
          </TabsContent>
          <TabsContent value="library" className="flex-1 overflow-hidden p-0 m-0 border-0">
            <LibraryTab mode={mode} selectedFiles={selectedFiles} onSelectionChange={setSelectedFiles} getFileIcon={getFileIcon} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Mégsem
          </Button>
          <Button onClick={handleSelect}>
            {
              selectedFiles.length === 0 ? "Mentés" : <>
                Kiválasztás ({selectedFiles.length})
              </>
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

