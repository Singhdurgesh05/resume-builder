const TemplateProfessional = ({ data, fontFamily, colorScheme }) => {
  const skillsList = data.skills?.skillsList || data.skills || [];
  const primaryColor = colorScheme?.primary || "#059669";
  const secondaryColor = colorScheme?.secondary || "#10b981";

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white shadow-lg"
      style={{ fontFamily }}
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {data.name}
          </h1>
          <div
            className="w-24 h-1 mb-4"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            {data.role}
          </p>

          {/* CONTACT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
            {data.email && (
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span>{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{data.location}</span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex items-center">
                <span className="mr-2">🔗</span>
                <span>{data.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* SUMMARY */}
        {data.summary && (
          <div className="mb-10">
            <h2
              className="text-2xl font-bold mb-4 flex items-center"
              style={{ color: primaryColor }}
            >
              <span
                className="w-1 h-8 mr-3"
                style={{ backgroundColor: primaryColor }}
              ></span>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed pl-4">
              {data.summary}
            </p>
          </div>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-2xl font-bold mb-6 flex items-center"
              style={{ color: primaryColor }}
            >
              <span
                className="w-1 h-8 mr-3"
                style={{ backgroundColor: primaryColor }}
              ></span>
              EXPERIENCE
            </h2>
            <div className="space-y-6 pl-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      <p
                        className="text-base font-semibold"
                        style={{ color: secondaryColor }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span
                        className="text-sm font-medium px-3 py-1 rounded"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor
                        }}
                      >
                        {exp.date || `${exp.startDate} - ${exp.endDate || 'Present'}`}
                      </span>
                      {exp.location && (
                        <p className="text-xs text-gray-500 mt-1">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  {exp.points && exp.points.length > 0 && (
                    <ul className="space-y-2 text-sm text-gray-700 mt-3">
                      {exp.points.map((point, j) => (
                        <li key={j} className="flex">
                          <span
                            className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          ></span>
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
          <div className="mb-10">
            <h2
              className="text-2xl font-bold mb-6 flex items-center"
              style={{ color: primaryColor }}
            >
              <span
                className="w-1 h-8 mr-3"
                style={{ backgroundColor: primaryColor }}
              ></span>
              EDUCATION
            </h2>
            <div className="space-y-6 pl-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p
                        className="text-base font-semibold"
                        style={{ color: secondaryColor }}
                      >
                        {edu.institute || edu.school || edu.institution}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span
                        className="text-sm font-medium px-3 py-1 rounded"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor
                        }}
                      >
                        {edu.date || `${edu.startDate || edu.start} - ${edu.endDate || edu.end || 'Present'}`}
                      </span>
                      {edu.location && (
                        <p className="text-xs text-gray-500 mt-1">{edu.location}</p>
                      )}
                    </div>
                  </div>
                  {edu.points && edu.points.length > 0 && (
                    <ul className="space-y-2 text-sm text-gray-700 mt-3">
                      {edu.points.map((point, j) => (
                        <li key={j} className="flex">
                          <span
                            className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
                          ></span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* SKILLS */}
          {skillsList && skillsList.length > 0 && (
            <div>
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1 h-8 mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                SKILLS
              </h2>
              <div className="space-y-4 pl-4">
                {skillsList.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {skill.name || skill}
                      </span>
                      {skill.level && (
                        <span
                          className="text-xs font-medium"
                          style={{ color: primaryColor }}
                        >
                          {skill.level}%
                        </span>
                      )}
                    </div>
                    {skill.level && (
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${skill.level}%`,
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                          }}
                        ></div>
                      </div>
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
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1 h-8 mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                PROJECTS
              </h2>
              <div className="space-y-5 pl-4">
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
                            <span
                              className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: primaryColor }}
                            ></span>
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

        {/* CERTIFICATIONS & LANGUAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1 h-8 mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3 pl-4 text-sm">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-bold text-gray-900">
                      {cert.name || cert.title}
                    </p>
                    {cert.issuer && (
                      <p className="text-gray-700">{cert.issuer}</p>
                    )}
                    {cert.date && (
                      <p className="text-gray-500 text-xs">{cert.date}</p>
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
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <span
                  className="w-1 h-8 mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                LANGUAGES
              </h2>
              <div className="grid grid-cols-2 gap-3 pl-4 text-sm">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: primaryColor }}
                    ></span>
                    <span className="text-gray-700 font-medium">{lang}</span>
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

export default TemplateProfessional;
