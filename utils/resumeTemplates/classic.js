module.exports = (resume, theme = {}) => {

  const p = resume.personalInfo || {};

  return `
<html>
<head>
<style>
  body{margin:0;font-family:Segoe UI, sans-serif;}
  .wrap{display:flex;min-height:100vh;}
  .left{
    width:30%;
    background:${theme.primary || "#2563eb"};
    color:white;
    padding:20px;
  }
  .right{
    width:70%;
    padding:30px;
    color:${theme.text || "#111"};
  }
  h3{margin-bottom:5px}
  p{margin-top:4px}
</style>
</head>

<body>
<div class="wrap">

<div class="left">
  <h2>${p.firstname || ""} ${p.lastname || ""}</h2>
  <p>${p.email || ""}</p>
  <p>${p.phone || ""}</p>
  <p>${p.linkedin || ""}</p>
  <p>${p.github || ""}</p>

  <h3>Skills</h3>
  <ul>
    ${(resume.skill || []).map(s=>`<li>${s}</li>`).join("")}
  </ul>
</div>

<div class="right">

<h3>Education</h3>
${(resume.education || []).map(e => `
  <p>
    <strong>${e.degree || ""}</strong> - ${e.institution || ""}<br/>
    ${year(e.startYear)} - ${year(e.endDate)}
  </p>
`).join("")}

<h3>Experience</h3>
${(resume.experience || []).map(exp => `
  <p>
    <strong>${exp.role || ""}</strong> - ${exp.company || ""}<br/>
    ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}<br/>
    ${exp.description || ""}
  </p>
`).join("")}

<h3>Projects</h3>
${(resume.projects || []).map(pj => `
  <p>
    <strong>${pj.title || ""}</strong><br/>
    ${pj.description || ""}<br/>
    <em>${(pj.techStack || []).join(", ")}</em>
  </p>
`).join("")}

</div>

</div>
</body>
</html>
`;
};

function formatDate(date){
  if(!date) return "Present";
  const d=new Date(date);
  return d.toLocaleDateString("en-US",{month:"short",year:"numeric"});
}

function year(date){
  if(!date) return "Present";
  return new Date(date).getFullYear();
}
