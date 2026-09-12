import { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';

const STORAGE_KEY = 'rajdeep_real_owner_photo_data';
const NAME_STORAGE_KEY = 'rajdeep_real_owner_photo_filename';
const EVENT_KEY = 'rajdeep_owner_photo_update';
const DB_NAME = 'rajdeep_store_db';
const DB_STORE = 'photos';
const DB_KEY = 'real_owner_photo';

// Helper to interact with IndexedDB for storing full-resolution uncompressed photos
function getIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePhotoToIDB(dataUrl: string, fileName?: string): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.put({ dataUrl, fileName, timestamp: Date.now() }, DB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IDB save error:', e);
  }
}

async function getPhotoFromIDB(): Promise<{ dataUrl: string; fileName?: string } | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.get(DB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function clearPhotoFromIDB(): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.delete(DB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

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

  const [photoFileName, setPhotoFileName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(NAME_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [isCustomRealPhoto, setIsCustomRealPhoto] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // Check IndexedDB on mount in case image was too large for localStorage
  useEffect(() => {
    let isMounted = true;
    getPhotoFromIDB().then((res) => {
      if (res && res.dataUrl && isMounted) {
        setPhotoUrl(res.dataUrl);
        setPhotoFileName(res.fileName || null);
        setIsCustomRealPhoto(true);
      }
    });

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const name = localStorage.getItem(NAME_STORAGE_KEY);
        if (saved) {
          setPhotoUrl(saved);
          setPhotoFileName(name);
          setIsCustomRealPhoto(true);
        } else {
          getPhotoFromIDB().then((res) => {
            if (res && res.dataUrl && isMounted) {
              setPhotoUrl(res.dataUrl);
              setPhotoFileName(res.fileName || null);
              setIsCustomRealPhoto(true);
            } else if (isMounted) {
              setPhotoUrl(COMPANY_INFO.ownerImage);
              setPhotoFileName(null);
              setIsCustomRealPhoto(false);
            }
          });
        }
      } catch {
        setPhotoUrl(COMPANY_INFO.ownerImage);
        setPhotoFileName(null);
        setIsCustomRealPhoto(false);
      }
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
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
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          reject(new Error('Failed to read file.'));
          return;
        }

        const fileName = file.name || 'WhatsApp Image';

        // Save uncompressed to IndexedDB first (no 5MB quota issue)
        await savePhotoToIDB(dataUrl, fileName);

        // Also attempt localStorage for synchronous fast restore
        try {
          localStorage.setItem(STORAGE_KEY, dataUrl);
          localStorage.setItem(NAME_STORAGE_KEY, fileName);
        } catch {
          // localStorage quota exceeded, IndexedDB already holds it safely
          try {
            localStorage.setItem(NAME_STORAGE_KEY, fileName);
          } catch {
            // ignore
          }
        }

        setPhotoUrl(dataUrl);
        setPhotoFileName(fileName);
        setIsCustomRealPhoto(true);
        window.dispatchEvent(new Event(EVENT_KEY));
        resolve(true);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const resetToDefault = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(NAME_STORAGE_KEY);
      await clearPhotoFromIDB();
      setPhotoUrl(COMPANY_INFO.ownerImage);
      setPhotoFileName(null);
      setIsCustomRealPhoto(false);
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // ignore
    }
  };

  return {
    photoUrl,
    photoFileName,
    isCustomRealPhoto,
    uploadPhoto,
    resetToDefault,
  };
}
