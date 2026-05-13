import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/cropUtils';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/useThemeStore';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  circular?: boolean;
}

export default function ImageCropper({ 
  image, 
  onCropComplete, 
  onCancel, 
  aspect = 1, 
  circular = false 
}: ImageCropperProps) {
  const { isDark } = useThemeStore();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleCropComplete = (_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

  const generateResult = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={cn(
        "w-full max-w-2xl rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col",
        isDark ? "bg-gray-900" : "bg-snes-surface"
      )}>
        {/* Header */}
        <div className="p-4 border-b-4 border-black flex items-center justify-between bg-purple-600 text-white">
          <h3 className="font-retro text-lg font-bold uppercase tracking-widest">Ajustar Imagem</h3>
          <button type="button" onClick={onCancel} className="p-1 hover:bg-black/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative h-[400px] bg-black/20">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 opacity-50" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1 accent-purple-600"
            />
            <ZoomIn className="w-5 h-5 opacity-50" />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 rounded-xl font-retro font-bold uppercase border-4 border-black hover:bg-black/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={generateResult}
              className="flex-1 py-3 px-6 rounded-xl font-retro font-bold uppercase bg-purple-600 text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-[0px] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
