export const generateResumePrompt = (details) => `
You are an expert resume writer. Generate a professional resume in JSON format.

User Details:
Name: ${details.name}
Job Title: ${details.title}
Skills: ${details.skills}
Experience: ${details.experience}
Education: ${details.education}

Return JSON ONLY:
{
  "name": "",
  "title": "",
  "summary": "",
  "skills": [],
  "experience": [{ "role": "", "company": "", "duration": "", "description": "" }],
  "education": [{ "degree": "", "school": "", "year": "" }]
}
`;


