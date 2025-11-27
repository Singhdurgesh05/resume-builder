import { templates } from "../../templates";
import { Download, Eye, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

const ResumePreview = ({ data, template = "classic", fontFamily, colorScheme }) => {
  const TemplateComponent = templates[template];
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);
    // Simulate PDF generation delay
    setTimeout(() => {
      window.print();
      setIsLoading(false);
    }, 1000);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  return (
    <div className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl overflow-y-auto max-h-screen">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-800/40 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 rounded-lg p-2">
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Live Preview</h2>
            <p className="text-sm text-gray-400">Real-time updates as you edit</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-1 border border-gray-700">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors min-w-[60px] text-center"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            
            <button
              onClick={handleZoomIn}
              disabled={scale >= 1.5}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700/50 p-6">
        {/* Scale Container */}
        <div 
          className="transition-transform duration-200 ease-in-out origin-top"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Resume Template */}
          <div
            data-resume-preview="true"
            className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none"
            style={{
              fontFamily,
              maxWidth: '210mm', // A4 width
              minHeight: '297mm' // A4 height
            }}
          >
            {TemplateComponent ? (
              <TemplateComponent 
                data={data} 
                fontFamily={fontFamily} 
                colorScheme={colorScheme} 
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg font-medium">Template not found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Please select a valid template from the design panel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Guidelines */}
        <div className="absolute inset-0 pointer-events-none border-2 border-transparent">
          {/* A4 Page Guidelines */}
          <div className="absolute top-2 left-2">
            <div className="bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">
              A4 Page Preview
            </div>
          </div>
          
          {/* Scale Indicator */}
          <div className="absolute top-2 right-2">
            <div className="bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">
              Scale: {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Preview Tips */}
      <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/20 rounded-lg p-2 mt-0.5">
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-emerald-400 mb-1">Preview Tips</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use zoom controls to adjust the preview size</li>
              <li>• Click "Download PDF" to export your resume</li>
              <li>• All changes are auto-saved as you type</li>
              <li>• For best print results, use A4 paper size</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:shadow-none,
          .print\:shadow-none * {
            visibility: visible;
          }
          .print\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;