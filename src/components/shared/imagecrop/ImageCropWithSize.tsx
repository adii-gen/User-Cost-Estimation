import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

interface ImageCropperProps {
  onImageCropped: (croppedImage: string) => void;
  type: "logo" | "cover";
  fixedWidth?: number;  // Optional fixed width for the crop
  fixedHeight?: number; // Optional fixed height for the crop
}

const ImageCropper = ({ onImageCropped, type, fixedWidth, fixedHeight }: ImageCropperProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Determine if we're using fixed size mode
  const isFixedSize = Boolean(fixedWidth && fixedHeight);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          setSrc(reader.result);
          setIsDialogOpen(true);
          // Reset crop when new image is selected
          setCrop(undefined);
          setCompletedCrop(null);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    
    // Initial crop after image load
    if (isFixedSize) {
      // Center the crop initially
      const x = Math.max(0, (width - fixedWidth!) / 2);
      const y = Math.max(0, (height - fixedHeight!) / 2);
      
      const initialCrop: Crop = {
        unit: 'px',
        x: x,
        y: y,
        width: Math.min(fixedWidth!, width),
        height: Math.min(fixedHeight!, height)
      };
      
      setCrop(initialCrop);
    } else {
      setCrop({
        unit: 'px',
        x: 0,
        y: 0,
        width: width,
        height: height
      });
    }
  };

  const getCroppedImage = () => {
    if (!imageRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    // Set canvas size to the crop dimensions
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the selected portion of the image onto the canvas
    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const handleSaveCrop = () => {
    if (!completedCrop) return;
    
    const croppedImageUrl = getCroppedImage();
    if (croppedImageUrl) {
      onImageCropped(croppedImageUrl);
      setIsDialogOpen(false);
      setSrc(null);
      setCrop(undefined);
      setCompletedCrop(null);
      toast({
        title: "Image cropped successfully",
        variant: "default",
      });
    }
  };

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
      />

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setSrc(null);
          setCrop(undefined);
          setCompletedCrop(null);
        }
      }}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Crop {type === "logo" ? "Logo" : "Cover"} Image 
              {isFixedSize && ` (${fixedWidth}x${fixedHeight})`}
            </DialogTitle>
          </DialogHeader>
          {src && (
            <div className="flex flex-col gap-4">
              <div className="overflow-auto max-h-[70vh]">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => {
                    if (isFixedSize) {
                      // For fixed size, enforce dimensions
                      setCrop({
                        ...c,
                        width: Math.min(fixedWidth!, imageRef.current?.width || 0),
                        height: Math.min(fixedHeight!, imageRef.current?.height || 0),
                      });
                    } else {
                      setCrop(c);
                    }
                  }}
                  onComplete={(c) => {
                    setCompletedCrop(c);
                  }}
                  aspect={isFixedSize ? fixedWidth! / fixedHeight! : undefined}
                  minWidth={isFixedSize ? Math.min(fixedWidth!, imageRef.current?.width || 0) : undefined}
                  minHeight={isFixedSize ? Math.min(fixedHeight!, imageRef.current?.height || 0) : undefined}
                  maxWidth={isFixedSize ? Math.min(fixedWidth!, imageRef.current?.width || 0) : undefined}
                  maxHeight={isFixedSize ? Math.min(fixedHeight!, imageRef.current?.height || 0) : undefined}
                  locked={isFixedSize}
                >
                  <img
                    ref={imageRef}
                    src={src}
                    alt="Crop me"
                    onLoad={onImageLoad}
                    style={{ maxWidth: '100%' }}
                  />
                </ReactCrop>
              </div>
              {isFixedSize && (
                <div className="text-sm text-gray-500">
                  Move the crop box to select the desired area. Size is fixed at {fixedWidth}x{fixedHeight}.
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSrc(null);
                    setCrop(undefined);
                    setCompletedCrop(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveCrop}
                  disabled={!completedCrop}
                >
                  Save Crop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageCropper;