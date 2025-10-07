// Admin screen for camera testing and configuration
import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import {
  loadCameraSettings,
  saveCameraSettings,
  resetCameraSettings,
  applyCameraSettings,
  type CameraSettings,
} from '@/lib/camera-settings';
import {
  loadAppSettings,
  saveAppSettings,
  type AppSettings,
} from '@/lib/app-settings';
import { getElectronAPI } from '@/lib/electron-api';

interface AdminScreenProps {
  onExit: () => void;
}

export const AdminScreen = ({ onExit }: AdminScreenProps) => {
  const { videoRef, cameraStream, error, isLoading } = useCamera();
  const [showDebug, setShowDebug] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Load saved settings on mount
  const [settings, setSettings] = useState<CameraSettings>(() => loadCameraSettings());
  const [appSettings, setAppSettings] = useState<AppSettings>(() => loadAppSettings());
  
  // Destructure for easier access
  const { zoom, brightness, contrast, saturation, cropX, cropY, rotation } = settings;
  const { filenamePrefix, saveFolderPath } = appSettings;

  // Apply filters to video
  useEffect(() => {
    applyCameraSettings(videoRef.current, settings);
  }, [settings, videoRef]);

  const updateSetting = <K extends keyof CameraSettings>(
    key: K,
    value: CameraSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle'); // Reset save status when settings change
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    saveCameraSettings(settings);
    saveAppSettings(appSettings);
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  };

  const handleResetSettings = () => {
    const defaults = resetCameraSettings();
    setSettings(defaults);
    setSaveStatus('idle');
  };

  const handleSelectFolder = async () => {
    const { selectFolder } = await import('@/lib/electron-api');
    const folderPath = await selectFolder();
    
    if (folderPath) {
      setAppSettings(prev => ({ ...prev, saveFolderPath: folderPath }));
      setSaveStatus('idle');
      alert(`Folder selected: ${folderPath}\n\nDon't forget to click "Save Settings"!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <Button variant="secondary" onClick={onExit}>
            Exit to App
          </Button>
        </div>

        {/* Camera Test */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Camera Test</h2>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </button>
          </div>

          {/* Camera Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="font-medium">Status:</span>
              {isLoading && (
                <span className="text-yellow-400">⏳ Initializing...</span>
              )}
              {!isLoading && cameraStream && (
                <span className="text-green-400">✅ Camera Active</span>
              )}
              {!isLoading && error && (
                <span className="text-red-400">❌ Camera Error</span>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Camera Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain transition-all duration-200"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                transform: `scale(${zoom}) translateX(${cropX}%) translateY(${cropY}%) rotate(${rotation}deg) scaleX(-1)`,
              }}
            />
            {!cameraStream && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-xl">No camera feed</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold">Camera Controls</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSettings}
                  disabled={saveStatus === 'saving'}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    saveStatus === 'saved'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } disabled:opacity-50`}
                >
                  {saveStatus === 'saving' && '💾 Saving...'}
                  {saveStatus === 'saved' && '✅ Saved!'}
                  {saveStatus === 'idle' && '💾 Save Settings'}
                </button>
                <button
                  onClick={handleResetSettings}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zoom */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Zoom: {zoom.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => updateSetting('zoom', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Brightness */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={brightness}
                  onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={contrast}
                  onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Saturation: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={saturation}
                  onChange={(e) => updateSetting('saturation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Horizontal Position */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Horizontal Position: {cropX > 0 ? '+' : ''}{cropX}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={cropX}
                  onChange={(e) => updateSetting('cropX', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Vertical Position */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vertical Position: {cropY > 0 ? '+' : ''}{cropY}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={cropY}
                  onChange={(e) => updateSetting('cropY', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Rotation */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => updateSetting('rotation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Filename Prefix */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Filename Prefix
                </label>
                <input
                  type="text"
                  value={filenamePrefix}
                  onChange={(e) => {
                    setAppSettings(prev => ({ ...prev, filenamePrefix: e.target.value }));
                    setSaveStatus('idle');
                  }}
                  placeholder="photobooth"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Files will be saved as: {filenamePrefix || 'photobooth'}-[timestamp].jpg
                </p>
              </div>

              {/* Save Folder Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Save Folder Location
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectFolder}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-all"
                  >
                    📁 Select Folder
                  </button>
                  {saveFolderPath && (
                    <button
                      onClick={() => {
                        setAppSettings(prev => ({ ...prev, saveFolderPath: '' }));
                        setSaveStatus('idle');
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {saveFolderPath ? (
                    <>✓ Saving to: <strong>{saveFolderPath}</strong></>
                  ) : (
                    <>No folder selected - files will download to Downloads folder</>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      brightness: 110,
                      contrast: 110,
                      saturation: 120,
                    }));
                    setSaveStatus('idle');
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm"
                >
                  Vibrant
                </button>
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      brightness: 90,
                      contrast: 120,
                      saturation: 90,
                    }));
                    setSaveStatus('idle');
                  }}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm"
                >
                  Moody
                </button>
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      brightness: 120,
                      contrast: 95,
                      saturation: 110,
                    }));
                    setSaveStatus('idle');
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm"
                >
                  Bright
                </button>
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      brightness: 100,
                      contrast: 100,
                      saturation: 0,
                    }));
                    setSaveStatus('idle');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
                >
                  B&W
                </button>
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      brightness: 105,
                      contrast: 105,
                      saturation: 130,
                    }));
                    setSaveStatus('idle');
                  }}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm"
                >
                  Pop
                </button>
              </div>
            </div>

            {/* Save Status Info */}
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <h4 className="text-sm font-bold mb-2">💾 Settings Management</h4>
              <p className="text-sm text-green-200">
                Click <strong>"Save Settings"</strong> to persist your camera adjustments. 
                Settings are automatically applied to all camera views in the app.
              </p>
              {saveStatus === 'saved' && (
                <p className="text-sm text-green-300 mt-2 font-medium">
                  ✅ Settings saved successfully! They will be applied throughout the app.
                </p>
              )}
            </div>
          </div>

          {/* Debug Info */}
          {showDebug && cameraStream && (
            <div className="bg-gray-900 rounded-lg p-4 space-y-2 text-sm font-mono">
              <h3 className="text-lg font-bold mb-2">Debug Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Device ID:</span>
                  <p className="break-all">{cameraStream.deviceId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Track State:</span>
                  <p>{cameraStream.videoTrack.readyState}</p>
                </div>
                <div>
                  <span className="text-gray-400">Track Enabled:</span>
                  <p>{cameraStream.videoTrack.enabled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Track Muted:</span>
                  <p>{cameraStream.videoTrack.muted ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {/* Video Settings */}
              <div className="mt-4">
                <span className="text-gray-400">Video Settings:</span>
                <pre className="mt-2 bg-black/50 rounded p-2 overflow-auto">
                  {JSON.stringify(cameraStream.videoTrack.getSettings(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">📋 Setup Instructions</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Verify camera feed is visible and centered</li>
            <li>Adjust zoom, brightness, contrast, and saturation</li>
            <li>Position camera with horizontal/vertical controls</li>
            <li>Test lighting conditions with different presets</li>
            <li>Copy settings to apply to capture screen (see export above)</li>
            <li>Ensure camera remains active (no interruptions)</li>
            <li>Click "Exit to App" when ready</li>
          </ol>
          <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500 rounded">
            <p className="text-sm">
              <strong>🔐 Admin Access:</strong> Tap the Vita Coco logo <strong>10 times</strong> quickly on the welcome screen
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold">System Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Browser:</span>
              <p>{navigator.userAgent}</p>
            </div>
            <div>
              <span className="text-gray-400">Platform:</span>
              <p>{navigator.platform}</p>
            </div>
            <div>
              <span className="text-gray-400">Screen:</span>
              <p>{window.screen.width} × {window.screen.height}</p>
            </div>
            <div>
              <span className="text-gray-400">Viewport:</span>
              <p>{window.innerWidth} × {window.innerHeight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

