"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, RotateCcw, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { HistoryItem, HistoryPart } from "@/lib/types";

interface ImageResultDisplayProps {
  imageUrl: string;
  originalImageUrl: string;
  description: string | null;
  onReset: () => void;
  conversationHistory?: HistoryItem[];
}

export function ImageResultDisplay({
  imageUrl,
  originalImageUrl,
  description,
  onReset,
  conversationHistory = [],
}: ImageResultDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [email, setEmail] = useState("");
  const t = useTranslations();

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
    <div className="w-full max-w-[1200px] mx-auto">
      {/* 桌面端布局 (744px以上) */}
      <div className="hidden md:flex flex-col gap-[40px] items-center">
        {/* 标题 */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-display-7 leading-display-7 font-brand font-extrabold text-text-1 text-center">
            {t('result.completed')}
          </h1>
        </div>

        {/* 图片对比区域 */}
        <div className="flex gap-[40px] items-center justify-center">
          {/* 左侧：原图 */}
          <div className="relative">
            <img
              src={originalImageUrl}
              alt="Original"
              className="w-[480px] h-[360px] object-cover rounded-[24px]"
            />
            <div aria-hidden="true" className="absolute border-[12px] border-solid border-white inset-0 pointer-events-none rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)]" />
          </div>

          {/* 箭头 */}
          <div className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)]">
            <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66671 13H20.6667M20.6667 13L14.6667 7M20.6667 13L14.6667 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* 右侧：生成的图片 + 订阅overlay */}
          <div className="relative">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-[480px] h-[360px] object-cover rounded-[24px]"
            />
            <div aria-hidden="true" className="absolute border-[12px] border-solid border-white inset-0 pointer-events-none rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)]" />
            
            {/* 订阅overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pt-[160px] px-0 bg-gradient-to-b from-transparent to-black rounded-[24px]" style={{ backdropFilter: 'blur(48px)' }}>
              <div className="flex flex-col items-center gap-[19px] w-full px-6">
                <p className="text-body-3 font-brand font-semibold text-white text-center leading-body-3">
                  {t('result.subscribeTitle')}
                </p>
                
                <div className="w-[360px] bg-white rounded-[50px] p-[3px] flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder={t('result.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-0 bg-transparent pl-[17px] pr-2 text-body-3 font-brand placeholder:text-text-1/35 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button className="bg-text-1 hover:bg-text-1/90 text-white px-3 py-[11px] rounded-[24px] text-body-3 font-brand font-semibold">
                    {t('result.subscribe')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* 移动端布局 */}
      <div className="md:hidden w-full mx-auto flex flex-col gap-5">
        <h1 className="text-display-7 leading-display-7 font-brand font-extrabold text-text-1 text-center">
          {t('result.completed')}
        </h1>
        
        <div className="relative">
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-[353px] object-cover rounded-[40px]"
          />
          <div aria-hidden="true" className="absolute border-[12px] border-solid border-white inset-0 pointer-events-none rounded-[40px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)]" />
          
          {/* 订阅overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pt-[160px] px-0 bg-gradient-to-b from-transparent to-black rounded-[40px]" style={{ backdropFilter: 'blur(48px)' }}>
            <div className="flex flex-col items-center gap-[19px] w-full px-6">
              <p className="text-body-3 font-brand font-semibold text-white text-center leading-body-3">
                {t('result.subscribeTitle')}
              </p>
              
              <div className="w-full max-w-[300px] bg-white rounded-[50px] p-[3px] flex items-center gap-2">
                <Input
                  type="email"
                  placeholder={t('result.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-0 bg-transparent pl-[17px] pr-2 text-body-3 font-brand placeholder:text-text-1/35 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="bg-text-1 hover:bg-text-1/90 text-white px-3 py-[11px] rounded-[24px] text-body-3 font-brand font-semibold">
                  {t('result.subscribe')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 原图小预览 */}
        <div className="flex items-center justify-center">
          <img
            src={originalImageUrl}
            alt="Original"
            className="w-[53px] h-[40px] object-cover rounded-[8px] rotate-[-8deg]"
          />
        </div>
      </div>

      {/* 功能按钮区域 */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          {t('result.download')}
        </Button>
        {conversationHistory.length > 0 && (
          <Button variant="outline" size="sm" onClick={toggleHistory}>
            <MessageCircle className="w-4 h-4 mr-2" />
            {showHistory ? t('result.toggleHistoryHide') : t('result.toggleHistoryShow')}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('result.createNew')}
        </Button>
      </div>

      {/* 历史记录区域 */}
      {showHistory && conversationHistory.length > 0 && (
        <div className="mt-8 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-4">{t('result.historyTitle')}</h3>
          <div className="space-y-4">
            {conversationHistory.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg bg-secondary`}>
                <p
                  className={`text-sm font-medium mb-2 ${
                    item.role === "user" ? "text-foreground" : "text-primary"
                  }`}
                >
                  {item.role === "user" ? t('result.roleUser') : t('result.roleModel')}
                </p>
                <div className="space-y-2">
                  {item.parts.map((part: HistoryPart, partIndex) => (
                    <div key={partIndex}>
                      {part.text && <p className="text-sm">{part.text}</p>}
                      {part.image && (
                        <div className="mt-2 overflow-hidden rounded-md">
                          <img
                            src={part.image}
                            alt={`Image shared by ${item.role}`}
                            className="max-w-[16rem] h-auto object-contain"
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
