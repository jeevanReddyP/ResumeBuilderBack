const safe = (v) => (v ? String(v) : "");

module.exports = (resume, theme = {}) => {
  const p = resume?.personalInfo || {};

  return `
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    padding: 30px;
    color: ${safe(theme.text) || "#111"};
  }
  h1 {
    margin-bottom: 4px;
    color: ${safe(theme.primary) || "#1f2933"};
  }
  h2 {
    border-bottom: 1px solid #ddd;
    margin-top: 18px;
    color: ${safe(theme.primary) || "#1f2933"};
  }
  .small { color:#555 }
</style>
</head>

<body>

<h1>${safe(p.firstname)} ${safe(p.lastname)}</h1>
<p class="small">
  ${safe(p.email)} | ${safe(p.phone)} | ${safe(p.linkedin)} | ${safe(p.github)}
</p>

<h2>Education</h2>
${(resume.education || []).map(e => `
  <p>
    <strong>${safe(e.degree)}</strong> - ${safe(e.institution)}<br/>
    ${year(e.startYear)} - ${year(e.endDate)}
  </p>
`).join("")}

<h2>Experience</h2>
${(resume.experience || []).map(exp => `
  <p>
    <strong>${safe(exp.role)}</strong> - ${safe(exp.company)}<br/>
    ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}<br/>
    ${safe(exp.description)}
  </p>
`).join("")}

<h2>Skills</h2>
<ul>
  ${(resume.skill || []).map(s => `<li>${safe(s)}</li>`).join("")}
</ul>

<h2>Projects</h2>
${(resume.projects || []).map(pj => `
  <p>
    <strong>${safe(pj.title)}</strong><br/>
    ${safe(pj.description)}<br/>
    <em>${(pj.techStack || []).map(safe).join(", ")}</em>
  </p>
`).join("")}

</body>
</html>
`;
};

function formatDate(date) {
  if (!date) return "Present";
  const d = new Date(date);
  return isNaN(d) ? "Present" : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function year(date) {
  if (!date) return "Present";
  const d = new Date(date);
  return isNaN(d) ? "Present" : d.getFullYear();
}
