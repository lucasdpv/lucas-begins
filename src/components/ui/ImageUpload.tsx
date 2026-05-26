import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, Loader2, Link as LinkIcon, Image as ImageIcon, Crop } from 'lucide-react';
import { uploadFile, cacheOriginalImage, getCachedOriginalImage } from '../../services/uploadService';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/useThemeStore';

import ImageCropper from './ImageCropper';
import imageCompression from 'browser-image-compression';
interface ImageUploadProps {
  onUploadComplete: (url: string, aspect?: 'original' | '1:1' | '16:9' | '4:5', originalUrl?: string) => void;
  initialValue?: string;
  originalUrl?: string;
  folder?: string;
  label?: string;
  className?: string;
  aspect?: number | 'original' | '1:1' | '16:9' | '4:5';
  circular?: boolean;
}

type UploadMode = 'file' | 'url';

export default function ImageUpload({ 
  onUploadComplete, 
  initialValue = "", 
  originalUrl: initialOriginalUrl = "",
  folder = "uploads",
  label = "Imagem de Capa",
  className,
  aspect = 'original',
  circular = false
}: ImageUploadProps) {
  const { isDark } = useThemeStore();
  const [preview, setPreview] = useState<string>(initialValue);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<UploadMode>(initialValue && !initialValue.includes('firebasestorage') ? 'url' : 'file');
  const [dragActive, setDragActive] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalUrl, setOriginalUrl] = useState<string>(initialOriginalUrl);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  React.useEffect(() => {
    setOriginalUrl(initialOriginalUrl);
  }, [initialOriginalUrl]);

  const aspectClass = 
    circular ? "aspect-square w-full" :
    aspect === '1:1' ? "aspect-square w-full" :
    aspect === '16:9' ? "aspect-video w-full" :
    aspect === '4:5' ? "aspect-[4/5] w-full" :
    "aspect-auto min-h-[160px] w-full";

  const handleFileSelection = (file: File) => {
    if (!file) return;
    setOriginalFile(file);
    setOriginalUrl("");
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = async (blob: Blob, chosenAspect: 'original' | '1:1' | '16:9' | '4:5') => {
    setImageToCrop(null);
    setIsUploading(true);
    setProgress(0);

    try {
      let currentOriginalUrl = originalUrl;

      // Upload original file if a new local file is selected
      if (originalFile) {
        const originalFileName = `${Date.now()}-original.webp`;
        const originalOptions = {
          maxSizeMB: 3,
          maxWidthOrHeight: 2560,
          useWebWorker: true,
          initialQuality: 0.9,
          fileType: 'image/webp' as any
        };
        const compressedOriginal = await imageCompression(originalFile, originalOptions);
        
        currentOriginalUrl = await uploadFile(compressedOriginal, `${folder}/${originalFileName}`, () => {});
        // Cache the original file blob in IndexedDB under the uploaded URL
        await cacheOriginalImage(currentOriginalUrl, originalFile);
        setOriginalUrl(currentOriginalUrl);
        setOriginalFile(null);
      }

      // Opções de compressão - WebP suporta transparência e compressão alta
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: 'image/webp' as any // Força saída em WebP para manter transparência
      };

      // Tenta manter o tipo original se possível, ou vai para webp
      const outputType = blob.type === 'image/png' ? 'image/png' : 'image/webp';
      const imageFile = new File([blob], `upload.${outputType.split('/')[1]}`, { type: outputType });
      
      // Comprimir
      const compressedFile = await imageCompression(imageFile, options);
      
      const fileName = `${Date.now()}-compressed.webp`;
      const downloadUrl = await uploadFile(compressedFile, `${folder}/${fileName}`, (p) => {
        setProgress(Math.round(p));
      });
      
      onUploadComplete(downloadUrl, chosenAspect, currentOriginalUrl);
      setPreview(downloadUrl);
    } catch (error) {
      console.error("Upload/Compression failed", error);
      alert("Falha ao processar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    setOriginalUrl("");
    setOriginalFile(null);
    onUploadComplete("", undefined, "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Cropper Modal */}
      {imageToCrop && (
        <ImageCropper 
          image={imageToCrop}
          aspect={
            aspect === 1 ? '1:1' :
            aspect === 16/9 ? '16:9' :
            aspect === 4/5 ? '4:5' :
            (aspect === 'original' || aspect === '1:1' || aspect === '16:9' || aspect === '4:5') ? aspect :
            'original'
          }
          circular={circular}
          onCropComplete={handleCroppedImage}
          onCancel={() => setImageToCrop(null)}
        />
      )}
      <div className="flex items-center justify-between">
        <label className="text-xs font-retro font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
          <Camera className="w-4 h-4 text-purple-500" /> {label}
        </label>
        
        <div className="flex p-0.5 bg-black/20 rounded-lg border border-black/10">
          <button 
            type="button"
            onClick={() => setMode('file')}
            className={cn(
              "px-3 py-1 text-[9px] font-retro font-bold uppercase transition-all rounded-md",
              mode === 'file' ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Upload
          </button>
          <button 
            type="button"
            onClick={() => setMode('url')}
            className={cn(
              "px-3 py-1 text-[9px] font-retro font-bold uppercase transition-all rounded-md",
              mode === 'url' ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
            )}
          >
            URL
          </button>
        </div>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => mode === 'file' && !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative group transition-all duration-300 border-2 rounded-xl flex flex-col items-center justify-center overflow-hidden",
          aspectClass,
          isDark ? "bg-gray-900/50 border-gray-700" : "bg-snes-input border-snes-dark",
          mode === 'file' && "cursor-pointer hover:border-purple-500",
          dragActive && "border-purple-500 bg-purple-500/10 scale-[1.01]",
          isUploading && "cursor-wait"
        )}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        {preview ? (
          <div className="w-full h-full absolute inset-0 animate-in fade-in duration-500">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {/* Overlay de Ações (Aparece no Hover) */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
              {mode === 'file' ? (
                <div className="flex gap-4">
                  <div className="bg-purple-600 p-2.5 rounded-lg border-2 border-black/20 shadow-lg text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                  <button 
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      let targetImage = originalUrl || preview;
                      if (originalUrl) {
                        const cachedBlob = await getCachedOriginalImage(originalUrl);
                        if (cachedBlob) {
                          targetImage = URL.createObjectURL(cachedBlob);
                        }
                      }
                      setImageToCrop(targetImage);
                    }} 
                    className="bg-blue-600 p-2.5 rounded-lg border-2 border-black/20 shadow-lg hover:bg-blue-700 transition-colors text-white"
                    title="Ajustar Recorte"
                  >
                    <Crop className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={removeImage} 
                    className="bg-red-500 p-2.5 rounded-lg border-2 border-black/20 shadow-lg hover:bg-red-600 transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-md px-6 space-y-3">
                   <div className="flex items-center gap-2 bg-black/80 p-2 rounded-xl border border-white/20">
                      <LinkIcon className="w-4 h-4 text-purple-400 ml-2" />
                      <input 
                        type="url"
                        value={preview}
                        onChange={(e) => { setPreview(e.target.value); onUploadComplete(e.target.value); }}
                        className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono py-1"
                        placeholder="Mudar URL..."
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button 
                        type="button"
                        onClick={removeImage} 
                        className="p-1.5 hover:text-red-400 transition-colors text-white/60"
                      >
                        <X className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              )}
              <p className="text-[10px] font-retro font-bold uppercase tracking-widest text-white/60">
                {mode === 'file' ? "Clique para trocar arquivo" : "Editando link direto"}
              </p>
            </div>

            {/* No modo URL, mantemos o input visível se não houver hover, ou apenas mostramos a imagem? */}
            {mode === 'url' && (
              <div className="absolute bottom-3 left-3 right-3 z-10 group-hover:hidden transition-all">
                <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] text-white/80 truncate font-mono">{preview}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="w-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
            {mode === 'file' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-retro text-xs font-bold uppercase tracking-widest">Enviar Arquivo</p>
                  <p className="text-[10px] opacity-40 font-medium mt-1">Arraste ou clique para selecionar</p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-4">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="font-retro text-xs font-bold uppercase tracking-widest">Vincular via URL</p>
                </div>
                <div className="flex items-center gap-2 bg-black/10 dark:bg-black/40 p-1.5 rounded-xl border border-black/10 focus-within:border-purple-500/50 transition-all">
                  <input 
                    type="url"
                    placeholder="https://exemplo.com/imagem.png"
                    value={preview}
                    onChange={(e) => { setPreview(e.target.value); onUploadComplete(e.target.value); }}
                    className={cn(
                      "flex-1 p-2 bg-transparent border-none outline-none text-xs font-mono",
                      isDark ? "text-white" : "text-black"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="pr-2">
                    <CheckCircle className={cn("w-4 h-4 transition-colors", preview ? "text-green-500" : "text-gray-500/20")} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Barra de Progresso */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-500" />
            <div className="w-2/3 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-retro text-[9px] font-bold uppercase mt-3 tracking-widest">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
