import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg, getProxiedUrl } from '../../lib/cropUtils';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/useThemeStore';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedBlob: Blob, aspect: 'original' | '1:1' | '16:9' | '4:5') => void;
  onCancel: () => void;
  aspect?: 'original' | '1:1' | '16:9' | '4:5';
  circular?: boolean;
}

export default function ImageCropper({ 
  image, 
  onCropComplete, 
  onCancel, 
  aspect = 'original', 
  circular = false 
}: ImageCropperProps) {
  const { isDark } = useThemeStore();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [naturalAspect, setNaturalAspect] = useState<number | undefined>(undefined);
  const [cropError, setCropError] = useState<string | null>(null);
  const [currentAspectSetting, setCurrentAspectSetting] = useState<'original' | '1:1' | '16:9' | '4:5'>(
    aspect
  );

  const calculatedAspect = 
    circular ? 1 :
    currentAspectSetting === '1:1' ? 1 :
    currentAspectSetting === '16:9' ? 16/9 :
    currentAspectSetting === '4:5' ? 4/5 :
    naturalAspect;

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleCropComplete = (_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

  const getBustedUrl = (url: string) => {
    const proxied = getProxiedUrl(url);
    if (proxied.startsWith('http') || proxied.startsWith('/firebase-storage')) {
      try {
        const base = proxied.startsWith('/') ? window.location.origin : undefined;
        const urlObj = new URL(proxied, base);
        urlObj.searchParams.set('nocache', 'cropper');
        return urlObj.toString();
      } catch {
        return proxied;
      }
    }
    return proxied;
  };

  const generateResult = async () => {
    setCropError(null);
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedBlob, currentAspectSetting);
    } catch (e) {
      console.error(e);
      setCropError("CORS_BLOCK");
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
          <button onClick={onCancel} className="p-1 hover:bg-black/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative h-[400px] bg-black/20">
          <Cropper
            image={getBustedUrl(image)}
            crop={crop}
            zoom={zoom}
            aspect={calculatedAspect}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
            onMediaLoaded={(mediaSize) => {
              setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {cropError && (
            <div className="p-4 bg-red-950/40 border-2 border-red-500 text-red-400 text-xs leading-relaxed space-y-2 rounded-2xl animate-in shake duration-300">
              <p className="font-retro font-bold uppercase tracking-wider">⚠️ ERRO DE SEGURANÇA (CORS)</p>
              <p>O Firebase Storage bloqueou o acesso do navegador para recortar esta imagem antiga.</p>
              <p className="text-[10px] opacity-90 leading-normal">
                <strong>Como configurar o Firebase Storage:</strong>
                <br />
                1. Crie um arquivo chamado <code className="bg-black/40 px-1 py-0.5 font-mono">cors.json</code> no seu computador:
                <code className="block bg-black/60 p-2 font-mono mt-1 text-[9px] overflow-x-auto whitespace-pre rounded">
                  {`[{"origin": ["*"], "method": ["GET"], "maxAgeSeconds": 3600}]`}
                </code>
                2. Configure o seu bucket rodando o comando no terminal do seu computador:
                <code className="block bg-black/60 p-2 font-mono mt-1 text-[9px] overflow-x-auto whitespace-pre rounded">
                  gsutil cors set cors.json gs://lucas-begins.firebasestorage.app
                </code>
                3. *Nota:* Para novas imagens que você enviar a partir de agora, o sistema usará um cache automático que evita esse erro localmente!
              </p>
            </div>
          )}

          {!circular && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-retro font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                Proporção da Imagem
              </span>
              <div className="grid grid-cols-4 gap-2 p-1 bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl">
                {[
                  { id: 'original', label: 'Original' },
                  { id: '1:1', label: '1:1 (Quad)' },
                  { id: '16:9', label: '16:9 (Ret)' },
                  { id: '4:5', label: '4:5 (Vert)' }
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setCurrentAspectSetting(a.id as any)}
                    className={cn(
                      "py-2 text-[10px] font-retro font-bold uppercase rounded-xl transition-all",
                      currentAspectSetting === a.id
                        ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    )}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              className="flex-1 py-3 px-6 rounded-xl font-retro font-bold uppercase border-4 border-black hover:bg-black/10 transition-all dark:text-white"
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
