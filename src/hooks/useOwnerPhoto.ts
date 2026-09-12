import { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';

const STORAGE_KEY = 'rajdeep_real_owner_photo_data';
const EVENT_KEY = 'rajdeep_owner_photo_update';

export function useOwnerPhoto() {
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return COMPANY_INFO.ownerImage;
  });

  const [isCustomRealPhoto, setIsCustomRealPhoto] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPhotoUrl(saved);
          setIsCustomRealPhoto(true);
        } else {
          setPhotoUrl(COMPANY_INFO.ownerImage);
          setIsCustomRealPhoto(false);
        }
      } catch {
        setPhotoUrl(COMPANY_INFO.ownerImage);
        setIsCustomRealPhoto(false);
      }
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const uploadPhoto = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          reject(new Error('Failed to read file.'));
          return;
        }

        try {
          localStorage.setItem(STORAGE_KEY, dataUrl);
          setPhotoUrl(dataUrl);
          setIsCustomRealPhoto(true);
          window.dispatchEvent(new Event(EVENT_KEY));
          resolve(true);
        } catch {
          // If file is very large for localStorage, compress slightly to fit localStorage
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1600;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedUrl = canvas.toDataURL('image/jpeg', 0.92);
              try {
                localStorage.setItem(STORAGE_KEY, compressedUrl);
                setPhotoUrl(compressedUrl);
                setIsCustomRealPhoto(true);
                window.dispatchEvent(new Event(EVENT_KEY));
                resolve(true);
              } catch (storageErr) {
                reject(storageErr);
              }
            } else {
              reject(new Error('Canvas context failed'));
            }
          };
          img.onerror = () => reject(new Error('Failed to load image for storage'));
          img.src = dataUrl;
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPhotoUrl(COMPANY_INFO.ownerImage);
      setIsCustomRealPhoto(false);
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // ignore
    }
  };

  return {
    photoUrl,
    isCustomRealPhoto,
    uploadPhoto,
    resetToDefault,
  };
}
