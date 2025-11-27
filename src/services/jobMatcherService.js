import { generateWithAI } from './geminiService';

/**
 * Extract text content from resume data
 */
const extractResumeText = (resumeContent) => {
  if (!resumeContent) return '';

  let text = '';

  // Extract personal info (supports both flat structure and nested personalInfo)
  const name = resumeContent.name || resumeContent.personalInfo?.fullName || '';
  const role = resumeContent.role || resumeContent.personalInfo?.title || '';
  const email = resumeContent.email || resumeContent.personalInfo?.email || '';
  const phone = resumeContent.phone || resumeContent.personalInfo?.phone || '';
  const location = resumeContent.location || resumeContent.personalInfo?.location || '';
  const linkedin = resumeContent.linkedin || '';
  const github = resumeContent.github || '';
  const summary = resumeContent.summary || resumeContent.personalInfo?.summary || '';

  if (name) text += `${name}\n`;
  if (role) text += `${role}\n`;
  if (email || phone) text += `${email} ${phone}\n`;
  if (location) text += `${location}\n`;
  if (linkedin) text += `LinkedIn: ${linkedin}\n`;
  if (github) text += `GitHub: ${github}\n`;
  if (summary) text += `\nSUMMARY\n${summary}\n`;
  text += '\n';

  // Extract experience
  if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
    text += 'EXPERIENCE\n';
    resumeContent.experience.forEach(exp => {
      text += `${exp.title || ''} at ${exp.company || ''}\n`;
      text += `${exp.date || exp.startDate || ''} ${exp.endDate ? '- ' + exp.endDate : ''}\n`;
      if (exp.location) text += `${exp.location}\n`;

      // Handle points/description
      if (exp.points && Array.isArray(exp.points)) {
        text += exp.points.join('\n') + '\n';
      } else if (exp.description) {
        if (Array.isArray(exp.description)) {
          text += exp.description.join('\n') + '\n';
        } else {
          text += exp.description + '\n';
        }
      }
      text += '\n';
    });
  }

  // Extract education
  if (resumeContent.education && Array.isArray(resumeContent.education)) {
    text += 'EDUCATION\n';
    resumeContent.education.forEach(edu => {
      text += `${edu.degree || ''} - ${edu.institute || edu.school || edu.institution || ''}\n`;
      text += `${edu.date || edu.start || edu.startDate || ''} ${edu.end || edu.endDate ? '- ' + (edu.end || edu.endDate) : ''}\n`;
      if (edu.location) text += `${edu.location}\n`;

      // Handle points/description
      if (edu.points && Array.isArray(edu.points)) {
        text += edu.points.join('\n') + '\n';
      } else if (edu.description) {
        if (Array.isArray(edu.description)) {
          text += edu.description.join('\n') + '\n';
        } else {
          text += edu.description + '\n';
        }
      }
      text += '\n';
    });
  }

  // Extract skills
  if (resumeContent.skills) {
    text += 'SKILLS\n';
    if (Array.isArray(resumeContent.skills)) {
      resumeContent.skills.forEach(skill => {
        if (typeof skill === 'string') {
          text += `${skill}\n`;
        } else if (skill.name) {
          text += `${skill.name}\n`;
        }
      });
    } else if (typeof resumeContent.skills === 'object') {
      // Handle skills as object with categories
      Object.entries(resumeContent.skills).forEach(([category, skillList]) => {
        if (Array.isArray(skillList)) {
          text += `${category}: ${skillList.join(', ')}\n`;
        } else if (typeof skillList === 'string') {
          text += `${category}: ${skillList}\n`;
        }
      });
    }
    text += '\n';
  }

  // Extract projects
  if (resumeContent.projects && Array.isArray(resumeContent.projects)) {
    text += 'PROJECTS\n';
    resumeContent.projects.forEach(proj => {
      text += `${proj.title || proj.name || ''}\n`;
      if (proj.date) text += `${proj.date}\n`;

      // Handle points/description
      if (proj.points && Array.isArray(proj.points)) {
        text += proj.points.join('\n') + '\n';
      } else if (proj.description) {
        if (Array.isArray(proj.description)) {
          text += proj.description.join('\n') + '\n';
        } else {
          text += proj.description + '\n';
        }
      }
      text += '\n';
    });
  }

  // Extract certifications
  if (resumeContent.certifications && Array.isArray(resumeContent.certifications)) {
    text += 'CERTIFICATIONS\n';
    resumeContent.certifications.forEach(cert => {
      text += `${cert.name || cert.title || ''}\n`;
      if (cert.issuer) text += `Issued by: ${cert.issuer}\n`;
      if (cert.date) text += `Date: ${cert.date}\n`;
      text += '\n';
    });
  }

  // Extract achievements
  if (resumeContent.achievements && Array.isArray(resumeContent.achievements)) {
    text += 'ACHIEVEMENTS\n';
    resumeContent.achievements.forEach(achievement => {
      if (typeof achievement === 'string') {
        text += `${achievement}\n`;
      } else if (achievement.title || achievement.description) {
        text += `${achievement.title || achievement.description}\n`;
      }
    });
    text += '\n';
  }

  return text;
};

/**
 * Analyze job match and provide comprehensive feedback
 */
export const analyzeJobMatch = async (resumeContent, jobDescription) => {
  try {
    const resumeText = extractResumeText(resumeContent);

    // Debug logging
    console.log('=== JOB MATCHER DEBUG ===');
    console.log('Resume content received:', resumeContent);
    console.log('Extracted resume text:', resumeText);
    console.log('Resume text length:', resumeText.length);
    console.log('Job description:', jobDescription);

    if (!resumeText.trim()) {
      throw new Error('Resume content is empty or invalid. Please edit the resume and add your information first.');
    }

    if (!jobDescription.trim()) {
      throw new Error('Job description is empty. Please paste a job description.');
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) and career advisor. Analyze how well this resume matches the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

IMPORTANT INSTRUCTIONS:
1. Carefully read through the ENTIRE resume to identify ALL skills, technologies, and experiences present
2. For "strengths", list ONLY the skills/qualifications that appear in BOTH the resume AND job description
3. For "missingSkills", list ONLY the critical skills mentioned in the job description that are genuinely NOT present anywhere in the resume
4. Consider synonyms and related technologies (e.g., if resume has "React.js" and job needs "React", that's a match; if resume has "JavaScript" and job needs "JS", that's a match)
5. Look for skills mentioned in project descriptions, experience bullet points, and skills section
6. Be thorough - don't mark skills as "missing" if they exist in the resume under a slightly different name or in project descriptions

Provide a comprehensive analysis in the following JSON format:
{
  "matchScore": <number between 0-100>,
  "matchLevel": "<Poor/Fair/Good/Excellent>",
  "strengths": [
    "List of matching skills, experiences, or qualifications found in both resume and job description"
  ],
  "missingSkills": [
    "ONLY critical skills mentioned in job description that are genuinely NOT present anywhere in the resume"
  ],
  "recommendations": [
    {
      "priority": "<High/Medium/Low>",
      "suggestion": "Specific actionable recommendation to improve match",
      "reason": "Why this recommendation matters"
    }
  ],
  "keywordGaps": [
    "Important keywords from job description not found in resume"
  ],
  "atsCompatibility": {
    "score": <number between 0-100>,
    "issues": ["List of ATS-related issues if any"]
  }
}

Be specific, actionable, and constructive. Return ONLY the JSON object, no additional text.`;

    const response = await generateWithAI(prompt);

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate response structure (allow zero values but ensure keys exist with correct types)
    const hasMatchScore = typeof analysis.matchScore === 'number';
    const hasMatchLevel = typeof analysis.matchLevel === 'string';
    const hasStrengths = Array.isArray(analysis.strengths);
    const hasMissingSkills = Array.isArray(analysis.missingSkills);
    const hasRecommendations = Array.isArray(analysis.recommendations);
    const hasKeywordGaps = Array.isArray(analysis.keywordGaps || []);
    const hasAtsCompatibility =
      analysis.atsCompatibility &&
      typeof analysis.atsCompatibility === 'object' &&
      typeof analysis.atsCompatibility.score === 'number' &&
      Array.isArray(analysis.atsCompatibility.issues || []);

    if (
      !hasMatchScore ||
      !hasMatchLevel ||
      !hasStrengths ||
      !hasMissingSkills ||
      !hasRecommendations ||
      !hasKeywordGaps ||
      !hasAtsCompatibility
    ) {
      throw new Error('Invalid analysis structure received');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw error;
  }
};

/**
 * Generate quick match score (faster, less detailed)
 */
export const quickMatchScore = async (resumeContent, jobDescription) => {
  try {
    const resumeText = extractResumeText(resumeContent);

    const prompt = `Compare this resume to the job description and provide only a match score (0-100) and brief explanation.

RESUME: ${resumeText.substring(0, 1000)}

JOB DESCRIPTION: ${jobDescription.substring(0, 1000)}

Return JSON: {"score": <number>, "summary": "<brief explanation>"}`;

    const response = await generateWithAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { score: 0, summary: 'Unable to calculate match score' };
  } catch (error) {
    console.error('Error calculating quick match score:', error);
    throw error;
  }
};

/**
 * Generate improvement suggestions for specific section
 */
export const suggestSectionImprovements = async (sectionName, sectionContent, jobDescription) => {
  try {
    const prompt = `You are a professional resume writer. Improve the "${sectionName}" section to better match this job description.

CURRENT ${sectionName.toUpperCase()}:
${JSON.stringify(sectionContent, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Provide specific improvements in JSON format:
{
  "suggestions": [
    {
      "original": "current text",
      "improved": "improved text",
      "reason": "why this change helps"
    }
  ]
}

Return ONLY the JSON object.`;

    const response = await generateWithAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { suggestions: [] };
  } catch (error) {
    console.error('Error generating section improvements:', error);
    throw error;
  }
};

/**
 * Extract keywords from job description
 */
export const extractJobKeywords = async (jobDescription) => {
  try {
    const prompt = `Extract the most important keywords, skills, and requirements from this job description. Focus on technical skills, tools, qualifications, and key responsibilities.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object:
{
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "qualifications": ["requirement1", "requirement2"],
  "tools": ["tool1", "tool2"],
  "keywords": ["keyword1", "keyword2"]
}

Return ONLY the JSON object.`;

    const response = await generateWithAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      technicalSkills: [],
      softSkills: [],
      qualifications: [],
      tools: [],
      keywords: []
    };
  } catch (error) {
    console.error('Error extracting job keywords:', error);
    throw error;
  }
};
