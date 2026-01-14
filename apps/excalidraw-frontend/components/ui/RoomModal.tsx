import React, { useState } from 'react';
import { X, Users, Lock, Globe, Copy, Check } from 'lucide-react';

export default function RoomModal({setIsModal}: { setIsModal: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [isOpen, setIsOpen] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const generatedLink = 'https://sketchflow.app/room/abc-xyz-123';

  const handleCreate = () => {
    if (roomName.trim()) {
      setRoomCreated(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border-2 border-gray-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {roomCreated ? 'Room Created!' : 'Create Room'}
            </h2>
          </div>
          <button
            onClick={() => setIsModal(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {!roomCreated ? (
          <div className="p-6 space-y-6">
            {/* Room Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Privacy
              </label>
              
              <div className="space-y-2">
                <button
                  onClick={() => setIsPrivate(false)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    !isPrivate
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      !isPrivate ? 'border-gray-900' : 'border-gray-300'
                    }`}>
                      {!isPrivate && (
                        <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" strokeWidth={2.5} />
                        <span className="font-medium">Public</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Anyone with the link can join
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setIsPrivate(true)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    isPrivate
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      isPrivate ? 'border-gray-900' : 'border-gray-300'
                    }`}>
                      {isPrivate && (
                        <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" strokeWidth={2.5} />
                        <span className="font-medium">Private</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Requires password to access
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!roomName.trim()}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  roomName.trim()
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Room
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Success Message */}
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 mb-2">Your room is ready!</p>
              <h3 className="text-xl font-bold">{roomName}</h3>
            </div>

            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Share this link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" strokeWidth={2.5} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Privacy:</span>
                <div className="flex items-center space-x-1 font-medium">
                  {isPrivate ? (
                    <>
                      <Lock className="w-4 h-4" strokeWidth={2.5} />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" strokeWidth={2.5} />
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Members:</span>
                <span className="font-medium">1 (You)</span>
              </div>
            </div>

            {/* Enter Room Button */}
            <button
              onClick={() => setIsModal(false)}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Enter Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}