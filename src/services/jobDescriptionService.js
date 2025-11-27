import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


 //* Extract text from PDF file
 //array buffer  is used to read binary data
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to read PDF file. The file might be corrupted or password-protected.');
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
    throw new Error('Failed to read DOCX file. The file might be corrupted.');
  }
};

/**
 * Extract text from TXT file
 */
const extractTextFromTXT = async (file) => {
  try {
    return await file.text();
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error('Failed to read text file.');
  }
};

/**
 * Parse job description text and extract structured information
 */
export const parseJobDescription = (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Job description text is empty');
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  const jobData = {
    rawText: text,
    title: '',
    company: '',
    location: '',
    type: '', // Full-time, Part-time, Contract, etc.
    requirements: [],
    responsibilities: [],
    qualifications: [],
    skills: [],
    experience: '',
    education: '',
    benefits: [],
    salary: ''
  };

  // Extract job title (usually in first few lines)
  const titlePatterns = [
    /job\s*title[:\s]+(.+)/i,
    /position[:\s]+(.+)/i,
    /role[:\s]+(.+)/i
  ];

  for (const line of lines.slice(0, 10)) {
    if (!jobData.title) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern);
        if (match) {
          jobData.title = match[1].trim();
          break;
        }
      }
      // If no pattern match, first substantial line might be the title
      if (!jobData.title && line.length > 10 && line.length < 100 && !line.includes('@')) {
        jobData.title = line;
      }
    }
  }

  // Extract company name
  const companyPatterns = [
    /company[:\s]+(.+)/i,
    /organization[:\s]+(.+)/i,
    /employer[:\s]+(.+)/i
  ];

  for (const line of lines) {
    for (const pattern of companyPatterns) {
      const match = line.match(pattern);
      if (match) {
        jobData.company = match[1].trim();
        break;
      }
    }
    if (jobData.company) break;
  }

  // Extract location
  const locationPatterns = [
    /location[:\s]+(.+)/i,
    /based\s+in[:\s]+(.+)/i,
    /office[:\s]+(.+)/i
  ];

  for (const line of lines) {
    for (const pattern of locationPatterns) {
      const match = line.match(pattern);
      if (match) {
        jobData.location = match[1].trim();
        break;
      }
    }
    if (jobData.location) break;
  }

  // Extract job type
  const typeKeywords = ['full-time', 'part-time', 'contract', 'freelance', 'temporary', 'remote'];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of typeKeywords) {
      if (lowerLine.includes(keyword)) {
        jobData.type = keyword.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
        break;
      }
    }
    if (jobData.type) break;
  }

  // Extract sections
  let currentSection = null;
  const sectionKeywords = {
    requirements: ['requirements', 'required', 'must have', 'required skills'],
    responsibilities: ['responsibilities', 'duties', 'what you will do', 'role description'],
    qualifications: ['qualifications', 'preferred', 'nice to have', 'preferred skills'],
    benefits: ['benefits', 'we offer', 'perks', 'what we offer'],
    skills: ['skills', 'technical skills', 'technologies']
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Check if this line is a section header
    let foundSection = null;
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      for (const keyword of keywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          foundSection = section;
          currentSection = section;
          break;
        }
      }
      if (foundSection) break;
    }

    if (foundSection) continue;

    // Add content to current section
    if (currentSection && line.length > 0) {
      // Check if it's a bullet point or numbered list item
      const isBullet = /^[•\-\*\d+\.)]\s*.+/.test(line);
      const content = line.replace(/^[•\-\*\d+\.)]\s*/, '').trim();

      if (content.length > 10) { // Only add substantial content
        if (Array.isArray(jobData[currentSection])) {
          jobData[currentSection].push(content);
        }
      }

      // Stop adding to section if we hit an empty line or very short line
      if (line.length < 5) {
        currentSection = null;
      }
    }

    // Extract experience requirements
    const expMatch = line.match(/(\d+)\+?\s*years?\s+(?:of\s+)?experience/i);
    if (expMatch && !jobData.experience) {
      jobData.experience = expMatch[0];
    }

    // Extract education requirements
    const eduPatterns = [
      /(bachelor'?s?|master'?s?|phd|doctorate|associate'?s?)\s+degree/i,
      /(bs|ba|ms|ma|mba|phd)\s+in/i
    ];
    for (const pattern of eduPatterns) {
      const match = line.match(pattern);
      if (match && !jobData.education) {
        jobData.education = match[0];
        break;
      }
    }

    // Extract salary information
    const salaryMatch = line.match(/\$[\d,]+\s*(?:-|to)\s*\$[\d,]+|\$[\d,]+k?/i);
    if (salaryMatch && !jobData.salary) {
      jobData.salary = salaryMatch[0];
    }
  }

  // Extract skills from requirements if skills section is empty
  if (jobData.skills.length === 0 && jobData.requirements.length > 0) {
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
      'kubernetes', 'typescript', 'angular', 'vue', 'git', 'agile', 'scrum',
      'html', 'css', 'rest api', 'graphql', 'mongodb', 'postgresql', 'redis',
      'ci/cd', 'jenkins', 'linux', 'microservices', 'api', 'database'
    ];

    const textLower = text.toLowerCase();
    jobData.skills = commonSkills.filter(skill => textLower.includes(skill.toLowerCase()));
  }

  return jobData;
};

/**
 * Import job description from file
 */
export const importJobDescriptionFile = async (file) => {
  try {
    let text = '';
    const fileType = file.type || '';
    const fileName = file.name.toLowerCase();

    // Extract text based on file type
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      text = await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      text = await extractTextFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await extractTextFromTXT(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT file.');
    }

    if (!text || text.trim().length < 50) {
      throw new Error('Job description file appears to be empty or too short.');
    }

    // Parse the extracted text
    const jobData = parseJobDescription(text);

    return {
      success: true,
      data: jobData
    };
  } catch (error) {
    console.error('Error importing job description:', error);
    return {
      success: false,
      error: error.message || 'Failed to import job description'
    };
  }
};

/**
 * Validate job description data
 */
export const validateJobDescription = (data) => {
  const warnings = [];

  if (!data.title) warnings.push('Job title not detected');
  if (!data.company) warnings.push('Company name not detected');
  if (data.requirements.length === 0) warnings.push('No requirements detected');
  if (data.responsibilities.length === 0) warnings.push('No responsibilities detected');
  if (data.skills.length === 0) warnings.push('No skills detected');

  return {
    isValid: warnings.length === 0,
    warnings
  };
};
