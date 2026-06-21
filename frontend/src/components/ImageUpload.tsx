import { useCallback, useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../lib/constants';
import { compressImage, fileToDataUrl } from '../lib/compress';
import { useI18n } from '../i18n/I18nProvider';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Props {
  imageFile: File | null;
  imagePreview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
}

export function ImageUpload({ imageFile, imagePreview, onChange }: Props) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(t('errors.fileFormat'));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t('errors.fileSize'));
        return;
      }
      setProcessing(true);
      try {
        const compressed = await compressImage(file);
        const preview = await fileToDataUrl(compressed);
        onChange(compressed, preview);
      } catch (e) {
        console.error(e);
        toast.error(t('errors.generic'));
      } finally {
        setProcessing(false);
      }
    },
    [onChange, t]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 text-accent-500" />
        <h3 className="font-display font-semibold text-lg">{t('upload.title')}</h3>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {imagePreview && imageFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group rounded-xl overflow-hidden bg-black/30"
        >
          <img src={imagePreview} alt="" className="w-full h-72 object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition text-white"
            aria-label="Remove"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-xs text-white/80 truncate">
              {imageFile.name} · {(imageFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`w-full h-72 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer
            ${dragOver ? 'border-accent-400 bg-accent-500/10' : 'border-[var(--border-strong)] hover:bg-[var(--bg-elev-strong)]'}`}
        >
          <div className="w-14 h-14 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
            {processing ? (
              <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-accent-500" />
            )}
          </div>
          <div className="text-center">
            <p className="font-medium">{t('upload.placeholder')}</p>
            <p className="text-sm text-fg-3 mt-1">{t('upload.formats')}</p>
          </div>
        </button>
      )}
    </div>
  );
}
