// src/components/project/DocumentsTab.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Loader2,
  Trash2,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileJson,
  Upload,
  Calendar,
  User,
  HardDrive,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api/projectApi";

// Helper functions
const getFileExtension = (fileName) => {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const getFileIcon = (fileName, size = "md") => {
  const ext = getFileExtension(fileName);
  const iconProps =
    size === "lg" ? { className: "h-12 w-12" } : { className: "h-8 w-8" };

  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext))
    return <ImageIcon {...iconProps} className="text-blue-500" />;
  if (ext === "pdf")
    return <FileText {...iconProps} className="text-red-500" />;
  if (["xlsx", "xls", "csv"].includes(ext))
    return <FileSpreadsheet {...iconProps} className="text-green-500" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <FileArchive {...iconProps} className="text-yellow-600" />;
  if (ext === "json")
    return <FileJson {...iconProps} className="text-purple-500" />;
  if (["js", "jsx", "ts", "tsx", "css", "scss", "html", "xml"].includes(ext))
    return <FileCode {...iconProps} className="text-gray-500" />;
  return <File {...iconProps} className="text-muted-foreground" />;
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isImageFile = (fileName) => {
  const ext = getFileExtension(fileName);
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext);
};

export function DocumentsTab({ projectId, canEdit, canOperationsEdit }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    file: null,
    name: "",
    description: "",
  });
  const [previewDoc, setPreviewDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getDocuments(projectId);
      const data = res.data?.data || res.data || [];
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchDocuments();
  }, [projectId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm({
        file,
        name: file.name,
        description: "",
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({
      file,
      name: file.name,
      description: "",
    });
  };

  const uploadDocument = async () => {
    if (!form.file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const presignRes = await projectApi.getPresignedUrl(projectId, {
        fileName: form.file.name,
        fileType: "document",
        mimeType: form.file.type,
      });
      const { uploadUrl, fileKey } = presignRes.data.data;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", form.file.type);
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress((event.loaded / event.total) * 100);
        }
      });
      await new Promise((resolve, reject) => {
        xhr.onload = () =>
          xhr.status === 200 ? resolve() : reject(new Error(`Upload failed`));
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(form.file);
      });

      await projectApi.confirmUpload(projectId, {
        fileKey,
        name: form.name || form.file.name,
        description: form.description || undefined,
      });

      toast.success("Document uploaded");
      setUploadOpen(false);
      resetForm();
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!confirm("Delete this document?")) return;
    try {
      await projectApi.deleteDocument(documentId);
      toast.success("Document deleted");
      fetchDocuments();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({ file: null, name: "", description: "" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with upload button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-sm text-muted-foreground">
            {documents.length} document(s) uploaded
          </p>
        </div>
        {canOperationsEdit && (
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {form.file
                    ? form.file.name
                    : "Drag & drop or click to select"}
                </p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  Browse files
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Display name (optional)</Label>
                  <Input
                    placeholder="Custom name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="Add notes"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                {uploading && (
                  <div className="space-y-1">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center">
                      {Math.round(uploadProgress)}% uploaded
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setUploadOpen(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={uploadDocument}
                    disabled={!form.file || uploading}
                  >
                    {uploading && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Document grid */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No documents yet</p>
            {canOperationsEdit && (
              <p className="text-sm">Click "Upload Document" to add files</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {documents.map((doc) => {
            const displayName = doc.name || doc.fileName || "Untitled";
            const isImage = isImageFile(displayName);
            const fileUrl = doc.fileUrl;
            const fileExt = getFileExtension(displayName).toUpperCase();

            return (
              <Card
                key={doc._id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handlePreview(doc)}
              >
                {/* Thumbnail / Preview area */}
                <div className="relative aspect-video bg-muted/30 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      {getFileIcon(displayName, "lg")}
                      <span className="mt-2 text-xs font-mono text-muted-foreground">
                        {fileExt}
                      </span>
                    </div>
                  )}
                  {/* Action buttons overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(doc);
                      }}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={fileUrl}
                        download={displayName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-3">
                  <p
                    className="font-medium text-sm truncate"
                    title={displayName}
                  >
                    {displayName}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {formatFileSize(doc.fileSize)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {doc.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full-screen preview modal */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-5xl w-[90vw] h-[85vh] p-0 overflow-hidden flex flex-col">
          {previewDoc &&
            (() => {
              const fileName =
                previewDoc.name || previewDoc.fileName || "Document";
              const isImage = isImageFile(fileName);
              const fileUrl = previewDoc.fileUrl;
              return (
                <>
                  <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <DialogTitle className="truncate">{fileName}</DialogTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setPreviewDoc(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-auto bg-black/5 p-4 flex items-center justify-center">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="text-center space-y-4">
                        {getFileIcon(fileName, "lg")}
                        <p className="text-muted-foreground">
                          Preview not available
                        </p>
                        <Button asChild>
                          <a href={fileUrl} download={fileName}>
                            <Download className="h-4 w-4 mr-1" /> Download
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  {previewDoc.description && (
                    <div className="p-3 border-t bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        {previewDoc.description}
                      </p>
                    </div>
                  )}
                  <div className="p-3 border-t flex justify-between text-xs text-muted-foreground">
                    <span>Uploaded: {formatDate(previewDoc.createdAt)}</span>
                    <span>Size: {formatFileSize(previewDoc.fileSize)}</span>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
