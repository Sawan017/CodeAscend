import React, { useEffect, useState } from 'react';

const globalChromaCache = new Map<string, string>();

export const ChromaKeyImage = ({ src, alt, style, className }: any) => {
  const [processedSrc, setProcessedSrc] = useState<string>(() => src ? (globalChromaCache.get(src) || '') : '');

  useEffect(() => {
    if (!src) return;
    if (globalChromaCache.has(src)) {
      setProcessedSrc(globalChromaCache.get(src)!);
      return;
    }

    let isMounted = true;
    
    const deferId = setTimeout(() => {
      if (!isMounted) return;
      if (globalChromaCache.has(src)) {
        setProcessedSrc(globalChromaCache.get(src)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        if (!isMounted) return;
        
        setTimeout(() => {
          if (!isMounted) return;
          try {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 256;
            let width = img.width;
            let height = img.height;
            if (width > MAX_SIZE || height > MAX_SIZE) {
              const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;
            
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];
              
              if (g > 170 && r < 100 && b < 100) {
                data[i+3] = 0;
              } else if (g > 120 && r < 120 && b < 120 && g > r * 1.2 && g > b * 1.2) {
                const diff = g - Math.max(r, b);
                data[i+3] = Math.max(0, 255 - diff * 3);
              } else if (r > 245 && g > 245 && b > 245) {
                data[i+3] = 0;
              } else if (r > 230 && g > 230 && b > 230) {
                 data[i+3] = Math.max(0, 255 - (r - 230) * 10);
              }
            }
            
            ctx.putImageData(imageData, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            
            globalChromaCache.set(src, dataUrl);
            
            if (isMounted) {
              setProcessedSrc(dataUrl);
            }
          } catch (e) {
            console.error("Chroma key processing failed", e);
          }
        }, 0);
      };
      
      img.src = src;
    }, Math.random() * 100);

    return () => {
      isMounted = false;
      clearTimeout(deferId);
    };
  }, [src]);

  if (!processedSrc) {
    return <div style={{...style, opacity: 0.1, background: 'rgba(255,255,255,0.05)', borderRadius: '50%'}} className={className} />;
  }

  return <img src={processedSrc} alt={alt} style={style} className={className} loading="lazy" />;
};