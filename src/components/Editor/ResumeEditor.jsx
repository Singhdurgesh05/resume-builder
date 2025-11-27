import { useState } from "react";
import {
  generateSummary,
  generateExperiencePoints,
  generateProjectPoints,
  generateEducationPoints,
  generateAchievements,
} from "../../services/geminiService";
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Trophy, 
  Code, 
  Languages,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  Github,
  Linkedin
} from "lucide-react";

const tabs = [
  { id: "Personal Info", icon: User },
  { id: "Summary", icon: FileText },
  { id: "Experience", icon: Briefcase },
  { id: "Education", icon: GraduationCap },
  { id: "Projects", icon: FolderGit2 },
  { id: "Achievements", icon: Trophy },
  { id: "Skills", icon: Code },
  { id: "Languages", icon: Languages },
];

const ResumeEditor = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...data[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    onUpdate({ ...data, [field]: updatedArray });
  };

  const handleArrayPointsChange = (field, index, pointIndex, value) => {
    const updatedArray = [...data[field]];
    const updatedPoints = [...updatedArray[index].points];
    updatedPoints[pointIndex] = value;
    updatedArray[index] = { ...updatedArray[index], points: updatedPoints };
    onUpdate({ ...data, [field]: updatedArray });
  };

  const addArrayItem = (field, template) => {
    onUpdate({ ...data, [field]: [...(data[field] || []), template] });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = (data[field] || []).filter((_, i) => i !== index);
    onUpdate({ ...data, [field]: updatedArray });
  };

  const addPoint = (field, index) => {
    const updatedArray = [...(data[field] || [])];
    updatedArray[index].points = [...(updatedArray[index].points || []), ""];
    onUpdate({ ...data, [field]: updatedArray });
  };

  const removePoint = (field, index, pointIndex) => {
    const updatedArray = [...(data[field] || [])];
    updatedArray[index].points = (updatedArray[index].points || []).filter((_, i) => i !== pointIndex);
    onUpdate({ ...data, [field]: updatedArray });
  };

  const handleSkillChange = (category, value) => {
    onUpdate({ ...data, skills: { ...data.skills, [category]: value } });
  };

  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...(data.achievements || [])];
    updatedAchievements[index] = value;
    onUpdate({ ...data, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    onUpdate({ ...data, achievements: [...(data.achievements || []), ""] });
  };

  const removeAchievement = (index) => {
    const updatedAchievements = (data.achievements || []).filter((_, i) => i !== index);
    onUpdate({ ...data, achievements: updatedAchievements });
  };

  const handleAddressChange = (field, value) => {
    onUpdate({ ...data, address: { ...data.address, [field]: value } });
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...(data.languages || [])];
    updatedLanguages[index] = value;
    onUpdate({ ...data, languages: updatedLanguages });
  };

  const addLanguage = () => {
    onUpdate({ ...data, languages: [...(data.languages || []), ""] });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = (data.languages || []).filter((_, i) => i !== index);
    onUpdate({ ...data, languages: updatedLanguages });
  };

  const handleSkillsListChange = (index, field, value) => {
    const updatedSkillsList = [...(data.skills?.skillsList || [])];
    updatedSkillsList[index] = { ...updatedSkillsList[index], [field]: value };
    onUpdate({ ...data, skills: { ...data.skills, skillsList: updatedSkillsList } });
  };

  const addSkillToList = () => {
    const currentList = data.skills?.skillsList || [];
    onUpdate({ ...data, skills: { ...data.skills, skillsList: [...currentList, { name: "", level: 50 }] } });
  };

  const removeSkillFromList = (index) => {
    const updatedSkillsList = (data.skills?.skillsList || []).filter((_, i) => i !== index);
    onUpdate({ ...data, skills: { ...data.skills, skillsList: updatedSkillsList } });
  };

  // AI Generation Handlers
  const handleGenerateSummary = async () => {
    setLoading({ summary: true });
    setError(null);
    try {
      const skills = data.skills?.languages || data.skills?.frameworks || "Not specified";
      const experience = data.experience?.length > 0
        ? `${data.experience.length} years of experience`
        : "Not specified";
      // Pass existing summary to enhance it if it exists
      const summary = await generateSummary(data.name, data.role, experience, skills, data.summary);
      handleChange("summary", summary.trim());
    } catch (err) {
      setError(err.message || "Failed to generate summary. Please check your API key.");
    } finally {
      setLoading({ summary: false });
    }
  };

  const handleGenerateExperiencePoints = async (index) => {
    setLoading({ [`exp-${index}`]: true });
    setError(null);
    try {
      const exp = data.experience[index];
      // Pass existing points to enhance them
      const points = await generateExperiencePoints(
        exp.title || exp.position,
        exp.company,
        exp.points || []
      );
      const updatedArray = [...(data.experience || [])];
      updatedArray[index] = { ...updatedArray[index], points };
      onUpdate({ ...data, experience: updatedArray });
    } catch (err) {
      setError(err.message || "Failed to generate experience points.");
    } finally {
      setLoading({ [`exp-${index}`]: false });
    }
  };

  const handleGenerateProjectPoints = async (index) => {
    setLoading({ [`proj-${index}`]: true });
    setError(null);
    try {
      const proj = data.projects[index];
      // Pass existing points to enhance them
      const points = await generateProjectPoints(
        proj.title,
        proj.role,
        proj.points || []
      );
      const updatedArray = [...(data.projects || [])];
      updatedArray[index] = { ...updatedArray[index], points };
      onUpdate({ ...data, projects: updatedArray });
    } catch (err) {
      setError(err.message || "Failed to generate project points.");
    } finally {
      setLoading({ [`proj-${index}`]: false });
    }
  };

  const handleGenerateEducationPoints = async (index) => {
    setLoading({ [`edu-${index}`]: true });
    setError(null);
    try {
      const edu = data.education[index];
      // Pass existing points to enhance them
      const points = await generateEducationPoints(
        edu.degree,
        edu.institute || edu.school,
        edu.points || []
      );
      const updatedArray = [...(data.education || [])];
      updatedArray[index] = { ...updatedArray[index], points };
      onUpdate({ ...data, education: updatedArray });
    } catch (err) {
      setError(err.message || "Failed to generate education points.");
    } finally {
      setLoading({ [`edu-${index}`]: false });
    }
  };

  const handleGenerateAchievements = async () => {
    setLoading({ achievements: true });
    setError(null);
    try {
      const skills = data.skills?.languages || data.skills?.frameworks || "Not specified";
      const experience = data.experience?.length > 0
        ? `${data.experience.length} years of experience`
        : "Not specified";
      // Pass existing achievements to enhance them
      const achievements = await generateAchievements(data.role, skills, experience, data.achievements);
      onUpdate({ ...data, achievements });
    } catch (err) {
      setError(err.message || "Failed to generate achievements.");
    } finally {
      setLoading({ achievements: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-sm flex items-center">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-800/60 text-gray-400 border-gray-700 hover:border-emerald-500/50 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.id}</span>
            </button>
          );
        })}
      </div>

      {/* Fields based on active tab */}
      <div className="space-y-4">
        {activeTab === "Personal Info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="John Doe"
                  value={data.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Role</label>
                <input
                  className="w-full p-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Senior Software Engineer"
                  value={data.role || ""}
                  onChange={(e) => handleChange("role", e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="john@example.com"
                      value={data.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                      value={data.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="San Francisco, CA"
                    value={data.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="linkedin.com/in/johndoe"
                    value={data.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="github.com/johndoe"
                    value={data.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio/Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    className="w-full pl-10 pr-3 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="johndoe.com"
                    value={data.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin size={18} />
                  Address (for Modern Template)
                </h3>
                <div className="space-y-3">
                  <input
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Street Address"
                    value={data.address?.line1 || ""}
                    onChange={(e) => handleAddressChange("line1", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="City"
                      value={data.address?.city || ""}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                    />
                    <input
                      className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="State"
                      value={data.address?.state || ""}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                    />
                    <input
                      className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="ZIP"
                      value={data.address?.zip || ""}
                      onChange={(e) => handleAddressChange("zip", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                <textarea
                  rows="6"
                  className="w-full p-4 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                  placeholder="Experienced software engineer with 5+ years in full-stack development..."
                  value={data.summary || ""}
                  onChange={(e) => handleChange("summary", e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loading.summary}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium"
                title="Generate summary with AI"
              >
                <Sparkles size={18} />
                {loading.summary ? "Generating..." : "AI Generate"}
              </button>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Sparkles size={16} />
              {data.summary?.trim()
                ? "Click 'AI Generate' to enhance and improve your existing summary"
                : "Click 'AI Generate' to create a professional summary based on your profile"}
            </p>
          </div>
        )}

        {activeTab === "Experience" && (
          <div className="space-y-6">
            {(data.experience || []).map((exp, idx) => (
              <div key={idx} className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Briefcase size={18} />
                    Experience {idx + 1}
                  </h3>
                  <button
                    onClick={() => removeArrayItem("experience", idx)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Job Title"
                    value={exp.title || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "title", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Company"
                    value={exp.company || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Date (e.g., 2022 - Present)"
                    value={exp.date || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "date", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Location"
                    value={exp.location || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "location", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-sm text-gray-300">Key Responsibilities & Achievements</label>
                    <button
                      onClick={() => handleGenerateExperiencePoints(idx)}
                      disabled={loading[`exp-${idx}`]}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title={exp.points?.some(p => p.trim().length > 5) ? "Enhance existing bullet points with AI" : "Generate bullet points with AI"}
                    >
                      <Sparkles size={14} />
                      {loading[`exp-${idx}`] ? "Enhancing..." : (exp.points?.some(p => p.trim().length > 5) ? "AI Enhance" : "AI Generate")}
                    </button>
                  </div>
                  {(exp.points || []).map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <input
                        className="flex-1 p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder={`Achievement ${pIdx + 1}`}
                        value={point}
                        onChange={(e) => handleArrayPointsChange("experience", idx, pIdx, e.target.value)}
                      />
                      <button
                        onClick={() => removePoint("experience", idx, pIdx)}
                        className="text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint("experience", idx)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                  >
                    <Plus size={16} />
                    Add Achievement Point
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem("experience", { title: "", company: "", date: "", location: "", points: [""] })}
              className="w-full p-4 border-2 border-dashed border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Experience
            </button>
          </div>
        )}

        {activeTab === "Education" && (
          <div className="space-y-6">
            {(data.education || []).map((edu, idx) => (
              <div key={idx} className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <GraduationCap size={18} />
                    Education {idx + 1}
                  </h3>
                  <button
                    onClick={() => removeArrayItem("education", idx)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Degree"
                    value={edu.degree || ""}
                    onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Institute"
                    value={edu.institute || ""}
                    onChange={(e) => handleArrayChange("education", idx, "institute", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Date (e.g., 2018 - 2022)"
                    value={edu.date || ""}
                    onChange={(e) => handleArrayChange("education", idx, "date", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Location"
                    value={edu.location || ""}
                    onChange={(e) => handleArrayChange("education", idx, "location", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-sm text-gray-300">Key Achievements</label>
                    <button
                      onClick={() => handleGenerateEducationPoints(idx)}
                      disabled={loading[`edu-${idx}`]}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title={edu.points?.some(p => p.trim().length > 5) ? "Enhance existing bullet points with AI" : "Generate bullet points with AI"}
                    >
                      <Sparkles size={14} />
                      {loading[`edu-${idx}`] ? "Enhancing..." : (edu.points?.some(p => p.trim().length > 5) ? "AI Enhance" : "AI Generate")}
                    </button>
                  </div>
                  {(edu.points || []).map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <input
                        className="flex-1 p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder={`Achievement ${pIdx + 1}`}
                        value={point}
                        onChange={(e) => handleArrayPointsChange("education", idx, pIdx, e.target.value)}
                      />
                      <button
                        onClick={() => removePoint("education", idx, pIdx)}
                        className="text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint("education", idx)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                  >
                    <Plus size={16} />
                    Add Achievement Point
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem("education", { degree: "", institute: "", date: "", location: "", points: [""] })}
              className="w-full p-4 border-2 border-dashed border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Education
            </button>
          </div>
        )}

        {/* Projects, Achievements, Skills, and Languages sections follow similar patterns */}
        {/* Due to length constraints, I've shown the pattern above. The remaining sections would follow the same design system */}
        
        {activeTab === "Projects" && (
          <div className="space-y-6">
            {(data.projects || []).map((proj, idx) => (
              <div key={idx} className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FolderGit2 size={18} />
                    Project {idx + 1}
                  </h3>
                  <button
                    onClick={() => removeArrayItem("projects", idx)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Project Title"
                    value={proj.title || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "title", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Project Link/URL"
                    value={proj.link || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "link", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Your Role"
                    value={proj.role || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "role", e.target.value)}
                  />
                  <input
                    className="p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Date (e.g., 2021 - 2022)"
                    value={proj.date || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "date", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-sm text-gray-300">Project Details</label>
                    <button
                      onClick={() => handleGenerateProjectPoints(idx)}
                      disabled={loading[`proj-${idx}`]}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title={proj.points?.some(p => p.trim().length > 5) ? "Enhance existing bullet points with AI" : "Generate bullet points with AI"}
                    >
                      <Sparkles size={14} />
                      {loading[`proj-${idx}`] ? "Enhancing..." : (proj.points?.some(p => p.trim().length > 5) ? "AI Enhance" : "AI Generate")}
                    </button>
                  </div>
                  {(proj.points || []).map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <input
                        className="flex-1 p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder={`Detail ${pIdx + 1}`}
                        value={point}
                        onChange={(e) => handleArrayPointsChange("projects", idx, pIdx, e.target.value)}
                      />
                      <button
                        onClick={() => removePoint("projects", idx, pIdx)}
                        className="text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint("projects", idx)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                  >
                    <Plus size={16} />
                    Add Project Detail
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem("projects", { title: "", link: "", role: "", date: "", points: [""] })}
              className="w-full p-4 border-2 border-dashed border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Project
            </button>
          </div>
        )}

        {activeTab === "Achievements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Trophy size={18} />
                Your Achievements
              </h3>
              <button
                onClick={handleGenerateAchievements}
                disabled={loading.achievements}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title={data.achievements?.some(a => a.trim().length > 5) ? "Enhance existing achievements with AI" : "Generate achievements with AI"}
              >
                <Sparkles size={16} />
                {loading.achievements ? "Enhancing..." : (data.achievements?.some(a => a.trim().length > 5) ? "AI Enhance" : "AI Generate")}
              </button>
            </div>
            
            <div className="space-y-3">
              {(data.achievements || []).map((achievement, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-4 flex-shrink-0"></div>
                  <input
                    className="flex-1 p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder={`Achievement ${idx + 1}`}
                    value={achievement}
                    onChange={(e) => handleAchievementChange(idx, e.target.value)}
                  />
                  <button
                    onClick={() => removeAchievement(idx)}
                    className="text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-900/20 transition-colors mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={addAchievement}
              className="w-full p-4 border-2 border-dashed border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Achievement
            </button>
          </div>
        )}

        {/* Skills Section */}
        {activeTab === "Skills" && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Code size={18} />
                Technical Skills
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-sm text-gray-300 mb-2">Programming Languages</label>
                  <textarea
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                    placeholder="e.g., JavaScript, Python, Java, C++"
                    value={data.skills?.languages || ""}
                    onChange={(e) => handleChange("skills", { ...data.skills, languages: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block font-medium text-sm text-gray-300 mb-2">Frameworks & Libraries</label>
                  <textarea
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                    placeholder="e.g., React, Node.js, Django, Spring Boot"
                    value={data.skills?.frameworks || ""}
                    onChange={(e) => handleChange("skills", { ...data.skills, frameworks: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block font-medium text-sm text-gray-300 mb-2">Tools & Technologies</label>
                  <textarea
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                    placeholder="e.g., Git, Docker, AWS, MongoDB"
                    value={data.skills?.tools || ""}
                    onChange={(e) => handleChange("skills", { ...data.skills, tools: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block font-medium text-sm text-gray-300 mb-2">Other Skills</label>
                  <textarea
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                    placeholder="e.g., Project Management, Team Leadership, Agile"
                    value={data.skills?.other || ""}
                    onChange={(e) => handleChange("skills", { ...data.skills, other: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Separate multiple skills with commas
              </p>
            </div>
          </div>
        )}

        {/* Languages Section */}
        {activeTab === "Languages" && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-800/40 rounded-xl border border-gray-700 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Languages size={18} />
                Language Proficiency
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-sm text-gray-300 mb-2">Languages You Speak</label>
                  <textarea
                    className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                    placeholder="e.g., English (Native), Spanish (Fluent), French (Intermediate)"
                    value={data.languages || ""}
                    onChange={(e) => handleChange("languages", e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    List each language with proficiency level in parentheses
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeEditor;