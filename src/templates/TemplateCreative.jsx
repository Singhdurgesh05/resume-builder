const TemplateCreative = ({ data, fontFamily, colorScheme }) => {
  const skillsList = data.skills?.skillsList || data.skills || [];
  const primaryColor = colorScheme?.primary || "#059669";
  const secondaryColor = colorScheme?.secondary || "#10b981";

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white shadow-lg"
      style={{ fontFamily }}
    >
      {/* HEADER WITH DIAGONAL ACCENT */}
      <div className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-2/3 h-full transform skew-x-12 translate-x-1/3"
          style={{ backgroundColor: primaryColor, opacity: 0.1 }}
        ></div>

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: primaryColor }}>
                {data.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mt-2 font-medium">
                {data.role}
              </p>
            </div>

            <div className="mt-6 md:mt-0 text-sm md:text-right space-y-1">
              <p className="text-gray-700">{data.email}</p>
              <p className="text-gray-700">{data.phone}</p>
              {data.location && <p className="text-gray-700">{data.location}</p>}
              {data.linkedin && (
                <p className="text-gray-700">LinkedIn: {data.linkedin}</p>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          {data.summary && (
            <div className="mt-8">
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* SKILLS */}
          {skillsList && skillsList.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                SKILLS
              </h2>
              <div className="space-y-3">
                {skillsList.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {skill.name || skill}
                      </span>
                      {skill.level && (
                        <span className="text-xs text-gray-500">{skill.level}%</span>
                      )}
                    </div>
                    {skill.level && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: primaryColor
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                LANGUAGES
              </h2>
              <ul className="space-y-2 text-sm">
                {data.languages.map((lang, i) => (
                  <li key={i} className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: primaryColor }}
                    ></span>
                    <span className="text-gray-700">{lang}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                CERTIFICATIONS
              </h2>
              <div className="space-y-3 text-sm">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-medium text-gray-800">{cert.name || cert.title}</p>
                    {cert.issuer && <p className="text-gray-600 text-xs">{cert.issuer}</p>}
                    {cert.date && <p className="text-gray-500 text-xs">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-8">
          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-6 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2" style={{ borderColor: secondaryColor }}>
                    <div
                      className="absolute -left-2 top-1 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: primaryColor }}
                    ></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-sm font-medium" style={{ color: primaryColor }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {exp.date || `${exp.startDate} - ${exp.endDate || 'Present'}`}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-xs text-gray-600 mb-2">{exp.location}</p>
                    )}
                    {exp.points && exp.points.length > 0 && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {exp.points.map((point, j) => (
                          <li key={j} className="flex">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-6 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                EDUCATION
              </h2>
              <div className="space-y-6">
                {data.education.map((edu, i) => (
                  <div key={i} className="relative pl-6 border-l-2" style={{ borderColor: secondaryColor }}>
                    <div
                      className="absolute -left-2 top-1 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: primaryColor }}
                    ></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-sm font-medium" style={{ color: primaryColor }}>
                          {edu.institute || edu.school || edu.institution}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {edu.date || `${edu.startDate || edu.start} - ${edu.endDate || edu.end || 'Present'}`}
                      </span>
                    </div>
                    {edu.location && (
                      <p className="text-xs text-gray-600 mb-2">{edu.location}</p>
                    )}
                    {edu.points && edu.points.length > 0 && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {edu.points.map((point, j) => (
                          <li key={j} className="flex">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-6 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: secondaryColor }}
              >
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {proj.title || proj.name}
                      </h3>
                      {proj.date && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {proj.date}
                        </span>
                      )}
                    </div>
                    {proj.points && proj.points.length > 0 && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {proj.points.map((point, j) => (
                          <li key={j} className="flex">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCreative;
