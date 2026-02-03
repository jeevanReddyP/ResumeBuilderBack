module.exports = (resume, theme = {}) => {

  const p = resume.personalInfo || {};

  return `
<html>
<head>
<style>
  body{
    font-family: Arial;
    padding: 40px;
    color:${theme.text || "#111"};
  }
  h1{text-align:center;color:${theme.primary || "#000"}}
  .center{text-align:center}
  .block{margin-top:20px}
</style>
</head>

<body>

<h1>${p.firstname || ""} ${p.lastname || ""}</h1>
<p class="center">
${p.email || ""} | ${p.phone || ""} | ${p.linkedin || ""} | ${p.github || ""}
</p>

<div class="block">
<strong>Education</strong>
${(resume.education || []).map(e=>`
  <p>
    ${e.degree || ""} - ${e.institution || ""} (${year(e.startYear)} - ${year(e.endDate)})
  </p>
`).join("")}
</div>

<div class="block">
<strong>Experience</strong>
${(resume.experience || []).map(exp=>`
  <p>
    ${exp.role || ""} - ${exp.company || ""} (${year(exp.startDate)} - ${year(exp.endDate)})<br/>
    ${exp.description || ""}
  </p>
`).join("")}
</div>

<div class="block">
<strong>Skills</strong><br/>
${(resume.skill || []).join(", ")}
</div>

<div class="block">
<strong>Projects</strong>
${(resume.projects || []).map(pj=>`
  <p>
    ${pj.title || ""} - ${pj.description || ""}<br/>
    <em>${(pj.techStack || []).join(", ")}</em>
  </p>
`).join("")}
</div>

</body>
</html>
`;
};

function year(date){
  if(!date) return "Present";
  return new Date(date).getFullYear();
}
