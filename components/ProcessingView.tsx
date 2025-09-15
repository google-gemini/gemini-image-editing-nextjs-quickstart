"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DesignDetails } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";

interface ProcessingViewProps {
  uploadedImage: string;
  generatedImage?: string;
  isProcessing?: boolean;
  isSubscribed?: boolean;
  onSubscribe?: (email: string) => void;
  designDetails?: DesignDetails;
}

export function ProcessingView({ 
  uploadedImage, 
  generatedImage, 
  isProcessing = false,
  isSubscribed = false,
  onSubscribe,
  designDetails
}: ProcessingViewProps) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [showDesignDetails, setShowDesignDetails] = useState(false);
  const isCompleted = !isProcessing && generatedImage;

  const handleSubscribe = () => {
    if (email.trim() && onSubscribe) {
      onSubscribe(email.trim());
      // 延迟显示设计详情，让订阅动画完成
      setTimeout(() => {
        setShowDesignDetails(true);
      }, 500);
    }
  };

  return (
    <div className="w-full lg:max-w-[1200px] mx-auto flex flex-col items-center gap-5 lg:gap-[40px]">
      {/* 顶部区域 - 标题 */}
      <div className="w-full flex justify-center items-center lg:px-[60px]">
        <div className="flex flex-col justify-center items-center gap-6 flex-1">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-display-4 leading-display-4 lg:text-display-7 lg:leading-display-7 font-extrabold text-center font-brand text-text-1">
              {isCompleted ? t('processing.completed') : t('processing.designing')}
            </h2>
          </div>
        </div>
      </div>

      {/* 图片区域 */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-[40px] w-full">
        {/* 原图 - 桌面端左侧，移动端缩略图 */}
        <div className="hidden md:block w-[480px] h-[360px] border-[12px] border-white rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)] overflow-hidden">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 箭头 - 仅桌面端显示 */}
        <div className="hidden md:flex w-[40px] h-[40px] items-center justify-center bg-white rounded-[24px]">
          <ArrowRight className="w-[26.67px] h-[25.93px] text-text-1" />
        </div>

        {/* 主图片区域 */}
        <div className="lg:w-[480px] mx-5 lg:mx-0 p-0">
          <div className="w-full lg:w-[480px] h-[265px] lg:h-[360px] relative">
          {generatedImage ? (
            <div className="w-full h-full border-[10px] lg:border-[12px] border-white rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.08)] lg:shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)] overflow-hidden relative">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-cover"
              />
              
              {/* 订阅overlay - 只在未订阅且完成时显示 */}
              {isCompleted && !isSubscribed && (
                <div className="absolute left-0 top-[62px] w-full lg:top-[77px] lg:bottom-auto lg:left-0 lg:right-0 lg:w-[480px] flex flex-col items-center gap-[19px] bg-gradient-to-b from-transparent to-black z-10 pointer-events-auto backdrop-blur-[24px] pt-20 px-5 pb-8 lg:pt-[160px] lg:pb-8">
                  <p className="text-body-3 leading-body-3 font-brand font-semibold text-white text-center w-full">
                    {t('processing.subscribeTitle')}
                  </p>
                  
                  <div className="w-full lg:w-[360px] mx-auto bg-white rounded-[50px] flex items-center gap-2 relative z-20 py-[3px] pr-[3px] pl-5">
                    <Input
                      type="email"
                      placeholder={t('processing.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border-0 bg-transparent text-body-3 font-brand focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-text-1 placeholder:text-text-3"
                      style={{ padding: '8px 0', minHeight: '20px' }}
                    />
                    <Button 
                      onClick={handleSubscribe}
                      className="bg-text-1 hover:bg-text-1/90 text-white rounded-[24px] text-body-3 font-brand font-semibold relative z-30 px-3 py-[11px]" 
                    >
                      {t('processing.subscribe')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-bg-2 border-[10px] lg:border-[12px] border-white rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.08)] lg:shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)] flex items-center justify-center relative overflow-hidden">
              
              {/* 扫光动画 */}
              {isProcessing && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent transform skew-x-12 w-[150%]" />
                </div>
              )}
            </div>
          )}
          {/* 移动端缩略图 */}
          <div className="lg:hidden absolute left-0 top-0">
            <div className="flex-none shrink-0 rotate-[-15deg]">
              <div className="w-20 h-[60px] aspect-[4/3] border-2 border-white rounded-[4px] shadow-[0px_0.667px_6.667px_0px_rgba(0,0,0,0.12)] overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* 建议区域 - 仅在订阅完成后显示 */}
      {isCompleted && isSubscribed && designDetails && (
        <div className="lg:w-[1080px] bg-[#F5F5F7] rounded-[24px] p-6 lg:px-8 lg:py-6 mx-5 lg:mx-0">
          <h3 className="text-display-6 leading-display-6 font-extrabold text-left font-brand text-text-1 mb-6">
            {t('processing.suggestion.title')}
          </h3>
          
          <div className="space-y-6">
            {/* 设计说明 */}
            <div>
              <h4 className="text-body-3 leading-body-3 font-semibold font-brand text-text-1 mb-2">
                {t('processing.suggestion.desc')}
              </h4>
              <div className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-text-1">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3">{children}</li>
                  }}
                >
                  {designDetails.designDescription}
                </ReactMarkdown>
              </div>
            </div>

            {/* 材料建议 */}
            <div>
              <h4 className="text-body-3 leading-body-3 font-semibold font-brand text-text-1 mb-2">
                {t('processing.suggestion.materials')}
              </h4>
              <div className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-text-1">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3">{children}</li>
                  }}
                >
                  {designDetails.materialSuggestions}
                </ReactMarkdown>
              </div>
            </div>

            {/* 成本估算 */}
            <div>
              <h4 className="text-body-3 leading-body-3 font-semibold font-brand text-text-1 mb-2">
                {t('processing.suggestion.cost')}
              </h4>
              <div className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-text-1">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3">{children}</li>
                  }}
                >
                  {designDetails.costEstimate}
                </ReactMarkdown>
              </div>
            </div>

            {/* 施工要点 */}
            <div>
              <h4 className="text-body-3 leading-body-3 font-semibold font-brand text-text-1 mb-2">
                {t('processing.suggestion.construction')}
              </h4>
              <div className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3 mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-text-1">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                    li: ({ children }) => <li className="text-body-4 leading-body-4 font-medium text-left font-brand text-text-3">{children}</li>
                  }}
                >
                  {designDetails.constructionTips}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
}
