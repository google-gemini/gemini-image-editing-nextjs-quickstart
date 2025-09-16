"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Upload as UploadIcon, Image as ImageIcon, X } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
  onError?: (error: string) => void;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

// 步骤指示器组件
function StepIndicator({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-1 rounded-full transition-all duration-200 ${
            step === 1 ? "w-10" : "w-3"
          } ${
            step === currentStep 
              ? "bg-text-1-80" 
              : "bg-text-1-35"
          }`}
        />
      ))}
    </div>
  );
}

export function ImageUpload({ onImageSelect, currentImage, onError }: ImageUploadProps) {
  const t = useTranslations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update the selected file when the current image changes
  useEffect(() => {
    if (!currentImage) {
      setSelectedFile(null);
    }
  }, [currentImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections) => {
      if (fileRejections?.length > 0) {
        const error = fileRejections[0].errors[0];
        onError?.(error.message);
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setSelectedFile(file);
      setIsLoading(true);

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const result = event.target.result as string;
          onImageSelect(result);
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        onError?.("Error reading file. Please try again.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"]
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleRemove = () => {
    setSelectedFile(null);
    onImageSelect("");
  };

  if (!currentImage) {
    // 设计稿样式的上传界面 - 响应式设计
    return (
      <div className="w-full lg:max-w-[1200px] mx-auto lg:pt-4">
        <div className="bg-white rounded-[40px] p-0 min-h-[360px] flex flex-col lg:flex-row gap-5 lg:gap-2.5">
          {/* 内容区 - 在移动端为垂直排列的第一部分 */}
          <div className="w-full lg:w-[560px] flex items-stretch lg:pr-20 px-5 lg:px-0 pt-4 pb-0 lg:pt-0 lg:pb-0">
            <div className="flex flex-col justify-center gap-6 flex-1">
              {/* 文本内容 */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 w-full max-w-[440px]">
                  <div className="text-blue-2 font-semibold text-body-3 font-brand text-left leading-body-3">
                    {t('upload.badge')}
                  </div>
                  <h1 className="text-text-1 font-extrabold text-display-4 font-brand text-left leading-display-4">
                    {t('upload.headline')}
                  </h1>
                </div>
                <p className="text-text-3 font-normal text-body-3 leading-body-3 font-brand text-left w-full">
                  Whether it's turning your backyard into a pool with realistic costs, or adding stylish décor to your pool with detailed names — AI makes it simple.
                </p>
              </div>
              
              {/* 上传按钮（对齐设计稿） */}
              <div className="flex flex-col gap-2">
                <div
                  {...getRootProps()}
                  className={`
                    bg-text-1 rounded-[24px] px-3 py-[11px]
                    flex items-center justify-center gap-1 cursor-pointer
                    ${isLoading ? "opacity-50 cursor-wait" : ""}
                    inline-flex w-fit
                  `}
                  aria-label="Upload an image of your backyard or pool"
                >
                  <input {...getInputProps()} />
                  <div className="w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.2611 6.77344L17.0556 7.24484C16.9053 7.58994 16.428 7.58994 16.2775 7.24484L16.0721 6.77344C15.7059 5.9329 15.0462 5.26369 14.223 4.89758L13.59 4.61603C13.2477 4.46379 13.2477 3.96569 13.59 3.81344L14.1876 3.54763C15.032 3.1721 15.7035 2.47812 16.0634 1.60904L16.2744 1.09962C16.4215 0.744585 16.9118 0.744585 17.0588 1.09962L17.2698 1.60904C17.6298 2.47812 18.3013 3.1721 19.1456 3.54763L19.7432 3.81344C20.0855 3.96569 20.0855 4.46379 19.7432 4.61603L19.1102 4.89758C18.287 5.26369 17.6274 5.9329 17.2611 6.77344ZM2.49313 2.50001H11.6666V4.16668H3.33329V15.8333L11.6666 7.50001L16.6666 12.5V9.16668H18.3333V16.6722C18.3333 17.1293 17.9539 17.5 17.5068 17.5H2.49313C2.03667 17.5 1.66663 17.1293 1.66663 16.6722V3.32784C1.66663 2.87064 2.04605 2.50001 2.49313 2.50001ZM16.6666 14.857L11.6666 9.85701L5.69032 15.8333H16.6666V14.857ZM6.66663 9.16668C5.74615 9.16668 4.99996 8.42051 4.99996 7.50001C4.99996 6.57954 5.74615 5.83334 6.66663 5.83334C7.5871 5.83334 8.33329 6.57954 8.33329 7.50001C8.33329 8.42051 7.5871 9.16668 6.66663 9.16668Z" fill="white"/>
                  </svg>
                  </div>
                  <span className="text-body-3 font-normal font-brand leading-body-3 px-1 text-white">
                    {t('upload.ctaPrefix')}
                    <span className="font-semibold">{t('upload.ctaBackyard')}</span>
                    {t('upload.ctaOr')}
                    <span className="font-semibold">{t('upload.ctaPool')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 图片区域 - 在移动端为垂直排列的第二部分 */}
          <div className="w-full lg:w-[630px] relative flex flex-col min-h-[202px] lg:min-h-auto">
            {/* 轮播图展示区域 */}
            <div className="flex-1 relative flex items-center px-5 lg:px-0">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 有图片时的显示 - 响应式设计
  return (
    <div className="w-full lg:max-w-[1200px] mx-auto lg:pt-4">
      <div className="bg-white rounded-[40px] p-0 min-h-[360px] flex flex-col lg:flex-row gap-5 lg:gap-0">
        {/* 内容区 */}
        <div className="w-full lg:w-[560px] flex items-stretch lg:pr-20 px-6 lg:px-0 pt-6 lg:pt-0">
          <div className="flex flex-col justify-center gap-6 flex-1">
            {/* 文件信息 */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <ImageIcon className="w-8 h-8 text-blue-2 flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-text-1 truncate">
                  {selectedFile?.name || "Current Image"}
                </p>
                {selectedFile && (
                  <p className="text-xs text-text-3">
                    {formatFileSize(selectedFile?.size ?? 0)}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="flex-shrink-0 text-text-3 hover:text-text-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 图片区域 */}
        <div className="w-full lg:w-[640px] relative flex flex-col min-h-[202px] lg:min-h-auto">
          {/* 步骤指示器 */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <StepIndicator currentStep={2} />
          </div>
          
          {/* 上传图片展示 */}
          <div className="flex-1 relative flex items-center px-5 lg:px-0">
            {/* 外层容器 - 480x360px，带12px白色边框 */}
            <div className="w-[480px] h-[360px] mx-auto border-[12px] border-white rounded-[24px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)] overflow-hidden relative">
              {/* 背景图片 - 在边框内部，24px圆角 */}
              <img
                src={currentImage}
                alt="Selected"
                className="w-full h-full object-cover rounded-[24px]"
              />
              
              {/* 遮罩层 - 底部渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-[24px]" />
              
              {/* 内容遮罩层 - 模糊效果 */}
              <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-[48px]">
                <div className="text-center">
                  <h3 className="text-white font-semibold text-base mb-4">{t('upload.subscribeTitle')}</h3>
                  <div className="bg-white rounded-[50px] p-1 flex items-center gap-2 max-w-[360px] mx-auto">
                    <input 
                      type="email" 
                      placeholder={t('upload.emailPlaceholder')}
                      className="flex-1 px-4 py-2 text-gray-600 bg-transparent outline-none text-base"
                    />
                    <button className="bg-[#242426] text-white px-3 py-2 rounded-[24px] text-base font-semibold">
                      {t('upload.subscribe')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
