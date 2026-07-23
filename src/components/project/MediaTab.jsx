// src/components/project/MediaTab.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Video, Images } from "lucide-react";

export function MediaTab({ project }) {
  const hasCover = !!project?.coverImage;
  const hasGallery = project?.galleryImages && project.galleryImages.length > 0;
  const hasVideo = !!project?.projectVideo;

  if (!hasCover && !hasGallery && !hasVideo) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
          <p>No media files uploaded for this project yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Cover Image Section */}
      {hasCover && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Cover Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border">
              <img 
                src={project.coverImage} 
                alt="Project Cover" 
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Video Section */}
      {hasVideo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Video className="h-4 w-4 mr-2 text-muted-foreground" />
              Project Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-3xl rounded-lg overflow-hidden border bg-black">
              <video 
                src={project.projectVideo} 
                controls 
                className="w-full h-auto max-h-[500px]"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Section */}
      {hasGallery && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Images className="h-4 w-4 mr-2 text-muted-foreground" />
              Gallery Images ({project.galleryImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {project.galleryImages.map((img, index) => (
                <a 
                  key={index} 
                  href={img} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative block aspect-square rounded-md overflow-hidden border bg-muted"
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}