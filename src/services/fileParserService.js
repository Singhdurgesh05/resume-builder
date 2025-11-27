import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url';
import mammoth from 'mammoth';

// Configure PDF.js worker so Vite bundles it correctly
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


 // Extract text from PDF file
 
const getPdfText = async (arrayBuffer, options = {}) => {
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    stopAtErrors: false,
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
    ...options
  }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent({
      disableCombineTextItems: false,
      normalizeWhitespace: true
    });

    // Build text with better spacing - preserve line breaks based on Y position
    let lastY = null;
    const pageLines = [];
    let currentLine = '';

    textContent.items.forEach((item) => {
      const text = (item.str || '').trim();
      if (!text) return;

      const currentY = item.transform[5]; // Y coordinate

      // If Y position changed significantly, it's a new line
      if (lastY !== null && Math.abs(currentY - lastY) > 2) {
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = text;
      } else {
        // Same line - add space between items
        currentLine += (currentLine ? ' ' : '') + text;
      }

      lastY = currentY;
    });

    // Add last line
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    fullText += pageLines.join('\n') + '\n';
  }

  const cleanedText = fullText.replace(/\u0000/g, '').trim();
  console.log('PDF extraction - Full text length:', cleanedText.length);
  console.log('PDF extraction - First 1000 chars:', cleanedText.substring(0, 1000));

  return cleanedText;
};

const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    let fullText = await getPdfText(arrayBuffer);
    if (!fullText || fullText.trim().length === 0) {
      fullText = await getPdfText(arrayBuffer, {
        useXfa: true,
        ignoreErrors: true,
        disableFontFace: true,
        isEvalSupported: false
      });
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No extractable text found in PDF');
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to read PDF file. Please try a different file.');
  }
};

/**
 * Extract text from DOCX file
 */
const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to read DOCX file. Please try a different file.');
  }
};

/**
 * Parse resume text and extract structured data
 */
const parseResumeText = (text) => {
  const resumeData = {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    role: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  };

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) resumeData.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) resumeData.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) resumeData.linkedin = linkedinMatch[0];

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) resumeData.github = githubMatch[0];

  // Extract name (usually first line or before email)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  if (lines.length > 0) {
    // Try to find name in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Check if line looks like a name (2-4 words, capitalized, minimal special chars)
      // Allow for names like "Durgesh Singh" or "John Doe"
      if (line.length > 3 && line.length < 60 &&
          /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(line) &&
          !line.includes('@') &&
          !line.includes('http') &&
          !line.includes('#') &&
          !/\d{3,}/.test(line)) { // No long numbers
        resumeData.name = line;
        break;
      }
    }

    // Try to infer professional role/title
    if (!resumeData.role) {
      for (let i = 0; i < Math.min(6, lines.length); i++) {
        const line = lines[i];
        if (
          line &&
          line !== resumeData.name &&
          !line.includes('@') &&
          !line.toLowerCase().includes('linkedin') &&
          !line.toLowerCase().includes('github') &&
          !/\d/.test(line) &&
          line.length < 70
        ) {
          resumeData.role = line;
          break;
        }
      }
    }
  }

  // Extract sections
  const sections = {
    experience: /(?:experience|work history|employment|professional experience)/i,
    education: /(?:education|academic|qualifications)/i,
    skills: /(?:skills|technical skills|competencies|expertise)/i,
    projects: /(?:projects|portfolio)/i,
    summary: /(?:summary|profile|objective|about)/i,
    certifications: /(?:certifications|certificates|licenses)/i,
    languages: /(?:languages)/i
  };

  // Split text into sections
  const textLower = text.toLowerCase();

  // Extract skills section - improved to handle multiple formats
  const skillsIndex = textLower.search(sections.skills);
  if (skillsIndex !== -1) {
    // Look for next section or end of text
    let skillsEndIndex = -1;
    const nextSections = ['achievement', 'certification', 'project', 'education', 'experience', 'language'];
    for (const section of nextSections) {
      const idx = textLower.indexOf(section, skillsIndex + 20);
      if (idx !== -1 && (skillsEndIndex === -1 || idx < skillsEndIndex)) {
        skillsEndIndex = idx;
      }
    }

    const skillsText = text.substring(skillsIndex, skillsEndIndex !== -1 ? skillsEndIndex : skillsIndex + 1000);
    console.log('Skills section text:', skillsText);

    // Extract skills (comma-separated or line-separated)
    const skillLines = skillsText.split('\n'); // Don't skip first line yet
    skillLines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Skip the main "Skills" header line
      if (index === 0 && /^(skills|technical skills|competencies)$/i.test(trimmedLine)) return;

      // Check if line has a category label (e.g., "Languages:", "Frameworks/Libraries:")
      const categoryMatch = trimmedLine.match(/^([\w\s/&]+):\s*(.+)$/);
      if (categoryMatch) {
        // Extract skills after the colon
        const skillsStr = categoryMatch[2];
        const skills = skillsStr.split(/[,;]/).map(s => s.trim()).filter(s => s && s.length > 1);
        console.log(`Found skills in category "${categoryMatch[1]}":`, skills);
        skills.forEach(skill => {
          if (skill && !resumeData.skills.includes(skill)) {
            resumeData.skills.push(skill);
          }
        });
      } else if (trimmedLine.length > 2) {
        // Regular skill line (no category) - split by commas, bullets, pipes
        const skills = trimmedLine.split(/[,•·|;]/).map(s => s.trim()).filter(s => s && s.length > 1 && !/^(skills|technical|competencies)$/i.test(s));
        if (skills.length > 0) {
          console.log('Found skills in line:', skills);
          skills.forEach(skill => {
            if (skill && !resumeData.skills.includes(skill)) {
              resumeData.skills.push(skill);
            }
          });
        }
      }
    });
  }

  console.log('Total skills extracted:', resumeData.skills.length, resumeData.skills);

  // Helper to get section text
  const getSectionText = (startIndex, fallbackLength = 800) => {
    if (startIndex === -1) return null;
    const endIndex = textLower.indexOf('\n\n', startIndex + 50);
    return text.substring(startIndex, endIndex !== -1 ? endIndex : startIndex + fallbackLength);
  };

  // Extract experience section
  const expIndex = textLower.search(sections.experience);
  if (expIndex !== -1) {
    const expText = getSectionText(expIndex, 1500);

    // Try to extract experience entries (simplified)
    const expLines = expText.split('\n').filter(line => line.trim());
    let currentExp = null;

    expLines.forEach((line, index) => {
      if (index === 0) return; // Skip header

      // Check if line looks like a job title or company
      if (line.length > 5 && line.length < 100 && /[A-Z]/.test(line[0])) {
        if (currentExp && currentExp.title) {
          resumeData.experience.push(currentExp);
        }

        // Check if it contains dates (might be title + dates)
        const dateMatch = line.match(/(\d{4}|\w+ \d{4})/);
        if (dateMatch) {
          const titlePart = line.substring(0, dateMatch.index).trim();
          currentExp = {
            title: titlePart || line,
            company: '',
            date: line.substring(dateMatch.index).trim(),
            points: []
          };
        } else {
          currentExp = {
            title: line,
            company: '',
            date: '',
            points: []
          };
        }
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        currentExp.points.push(line.replace(/^[•\-*]\s*/, '').trim());
      }
    });

    if (currentExp && currentExp.title) {
      resumeData.experience.push(currentExp);
    }
  }

  // Extract education section - improved
  const eduIndex = textLower.search(sections.education);
  if (eduIndex !== -1) {
    // Find end of education section
    let eduEndIndex = -1;
    const afterEduSections = ['skill', 'achievement', 'certification', 'project', 'language', 'reference'];
    for (const section of afterEduSections) {
      const idx = textLower.indexOf(section, eduIndex + 20);
      if (idx !== -1 && (eduEndIndex === -1 || idx < eduEndIndex)) {
        eduEndIndex = idx;
      }
    }

    const eduText = text.substring(eduIndex, eduEndIndex !== -1 ? eduEndIndex : eduIndex + 1500);
    console.log('Education section text:', eduText);

    const eduLines = eduText.split('\n').filter(line => line.trim());
    let currentEdu = null;

    eduLines.forEach((line, index) => {
      if (index === 0 && /^education$/i.test(line.trim())) return; // Skip header

      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Check if this line contains a date pattern
      const dateMatch = trimmedLine.match(/(\d{4}\s*[-–—]\s*\d{4}|\d{4}\s*[-–—]\s*\w+|\w+\.?\s+\d{4}\s*[-–—]\s*\w+\.?\s+\d{4})/);

      // Check for bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        const pointText = trimmedLine.replace(/^[•\-*]\s*/, '').trim();
        if (currentEdu && pointText) {
          currentEdu.points.push(pointText);
        }
      }
      // Line with date - likely institute or degree line
      else if (dateMatch) {
        // Save previous education entry
        if (currentEdu && (currentEdu.degree || currentEdu.institute)) {
          resumeData.education.push(currentEdu);
        }

        const beforeDate = trimmedLine.substring(0, dateMatch.index).trim();
        const dateStr = dateMatch[0].trim();

        currentEdu = {
          degree: beforeDate || '',
          institute: '',
          date: dateStr,
          points: []
        };
      }
      // Institute name or degree (lines that start with capital letter)
      else if (trimmedLine.length > 5 && /[A-Z]/.test(trimmedLine[0])) {
        if (!currentEdu) {
          currentEdu = {
            degree: '',
            institute: trimmedLine,
            date: '',
            points: []
          };
        } else if (!currentEdu.institute) {
          currentEdu.institute = trimmedLine;
        } else if (!currentEdu.degree) {
          currentEdu.degree = trimmedLine;
        }
      }
      // CGPA, GPA, or coursework lines
      else if (currentEdu && (trimmedLine.toLowerCase().includes('cgpa') ||
                              trimmedLine.toLowerCase().includes('gpa') ||
                              trimmedLine.toLowerCase().includes('coursework'))) {
        currentEdu.points.push(trimmedLine);
      }
    });

    if (currentEdu && (currentEdu.degree || currentEdu.institute)) {
      resumeData.education.push(currentEdu);
    }

    console.log('Education extracted:', resumeData.education.length, resumeData.education);
  }

  // Extract summary
  const summaryIndex = textLower.search(sections.summary);
  if (summaryIndex !== -1) {
    const summaryText = getSectionText(summaryIndex, 600);
    const summaryLines = summaryText.split('\n').slice(1); // Skip header
    resumeData.summary = summaryLines.join(' ').trim();
  }

  // Extract projects section - improved
  const projIndex = textLower.search(sections.projects);
  if (projIndex !== -1) {
    // Find end of projects section
    let projEndIndex = -1;
    const afterProjectSections = ['education', 'skill', 'achievement', 'certification', 'language'];
    for (const section of afterProjectSections) {
      const idx = textLower.indexOf(section, projIndex + 20);
      if (idx !== -1 && (projEndIndex === -1 || idx < projEndIndex)) {
        projEndIndex = idx;
      }
    }

    const projText = text.substring(projIndex, projEndIndex !== -1 ? projEndIndex : projIndex + 2000);
    console.log('Projects section text:', projText);

    if (projText) {
      const projLines = projText.split('\n').map(line => line.trim()).filter(line => line);
      let currentProj = null;

      projLines.forEach((line, index) => {
        if (index === 0 && /^projects?$/i.test(line)) return; // skip header

        // Check for bullet points
        if (/^[-•*]/.test(line)) {
          const pointText = line.replace(/^[-•*]\s*/, '').trim();
          if (currentProj && pointText) {
            currentProj.points.push(pointText);
          }
        }
        // Check if it's a project title (usually bold or standalone line before bullets)
        else if (line.length > 3 && line.length < 150 && !line.includes(':') && /[A-Z]/.test(line[0])) {
          // Save previous project if exists
          if (currentProj && currentProj.title) {
            resumeData.projects.push(currentProj);
          }
          currentProj = {
            title: line.replace(/[:\-–—]+$/, '').trim(),
            link: line.includes('http') ? line.match(/https?:\/\/\S+/)?.[0] || '' : '',
            role: '',
            date: '',
            points: []
          };
        }
        // Check if it's metadata (Tech Stack, Role, etc.)
        else if (currentProj && line.includes(':')) {
          const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
          if (colonMatch) {
            const label = colonMatch[1].toLowerCase();
            const value = colonMatch[2].trim();
            if (label.includes('tech') || label.includes('stack') || label.includes('technolog')) {
              // Add tech stack items as additional context in points
              currentProj.points.push(`Tech Stack: ${value}`);
            } else if (label.includes('role')) {
              currentProj.role = value;
            }
          }
        }
      });

      // Save last project
      if (currentProj && currentProj.title) {
        resumeData.projects.push(currentProj);
      }

      console.log('Projects extracted:', resumeData.projects.length, resumeData.projects);
    }
  }

  // Extract certifications/achievements - improved
  const certIndex = textLower.search(sections.certifications);
  if (certIndex !== -1) {
    // Find end of certifications section
    let certEndIndex = -1;
    const afterCertSections = ['reference', 'declaration'];
    for (const section of afterCertSections) {
      const idx = textLower.indexOf(section, certIndex + 20);
      if (idx !== -1 && (certEndIndex === -1 || idx < certEndIndex)) {
        certEndIndex = idx;
      }
    }

    const certText = text.substring(certIndex, certEndIndex !== -1 ? certEndIndex : certIndex + 1000);
    console.log('Certifications section text:', certText);

    if (certText) {
      const certLines = certText.split('\n');
      certLines.forEach((line, index) => {
        // Skip header line
        if (index === 0 && /^(achievement|certification)/i.test(line.trim())) return;

        const trimmed = line.replace(/^[-•*]\s*/, '').trim();
        if (trimmed && trimmed.length > 5) {
          resumeData.certifications.push(trimmed);
        }
      });

      console.log('Certifications extracted:', resumeData.certifications.length, resumeData.certifications);
    }
  }

  // Extract languages
  const langIndex = textLower.search(sections.languages);
  if (langIndex !== -1) {
    const langText = getSectionText(langIndex, 500);
    if (langText) {
      const langLines = langText
        .split('\n')
        .slice(1)
        .join(' ')
        .split(/[,•\n]/)
        .map(lang => lang.replace(/^[-*]\s*/, '').trim())
        .filter(lang => lang && lang.length > 1);
      if (langLines.length > 0) {
        resumeData.languages = langLines;
      }
    }
  }

  // If summary not detected, use first paragraph after contact
  if (!resumeData.summary) {
    const paragraph = text.split('\n\n').find(block => {
      const trimmed = block.trim();
      return trimmed &&
        !trimmed.toLowerCase().includes('experience') &&
        !trimmed.toLowerCase().includes('education') &&
        trimmed.length > 40 &&
        trimmed.length < 800;
    });
    if (paragraph) {
      resumeData.summary = paragraph.replace(/\s+/g, ' ').trim();
    }
  }

  // Ensure skills array populated even if section missing by looking for "Skills:" inline
  if (resumeData.skills.length === 0) {
    const inlineSkillsMatch = text.match(/skills?\s*[:\-]\s*(.+)/i);
    if (inlineSkillsMatch) {
      resumeData.skills = inlineSkillsMatch[1]
        .split(/[,•|]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1);
    }
  }

  return resumeData;
};

/**
 * Import and parse resume file
 */
export const importResumeFile = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let text = '';

    // Extract text based on file type
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      text = await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      text = await extractTextFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Could not extract text from file. The file might be empty or corrupted.');
    }

    // Log extracted text for debugging
    console.log('=== EXTRACTED TEXT FROM PDF ===');
    console.log('Text length:', text.length);
    console.log('First 500 characters:', text.substring(0, 500));
    console.log('Full text:', text);

    // Parse the extracted text
    const resumeData = parseResumeText(text);

    // Log parsed data for debugging
    console.log('=== PARSED RESUME DATA ===');
    console.log('Name:', resumeData.name);
    console.log('Email:', resumeData.email);
    console.log('Phone:', resumeData.phone);
    console.log('Role:', resumeData.role);
    console.log('Experience entries:', resumeData.experience.length);
    console.log('Education entries:', resumeData.education.length);
    console.log('Skills count:', resumeData.skills.length);
    console.log('Projects count:', resumeData.projects.length);
    console.log('Full data:', resumeData);

    return {
      success: true,
      data: resumeData,
      rawText: text
    };
  } catch (error) {
    console.error('Error importing resume:', error);
    return {
      success: false,
      error: error.message || 'Failed to import resume'
    };
  }
};

/**
 * Convert parsed resume data to the structure used by the editor
 */
export const buildResumeEditorData = (parsedData = {}) => {
  const toArray = (value) => (Array.isArray(value) ? value : []);

  // Ensure experience has all required fields with proper fallbacks
  const experience = toArray(parsedData.experience).map((exp) => {
    const startYear = exp.start || (exp.date ? exp.date.split(/[-–—]/)[0]?.trim() : "");
    const endYear = exp.end || (exp.date ? exp.date.split(/[-–—]/)[1]?.trim() : "");
    const points = toArray(exp.points);

    return {
      title: exp.title || exp.position || "",
      company: exp.company || "",
      date: exp.date || (startYear && endYear ? `${startYear} – ${endYear}` : ""),
      location: exp.location || "",
      points: points,
      position: exp.position || exp.title || "",
      start: startYear,
      end: endYear,
      description: points
    };
  });

  // Ensure education has all required fields with proper fallbacks
  const education = toArray(parsedData.education).map((edu) => {
    const startYear = edu.start || (edu.date ? edu.date.split(/[-–—]/)[0]?.trim() : "");
    const endYear = edu.end || (edu.date ? edu.date.split(/[-–—]/)[1]?.trim() : "");
    const points = toArray(edu.points);

    return {
      degree: edu.degree || edu.title || "",
      institute: edu.institute || edu.school || "",
      date: edu.date || (startYear && endYear ? `${startYear} – ${endYear}` : ""),
      location: edu.location || "",
      points: points,
      school: edu.school || edu.institute || "",
      start: startYear,
      end: endYear
    };
  });

  // Ensure projects have all required fields
  const projects = toArray(parsedData.projects).map((proj) => ({
    title: proj.title || "",
    link: proj.link || "",
    role: proj.role || "",
    date: proj.date || "",
    points: toArray(proj.points)
  }));

  // Process skills
  const skillsArray = toArray(parsedData.skills);
  const skillString = skillsArray.join(", ");

  return {
    name: parsedData.name || "",
    role: parsedData.role || "",
    phone: parsedData.phone || "",
    email: parsedData.email || "",
    linkedin: parsedData.linkedin || "",
    github: parsedData.github || "",
    location: parsedData.location || "",
    website: parsedData.website || "",
    summary: parsedData.summary || "",
    address: {
      line1: parsedData.address?.line1 || "",
      city: parsedData.address?.city || "",
      state: parsedData.address?.state || "",
      zip: parsedData.address?.zip || ""
    },
    experience: experience,
    education: education,
    projects: projects,
    achievements: toArray(parsedData.certifications),
    skills: {
      languages: skillString,
      frameworks: "",
      databases: "",
      cloud: "",
      tools: "",
      skillsList: skillsArray.map((skill) => ({
        name: skill,
        level: 70
      }))
    },
    languages: toArray(parsedData.languages),
    certifications: toArray(parsedData.certifications)
  };
};

/**
 * Validate imported resume data
 */
export const validateResumeData = (data) => {
  const warnings = [];

  if (!data.name) warnings.push('Name not detected');
  if (!data.email) warnings.push('Email not detected');
  if (!data.phone) warnings.push('Phone not detected');
  if (data.experience.length === 0) warnings.push('No experience entries found');
  if (data.education.length === 0) warnings.push('No education entries found');
  if (data.skills.length === 0) warnings.push('No skills found');

  return {
    isValid: warnings.length < 3, // At least some data should be present
    warnings
  };
};
