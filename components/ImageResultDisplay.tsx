"use client";

import { Button } from "@/components/ui/button";
import { Download, RotateCcw, MessageCircle } from "lucide-react";
import { useState } from "react";
import { HistoryItem, HistoryPart } from "@/lib/types";

interface ImageResultDisplayProps {
  imageUrl: string;
  description: string | null;
  onReset: () => void;
  conversationHistory?: HistoryItem[];
}

export function ImageResultDisplay({
  imageUrl,
  description,
  onReset,
  conversationHistory = [],
}: ImageResultDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gemini-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated Image</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {conversationHistory.length > 0 && (
            <Button variant="outline" size="sm" onClick={toggleHistory}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {showHistory ? "Hide History" : "Show History"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Create New Image
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden bg-muted p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Generated"
          className="max-w-[640px] h-auto mx-auto"
        />
      </div>

      {description && (
        <div className="p-4 rounded-lg bg-muted">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      {showHistory && conversationHistory.length > 0 && (
        <div className="p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-4">Conversation History</h3>
          <div className="space-y-4">
            {conversationHistory.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg bg-secondary`}>
                <p
                  className={`text-sm font-medium mb-2 ${
                    item.role === "user" ? "text-foreground" : "text-primary"
                  }`}
                >
                  {item.role === "user" ? "You" : "Gemini"}
                </p>
                <div className="space-y-2">
                  {item.parts.map((part: HistoryPart, partIndex) => (
                    <div key={partIndex}>
                      {part.text && <p className="text-sm">{part.text}</p>}
                      {part.image && (
                        <div className="mt-2 overflow-hidden rounded-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={part.image}
                            alt={`${item.role} image`}
                            className="max-w-64 h-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
