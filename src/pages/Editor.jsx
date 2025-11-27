import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Palette, Edit3, Save, ArrowLeft, Eye, Settings, Download, Share2 } from "lucide-react";
import ResumeEditor from "../components/Editor/ResumeEditor";
import ResumePreview from "../components/Editor/ResumePreview";
import sampleResume from "../data/sampleResume";
import { templateList } from "../templates";
import { getResumeById, updateResume } from "../services/resumeService";
import { exportToPDF } from "../services/pdfExportService";

const fontOptions = [
  { id: "inter", name: "Inter", description: "Modern sans-serif", stack: '"Inter", "Helvetica Neue", Arial, sans-serif' },
  { id: "lora", name: "Lora", description: "Elegant serif", stack: '"Lora", "Times New Roman", serif' },
  { id: "merriweather", name: "Merriweather", description: "Readable serif", stack: '"Merriweather", Georgia, serif' },
  { id: "playfair", name: "Playfair Display", description: "Editorial serif", stack: '"Playfair Display", "Times New Roman", serif' },
];

const colorPresets = [
  { id: "emerald", name: "Emerald", primary: "#059669", secondary: "#10b981" },
  { id: "blue", name: "Blue", primary: "#2563eb", secondary: "#3b82f6" },
  { id: "indigo", name: "Indigo", primary: "#4f46e5", secondary: "#6366f1" },
  { id: "purple", name: "Purple", primary: "#7c3aed", secondary: "#a855f7" },
  { id: "pink", name: "Pink", primary: "#db2777", secondary: "#ec4899" },
  { id: "red", name: "Red", primary: "#dc2626", secondary: "#ef4444" },
  { id: "orange", name: "Orange", primary: "#ea580c", secondary: "#f97316" },
  { id: "amber", name: "Amber", primary: "#d97706", secondary: "#f59e0b" },
  { id: "cyan", name: "Cyan", primary: "#0891b2", secondary: "#06b6d4" },
  { id: "teal", name: "Teal", primary: "#0d9488", secondary: "#14b8a6" },
  { id: "lime", name: "Lime", primary: "#65a30d", secondary: "#84cc16" },
  { id: "rose", name: "Rose", primary: "#e11d48", secondary: "#f43f5e" },
  { id: "violet", name: "Violet", primary: "#7c3aed", secondary: "#8b5cf6" },
  { id: "fuchsia", name: "Fuchsia", primary: "#c026d3", secondary: "#d946ef" },
  { id: "sky", name: "Sky", primary: "#0284c7", secondary: "#0ea5e9" },
  { id: "gray", name: "Gray", primary: "#4b5563", secondary: "#6b7280" },
];

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeId = location.state?.resumeId;

  const [resume, setResume] = useState(sampleResume);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [selectedFont, setSelectedFont] = useState(fontOptions[0].id);
  const [selectedColor, setSelectedColor] = useState(colorPresets[0].id);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const resumePreviewRef = useRef(null);

  // Load resume data if editing existing resume
  useEffect(() => {
    const loadResumeData = async () => {
      if (resumeId) {
        try {
          const data = await getResumeById(resumeId);

          // Only use sampleResume if content is explicitly null/undefined
          // Don't fallback to sample if content exists but is empty
          if (data.content && typeof data.content === 'object') {
            setResume(data.content);
          } else if (data.content === null || data.content === undefined) {
            setResume(sampleResume);
          } else {
            setResume(data.content || sampleResume);
          }

          setSelectedTemplate(data.template || "classic");
          setSelectedFont(data.font || fontOptions[0].id);
          setSelectedColor(data.color || colorPresets[0].id);
          setResumeTitle(data.title || "Untitled Resume");
        } catch (error) {
          console.error('Failed to load resume:', error);
          alert('Failed to load resume. Redirecting to dashboard...');
          navigate('/dashboard');
        }
      }
    };

    loadResumeData();
  }, [resumeId, navigate]);

  // Auto-save resume data to Supabase
  useEffect(() => {
    if (resumeId) {
      const saveTimer = setTimeout(async () => {
        try {
          setIsSaving(true);
          setSaveError(null);

          console.log('Auto-saving resume:', {
            resumeId,
            title: resumeTitle,
            hasContent: !!resume,
            contentKeys: resume ? Object.keys(resume) : []
          });

          await updateResume(resumeId, {
            title: resumeTitle,
            content: resume,
            template: selectedTemplate,
            font: selectedFont,
            color: selectedColor
          });
          setLastSaved(new Date());
          console.log('Auto-save successful');
        } catch (error) {
          console.error('Failed to auto-save resume:', error);
          setSaveError(error.message || 'Failed to save changes');
          // Clear error after 5 seconds
          setTimeout(() => setSaveError(null), 5000);
        } finally {
          setIsSaving(false);
        }
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(saveTimer);
    }
  }, [resume, selectedTemplate, selectedFont, selectedColor, resumeTitle, resumeId]);

  const fontFamily = useMemo(() => {
    const option = fontOptions.find((font) => font.id === selectedFont);
    return option?.stack || fontOptions[0].stack;
  }, [selectedFont]);

  const colorScheme = useMemo(() => {
    const preset = colorPresets.find((color) => color.id === selectedColor);
    return preset || colorPresets[0];
  }, [selectedColor]);

  const handleManualSave = async () => {
    if (resumeId) {
      try {
        setIsSaving(true);
        await updateResume(resumeId, {
          title: resumeTitle,
          content: resume,
          template: selectedTemplate,
          font: selectedFont,
          color: selectedColor
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save resume:', error);
        alert('Failed to save resume. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      // Get the resume preview element
      const previewElement = document.querySelector('[data-resume-preview="true"]');

      if (!previewElement) {
        alert('Resume preview not found. Please try again.');
        return;
      }

      // Generate filename from resume title
      const filename = `${resumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

      // Export to PDF
      const result = await exportToPDF(previewElement, filename);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('PDF exported successfully');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      // Create a shareable link or share options
      const shareData = {
        title: resumeTitle,
        text: `Check out my resume: ${resumeTitle}`,
        url: window.location.href
      };

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Resume shared successfully');
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! You can now share your resume.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        // Try clipboard fallback
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        } catch (clipboardError) {
          alert('Failed to share. Please copy the URL manually.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="border-l border-gray-700 pl-4">
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 text-white placeholder-gray-500"
                placeholder="Resume Title"
              />
              {lastSaved && (
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 px-2">
                  <Save size={12} className={isSaving ? "animate-pulse" : ""} />
                  {isSaving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}
                </div>
              )}
            </div>
          </div>

          {/* Center - Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Save</span>
            </button>
            
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Export as PDF"
            >
              <Download size={18} className={isExporting ? "animate-pulse" : ""} />
              <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export PDF"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
              title="Share resume"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Right side - Toggle buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditorOpen(!isEditorOpen);
                if (!isEditorOpen) setIsTemplateOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                isEditorOpen
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-emerald-500/50 hover:text-white"
              }`}
            >
              <Edit3 size={18} />
              <span className="hidden sm:inline">Editor</span>
            </button>

            <button
              onClick={() => {
                setIsTemplateOpen(!isTemplateOpen);
                if (!isTemplateOpen) setIsEditorOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                isTemplateOpen
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-emerald-500/50 hover:text-white"
              }`}
            >
              <Palette size={18} />
              <span className="hidden sm:inline">Design</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Editor Controls */}
        <div
          className={`bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 overflow-y-auto ${
            isEditorOpen ? "w-96" : "w-0"
          }`}
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          {isEditorOpen && (
            <div className="h-full">
              <div className="p-4 border-b border-gray-800 bg-gray-900/90 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Edit3 size={20} />
                  Edit Resume
                </h2>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Close editor"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                <ResumeEditor data={resume} onUpdate={setResume} />
              </div>
            </div>
          )}
        </div>

        {/* Center - Live Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye size={20} />
                  Live Preview
                </h3>
                <div className="text-sm text-gray-400">
                  Real-time updates as you edit
                </div>
              </div>
              <ResumePreview 
                data={resume} 
                template={selectedTemplate} 
                fontFamily={fontFamily} 
                colorScheme={colorScheme} 
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Templates & Customization */}
        <div
          className={`bg-gray-900/80 backdrop-blur-xl border-l border-gray-800 transition-all duration-300 overflow-y-auto ${
            isTemplateOpen ? "w-96" : "w-0"
          }`}
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          {isTemplateOpen && (
            <div className="h-full">
              <div className="p-4 border-b border-gray-800 bg-gray-900/90 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Settings size={20} />
                  Design & Style
                </h2>
                <button
                  onClick={() => setIsTemplateOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Close design panel"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-8">
                {/* Template Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Palette size={16} />
                    Choose Template
                  </h3>
                  <div className="space-y-3">
                    {templateList.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group ${
                          selectedTemplate === template.id
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                            : "border-gray-700 hover:border-emerald-500/50 bg-gray-800/40 hover:bg-gray-800/60"
                        }`}
                      >
                        <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {template.id === "classic" && "Professional and traditional layout"}
                          {template.id === "modern" && "Contemporary design with visual elements"}
                          {template.id === "minimal" && "Clean and simple aesthetic"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font/Typography Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                    Typography
                  </h3>
                  <div className="space-y-3">
                    {fontOptions.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group ${
                          selectedFont === font.id
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                            : "border-gray-700 hover:border-emerald-500/50 bg-gray-800/40 hover:bg-gray-800/60"
                        }`}
                        style={{ fontFamily: font.stack }}
                      >
                        <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {font.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{font.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                    Color Scheme
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all duration-200 group ${
                          selectedColor === color.id
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                            : "border-gray-700 hover:border-emerald-500/50 bg-gray-800/40 hover:bg-gray-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div
                              className="w-6 h-6 rounded border border-gray-600"
                              style={{ backgroundColor: color.primary }}
                            />
                            <div
                              className="w-6 h-6 rounded border border-gray-600"
                              style={{ backgroundColor: color.secondary }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                            {color.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Actions */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                    Preview Options
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-700 rounded-xl text-white hover:border-emerald-500/50 hover:bg-gray-800/60 transition-all duration-200 group">
                      <Download size={18} className="text-gray-400 group-hover:text-emerald-400" />
                      <div className="text-left">
                        <div className="font-medium">Export as PDF</div>
                        <div className="text-xs text-gray-400">Download your resume</div>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-700 rounded-xl text-white hover:border-emerald-500/50 hover:bg-gray-800/60 transition-all duration-200 group">
                      <Share2 size={18} className="text-gray-400 group-hover:text-emerald-400" />
                      <div className="text-left">
                        <div className="font-medium">Share Preview</div>
                        <div className="text-xs text-gray-400">Get feedback from others</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Editor;