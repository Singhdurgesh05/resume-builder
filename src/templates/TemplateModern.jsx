const TemplateModern = ({ data, fontFamily, colorScheme }) => {
  const primaryColor = colorScheme?.primary || "#9333ea";
  const secondaryColor = colorScheme?.secondary || "#a855f7";

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white shadow-lg grid grid-cols-1 md:grid-cols-3"
      style={{ fontFamily }}
    >

      {/* LEFT SIDEBAR */}
      <div className="bg-gray-100 p-6 md:p-8 border-r">
        <h1 className="text-3xl font-extrabold leading-tight">{data.name}</h1>
        {data.role && <p className="text-gray-600 mt-1">{data.role}</p>}

        {/* DETAILS */}
        <div className="mt-10">
          <h2 className="text-sm font-bold tracking-wider" style={{ color: primaryColor }}>CONTACT</h2>

          <div className="mt-4 text-sm space-y-3">
            {data.email && (
              <>
                <p className="font-semibold">EMAIL</p>
                <p className="text-gray-700 break-all">{data.email}</p>
              </>
            )}

            {data.phone && (
              <>
                <p className="font-semibold">PHONE</p>
                <p className="text-gray-700">{data.phone}</p>
              </>
            )}

            {data.location && (
              <>
                <p className="font-semibold">LOCATION</p>
                <p className="text-gray-700">{data.location}</p>
              </>
            )}

            {data.address && (data.address.line1 || data.address.city) && (
              <>
                <p className="font-semibold">ADDRESS</p>
                <p className="text-gray-700">
                  {data.address.line1 && <>{data.address.line1}<br /></>}
                  {data.address.line2 && <>{data.address.line2}<br /></>}
                  {data.address.city && data.address.state && (
                    <>{data.address.city}, {data.address.state} {data.address.zip}</>
                  )}
                </p>
              </>
            )}

            {data.linkedin && (
              <>
                <p className="font-semibold">LINKEDIN</p>
                <p className="text-gray-700 break-all">{data.linkedin}</p>
              </>
            )}

            {data.github && (
              <>
                <p className="font-semibold">GITHUB</p>
                <p className="text-gray-700 break-all">{data.github}</p>
              </>
            )}

            {data.website && (
              <>
                <p className="font-semibold">WEBSITE</p>
                <p className="text-gray-700 break-all">{data.website}</p>
              </>
            )}
          </div>
        </div>

        {/* SKILLS */}
        {data.skills && (
          <div className="mt-10">
            <h2 className="text-sm font-bold tracking-wider" style={{ color: primaryColor }}>SKILLS</h2>

            <div className="mt-4 text-sm space-y-3">
              {data.skills.languages && (
                <>
                  <p className="font-semibold">Languages</p>
                  <p className="text-gray-700">{data.skills.languages}</p>
                </>
              )}

              {data.skills.frameworks && (
                <>
                  <p className="font-semibold">Frameworks</p>
                  <p className="text-gray-700">{data.skills.frameworks}</p>
                </>
              )}

              {data.skills.tools && (
                <>
                  <p className="font-semibold">Tools</p>
                  <p className="text-gray-700">{data.skills.tools}</p>
                </>
              )}

              {data.skills.other && (
                <>
                  <p className="font-semibold">Other</p>
                  <p className="text-gray-700">{data.skills.other}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {data.languages && (
          <div className="mt-10">
            <h2 className="text-sm font-bold tracking-wider" style={{ color: primaryColor }}>LANGUAGES</h2>
            <p className="mt-4 text-sm text-gray-700">{data.languages}</p>
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="col-span-2 p-6 md:p-8">

        {/* SUMMARY */}
        {data.summary && (
          <div>
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>SUMMARY</h2>
            <div className="border-t-2 mt-1 pt-4 text-gray-700 text-sm" style={{ borderColor: secondaryColor }}>
              {data.summary}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>EXPERIENCE</h2>
            <div className="border-t-2 mt-1 pt-4 space-y-8" style={{ borderColor: secondaryColor }}>
              {data.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <p>
                      <span className="font-bold">{job.position || job.title}</span>
                      {job.company && <>, {job.company}</>}
                    </p>
                    {job.location && <p className="text-gray-600">{job.location}</p>}
                  </div>

                  {job.date && <p className="text-gray-600 text-xs">{job.date}</p>}

                  {job.points && job.points.length > 0 && (
                    <ul className="list-disc pl-5 text-gray-700 text-sm mt-2">
                      {job.points.map((d, j) => (
                        <li key={j}>{d}</li>
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
          <div className="mt-10">
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>PROJECTS</h2>
            <div className="border-t-2 mt-1 pt-4 space-y-8" style={{ borderColor: secondaryColor }}>
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <p>
                      <span className="font-bold">{proj.title}</span>
                      {proj.role && <> — {proj.role}</>}
                    </p>
                    {proj.date && <p className="text-gray-600">{proj.date}</p>}
                  </div>

                  {proj.link && (
                    <p className="text-xs text-blue-600 break-all">
                      <a href={proj.link}>{proj.link}</a>
                    </p>
                  )}

                  {proj.points && proj.points.length > 0 && (
                    <ul className="list-disc pl-5 text-gray-700 text-sm mt-2">
                      {proj.points.map((p, j) => (
                        <li key={j}>{p}</li>
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
          <div className="mt-10">
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>EDUCATION</h2>
            <div className="border-t-2 mt-1 pt-4 space-y-6" style={{ borderColor: secondaryColor }}>
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <p>
                      <span className="font-bold">{edu.degree}</span>
                      {(edu.school || edu.institute) && <>, {edu.school || edu.institute}</>}
                    </p>
                    {edu.location && <p className="text-gray-600">{edu.location}</p>}
                  </div>

                  {edu.date && <p className="text-gray-600 text-xs">{edu.date}</p>}

                  {edu.points && edu.points.length > 0 && (
                    <ul className="list-disc pl-5 text-gray-700 text-sm mt-2">
                      {edu.points.map((p, j) => (
                        <li key={j}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>ACHIEVEMENTS</h2>
            <div className="border-t-2 mt-1 pt-4" style={{ borderColor: secondaryColor }}>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
                {data.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TemplateModern;
