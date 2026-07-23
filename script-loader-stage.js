'use strict';

const coreScript = document.createElement('script');
coreScript.src = 'script-core.js?v=portfolio-core-1';
coreScript.onload = () => {
  const academicScript = document.createElement('script');
  academicScript.src = 'academic-home.js?v=cqu-formal-qualifications-1';
  document.body.append(academicScript);
};
document.body.append(coreScript);
