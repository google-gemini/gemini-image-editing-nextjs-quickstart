// Modify your existing ImageUpload component to include tabs for upload and webcam
'use client';
import { ChangeEvent, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { WebcamCapture } from "../components/WebcamCapture";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [selectedTab, setSelectedTab] = useState<string>("upload");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebcamCapture = (imageData: string) => {
    onImageSelect(imageData);
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="upload"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="webcam">Use Webcam</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="py-6">
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF or WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </TabsContent>
        <TabsContent value="webcam" className="py-6">
          <WebcamCapture onCapture={handleWebcamCapture} />
        </TabsContent>
      </Tabs>
    </div>
  );
}