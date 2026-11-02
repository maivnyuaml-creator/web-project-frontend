'use client';

import React, { useState, useRef } from 'react';
import { CreatorLayout } from '@/components/layout/CreatorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { CreatorMediaItem } from '@/types';
import { Image as ImageIcon, Video, Plus, Lock, CheckCircle2, Clock, Trash2, UploadCloud, X, FileCheck } from 'lucide-react';

const INITIAL_MEDIA: CreatorMediaItem[] = [
  {
    id: 'med-1',
    creatorId: 'c-aurora',
    title: 'Cyberpunk Neon Studio Photoset',
    type: 'PHOTO',
    previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    priceTokens: 150,
    isUnlocked: false,
    reviewStatus: 'APPROVED',
    createdAt: '2026-10-20',
  },
  {
    id: 'med-2',
    creatorId: 'c-aurora',
    title: 'Cosplay Backstage 4K Clip',
    type: 'VIDEO',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    priceTokens: 250,
    isUnlocked: false,
    reviewStatus: 'APPROVED',
    createdAt: '2026-10-18',
  },
  {
    id: 'med-3',
    creatorId: 'c-aurora',
    title: 'Tokyo Nocturne Teaser Reel',
    type: 'VIDEO',
    previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    priceTokens: 180,
    isUnlocked: false,
    reviewStatus: 'PENDING',
    createdAt: '2026-10-22',
  },
];

export default function CreatorMediaPage() {
  const { toast } = useToast();
  const [mediaList, setMediaList] = useState<CreatorMediaItem[]>(INITIAL_MEDIA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [priceTokens, setPriceTokens] = useState('150');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const processFile = (file: File) => {
    // 2GB max limit
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast({
        type: 'error',
        title: 'File Too Large',
        message: 'File size exceeds maximum supported limit of 2GB.',
      });
      return;
    }

    setSelectedFile(file);

    // Auto-detect media type and generate preview
    if (file.type.startsWith('video/')) {
      setType('VIDEO');
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    } else if (file.type.startsWith('image/')) {
      setType('PHOTO');
      if (filePreview) URL.revokeObjectURL(filePreview);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      if (!previewUrl) {
        setPreviewUrl(url);
      }
    }

    // Auto-populate title if empty
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      if (cleanName) {
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }

    toast({
      type: 'success',
      title: 'File Attached',
      message: `${file.name} (${formatFileSize(file.size)}) is ready for upload.`,
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClickDropZone = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setIsDragging(false);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ type: 'error', title: 'Title Required', message: 'Please provide a title for the media item.' });
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newItem: CreatorMediaItem = {
        id: `med-${Date.now()}`,
        creatorId: 'c-aurora',
        title: title.trim(),
        type,
        previewUrl: previewUrl.trim() || filePreview || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80',
        priceTokens: parseInt(priceTokens, 10) || 100,
        isUnlocked: false,
        reviewStatus: 'PENDING',
        createdAt: 'Just now',
      };
      setMediaList([newItem, ...mediaList]);
      setIsUploading(false);
      handleCloseDialog();
      setTitle('');
      setPreviewUrl('');
      toast({
        type: 'success',
        title: 'Media Uploaded',
        message: 'Your file has been queued for 2257 compliance and review.',
      });
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
    toast({ type: 'info', title: 'Media Deleted', message: 'Item removed from your vault.' });
  };

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Creator Media Vault (Pay-Per-View)
            </h2>
            <p className="text-xs text-zinc-400">
              Upload exclusive photosets and video clips for token unlock. All content is screened for 2257 compliance.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Upload Media
          </Button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0f0f18] border border-zinc-800/80 overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                <img src={item.previewUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant={item.type === 'VIDEO' ? 'purple' : 'fuchsia'}>
                    {item.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={item.reviewStatus === 'APPROVED' ? 'success' : 'warning'}>
                    {item.reviewStatus}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                    🪙 {item.priceTokens}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500 text-[11px]">{item.createdAt}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title="Upload Media to Vault"
        description="Set token price and upload high-resolution media."
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <Input
            label="Media Title"
            placeholder="e.g. VIP Photoset #5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'PHOTO' | 'VIDEO')}
                className="w-full bg-[#12121c] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="PHOTO">Photo Set</option>
                <option value="VIDEO">Video Clip</option>
              </select>
            </div>

            <Input
              label="Token Unlock Price"
              type="number"
              min="10"
              value={priceTokens}
              onChange={(e) => setPriceTokens(e.target.value)}
              required
            />
          </div>

          <Input
            label="Preview Image URL"
            placeholder="https://... (or choose a file below)"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
          />

          {/* Hidden File Input for Native File Picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Interactive Drag and Drop Area */}
          {!selectedFile ? (
            <div
              onClick={handleClickDropZone}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClickDropZone();
                }
              }}
              className={`p-6 rounded-2xl border border-dashed transition-all duration-200 text-center space-y-2 cursor-pointer outline-none select-none group ${
                isDragging
                  ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50 scale-[1.01]'
                  : 'border-zinc-700 bg-zinc-900/50 hover:border-purple-500/60 hover:bg-purple-950/20'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-200 ${
                  isDragging
                    ? 'bg-purple-500/30 text-purple-200 scale-110'
                    : 'bg-purple-950/60 text-purple-400 group-hover:scale-110'
                }`}
              >
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-zinc-200">
                {isDragging ? 'Drop file here to upload' : 'Drag and drop file or choose media to upload'}
              </p>
              <span className="text-[10px] text-zinc-500 block">
                Supports JPG, PNG, WEBP, MP4, MOV (up to 2GB)
              </span>
              <span className="inline-block text-[11px] font-medium text-purple-400 group-hover:text-purple-300 underline underline-offset-2 pt-0.5">
                Browse files from computer
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-purple-500/40 bg-[#12121e] flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-xl border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    {type === 'VIDEO' ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[240px]">
                      {selectedFile.name}
                    </p>
                    <Badge variant="success">READY</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {formatFileSize(selectedFile.size)} • {type === 'VIDEO' ? 'Video' : 'Image'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleClickDropZone}
                  className="px-2.5 py-1 text-[11px] font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove file"
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUploading}>
              Upload & Submit
            </Button>
          </div>
        </form>
      </Dialog>
    </CreatorLayout>
  );
}
