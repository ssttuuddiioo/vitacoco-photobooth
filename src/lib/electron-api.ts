// File system API bridge - works in both Electron and modern browsers

// Check if running in Electron
export const isElectron = (): boolean => {
  return !!(window as any).electron || typeof (window as any).require !== 'undefined';
};

// Check if browser supports File System Access API
export const supportsBrowserFileSystem = (): boolean => {
  return 'showDirectoryPicker' in window;
};

// Browser File System Access API implementation
let browserFolderHandle: FileSystemDirectoryHandle | null = null;

const selectFolderBrowser = async (): Promise<string | null> => {
  if (!supportsBrowserFileSystem()) {
    alert('Your browser does not support folder selection. Please use Chrome or Edge.');
    return null;
  }

  try {
    const handle = await (window as any).showDirectoryPicker({
      mode: 'readwrite'
    });
    browserFolderHandle = handle;
    return handle.name; // Return folder name as identifier
  } catch (error) {
    console.error('Folder selection cancelled or failed:', error);
    return null;
  }
};

const saveFileBrowser = async (filename: string, dataUrl: string): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  if (!browserFolderHandle) {
    return { success: false, error: 'No folder selected' };
  }

  try {
    // Create/get file handle
    const fileHandle = await browserFolderHandle.getFileHandle(filename, { create: true });
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Write file
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    
    return { success: true, filePath: `${browserFolderHandle.name}/${filename}` };
  } catch (error: any) {
    console.error('Failed to save file:', error);
    return { success: false, error: error.message };
  }
};

// Unified API that works in both Electron and Browser
export const selectFolder = async (): Promise<string | null> => {
  // Try Electron first
  if (isElectron()) {
    const electronAPI = (window as any).electron;
    if (electronAPI?.selectFolder) {
      return electronAPI.selectFolder();
    }
  }

  // Fallback to browser API
  return selectFolderBrowser();
};

export const saveFile = async (filename: string, dataUrl: string, electronFolderPath?: string): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  // Try Electron first
  if (isElectron() && electronFolderPath) {
    const electronAPI = (window as any).electron;
    if (electronAPI?.saveFile) {
      return electronAPI.saveFile({
        folderPath: electronFolderPath,
        filename,
        dataUrl,
      });
    }
  }

  // Fallback to browser API
  return saveFileBrowser(filename, dataUrl);
};

