const TemplateMinimal = ({ data, fontFamily, colorScheme }) => {
  const primaryColor = colorScheme?.primary || "#9333ea";

  return (
    <div className="bg-gray-100 p-8" style={{ fontFamily }}>
      <div className="resume-container bg-white flex flex-col md:flex-row min-h-screen mx-auto shadow-md"
        style={{ maxWidth: "8.5in" }}
      >

        {/* MAIN CONTENT */}
        <div className="main-content p-8 pt-10 border-r border-gray-200 flex-1">

          {/* HEADER */}
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              {data.name}
            </h1>
            {data.role && (
              <p className="text-xl font-semibold text-gray-600 border-b-2 border-gray-300 pb-2">
                {data.role}
              </p>
            )}
          </header>

          {/* PROFILE / SUMMARY */}
          {data.summary && (
            <section className="mb-8">
              <h2 className="section-title" style={{ color: primaryColor, borderColor: primaryColor }}>Profile</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {data.summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="section-title" style={{ color: primaryColor, borderColor: primaryColor }}>Professional Experience</h2>

              {data.experience.map((exp, idx) => (
                <div key={idx} className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{exp.title || exp.position}</h3>
                      {exp.company && <p className="text-sm italic text-gray-600">{exp.company}</p>}
                    </div>

                    <div className="text-right">
                      {exp.date && <p className="text-sm text-gray-600 font-medium">{exp.date}</p>}
                      {exp.location && <p className="text-xs italic text-gray-500">{exp.location}</p>}
                    </div>
                  </div>

                  {exp.points && exp.points.length > 0 && (
                    <ul className="custom-bullets text-sm text-gray-700 mt-2">
                      {exp.points.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="section-title" style={{ color: primaryColor, borderColor: primaryColor }}>Key Projects</h2>

              {data.projects.map((proj, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{proj.title}</h3>
                      {proj.role && <p className="text-sm italic text-gray-600">{proj.role}</p>}
                    </div>

                    {proj.link && (
                      <a href={proj.link} className="text-xs text-blue-600 hover:underline font-semibold">
                        View
                      </a>
                    )}
                  </div>

                  {proj.date && <p className="text-xs text-gray-500 mt-1">{proj.date}</p>}

                  {proj.points && proj.points.length > 0 && (
                    <ul className="custom-bullets text-sm text-gray-700 mt-2">
                      {proj.points.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <section className="mb-8">
              <h2 className="section-title" style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>

              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{edu.degree}</h3>
                      {(edu.institute || edu.school) && (
                        <p className="text-sm italic text-gray-600">{edu.institute || edu.school}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {edu.date && <p className="text-sm text-gray-600 font-medium">{edu.date}</p>}
                      {edu.location && <p className="text-xs italic text-gray-500">{edu.location}</p>}
                    </div>
                  </div>

                  {edu.points && edu.points.length > 0 && (
                    <ul className="custom-bullets text-sm text-gray-700 mt-2">
                      {edu.points.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* ACHIEVEMENTS */}
          {data.achievements && data.achievements.length > 0 && (
            <section>
              <h2 className="section-title" style={{ color: primaryColor, borderColor: primaryColor }}>Achievements</h2>
              <ul className="custom-bullets text-sm text-gray-700">
                {data.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="sidebar bg-gray-50 p-8 pt-10 text-gray-700 w-[30%] space-y-8">

          {/* CONTACT */}
          <section>
            <h2 className="sidebar-title" style={{ color: primaryColor, borderColor: primaryColor }}>Contact</h2>
            <div className="space-y-1 text-sm">
              {data.email && <p>{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
              {data.location && <p>{data.location}</p>}
              {data.linkedin && <p>{data.linkedin}</p>}
              {data.github && <p>{data.github}</p>}
              {data.website && <p>{data.website}</p>}
            </div>
          </section>

          {/* SKILLS */}
          {data.skills && (
            <section>
              <h2 className="sidebar-title" style={{ color: primaryColor, borderColor: primaryColor }}>Skills</h2>

              {data.skills.languages && (
                <>
                  <h3 className="skill-heading">LANGUAGES</h3>
                  <div className="skill-badges">
                    {data.skills.languages.split(",").map((skill, idx) => (
                      <span key={idx} className="badge">{skill.trim()}</span>
                    ))}
                  </div>
                </>
              )}

              {data.skills.frameworks && (
                <>
                  <h3 className="skill-heading mt-4">FRAMEWORKS</h3>
                  <div className="skill-badges">
                    {data.skills.frameworks.split(",").map((skill, idx) => (
                      <span key={idx} className="badge">{skill.trim()}</span>
                    ))}
                  </div>
                </>
              )}

              {data.skills.tools && (
                <>
                  <h3 className="skill-heading mt-4">TOOLS</h3>
                  <div className="skill-badges">
                    {data.skills.tools.split(",").map((skill, idx) => (
                      <span key={idx} className="badge">{skill.trim()}</span>
                    ))}
                  </div>
                </>
              )}

              {data.skills.other && (
                <>
                  <h3 className="skill-heading mt-4">OTHER</h3>
                  <div className="skill-badges">
                    {data.skills.other.split(",").map((skill, idx) => (
                      <span key={idx} className="badge">{skill.trim()}</span>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* LANGUAGES */}
          {data.languages && (
            <section>
              <h2 className="sidebar-title" style={{ color: primaryColor, borderColor: primaryColor }}>Languages</h2>
              <p className="text-sm">{data.languages}</p>
            </section>
          )}

        </div>
      </div>

      {/* Custom Tailwind-based bullet styling */}
      <style>
        {`
          .custom-bullets li {
            position: relative;
            padding-left: 1.2rem;
            margin-bottom: 0.4rem;
          }
          .custom-bullets li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0.5rem;
            height: 0.25rem;
            width: 0.25rem;
            background-color: ${primaryColor};
            border-radius: 50%;
          }
          .section-title {
            @apply text-lg font-bold uppercase text-gray-600 mb-3 border-b-2 border-gray-300 pb-1;
          }
          .sidebar-title {
            @apply text-lg font-bold uppercase text-gray-600 mb-3 border-b border-gray-300 pb-1;
          }
          .skill-heading {
            @apply text-sm font-semibold text-gray-800 mb-1;
          }
          .badge {
            @apply bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium;
          }
          .skill-badges {
            @apply flex flex-wrap gap-2;
          }
        `}
      </style>

    </div>
  );
};

export default TemplateMinimal;
