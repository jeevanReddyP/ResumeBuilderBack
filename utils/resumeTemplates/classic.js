module.exports = (resume, theme = {}) => {

  const p = resume.personalInfo || {};

  return `
<html>
<head>
<style>
  body{
    font-family: Arial, sans-serif;
    padding: 30px;
    color: ${theme.text || "#111"};
  }
  h1{
    margin-bottom: 4px;
    color: ${theme.primary || "#1f2933"};
  }
  h2{
    border-bottom: 1px solid #ddd;
    margin-top: 18px;
    color: ${theme.primary || "#1f2933"};
  }
  .small{color:#555}
</style>
</head>

<body>

<h1>${p.firstname || ""} ${p.lastname || ""}</h1>
<p class="small">
  ${p.email || ""} | ${p.phone || ""} | ${p.linkedin || ""} | ${p.github || ""}
</p>

<h2>Education</h2>
${(resume.education || []).map(e => `
  <p>
    <strong>${e.degree || ""}</strong> - ${e.institution || ""}<br/>
    ${e.startYear ? new Date(e.startYear).getFullYear() : ""} -
    ${e.endDate ? new Date(e.endDate).getFullYear() : "Present"}
  </p>
`).join("")}

<h2>Experience</h2>
${(resume.experience || []).map(exp => `
  <p>
    <strong>${exp.role || ""}</strong> - ${exp.company || ""}<br/>
    ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}<br/>
    ${exp.description || ""}
  </p>
`).join("")}

<h2>Skills</h2>
<ul>
  ${(resume.skill || []).map(s => `<li>${s}</li>`).join("")}
</ul>

<h2>Projects</h2>
${(resume.projects || []).map(pj => `
  <p>
    <strong>${pj.title || ""}</strong><br/>
    ${pj.description || ""}<br/>
    <em>${(pj.techStack || []).join(", ")}</em>
  </p>
`).join("")}

</body>
</html>
`;
};

// helper inside same file
function formatDate(date){
  if(!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US",{month:"short",year:"numeric"});
}
