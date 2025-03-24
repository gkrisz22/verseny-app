"use client"

import { useState, useEffect } from "react"
import { Check, Grid, List, Search, SlidersHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MediaFile } from "@/types/media"
import { getMediaFiles } from "@/app/_actions/media.action"
import { FileVideoIcon, FileIcon, FileTextIcon } from "lucide-react"
import Image from "next/image"

interface LibraryTabProps {
  selectedFiles: MediaFile[]
  onSelectionChange: (files: MediaFile[]) => void
  getFileIcon: (file: MediaFile, className: string) => React.JSX.Element
}

type ViewMode = "grid" | "list"
type SortOption = "newest" | "oldest" | "name" | "size"
type FilterType = "all" | "image" | "document" | "video" | "audio"

export function LibraryTab({ selectedFiles, onSelectionChange, getFileIcon }: LibraryTabProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true)
      try {
        const mediaFiles = await getMediaFiles()
        setFiles(mediaFiles)
      } catch (error) {
        console.error("Nem sikerült a betöltés: ", error)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  const toggleFileSelection = (file: MediaFile) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      onSelectionChange(selectedFiles.filter((f) => f.id !== file.id))
    } else {
      onSelectionChange([...selectedFiles, file])
    }
  }

  const isSelected = (file: MediaFile) => {
    return selectedFiles.some((f) => f.id === file.id)
  }

  const deleteFile = (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId))
  }

  const filteredFiles = files
    .filter((file) => {
      if (filterType === "all") return true
      return file.type.startsWith(filterType)
    })
    .filter((file) => {
      if (!searchQuery) return true
      return file.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.size - a.size
        default:
          return 0
      }
    })

    

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Keresés..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Fájltípus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                <SelectItem value="image">Képek</SelectItem>
                <SelectItem value="video">Videók</SelectItem>
                <SelectItem value="audio">Hang</SelectItem>
                <SelectItem value="application">Dokumentumok</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <DropdownMenuRadioItem value="newest">Legújabb elől</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Legrégebbi elől</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">Név</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size">Méret</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Fájlok betöltése...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Nem található fájl.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 pb-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`
                  relative rounded-lg overflow-hidden border cursor-pointer transition-all
                  ${isSelected(file) ? "ring-2 ring-primary" : "hover:border-primary/50"}
                `}
                onClick={() => toggleFileSelection(file)}
              >
                {file.type.startsWith("image") ? (
                  <div className="aspect-square">
                    <Image src={"/" + file.path || "/placeholder.svg"} alt={file.name} className="h-full w-full object-cover" width={300} height={300} />
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {getFileIcon(file, "h-12 w-12 text-muted-foreground")}
                  </div>
                )}
                <div className="p-2 text-xs truncate bg-background/90 absolute bottom-0 left-0 right-0">
                  {file.name}
                </div>
                {isSelected(file) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <button
                  className="absolute top-2 left-2 bg-transparent text-white rounded-full p-1 hover:bg-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(file.id)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`
                  flex items-center gap-3 p-2 rounded-lg border cursor-pointer
                  ${isSelected(file) ? "bg-muted border-primary" : "hover:bg-muted/50"}
                `}
                onClick={() => toggleFileSelection(file)}
              >
                <Checkbox
                  checked={isSelected(file)}
                  onCheckedChange={() => toggleFileSelection(file)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="h-10 w-10 flex-shrink-0">
                  {file.type.startsWith("image") ? (
                    <Image
                      src={file.path || "/placeholder.svg"}
                      alt={file.name}
                      className="h-full w-full object-cover rounded"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center rounded">
                      {file.type.startsWith("video") && <FileVideoIcon className="h-5 w-5 text-muted-foreground" />}
                      {file.type.startsWith("audio") && <FileIcon className="h-5 w-5 text-muted-foreground" />}
                      {file.type.startsWith("application") && <FileTextIcon className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.createdAt).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  className="bg-transparent text-white rounded-full p-1 hover:bg-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(file.id)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

