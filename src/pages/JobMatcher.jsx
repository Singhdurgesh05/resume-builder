import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  Target,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Home,
  LogOut,
  Upload,
  X,
} from "lucide-react";
import { getUserResumes, getResumeById } from "../services/resumeService";
import { analyzeJobMatch } from "../services/jobMatcherService";
import { importResumeFile } from "../services/fileParserService";

function JobMatcher() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedResumeData, setUploadedResumeData] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Load user's resumes
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await getUserResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes:", err);
      setError("Failed to load resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValidType = validTypes.includes(file.type) || validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidType) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    setIsProcessingFile(true);
    setError(null);
    setUploadedFile(file);

    try {
      const result = await importResumeFile(file);

      if (!result.success) {
        setError(result.error);
        setUploadedFile(null);
        return;
      }

      setUploadedResumeData(result.data);
      // Clear selected resume from dropdown when uploading a file
      setSelectedResumeId("");
      // Clear any previous analysis
      setAnalysis(null);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process resume file. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setUploadedResumeData(null);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    // Check if either a resume is selected or a file is uploaded
    if (!selectedResumeId && !uploadedResumeData) {
      setError("Please select a resume or upload a resume file");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      setAnalysis(null);

      let resumeContent;

      // Use uploaded file data if available, otherwise use selected resume
      if (uploadedResumeData) {
        // Convert parsed resume data to the format expected by analyzeJobMatch
        // The jobMatcherService expects skills as either an array OR an object with categories
        resumeContent = {
          name: uploadedResumeData.name || "",
          email: uploadedResumeData.email || "",
          phone: uploadedResumeData.phone || "",
          location: uploadedResumeData.location || "",
          linkedin: uploadedResumeData.linkedin || "",
          github: uploadedResumeData.github || "",
          role: uploadedResumeData.role || "",
          summary: uploadedResumeData.summary || "",
          experience: uploadedResumeData.experience || [],
          education: uploadedResumeData.education || [],
          skills: uploadedResumeData.skills || [], // Keep as array for proper extraction
          projects: uploadedResumeData.projects || [],
          achievements: uploadedResumeData.certifications || [],
          certifications: uploadedResumeData.certifications || [],
          languages: uploadedResumeData.languages || []
        };

        // Debug: Log what we're sending
        console.log('=== RESUME CONTENT BEING ANALYZED ===');
        console.log('Skills array:', resumeContent.skills);
        console.log('Full resume content:', resumeContent);
      } else {
        // Get full resume content from selected resume
        const resumeData = await getResumeById(selectedResumeId);

        // Check if resume has content
        if (!resumeData.content || Object.keys(resumeData.content).length === 0) {
          setError("This resume is empty. Please edit the resume and add content before analyzing.");
          setAnalyzing(false);
          return;
        }

        resumeContent = resumeData.content;
      }

      // Analyze match
      const result = await analyzeJobMatch(resumeContent, jobDescription);

      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getMatchLevelColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-emerald-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getMatchLevelBg = (score) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/50";
    if (score >= 60) return "bg-emerald-500/20 border-emerald-500/50";
    if (score >= 40) return "bg-yellow-500/20 border-yellow-500/50";
    return "bg-red-500/20 border-red-500/50";
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const handleSignOut = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg p-2">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                ResumeNow
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800"
              >
                <Home size={16} />
                Home
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 rounded-full p-4 border border-emerald-500/20">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent mb-2">
                Job Description Matcher
              </h1>
              <p className="text-gray-400 text-lg">
                Analyze how well your resume matches job requirements
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Selection */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
            <label className="block text-white text-lg font-semibold mb-4">
              Select Resume
            </label>
            {loading ? (
              <div className="text-gray-400 py-4">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="text-gray-400 py-4">
                No resumes found.{" "}
                <Link to="/dashboard" className="text-emerald-400 hover:underline">
                  Create one first
                </Link>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  // Clear uploaded file when selecting from dropdown
                  if (e.target.value) {
                    handleRemoveUploadedFile();
                  }
                }}
                disabled={!!uploadedFile}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            )}

            {/* OR Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* File Upload Section */}
            {!uploadedFile ? (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile || !!selectedResumeId}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500/60 text-emerald-400 px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingFile ? (
                    <>
                      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span className="font-medium">Upload Resume from Device</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Supported formats: PDF, DOCX, TXT (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-emerald-400 text-xs">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Ready to analyze
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveUploadedFile}
                    className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
            <label className="block text-white text-lg font-semibold mb-4">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || (!selectedResumeId && !uploadedResumeData) || !jobDescription.trim()}
            className="group relative bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Match</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-xl mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Match Score */}
            <div
              className={`bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border ${getMatchLevelBg(
                analysis.matchScore
              )}`}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Match Score
                </h2>
                <div className="flex items-center justify-center gap-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          (analysis.matchScore / 100) * 351.86
                        } 351.86`}
                        className={getMatchLevelColor(analysis.matchScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-4xl font-bold ${getMatchLevelColor(
                          analysis.matchScore
                        )}`}
                      >
                        {analysis.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-lg">Match Level</p>
                    <p
                      className={`text-3xl font-bold ${getMatchLevelColor(
                        analysis.matchScore
                      )}`}
                    >
                      {analysis.matchLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Strengths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                    >
                      <p className="text-green-300">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills && analysis.missingSkills.length > 0 && (
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  Missing Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.missingSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                    >
                      <p className="text-red-300">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  Recommendations
                </h3>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/40 border border-gray-700 rounded-lg p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                            rec.priority
                          )}`}
                        >
                          {rec.priority}
                        </span>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">
                            {rec.suggestion}
                          </p>
                          <p className="text-gray-400 text-sm">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Compatibility */}
            {analysis.atsCompatibility && (
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ATS Compatibility
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        analysis.atsCompatibility.score >= 70
                          ? "bg-green-500"
                          : analysis.atsCompatibility.score >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${analysis.atsCompatibility.score}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {analysis.atsCompatibility.score}%
                  </span>
                </div>
                {analysis.atsCompatibility.issues &&
                  analysis.atsCompatibility.issues.length > 0 && (
                    <div className="space-y-2">
                      {analysis.atsCompatibility.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-gray-400"
                        >
                          <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setJobDescription("");
                  setSelectedResumeId("");
                  handleRemoveUploadedFile();
                }}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Analyze Another
              </button>
              {selectedResumeId && (
                <button
                  onClick={() => navigate("/editor", { state: { resumeId: selectedResumeId } })}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-500 hover:to-green-600 transition-all"
                >
                  Edit Resume
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}

export default JobMatcher;
