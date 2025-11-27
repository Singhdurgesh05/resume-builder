import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, Clock, Edit, Trash2, Plus, Download, Upload, Target, LogOut, Home, User } from "lucide-react";
import CreateResumeModal from "../components/createResumeModal.jsx";
import ImportResumeModal from "../components/ImportResumeModal.jsx";
import { getUserResumes, createResume, deleteResume } from "../services/resumeService";
import { buildResumeEditorData } from "../services/fileParserService";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load resumes from Supabase
  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserResumes();
      setResumes(data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reload resumes whenever we navigate to the dashboard or when component mounts
  useEffect(() => {
    loadResumes();
  }, [location]);

  const handleSignOut = () => {
    navigate("/signin");
  };

  // When new resume is created via modal
  const createResumeWithName = async (resumeName) => {
    const name = resumeName?.trim() || "Untitled Resume";

    try {
      const newResume = await createResume({
        title: name,
        template: "classic",
        font: "inter",
        content: null
      });

      setShowModal(false);
      navigate("/editor", { state: { resumeId: newResume.id } });
    } catch (err) {
      console.error('Failed to create resume:', err);
      alert('Failed to create resume. Please try again.');
    }
  };

  const handleEditResume = (resumeId) => {
    navigate("/editor", { state: { resumeId } });
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(resumeId);
        // Reload resumes after deletion
        await loadResumes();
      } catch (err) {
        console.error('Failed to delete resume:', err);
        alert('Failed to delete resume. Please try again.');
      }
    }
  };

  const handleImportResume = async ({ name, data }) => {
    if (!data) {
      console.error('No data provided for import');
      return;
    }

    try {
      console.log('Importing resume with parsed data:', data);
      const normalizedContent = buildResumeEditorData(data);
      console.log('Normalized content for editor:', normalizedContent);

      const newResume = await createResume({
        title: name?.trim() || "Imported Resume",
        template: "classic",
        font: "inter",
        content: normalizedContent
      });

      console.log('Resume created successfully with ID:', newResume.id);
      setShowImportModal(false);
      navigate("/editor", { state: { resumeId: newResume.id } });
    } catch (err) {
      console.error('Failed to import resume:', err);
      alert('Failed to import resume. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent mb-3">
                Welcome to Your Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Create and manage your professional resumes</p>
            </div>
            <div className="bg-emerald-500/10 rounded-full p-4 border border-emerald-500/20">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Create New Resume */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-gradient-to-br from-emerald-600 to-green-700 p-6 rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] hover:from-emerald-500 hover:to-green-600 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="bg-white/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create New Resume</h3>
              <p className="text-emerald-100">Start building your resume from scratch</p>
            </div>
          </button>

          {/* Job Description Matcher */}
          <button
            onClick={() => navigate("/job-matcher")}
            className="group bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="bg-emerald-500/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Job Description Matcher</h3>
            <p className="text-gray-400">Match your resume to job requirements</p>
          </button>

          {/* Import Resume */}
          <button
            onClick={() => setShowImportModal(true)}
            className="group bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="bg-emerald-500/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Import Resume</h3>
            <p className="text-gray-400">Upload and edit existing resume</p>
          </button>
        </div>

        {/* Recent Resumes */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                Your Resumes
              </h2>
              <p className="text-gray-400 mt-1">Manage and edit your professional resumes</p>
            </div>
            <div className="bg-emerald-500/10 rounded-full px-4 py-2 border border-emerald-500/20">
              <span className="text-emerald-400 font-medium">{resumes.length} total</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-xl mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 text-lg">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-6">
                <FileText className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-lg mb-6">No resumes yet. Start building your professional profile!</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-emerald-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 font-medium"
              >
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="group bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:translate-y-[-4px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 rounded-lg p-2">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {resume.title || "Untitled Resume"}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock size={14} className="text-emerald-400" />
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded">
                        Template: <span className="capitalize font-medium text-emerald-400">{resume.template}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleEditResume(resume.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="px-4 py-2.5 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/20 hover:border-red-700 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modal */}
      <CreateResumeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={createResumeWithName}
      />
      <ImportResumeModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportResume}
      />
    </div>
  );
}

export default Dashboard;