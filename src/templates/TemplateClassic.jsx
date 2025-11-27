export default function TemplateClassic({ data, fontFamily, colorScheme }) {
  const primaryColor = colorScheme?.primary || "#9333ea";

  return (
    <div
      className="w-full max-w-[210mm] mx-auto text-[#222] leading-relaxed p-10 bg-white"
      style={{ fontFamily, minHeight: "297mm" }}
    >

      {/* HEADER */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-1">{data.name}</h1>
        {data.role && <p className="text-lg text-gray-600 mb-2">{data.role}</p>}

        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm">
          {data.email && <span>✉️ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>💻 {data.github}</span>}
          {data.website && <span>🌐 {data.website}</span>}
        </div>

        <hr className="mt-3 border-gray-400" />
      </header>

      {/* SUMMARY */}
      {data.summary && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>SUMMARY</h2>
          <p className="mt-2">{data.summary}</p>
        </section>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>EDUCATION</h2>

          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between gap-4 mt-4">
              <div className="flex-1">
                <p className="font-semibold">{edu.degree}</p>
                <p className="italic">{edu.institute || edu.school}</p>
                {edu.points && edu.points.length > 0 && (
                  <ul className="list-disc ml-6 mt-1">
                    {edu.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-right text-sm whitespace-nowrap flex-shrink-0" style={{ minWidth: "140px" }}>
                {edu.date}
                {edu.location && <><br />{edu.location}</>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>EXPERIENCE</h2>

          {data.experience.map((exp, idx) => (
            <div key={idx} className="flex justify-between gap-4 mt-4">
              <div className="flex-1">
                <p className="font-semibold">{exp.title || exp.position}</p>
                <p className="italic">{exp.company}</p>
                {exp.points && exp.points.length > 0 && (
                  <ul className="list-disc ml-6 mt-1">
                    {exp.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-right text-sm whitespace-nowrap flex-shrink-0" style={{ minWidth: "140px" }}>
                {exp.date}
                {exp.location && <><br />{exp.location}</>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>PROJECTS</h2>

          {data.projects.map((proj, idx) => (
            <div key={idx} className="flex justify-between gap-4 mt-4">
              <div className="flex-1">
                <p className="font-semibold">
                  {proj.title}
                  {proj.link && <> — <a className="underline text-blue-700" href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></>}
                </p>
                {proj.role && <p className="italic">{proj.role}</p>}
                {proj.points && proj.points.length > 0 && (
                  <ul className="list-disc ml-6 mt-1">
                    {proj.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-right text-sm whitespace-nowrap flex-shrink-0" style={{ minWidth: "140px" }}>{proj.date}</div>
            </div>
          ))}
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>ACHIEVEMENTS</h2>
          <ul className="list-disc ml-6 mt-3">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>SKILLS</h2>
          <p className="mt-3 leading-relaxed">
            {data.skills.languages && (
              <>
                <strong>Languages:</strong> {data.skills.languages}
                <br />
              </>
            )}
            {data.skills.frameworks && (
              <>
                <strong>Frameworks & Libraries:</strong> {data.skills.frameworks}
                <br />
              </>
            )}
            {data.skills.tools && (
              <>
                <strong>Tools & Technologies:</strong> {data.skills.tools}
                <br />
              </>
            )}
            {data.skills.other && (
              <>
                <strong>Other Skills:</strong> {data.skills.other}
              </>
            )}
          </p>
        </section>
      )}

      {/* LANGUAGES */}
      {data.languages && (
        <section className="mt-8">
          <h2 className="text-xl font-bold border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>LANGUAGES</h2>
          <p className="mt-3 leading-relaxed">{data.languages}</p>
        </section>
      )}

    </div>
  );
}
