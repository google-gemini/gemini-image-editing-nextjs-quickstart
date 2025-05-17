'use client';
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import { Camera, Repeat } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleStartCapture = () => {
    setIsCapturing(true);
    setCapturedImage(null);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
        setIsCapturing(false);
      }
    }
  }, [onCapture]);

  const retake = () => {
    setCapturedImage(null);
    setIsCapturing(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isCapturing && !capturedImage ? (
        <Button 
          onClick={handleStartCapture} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Use Webcam
        </Button>
      ) : isCapturing ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "user",
              }}
              className="w-full"
            />
          </div>
          <Button onClick={capture} className="w-full">Capture Photo</Button>
        </div>
      ) : capturedImage ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img src={capturedImage} alt="Captured" className="w-full" />
          </div>
          <Button 
            onClick={retake} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Repeat className="w-4 h-4" />
            Retake Photo
          </Button>
        </div>
      ) : null}
    </div>
  );
}