"use client";

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // 打字速度（毫秒）
  className?: string;
  onComplete?: () => void;
  startDelay?: number; // 开始前的延迟
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  className = "", 
  onComplete,
  startDelay = 0
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (startDelay > 0) {
      const startTimer = setTimeout(() => {
        setIsStarted(true);
      }, startDelay);
      return () => clearTimeout(startTimer);
    } else {
      setIsStarted(true);
    }
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isStarted, onComplete]);

  // 重置效果当text改变时
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsStarted(startDelay === 0);
  }, [text, startDelay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
