import { useState } from "react";
import { FileText, X, Sparkles, FolderPlus, Zap } from "lucide-react";

export default function CreateResumeModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setIsCreating(true);
   //create a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    onCreate(name);
    setIsCreating(false);
    setName("");
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-green-700/20 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-2">
                <FolderPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Resume</h2>
                <p className="text-sm text-emerald-400 mt-1">Start building your professional profile</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FileText size={16} />
              Resume / Project Name
            </label>
            <input
              type="text"
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="e.g., Senior Frontend Developer Resume"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <p className="text-xs text-gray-400">
              Give your resume a descriptive name to easily identify it later
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-1">Pro Tip</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Include your target role in the name</li>
                  <li>• Use specific titles like "Tech Lead Resume"</li>
                  <li>• Add version numbers for multiple drafts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Template Suggestions */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              Popular Resume Types
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Software Engineer",
                "Product Manager", 
                "Data Scientist",
                "UX Designer"
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => setName(`${type} Resume`)}
                  className="p-2 text-xs bg-gray-800/40 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-all duration-200"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-800/40 border-t border-gray-800 p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus size={18} />
                  Create Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}