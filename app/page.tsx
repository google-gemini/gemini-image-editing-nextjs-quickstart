"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePromptInput } from "@/components/ImagePromptInput";
import { ProcessingView } from "@/components/ProcessingView";
import { ImageIcon, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryItem, DesignDetails } from "@/lib/types";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [designDetails, setDesignDetails] = useState<DesignDetails | null>(null);

  const handleImageSelect = async (imageData: string) => {
    setImage(imageData || null);
    
    // 立即开始处理图片生成
    if (imageData) {
      try {
        setLoading(true);
        setError(null);

        // 直接使用上传的图片数据
        const requestData = {
          // Automatically generate prompt based on image content: add a pool if there isn't one, decorate if there is
          prompt: "Please analyze this image and determine if the backyard already has a swimming pool. If there is no pool, design and add a suitable pool to the backyard and generate a visual result. If there is already a pool, enhance and decorate the existing pool and generate a visual result.",
          image: imageData,
          history: history.length > 0 ? history : undefined,
        };

        const response = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate image");
        }

        const data = await response.json();

        if (data.image) {
          // Update the generated image, description and design details
          setGeneratedImage(data.image);
          setDescription(data.description || null);
          setDesignDetails(data.designDetails || null);

          // Update history locally - add user message
          const userMessage: HistoryItem = {
            role: "user",
            parts: [
              { text: "Transform this image into a beautiful pool design" },
              { image: imageData },
            ],
          };

          // Add AI response
          const aiResponse: HistoryItem = {
            role: "model",
            parts: [
              ...(data.description ? [{ text: data.description }] : []),
              ...(data.image ? [{ image: data.image }] : []),
            ],
          };

          // Update history with both messages
          setHistory((prevHistory) => [...prevHistory, userMessage, aiResponse]);
        } else {
          setError("No image returned from API");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error processing request:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);

      // If we have a generated image, use that for editing, otherwise use the uploaded image
      const imageToEdit = generatedImage || image;

      // Prepare the request data as JSON
      const requestData = {
        prompt,
        image: imageToEdit,
        history: history.length > 0 ? history : undefined,
      };

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      if (data.image) {
        // Update the generated image, description and design details
        setGeneratedImage(data.image);
        setDescription(data.description || null);
        setDesignDetails(data.designDetails || null);

        // Update history locally - add user message
        const userMessage: HistoryItem = {
          role: "user",
          parts: [
            { text: prompt },
            ...(imageToEdit ? [{ image: imageToEdit }] : []),
          ],
        };

        // Add AI response
        const aiResponse: HistoryItem = {
          role: "model",
          parts: [
            ...(data.description ? [{ text: data.description }] : []),
            ...(data.image ? [{ image: data.image }] : []),
          ],
        };

        // Update history with both messages
        setHistory((prevHistory) => [...prevHistory, userMessage, aiResponse]);
      } else {
        setError("No image returned from API");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error processing request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (email: string) => {
    try {
      setError(null);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response
        .json()
        .catch(() => ({ success: response.ok }));
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || "Failed to subscribe");
      }
      setIsSubscribed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Subscription failed");
    }
  };

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setDescription(null);
    setLoading(false);
    setError(null);
    setHistory([]);
    setIsSubscribed(false);
    setDesignDetails(null);
  };

  // If we have a generated image, we want to edit it next time
  const currentImage = generatedImage || image;
  const isEditing = !!currentImage;

  // Get the latest image to display (always the generated image)
  const displayImage = generatedImage;

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full mx-auto">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg max-w-[1200px] mx-auto">
            {error}
          </div>
        )}

        {!currentImage ? (
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={currentImage}
            onError={setError}
          />
        ) : (
          <div className="max-w-[1200px] mx-auto space-y-8">
            <ProcessingView 
              uploadedImage={image || ""} 
              generatedImage={generatedImage || undefined}
              isProcessing={loading}
              isSubscribed={isSubscribed}
              onSubscribe={handleSubscribe}
              designDetails={designDetails || undefined}
            />
          </div>
        )}
      </div>
    </main>
  );
}
