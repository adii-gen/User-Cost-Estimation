import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ImageCropper from './imagecrop/Imagecrop';
// import { ImageCropper } from './ImageCropper'; // Assuming you have this component

interface ServiceCategoryFormData {
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
}

const initialFormData: ServiceCategoryFormData = {
  name: '',
  logo: '',
  description: '',
  isActive: true,
};

export default function ServiceCategoryForm() {
  const [formData, setFormData] = useState<ServiceCategoryFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleCroppedImage = (croppedImage: string) => {
    setFormData((prev) => ({
      ...prev,
      logo: croppedImage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/serviceCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create service category');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Service category created successfully',
      });
      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create service category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Service Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-3">
            <Label>Logo Image</Label>
            <div className="relative">
              <ImageCropper
                onImageCropped={(croppedImage) => handleCroppedImage(croppedImage)}
              
                type="logo"
              />
              {formData.logo && (
                <div className="mt-4 relative group">
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-32 h-32 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={4}
            />
          </div>

          {/* <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Active</Label>
          </div> */}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}