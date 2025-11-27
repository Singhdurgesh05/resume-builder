import { useState } from "react";
import { Sparkles, X, User, Briefcase, Code, GraduationCap, Clock, Zap } from "lucide-react";

export default function AiGenerate({ isOpen, onClose, onGenerate }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    experience: "",
    skills: "",
    education: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAI = async () => {
    setIsGenerating(true);
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onGenerate(form);
    setIsGenerating(false);
    onClose();
  };

  const handleClose = () => {
    setForm({
      name: "",
      title: "",
      experience: "",
      skills: "",
      education: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-green-700/20 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Generate Resume with AI</h2>
                <p className="text-sm text-emerald-400 mt-1">Let AI create your perfect resume</p>
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

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <User size={16} />
              Full Name
            </label>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Job Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Briefcase size={16} />
              Job Title
            </label>
            <input
              name="title"
              placeholder="Senior Software Engineer"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Skills Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Code size={16} />
              Skills & Technologies
            </label>
            <textarea
              name="skills"
              placeholder="JavaScript, React, Node.js, Python, AWS..."
              value={form.skills}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none h-20"
            />
          </div>

          {/* Experience Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Clock size={16} />
              Professional Experience
            </label>
            <textarea
              name="experience"
              placeholder="Describe your work experience, projects, and achievements..."
              value={form.experience}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none h-24"
            />
          </div>

          {/* Education Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <GraduationCap size={16} />
              Education Background
            </label>
            <textarea
              name="education"
              placeholder="Degrees, certifications, courses, and academic achievements..."
              value={form.education}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none h-20"
            />
          </div>

          {/* AI Generation Tips */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-1">AI Generation Tips</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Be specific about your skills and experience</li>
                  <li>• Include relevant technologies and tools</li>
                  <li>• Mention key achievements and projects</li>
                  <li>• AI will create professional bullet points</li>
                </ul>
              </div>
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
              onClick={handleAI}
              disabled={isGenerating || !form.name || !form.title}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Resume
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