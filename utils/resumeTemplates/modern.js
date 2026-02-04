const safe = (v) => (v ? String(v) : "");

module.exports = (resume, theme = {}) => {
  const p = resume?.personalInfo || {};

  return `
<html>
<head>
<style>
  body { margin:0; font-family:Segoe UI, sans-serif; }
  .wrap { display:flex; min-height:100vh; }
  .left {
    width:30%;
    background:${safe(theme.primary) || "#2563eb"};
    color:white;
    padding:20px;
  }
  .right {
    width:70%;
    padding:30px;
    color:${safe(theme.text) || "#111"};
  }
</style>
</head>

<body>
<div class="wrap">

<div class="left">
  <h2>${safe(p.firstname)} ${safe(p.lastname)}</h2>
  <p>${safe(p.email)}</p>
  <p>${safe(p.phone)}</p>
  <p>${safe(p.linkedin)}</p>
  <p>${safe(p.github)}</p>

  <h3>Skills</h3>
  <ul>
    ${(resume.skill || []).map(s => `<li>${safe(s)}</li>`).join("")}
  </ul>
</div>

<div class="right">

<h3>Education</h3>
${(resume.education || []).map(e => `
  <p>
    <strong>${safe(e.degree)}</strong> - ${safe(e.institution)}<br/>
    ${year(e.startYear)} - ${year(e.endDate)}
  </p>
`).join("")}

<h3>Experience</h3>
${(resume.experience || []).map(exp => `
  <p>
    <strong>${safe(exp.role)}</strong> - ${safe(exp.company)}<br/>
    ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}<br/>
    ${safe(exp.description)}
  </p>
`).join("")}

<h3>Projects</h3>
${(resume.projects || []).map(pj => `
  <p>
    <strong>${safe(pj.title)}</strong><br/>
    ${safe(pj.description)}<br/>
    <em>${(pj.techStack || []).map(safe).join(", ")}</em>
  </p>
`).join("")}

</div>
</div>
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
