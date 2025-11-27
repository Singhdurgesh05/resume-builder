import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The generated content
 */
export const generateWithAI = async (prompt) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  // List of models to try in order (most preferred first)
 const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
// Remove undefined values

  // If user specified a model, only try that one
  const modelsToTry = import.meta.env.VITE_GEMINI_MODEL 
    ? [import.meta.env.VITE_GEMINI_MODEL]
    : modelNames;

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`Failed to use model ${modelName}:`, error.message);
      lastError = error;
      // Continue to next model if this one fails
      continue;
    }
  }

  // If all models failed, throw a helpful error
  console.error('All Gemini models failed:', lastError);
  throw new Error(
    `Failed to generate content. Tried models: ${modelsToTry.join(', ')}. ` +
    `Error: ${lastError?.message || 'Unknown error'}. ` +
    `Please check your API key and ensure you have access to Gemini models. ` +
    `You can specify a model via VITE_GEMINI_MODEL environment variable.`
  );
};

/**
 * Generate or enhance professional summary
 */
export const generateSummary = async (name, role, experience, skills, existingSummary = "") => {
  let prompt;

  if (existingSummary && existingSummary.trim().length > 10) {
    // Enhance existing summary
    prompt = `You are an expert resume writer. Improve and enhance the following professional summary while keeping the core message and tone.

Existing Summary:
"${existingSummary}"

Context:
Name: ${name || 'Candidate'}
Role/Title: ${role || 'Professional'}
Experience: ${experience || 'Not specified'}
Key Skills: ${skills || 'Not specified'}

Instructions:
- Keep the original intent and key points
- Make it more professional and impactful
- Improve wording and flow
- Keep it concise (2-3 sentences)
- Fix any grammar or style issues
- Return ONLY the enhanced summary text, no explanations or additional formatting.`;
  } else {
    // Generate new summary
    prompt = `You are an expert resume writer. Generate a professional, concise summary (2-3 sentences) for a resume.

Name: ${name || 'Candidate'}
Role/Title: ${role || 'Professional'}
Experience: ${experience || 'Not specified'}
Key Skills: ${skills || 'Not specified'}

Write a compelling professional summary that highlights their expertise and value proposition. Keep it concise and impactful. Return only the summary text, no additional formatting.`;
  }

  return await generateWithAI(prompt);
};

/**
 * Generate or enhance experience bullet points
 */
export const generateExperiencePoints = async (jobTitle, company, existingPoints = []) => {
  // Filter out empty points
  const validPoints = (existingPoints || []).filter(p => p && p.trim().length > 5);
  let prompt;

  if (validPoints.length > 0) {
    // Enhance existing points
    prompt = `You are an expert resume writer. Improve and enhance the following bullet points for a work experience entry while keeping the core achievements and facts.

Job Title: ${jobTitle || 'Position'}
Company: ${company || 'Company'}

Existing Bullet Points:
${validPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Instructions:
- Keep the same achievements and facts from the original points
- Make them more professional and impactful
- Start with strong action verbs
- Quantify achievements where already mentioned
- Improve wording and clarity
- Keep the same number of points (${validPoints.length} points)
- Return ONLY the improved bullet points as a JSON array of strings, like: ["Point 1", "Point 2", "Point 3"]
- Do NOT add explanations or additional text`;
  } else {
    // Generate new points
    prompt = `You are an expert resume writer. Generate 3-4 professional, achievement-oriented bullet points for a work experience entry.

Job Title: ${jobTitle || 'Position'}
Company: ${company || 'Company'}
Brief Description: General responsibilities and achievements

Generate bullet points that:
- Start with action verbs
- Quantify achievements where possible
- Highlight impact and results
- Are concise and professional

Return the bullet points as a JSON array of strings, like: ["Point 1", "Point 2", "Point 3"]`;
  }

  const response = await generateWithAI(prompt);
  try {
    // Try to parse JSON from response
    const jsonMatch = response.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // If not JSON, split by lines and clean up
    return response.split('\n')
      .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[•\-\d+\.\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 4);
  } catch (error) {
    // Fallback: return as array of lines
    return response.split('\n')
      .filter(line => line.trim())
      .slice(0, 4);
  }
};

/**
 * Generate or enhance project description points
 */
export const generateProjectPoints = async (projectTitle, role, existingPoints = []) => {
  const validPoints = (existingPoints || []).filter(p => p && p.trim().length > 5);
  let prompt;

  if (validPoints.length > 0) {
    // Enhance existing points
    prompt = `You are an expert resume writer. Improve and enhance the following bullet points for a project entry while keeping the core details and achievements.

Project Title: ${projectTitle || 'Project'}
Your Role: ${role || 'Developer'}

Existing Bullet Points:
${validPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Instructions:
- Keep the same technical details and achievements from the original points
- Make them more professional and impactful
- Highlight technical achievements and technologies
- Show impact and scale where mentioned
- Improve wording and clarity
- Keep the same number of points (${validPoints.length} points)
- Return ONLY the improved bullet points as a JSON array of strings, like: ["Point 1", "Point 2", "Point 3"]
- Do NOT add explanations or additional text`;
  } else {
    // Generate new points
    prompt = `You are an expert resume writer. Generate 3-4 professional bullet points for a project entry.

Project Title: ${projectTitle || 'Project'}
Your Role: ${role || 'Developer'}
Brief Description: Project details and technologies used

Generate bullet points that:
- Highlight technical achievements
- Show impact and scale
- Mention key technologies
- Are concise and professional

Return the bullet points as a JSON array of strings, like: ["Point 1", "Point 2", "Point 3"]`;
  }

  const response = await generateWithAI(prompt);
  try {
    const jsonMatch = response.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return response.split('\n')
      .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[•\-\d+\.\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 4);
  } catch (error) {
    return response.split('\n')
      .filter(line => line.trim())
      .slice(0, 4);
  }
};

/**
 * Generate or enhance education points
 */
export const generateEducationPoints = async (degree, institute, existingPoints = []) => {
  const validPoints = (existingPoints || []).filter(p => p && p.trim().length > 5);
  let prompt;

  if (validPoints.length > 0) {
    // Enhance existing points
    prompt = `You are an expert resume writer. Improve and enhance the following bullet points for an education entry while keeping the core achievements and details.

Degree: ${degree || 'Degree'}
Institute: ${institute || 'University'}

Existing Bullet Points:
${validPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Instructions:
- Keep the same academic achievements and details from the original points
- Make them more professional and impactful
- Highlight academic excellence, coursework, honors
- Improve wording and clarity
- Keep the same number of points (${validPoints.length} points)
- Return ONLY the improved bullet points as a JSON array of strings, like: ["Point 1", "Point 2"]
- Do NOT add explanations or additional text`;
  } else {
    // Generate new points
    prompt = `You are an expert resume writer. Generate 2-3 professional bullet points for an education entry.

Degree: ${degree || 'Degree'}
Institute: ${institute || 'University'}
Additional Info: Relevant coursework, achievements, or highlights

Generate bullet points that highlight:
- Academic achievements
- Relevant coursework or projects
- Honors or distinctions
- Key learnings

Return the bullet points as a JSON array of strings, like: ["Point 1", "Point 2"]`;
  }

  const response = await generateWithAI(prompt);
  try {
    const jsonMatch = response.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return response.split('\n')
      .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[•\-\d+\.\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 3);
  } catch (error) {
    return response.split('\n')
      .filter(line => line.trim())
      .slice(0, 3);
  }
};

/**
 * Generate or enhance achievements
 */
export const generateAchievements = async (role, skills, experience, existingAchievements = []) => {
  const validAchievements = (existingAchievements || []).filter(a => a && a.trim().length > 5);
  let prompt;

  if (validAchievements.length > 0) {
    // Enhance existing achievements
    prompt = `You are an expert resume writer. Improve and enhance the following achievement statements while keeping the core accomplishments and facts.

Role/Title: ${role || 'Professional'}
Skills: ${skills || 'Not specified'}
Experience Level: ${experience || 'Not specified'}

Existing Achievements:
${validAchievements.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Instructions:
- Keep the same accomplishments and facts from the original achievements
- Make them more professional and impactful
- Quantify where already mentioned
- Improve wording and clarity
- Keep the same number of achievements (${validAchievements.length} achievements)
- Return ONLY the improved achievements as a JSON array of strings, like: ["Achievement 1", "Achievement 2", "Achievement 3"]
- Do NOT add explanations or additional text`;
  } else {
    // Generate new achievements
    prompt = `You are an expert resume writer. Generate 3-5 professional achievement statements.

Role/Title: ${role || 'Professional'}
Skills: ${skills || 'Not specified'}
Experience Level: ${experience || 'Not specified'}

Generate achievements that:
- Are specific and quantifiable
- Show recognition or impact
- Are relevant to the role
- Sound professional and impressive

Return the achievements as a JSON array of strings, like: ["Achievement 1", "Achievement 2", "Achievement 3"]`;
  }

  const response = await generateWithAI(prompt);
  try {
    const jsonMatch = response.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return response.split('\n')
      .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[•\-\d+\.\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  } catch (error) {
    return response.split('\n')
      .filter(line => line.trim())
      .slice(0, 5);
  }
};

/**
 * Analyze resume against job description
 */
export const analyzeResumeAgainstJob = async (resumeData, jobData) => {
  const prompt = `You are an expert resume and job matching analyst. Analyze how well this resume matches the job description.

RESUME DATA:
Name: ${resumeData.name || 'Not specified'}
Email: ${resumeData.email || 'Not specified'}
Skills: ${resumeData.skills.join(', ') || 'None listed'}
Experience: ${resumeData.experience.length} positions
Education: ${resumeData.education.length} entries

Resume Skills: ${resumeData.skills.join(', ')}
Resume Experience Titles: ${resumeData.experience.map(exp => exp.position).join(', ')}

JOB DESCRIPTION DATA:
Job Title: ${jobData.title || 'Not specified'}
Company: ${jobData.company || 'Not specified'}
Required Skills: ${jobData.skills.join(', ') || 'None listed'}
Requirements: ${jobData.requirements.slice(0, 5).join('; ')}
Experience Required: ${jobData.experience || 'Not specified'}
Responsibilities: ${jobData.responsibilities.slice(0, 3).join('; ')}

ANALYSIS REQUIRED:
1. Calculate an overall match score (0-100) based on skills, experience, and requirements alignment
2. List matched skills (skills in resume that match job requirements)
3. List missing skills (important skills from job description not in resume)
4. Provide 3-5 actionable suggestions to improve the resume for this job

Return ONLY a valid JSON object in this exact format:
{
  "matchScore": 75,
  "matchedSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": ["skill4", "skill5"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

  const response = await generateWithAI(prompt);

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);

      // Ensure all required fields exist with defaults
      return {
        matchScore: analysis.matchScore || 0,
        matchedSkills: Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills : [],
        missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : []
      };
    }

    // Fallback: basic analysis if AI response isn't properly formatted
    const resumeSkillsLower = resumeData.skills.map(s => s.toLowerCase());
    const jobSkillsLower = jobData.skills.map(s => s.toLowerCase());

    const matched = resumeSkillsLower.filter(skill =>
      jobSkillsLower.some(jobSkill =>
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );

    const missing = jobSkillsLower.filter(skill =>
      !resumeSkillsLower.some(resumeSkill =>
        resumeSkill.includes(skill) || skill.includes(resumeSkill)
      )
    );

    const matchScore = jobSkillsLower.length > 0
      ? Math.round((matched.length / jobSkillsLower.length) * 100)
      : 50;

    return {
      matchScore,
      matchedSkills: matched.slice(0, 10),
      missingSkills: missing.slice(0, 10),
      suggestions: [
        "Add missing skills to your resume if you have experience with them",
        "Tailor your experience descriptions to match job requirements",
        "Highlight relevant achievements that align with the job responsibilities"
      ]
    };
  } catch (error) {
    console.error('Error parsing AI analysis response:', error);
    throw new Error('Failed to analyze resume against job description. Please try again.');
  }
};

