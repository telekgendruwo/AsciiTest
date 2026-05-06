/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Camera, Download, RefreshCw, Terminal, Info, 
  Settings2, Share2, Globe, Rocket, Palette, Sliders, 
  Sun, Contrast as ContrastIcon, EyeOff, Save, Bookmark, 
  Trash2, Plus, Undo2, Redo2, Zap, Monitor, Smartphone, VideoOff, Menu,
  Lock, Unlock, Crop, ChevronDown, ArrowRight, ArrowUp
} from 'lucide-react';

const CHAR_SETS = {
  standard: '@%#*+=-:. ',
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  blocks: '█▓▒░ ',
  binary: '01 ',
};

const PALETTES = [
  { name: 'Pure Terminal', primary: '#ffffff', bg: '#000000' },
  { name: 'Monochrome', primary: '#f0f0f0', bg: '#1a1a1a' },
  { name: 'Classic Green', primary: '#00ff41', bg: '#0a0a0a' },
  { name: 'Amber CRT', primary: '#ffb000', bg: '#1a1000' },
  { name: 'Arctic Frost', primary: '#00ccff', bg: '#000810' },
  { name: 'Cyber Magenta', primary: '#ff00ff', bg: '#0a000a' },
  { name: 'Retro Neon', primary: '#39ff14', bg: '#0d1117' },
  { name: 'Deep Space', primary: '#7b2ff7', bg: '#05051a' },
];

const PLATFORM_PRESETS = [
  { id: 'desktop_hd', name: 'Desktop HD', width: 1440, height: 900, targetWidth: 180, icon: Monitor },
  { id: 'desktop_fhd', name: 'Desktop FHD', width: 1920, height: 1080, targetWidth: 240, icon: Monitor },
  { id: 'mobile_ios', name: 'Mobile iOS', width: 390, height: 844, targetWidth: 50, icon: Smartphone },
  { id: 'mobile_android', name: 'Mobile Android', width: 360, height: 800, targetWidth: 46, icon: Smartphone },
  { id: 'tablet', name: 'Tablet', width: 768, height: 1024, targetWidth: 100, icon: Smartphone },
];

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AppSettings {
  width: number;
  charAspectRatio: number;
  charSet: keyof typeof CHAR_SETS;
  paletteName: string;
  brightness: number;
  contrast: number;
  inverted: boolean;
  glitch: boolean;
  glitchIntensity: number;
  glitchDisplacement: number;
  glitchChromatic: number;
  glitchScanline: number;
  sepia: number;
  grayscale: number;
  blur: number;
  hueRotate: number;
  starSpeed: number;
  starDirection: 'UP' | 'DOWN';
  isAspectLocked: boolean;
  crop?: CropData;
}

interface Preset extends AppSettings {
  id: string;
  name: string;
}

const StarsBackground = ({ color, speed = 1, direction = 'UP' }: { color: string, speed?: number, direction?: 'UP' | 'DOWN' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: (Math.random() * 0.2 + 0.05) * speed,
          opacity: Math.random()
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      
      particles.forEach(p => {
        if (direction === 'UP') {
          p.y -= p.speed;
          if (p.y < 0) p.y = canvas.height;
        } else {
          p.y += p.speed;
          if (p.y > canvas.height) p.y = 0;
        }
        
        ctx.globalAlpha = p.opacity * (0.3 + Math.sin(Date.now() * 0.001 * (p.speed / speed)) * 0.2);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, direction]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const CyberGrid = ({ color }: { color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      
      const time = Date.now() * 0.001;
      const gridSize = 50;
      const perspective = 0.5;

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = (y + time * 20) % canvas.height;
        const alpha = Math.min(1, Math.max(0, 1 - offset / canvas.height)) * 0.2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.lineTo(canvas.width, offset);
        ctx.stroke();
      }

      // Vertical lines
      const center = canvas.width / 2;
      for (let x = -canvas.width; x < canvas.width * 2; x += gridSize) {
        const xPos = center + (x - center) * (1 + perspective);
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, canvas.height);
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-30" />;
};

const CropModal = ({ image, onCrop, onCancel }: { image: string, onCrop: (crop: CropData) => void, onCancel: () => void }) => {
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startPos) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (!startPos || !currentPos || !containerRef.current) {
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(startPos.x - currentPos.x);
    const h = Math.abs(startPos.y - currentPos.y);

    if (w < 10 || h < 10) {
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    onCrop({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      width: (w / rect.width) * 100,
      height: (h / rect.height) * 100,
    });
    setStartPos(null);
    setCurrentPos(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full border border-terminal-green/30 bg-black p-4 md:p-6 flex flex-col gap-4 md:gap-6 my-auto">
        <div className="flex justify-between items-center border-b border-terminal-green/20 pb-4">
          <h2 className="text-sm md:text-xl font-bold uppercase tracking-tighter italic">DEFINE_SCAN_REGION</h2>
          <button onClick={onCancel} className="text-terminal-green hover:text-white transition-all uppercase text-[10px] md:text-xs">CANCEL</button>
        </div>
        
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative aspect-video bg-terminal-green/5 border border-terminal-green/10 cursor-crosshair overflow-hidden select-none"
        >
          <img src={image} alt="To crop" className="w-full h-full object-contain pointer-events-none opacity-50" style={{ imageRendering: 'pixelated' }} />
          {startPos && currentPos && (
            <div 
              className="absolute border-2 border-terminal-green bg-terminal-green/20"
              style={{
                left: Math.min(startPos.x, currentPos.x),
                top: Math.min(startPos.y, currentPos.y),
                width: Math.abs(startPos.x - currentPos.x),
                height: Math.abs(startPos.y - currentPos.y)
              }}
            >
              <div className="absolute top-0 right-0 bg-terminal-green text-black text-[8px] px-1 font-bold">SCAN_IN_PROGRESS</div>
            </div>
          )}
        </div>

        <p className="text-[10px] opacity-60 uppercase text-center">DRAG OVER THE IMAGE TO SELECT CROP AREA. RE-DRAG TO REDEFINE.</p>
        
        <div className="flex justify-end gap-4">
           <button onClick={() => onCrop({ x: 0, y: 0, width: 100, height: 100 })} className="px-4 py-2 border border-terminal-green/30 text-terminal-green text-[10px] uppercase hover:bg-terminal-green/5">RESET_FULL_SCAN</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [ascii, setAscii] = useState<string>('');
  const [width, setWidth] = useState(120);
  const [charAspectRatio, setCharAspectRatio] = useState(0.5);
  const [charSet, setCharSet] = useState<keyof typeof CHAR_SETS>('standard');
  const [activePalette, setActivePalette] = useState(PALETTES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  // New Features
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0.001);
  const [glitchDisplacement, setGlitchDisplacement] = useState(0);
  const [glitchChromatic, setGlitchChromatic] = useState(0);
  const [glitchScanline, setGlitchScanline] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sharpen, setSharpen] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [starSpeed, setStarSpeed] = useState(1);
  const [starDirection, setStarDirection] = useState<'UP' | 'DOWN'>('UP');
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [isAspectLocked, setIsAspectLocked] = useState(true);
  const [crop, setCrop] = useState<CropData | undefined>(undefined);
  const [isCropping, setIsCropping] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const renderConfigRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic when data is loaded
  useEffect(() => {
    if ((image || isCameraActive) && isSidebarOpen) {
      // Small delay to ensure section is expanded if we were to force open it
      setTimeout(() => {
        renderConfigRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [image, isCameraActive, isSidebarOpen]);

  // History system
  const [history, setHistory] = useState<AppSettings[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  const getCurrentSettings = useCallback((): AppSettings => ({
    width,
    charAspectRatio,
    charSet,
    paletteName: activePalette.name,
    brightness,
    contrast,
    inverted,
    glitch,
    glitchIntensity,
    glitchDisplacement,
    glitchChromatic,
    glitchScanline,
    sepia,
    grayscale,
    blur,
    hueRotate,
    starSpeed,
    starDirection,
    isAspectLocked,
    crop
  }), [width, charAspectRatio, charSet, activePalette.name, brightness, contrast, inverted, glitch, glitchIntensity, glitchDisplacement, glitchChromatic, glitchScanline, sepia, grayscale, blur, hueRotate, starSpeed, starDirection, isAspectLocked, crop]);

  const applySettings = useCallback((s: AppSettings) => {
    setWidth(s.width);
    setCharAspectRatio(s.charAspectRatio || 0.5);
    setCharSet(s.charSet);
    const pal = PALETTES.find(p => p.name === s.paletteName) || PALETTES[0];
    setActivePalette(pal);
    setBrightness(s.brightness);
    setContrast(s.contrast);
    setInverted(s.inverted);
    setGlitch(s.glitch || false);
    setGlitchIntensity(s.glitchIntensity || 0.001);
    setGlitchDisplacement(s.glitchDisplacement || 0);
    setGlitchChromatic(s.glitchChromatic || 0);
    setGlitchScanline(s.glitchScanline || 0);
    setSepia(s.sepia || 0);
    setGrayscale(s.grayscale || 0);
    setBlur(s.blur || 0);
    setHueRotate(s.hueRotate || 0);
    setStarSpeed(s.starSpeed || 1);
    setStarDirection(s.starDirection || 'UP');
    setIsAspectLocked(s.isAspectLocked !== undefined ? s.isAspectLocked : true);
    setCrop(s.crop);
  }, []);

  const pushHistory = useCallback((settings: AppSettings) => {
    if (isInternalChange.current) return;
    setHistory(prev => {
      const last = prev[historyIndex];
      if (last && JSON.stringify(last) === JSON.stringify(settings)) return prev;
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(settings);
      if (newHistory.length > 50) newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      applySettings(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      applySettings(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  };

  const pushTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (pushTimeout.current) clearTimeout(pushTimeout.current);
    pushTimeout.current = setTimeout(() => pushHistory(getCurrentSettings()), 500);
  }, [width, charAspectRatio, charSet, activePalette, brightness, contrast, inverted, glitch, glitchIntensity, glitchDisplacement, glitchChromatic, glitchScanline, sepia, grayscale, blur, hueRotate, starSpeed, starDirection, isAspectLocked, crop, pushHistory, getCurrentSettings]);

  // Presets
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('ascii-presets-v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ascii-presets-v2', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    document.documentElement.style.setProperty('--palette-primary', activePalette.primary);
    document.documentElement.style.setProperty('--palette-bg', activePalette.bg);
  }, [activePalette]);

  // Conversion Engine
  const renderFrame = useCallback((source: HTMLImageElement | HTMLVideoElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let sWidth, sHeight;
    if (source instanceof HTMLVideoElement) {
      sWidth = source.videoWidth;
      sHeight = source.videoHeight;
    } else {
      sWidth = source.width;
      sHeight = source.height;
    }

    if (!sWidth || !sHeight) return;

    let drawX = 0, drawY = 0, drawW = sWidth, drawH = sHeight;
    if (crop) {
      drawX = (crop.x / 100) * sWidth;
      drawY = (crop.y / 100) * sHeight;
      drawW = (crop.width / 100) * sWidth;
      drawH = (crop.height / 100) * sHeight;
    }

    const aspect = drawH / drawW;
    const h = Math.round(width * aspect * charAspectRatio);
    canvas.width = width;
    canvas.height = h;

    // Apply Canvas Filters
    ctx.filter = `grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    ctx.drawImage(source, drawX, drawY, drawW, drawH, 0, 0, width, h);
    ctx.filter = 'none';

    const imageData = ctx.getImageData(0, 0, width, h);
    const pixels = imageData.data;
    const chars = CHAR_SETS[charSet];
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    let asciiStr = '';
    const charCount = pixels.length / 4;
    
    for (let i = 0; i < charCount; i++) {
        let pixelIndex = i * 4;
        const x = i % width;
        const y = Math.floor(i / width);

        // 1. Block/Row Displacement
        if (glitch && glitchDisplacement > 0) {
            const rowOffset = Math.floor(Math.sin(y * 0.2 + Date.now() * 0.005) * glitchDisplacement);
            const newX = (x + rowOffset + width) % width;
            pixelIndex = (y * width + newX) * 4;
        }

        // 2. Scanline Disruption
        if (glitch && glitchScanline > 0 && Math.random() < glitchScanline * 0.001) {
            pixelIndex = Math.min(pixels.length - 4, pixelIndex + Math.floor(Math.random() * 50) * 4);
        }

        let r = pixels[pixelIndex], g = pixels[pixelIndex + 1], b = pixels[pixelIndex + 2];

        // 3. Chromatic Shift
        if (glitch && glitchChromatic > 0) {
            const offset = Math.floor(glitchChromatic);
            const rIdx = Math.max(0, Math.min(pixels.length - 4, pixelIndex - offset * 4));
            const bIdx = Math.max(0, Math.min(pixels.length - 4, pixelIndex + offset * 4));
            r = pixels[rIdx];
            b = pixels[bIdx];
        }
        
        let grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        grey = (grey + brightness - 128) * contrastFactor + 128;
        if (inverted) grey = 255 - grey;
        grey = Math.max(0, Math.min(255, Math.floor(grey)));
        
        let charIndex = Math.floor((grey / 255) * (chars.length - 1));
        
        if (glitch && Math.random() < glitchIntensity) {
            charIndex = Math.floor(Math.random() * chars.length);
        }
        
        asciiStr += chars[charIndex];
        if ((i + 1) % width === 0) asciiStr += '\n';
    }
    setAscii(asciiStr);
  }, [width, charAspectRatio, charSet, brightness, contrast, inverted, glitch, glitchIntensity, glitchDisplacement, glitchChromatic, glitchScanline, sepia, grayscale, blur, hueRotate]);

  const processLoop = useCallback(() => {
    if ((isCameraActive || isVideoPlaying) && videoRef.current) {
      renderFrame(videoRef.current);
      requestRef.current = requestAnimationFrame(processLoop);
    }
  }, [isCameraActive, isVideoPlaying, renderFrame]);

  useEffect(() => {
    if (isCameraActive || isVideoPlaying) {
      requestRef.current = requestAnimationFrame(processLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (imageElementRef.current) renderFrame(imageElementRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCameraActive, isVideoPlaying, processLoop, renderFrame]);

  // Camera Control
  const toggleCamera = async () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices API not available in this context.");
        }

        let stream: MediaStream;
        try {
          // Try loose constraints first
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
        } catch (innerErr) {
          console.warn("Requested constraints failed, trying basic video...", innerErr);
          // High-compatibility fallback
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          // Close dropdowns when entering active mode
          setOpenSections({
            intelligence: false,
            display: false,
            filters: false,
            matrix: false,
            presets: false,
            platform: false
          });
        }
      } catch (err) {
        console.error("Camera access failed", err);
        let errorMsg = "Unable to access camera.";
        if (err instanceof Error) {
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMsg = "No camera device was found on this system.";
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg = "Camera permission was denied. Please allow access in browser settings.";
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMsg = "Camera is already in use by another application.";
          }
        }
        alert(`CAMERA_ERROR: ${errorMsg}`);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('FORMAT_REJECTED: Only .JPG and .PNG files are authorized.');
        return;
      }

      if (isCameraActive) toggleCamera();
      
      const reader = new FileReader();
      
      if (file.type.startsWith('video/')) {
        setIsProcessing(true);
        setIsVideoPlaying(true);
        const url = URL.createObjectURL(file);
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.loop = true;
          videoRef.current.play();
          setIsProcessing(false);
          setImage("VIDEO_SOURCE");
        }
        return;
      }

      setIsProcessing(true);
      setIsVideoPlaying(false);
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageElementRef.current = img;
          setImage(event.target?.result as string);
          renderFrame(img);
          setIsProcessing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const savePreset = () => {
    const name = prompt('ENTER PRESET IDENTIFIER:');
    if (!name) return;
    const newPreset: Preset = { id: Date.now().toString(), name, ...getCurrentSettings() };
    setPresets([newPreset, ...presets]);
  };

  const downloadAsciiFormat = (format: 'txt' | 'svg' | 'png' | 'webp') => {
    if (!ascii) return;

    const lines = ascii.split('\n');
    const widthPixels = width * 8; // Approx width for rendering
    const heightPixels = lines.length * 8;

    if (format === 'txt') {
      const blob = new Blob([ascii], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cosmic-ascii.txt';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'svg') {
      const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPixels}" height="${heightPixels}" viewBox="0 0 ${widthPixels} ${heightPixels}">`;
      const svgBg = `<rect width="100%" height="100%" fill="${activePalette.bg}" />`;
      const svgText = `<text x="0" y="0" font-family="monospace" font-size="8" fill="${activePalette.primary}" white-space="pre">`;
      const svgLines = lines.map((line, i) => `<tspan x="0" dy="${i === 0 ? '8' : '8'}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>`).join('');
      const svgFooter = `</text></svg>`;
      const blob = new Blob([svgHeader + svgBg + svgText + svgLines + svgFooter], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cosmic-ascii.svg';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // PNG and WebP using Canvas
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    exportCanvas.width = widthPixels;
    exportCanvas.height = heightPixels;

    exportCtx.fillStyle = activePalette.bg;
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.fillStyle = activePalette.primary;
    exportCtx.font = '8px monospace';
    exportCtx.textBaseline = 'top';

    lines.forEach((line, i) => {
      exportCtx.fillText(line, 0, i * 8);
    });

    const type = format === 'png' ? 'image/png' : 'image/webp';
    const dataUrl = exportCanvas.toDataURL(type);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `cosmic-ascii.${format}`;
    a.click();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCanvasScale(prev => Math.min(Math.max(prev * delta, 0.5), 5));
    }
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    intelligence: false,
    display: false,
    filters: false,
    matrix: false,
    presets: false,
    platform: false
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = prev[id];
      const newState: Record<string, boolean> = {};
      // Close all others
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      return { ...newState, [id]: !isCurrentlyOpen };
    });
  };

  const SectionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-3 px-2 hover:bg-white/5 transition-colors group rounded-sm"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-3.5 h-3.5 transition-colors ${openSections[id] ? 'text-terminal-green' : 'text-terminal-green/40 group-hover:text-terminal-green'}`} />
        <span className={`text-[10px] uppercase font-bold tracking-widest transition-all ${openSections[id] ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
          {label}
        </span>
      </div>
      <ChevronDown className={`w-3 h-3 text-terminal-green/30 transition-transform duration-300 ${openSections[id] ? 'rotate-180 text-terminal-green' : ''}`} />
    </button>
  );

  const isInitialState = !image && !isCameraActive && !isProcessing;

  if (isInitialState) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative font-sans selection:bg-white selection:text-black">
        {/* Architectural Border Frame */}
        <div className="absolute inset-0 border-[12px] md:border-[24px] border-white/5 pointer-events-none z-50 transition-colors duration-500" />
        
        {/* Navigation & Metadata Bar */}
        <nav className="p-8 md:p-12 flex justify-between items-end relative z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase leading-none mb-1">System Ident</h2>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-tighter text-white">AV-2.0</span>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ASCII Vision Protocol</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] gap-1">
            <span>Lat: 37.7749 // Lng: -122.4194</span>
            <span>Kernel: Optimized Silicon v4</span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-12 relative z-10">
          
          {/* Left Column: Huge Type / Manifesto */}
          <div className="flex-1 flex flex-col justify-end pb-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-8xl md:text-[180px] font-black leading-[0.75] tracking-tighter text-white uppercase italic">
                RAW<br/>
                TRANS<br/>
                FORM
              </h1>
              <div className="max-w-md">
                <p className="text-sm md:text-base text-white/50 leading-relaxed font-light tracking-wide">
                  A high-precision visual reconstruction engine. Converting digital light frequencies into structured character matrices with high fidelity. No compromises.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interaction Cards */}
          <div className="w-full md:w-[480px] flex flex-col justify-end gap-6 pb-12">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="group w-full flex flex-col p-10 bg-white text-black hover:bg-white/90 transition-all duration-300 relative overflow-hidden"
              >
                <span className="text-[10px] font-bold tracking-[0.3em] opacity-40 mb-12 uppercase group-hover:opacity-100 transition-opacity">Protocol 01</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black uppercase tracking-tighter">DATA IMPORT</span>
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>

              <button 
                onClick={toggleCamera} 
                className="group w-full flex flex-col p-10 border border-white/20 text-white hover:bg-white/5 transition-all duration-300 relative"
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] font-bold tracking-[0.3em] opacity-30 uppercase group-hover:opacity-100 transition-opacity">Protocol 02</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">Under Construction</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black uppercase tracking-tighter">LIVE STREAM</span>
                  <Camera className="w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>

              <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/10 opacity-30">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase tracking-widest">Compression</span>
                  <span className="block text-xs font-mono">LOSSLESS 8bit</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="block text-[9px] font-bold uppercase tracking-widest">Hardware</span>
                  <span className="block text-xs font-mono">ACCEL RENDER</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".jpg,.jpeg,.png" />
      </div>
    );
  }

  const isEditorEmpty = !image && !isCameraActive && !isProcessing;

  return (
    <div className="min-h-screen bg-black flex flex-col relative font-sans selection:bg-white selection:text-black text-white overflow-hidden">
      {/* Architectural Border Frame */}
      <div className="absolute inset-0 border-[12px] md:border-[24px] border-white/5 pointer-events-none z-50 transition-colors duration-500" />
      
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      
      {isCropping && image && (
        <CropModal 
          image={image === "VIDEO_SOURCE" ? "" : image} 
          onCrop={(c) => { setCrop(c); setIsCropping(false); }} 
          onCancel={() => setIsCropping(false)} 
        />
      )}

      {/* Modern High-End Metadata Nav */}
      <nav className="p-8 md:p-12 pb-0 flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase leading-none mb-1">System Ident</h2>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tighter text-white">AV-2.0</span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ASCII Vision Editor</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
            <div className="hidden sm:flex border border-white/5 bg-white/5 rounded-sm overflow-hidden h-full">
              <button onClick={undo} disabled={historyIndex <= 0} className="p-3 hover:bg-white/10 disabled:opacity-30 border-r border-white/5"><Undo2 className="w-4 h-4 text-white" /></button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-3 hover:bg-white/10 disabled:opacity-30"><Redo2 className="w-4 h-4 text-white" /></button>
            </div>
            
            <div className="flex bg-white rounded-sm overflow-hidden group/export">
              <button
                disabled={!ascii}
                className="px-6 py-3 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-3 border-r border-black/10"
              >
                <Save className="w-4 h-4" /> Export Protocol
              </button>
              <div className="flex items-center">
                <button onClick={() => downloadAsciiFormat('svg')} title="SVG Format" className="px-3 h-full hover:bg-black/5 text-black font-mono text-[9px] font-bold border-r border-black/10 transition-colors">SVG</button>
                <button onClick={() => downloadAsciiFormat('png')} title="PNG Format" className="px-3 h-full hover:bg-black/5 text-black font-mono text-[9px] font-bold border-r border-black/10 transition-colors">PNG</button>
                <button onClick={() => downloadAsciiFormat('webp')} title="WebP Format" className="px-3 h-full hover:bg-black/5 text-black font-mono text-[9px] font-bold transition-colors">WEBP</button>
              </div>
            </div>

            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`flex items-center gap-2 px-4 py-2 transition-all rounded-sm border ${isSidebarOpen ? 'bg-terminal-green text-black border-terminal-green' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30 bg-white/5'}`}
              title={isSidebarOpen ? "Minimize Controls" : "Expand Interface"}
            >
              <Settings2 className={`w-4 h-4 ${isSidebarOpen ? 'animate-spin-slow' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">
                {isSidebarOpen ? 'Compact_Mode' : 'Expert_Mode'}
              </span>
            </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex p-8 md:p-12 gap-8 md:gap-12 relative z-10 overflow-hidden h-[calc(100vh-140px)]">
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside 
              key="sidebar-active"
              ref={sidebarRef}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2"
            >
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                fileInputRef.current?.click();
                setOpenSections({ intelligence: false, display: false, filters: false, matrix: false, presets: false, platform: false });
              }}
              className="w-full group flex items-center justify-between p-6 border border-white/10 hover:border-white/30 transition-all duration-300 relative"
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-bold tracking-[0.2em] mb-1 text-white/30 group-hover:text-white/60 transition-colors uppercase">Action 01</span>
                <span className="text-lg font-black uppercase tracking-tight">Source Select</span>
              </div>
              <Upload className="w-6 h-6 text-white/20 group-hover:text-white transition-all group-hover:-translate-y-1" />
            </button>
            <button 
              onClick={toggleCamera}
              className={`w-full group flex items-center justify-between p-6 border transition-all duration-300 relative ${isCameraActive ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white'}`}
            >
              <div className="flex flex-col items-start">
                <span className={`text-[9px] font-bold tracking-[0.2em] mb-1 uppercase ${isCameraActive ? 'text-black/40' : 'text-white/30 group-hover:text-white/60'}`}>Action 02</span>
                <span className="text-lg font-black uppercase tracking-tight">Live Capture</span>
                <span className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1 ${isCameraActive ? 'text-black/30' : 'text-terminal-green/40'}`}>Under Construction</span>
              </div>
              <Camera className={`w-6 h-6 transition-all ${isCameraActive ? 'text-black' : 'text-white/20 group-hover:text-white group-hover:scale-110'}`} />
            </button>
            {image && !isCameraActive && (
              <button 
                onClick={() => {
                  setIsCropping(true);
                  setOpenSections({ intelligence: false, display: false, filters: false, matrix: false, presets: false, platform: false });
                }}
                className="w-full group flex items-center justify-between p-6 border border-white/10 hover:border-white/30 transition-all duration-300 relative"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-bold tracking-[0.2em] mb-1 text-white/30 group-hover:text-white/60 transition-colors uppercase">Action 03</span>
                  <span className="text-lg font-black uppercase tracking-tight">Crop Region</span>
                </div>
                <Crop className="w-6 h-6 text-white/20 group-hover:text-white transition-all group-hover:scale-110" />
              </button>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <SectionHeader id="intelligence" label="System Intelligence" icon={Info} />
            <AnimatePresence>
              {openSections.intelligence && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4 space-y-4">
                  <div className="p-4 bg-terminal-green/5 border border-terminal-green/20 rounded-sm space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-terminal-green flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Input Protocol
                      </p>
                      <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">
                        Sistem hanya menerima file <span className="text-white">.JPG</span> dan <span className="text-white">.PNG</span>. Format lain akan didepresiasi.
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-terminal-green flex items-center gap-2">
                        <Monitor className="w-3 h-3" /> Sharpness Protocol
                      </p>
                      <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">
                        Rendering <span className="text-white">Pixelated</span> aktif. Tepian karakter dipertajam untuk menjaga integritas visual ASCII.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-terminal-green flex items-center gap-2">
                        <Save className="w-3 h-3" /> Export Hierarchy
                      </p>
                      <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">
                        Gunakan tombol di atas untuk export: <span className="text-white">SVG</span>, <span className="text-white">PNG</span>, atau <span className="text-white">WebP</span>.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-terminal-green flex items-center gap-2">
                        <Smartphone className="w-3 h-3" /> Platform Sync
                      </p>
                      <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">
                        Gunakan seksi <span className="text-white">Platform Simulation</span> untuk menyesuaikan resolusi dengan target layar (Mobile/Desk).
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5" ref={renderConfigRef}>
            <SectionHeader id="display" label="Render Config" icon={Monitor} />
            <AnimatePresence>
              {openSections.display && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-6 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30"><span>Resolution</span><span className="font-mono text-white/60">{width}px</span></div>
                    <input type="range" min="40" max="240" step="10" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="w-full accent-white h-1 bg-white/10 appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30"><span>Brightness</span><span className="font-mono text-white/60">{brightness}</span></div>
                    <input type="range" min="-100" max="100" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full accent-white h-1 bg-white/10 appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30"><span>Contrast</span><span className="font-mono text-white/60">{contrast}</span></div>
                    <input type="range" min="-100" max="100" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full accent-white h-1 bg-white/10 appearance-none cursor-pointer" />
                  </div>
                  
                  {/* Integrated Light Optics into Render Config */}
                  {[
                    { label: 'Sharpen', val: sharpen, set: setSharpen, min: 0, max: 100 },
                    { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100 },
                    { label: 'Blur', val: blur, set: setBlur, min: 0, max: 10, step: 0.5 },
                    { label: 'Sepia', val: sepia, set: setSepia, min: 0, max: 100 },
                  ].map((f) => (
                    <div key={f.label} className="space-y-3 pt-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30"><span>{f.label}</span><span className="font-mono text-white/60">{f.val}</span></div>
                      <input type="range" min={f.min} max={f.max} step={f.step || 1} value={f.val} onChange={(e) => f.set(parseFloat(e.target.value))} className="w-full accent-white h-1 bg-white/10 appearance-none cursor-pointer" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <SectionHeader id="filters" label="Light Optics" icon={Sliders} />
            <AnimatePresence>
              {openSections.filters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4">
                  <div className="p-8 border border-dashed border-white/10 rounded-sm flex items-center justify-center bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 animate-pulse">Under Construction</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <SectionHeader id="matrix" label="Kernel Set" icon={Palette} />
            <AnimatePresence>
              {openSections.matrix && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(CHAR_SETS).map((key) => (
                      <button
                        key={key}
                        onClick={() => setCharSet(key as keyof typeof CHAR_SETS)}
                        className={`p-4 text-[10px] font-bold uppercase tracking-widest border transition-all ${charSet === key ? 'bg-white text-black border-white' : 'border-white/5 text-white/30 hover:border-white/20'}`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between px-2">
              <SectionHeader id="platform" label="Platform Simulation" icon={Smartphone} />
            </div>
            <AnimatePresence>
              {openSections.platform && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4">
                  <div className="p-8 border border-dashed border-white/10 rounded-sm flex items-center justify-center bg-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 animate-pulse">Under Construction</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <SectionHeader id="presets" label="Archive & Presets" icon={Bookmark} />
            <AnimatePresence>
              {openSections.presets && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4 space-y-3">
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {presets.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => { applySettings(p); }} 
                        className="group flex justify-between items-center p-3 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/5 cursor-pointer text-[9px] uppercase tracking-widest transition-all"
                      >
                        <span className="opacity-60 group-hover:opacity-100">{p.name || 'Untitled_P'}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                           <Trash2 onClick={(e) => { e.stopPropagation(); setPresets(prev => prev.filter(x => x.id !== p.id)); }} className="w-3.5 h-3.5 hover:text-red-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                    {presets.length === 0 && <div className="text-[9px] text-white/20 uppercase text-center py-4 border border-dashed border-white/5">No Data Stored</div>}
                  </div>
                  <button 
                    onClick={savePreset} 
                    className="w-full p-3 border border-white/10 hover:border-white/30 text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 text-white/40 hover:text-white transition-all"
                  >
                    <Plus className="w-3 h-3" /> Register Config
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-auto pt-8 flex flex-col gap-4">
            <div className="flex justify-between items-center opacity-30 text-[9px] uppercase tracking-[0.2em] font-mono">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-terminal-green" /> 0x882F STABLE</span>
              <span>4K RECON</span>
            </div>
            <button
               onClick={() => { 
                setImage(null); 
                setIsCameraActive(false); 
                setIsSidebarOpen(false);
                setOpenSections({ intelligence: false, display: false, filters: false, matrix: false, presets: false, platform: false });
                if(videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); 
               }}
               className="w-full py-4 border border-white/10 text-white/20 hover:text-white uppercase text-[10px] font-black tracking-[0.4em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)]"
            >
               Terminate Protocol
            </button>
            <button 
              onClick={() => sidebarRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 py-4 text-[9px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-all group"
            >
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
              <span>Back to Top</span>
            </button>
          </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.section 
          onWheel={handleWheel}
          initial={false}
          className="flex-1 relative overflow-auto flex items-center justify-center p-4 md:p-8 custom-scrollbar border border-white/5 bg-black/40 backdrop-blur-sm transition-all duration-500"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${ascii.length}-${glitch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ascii-container font-mono whitespace-pre leading-[0.7] select-none text-center transform-gpu"
              style={{ 
                fontSize: 'clamp(2px, 1vw, 12px)',
                width: 'max-content',
                maxWidth: '100%',
                imageRendering: 'pixelated',
                transform: `scale(${canvasScale})`
              }}
            >
              {isEditorEmpty ? (
                <div className="flex flex-col items-center gap-12 opacity-10">
                   <h2 className="text-8xl font-black tracking-tighter uppercase italic">Ready_</h2>
                   <p className="text-xs uppercase tracking-[0.5em]">Awaiting Data Input</p>
                </div>
              ) : (
                <div className="inline-block text-left mx-auto">
                  {ascii}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {!isEditorEmpty && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-black/80 border border-white/10 rounded-full backdrop-blur-xl z-20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Mag: {Math.round(canvasScale * 100)}%</span>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex gap-4">
                <button onClick={() => setCanvasScale(prev => Math.max(prev - 0.2, 0.5))} className="text-white/40 hover:text-white transition-colors text-xs font-bold">-</button>
                <button onClick={() => setCanvasScale(1)} className="text-white/40 hover:text-white transition-colors text-xs font-bold">1:1</button>
                <button onClick={() => setCanvasScale(prev => Math.min(prev + 0.2, 5))} className="text-white/40 hover:text-white transition-colors text-xs font-bold">+</button>
              </div>
            </div>
          )}
        </motion.section>
      </main>

      <canvas ref={canvasRef} className="hidden" style={{ imageRendering: 'pixelated' }} />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".jpg,.jpeg,.png" />
    </div>
  );
}
