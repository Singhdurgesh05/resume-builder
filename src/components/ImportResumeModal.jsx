import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { importResumeFile, validateResumeData } from "../services/fileParserService";

export default function ImportResumeModal({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [resumeName, setResumeName] = useState("");
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidType = validTypes.includes(selectedFile.type) ||
                       validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidType) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setParsedData(null);
    setWarnings([]);

    try {
      // Parse the file
      const result = await importResumeFile(selectedFile);

      if (!result.success) {
        setError(result.error);
        setFile(null);
        return;
      }

      // Validate the parsed data
      const validation = validateResumeData(result.data);
      setParsedData(result.data);
      setWarnings(validation.warnings);

      // Set default resume name from file name
      const defaultName = selectedFile.name.replace(/\.(pdf|docx|txt)$/i, '');
      setResumeName(defaultName);

      if (!validation.isValid) {
        setError("Warning: Some resume sections could not be detected. You can edit them manually after import.");
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process file. Please try again.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleImport = async () => {
    if (!parsedData || !resumeName.trim()) return;

    try {
      setIsSubmitting(true);
      await onImport({
        name: resumeName,
        data: parsedData
      });
      handleClose();
    } catch (err) {
      console.error("Failed to import resume:", err);
      setError(err.message || "Failed to import resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setWarnings([]);
    setResumeName("");
    setIsProcessing(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-green-700/20 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-2">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Import Resume</h2>
                <p className="text-sm text-emerald-400 mt-1">
                  Upload your existing resume to auto-fill the editor
                </p>
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* File Upload Area */}
          {!parsedData && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader className="w-12 h-12 text-emerald-500 animate-spin" />
                  <p className="text-gray-400">Processing your resume...</p>
                </div>
              ) : (
                <>
                  <div className="bg-emerald-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Drop your resume here
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all duration-200 font-medium"
                  >
                    Choose File
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, DOCX, TXT (Max 10MB)
                  </p>
                </>
              )}
            </div>
          )}

          {/* Parsed Data Preview */}
          {parsedData && (
            <div className="space-y-4">
              {/* Resume Name Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FileText size={16} />
                  Resume Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Enter resume name"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                />
              </div>

              {/* Success Message */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-emerald-400 mb-1">
                      Resume Parsed Successfully
                    </h4>
                    <p className="text-xs text-gray-400">
                      Your resume has been analyzed. Review the detected information below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Detected Information Summary */}
              <div className="bg-gray-800/40 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">Detected Information:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={parsedData.name ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.name ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">Name: {parsedData.name || "Not found"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={parsedData.email ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.email ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">Email: {parsedData.email || "Not found"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={parsedData.phone ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.phone ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">Phone: {parsedData.phone || "Not found"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={parsedData.experience.length > 0 ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.experience.length > 0 ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">
                      Experience: {parsedData.experience.length} entries
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={parsedData.education.length > 0 ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.education.length > 0 ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">
                      Education: {parsedData.education.length} entries
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={parsedData.skills.length > 0 ? "text-emerald-400" : "text-gray-500"}>
                      {parsedData.skills.length > 0 ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400">
                      Skills: {parsedData.skills.length} found
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">
                        Missing Information
                      </h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {warnings.map((warning, i) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        You can add this information manually in the editor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Change File Button */}
              <button
                onClick={() => {
                  setParsedData(null);
                  setFile(null);
                  setWarnings([]);
                  setError(null);
                }}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                ← Upload a different file
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}
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
                onClick={handleImport}
                disabled={!parsedData || !resumeName.trim() || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
              >
                <Upload size={18} className={isSubmitting ? "animate-spin" : ""} />
                {isSubmitting ? "Importing..." : "Import Resume"}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
