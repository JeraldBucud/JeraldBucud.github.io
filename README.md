# Jerald Bucud — Software Developer Portfolio

Personal portfolio website for **Jerald Christopher Bucud**, a Brisbane-based Master of Information Technology candidate focused on Java and Spring full-stack development, with additional experience in enterprise Java and applied computer vision.

## Live website

[https://jeraldbucud.com](https://jeraldbucud.com)

The website is configured for deployment through GitHub Pages from the `main` branch and uses the custom domain recorded in the `CNAME` file.

## Selected projects

### Godscent Drive POS

A private full-stack system built with React, Spring Boot and PostgreSQL for point-of-sale, inventory and event operations.

The public case study presents approved interface evidence and clearly distinguishes implemented functionality from planned enhancements.

[View the Godscent Drive POS case study](https://jeraldbucud.com/godscent-drive-pos-case-study.html)

### YOLOv11 Mango Detection

A public computer-vision project documenting two YOLOv11-n training configurations, validation-based model selection, held-out evaluation results and a configurable inference script.

[View the case study](https://jeraldbucud.com/yolov11-mango-detection-case-study.html) · [View the repository](https://github.com/JeraldBucud/yolov11-mango-detection)

### CrisisOps

A JavaFX disaster-response application that evolved from an individual prototype into a collaborative client-server system.

The project includes a multi-threaded Java server, socket communication, MySQL persistence, role-specific workflows and current JUnit test evidence.

[View the case study](https://jeraldbucud.com/crisisops-case-study.html) · [View the repository](https://github.com/JeraldBucud/crisisops-disaster-response-system)

### SmartTech E-Business System

A collaborative Jakarta EE retail-operations application using Jakarta Faces, EJB services, Jakarta Persistence, authenticated sessions, MySQL and stock-aware order processing.

[View the case study](https://jeraldbucud.com/smarttech-ebusiness-system-case-study.html) · [View the repository](https://github.com/JeraldBucud/smarttech-ebusiness-system)

## Primary full-stack direction

**Java · Spring Boot · React · PostgreSQL**

### Backend Development

Java · Spring Boot · REST APIs · PostgreSQL · MySQL · JUnit

### Frontend Development

React · JavaScript · HTML · CSS

### Engineering & Delivery

Git · Maven · GitHub Actions · Testing

Project-specific technologies such as JavaFX, Jakarta EE, Python, YOLOv11 and OpenCV remain documented in the relevant project cards, case studies and source repositories.

## Website structure

```text
JeraldBucud.github.io/
├── .github/
│   └── workflows/
│       └── portfolio-quality.yml
├── assets/
│   ├── academic/
│   ├── branding/
│   ├── certificates/
│   └── projects/
├── docs/
│   └── github-profile/
├── scripts/
│   └── check_site.py
├── index.html
├── credentials.html
├── godscent-drive-pos-case-study.html
├── yolov11-mango-detection-case-study.html
├── crisisops-case-study.html
├── smarttech-ebusiness-system-case-study.html
├── 404.html
├── styles.css
├── development-core.css
├── phase-one.css
├── selected-work.css
├── selected-work-responsive.css
├── responsive-browser-qa.css
├── accessibility.css
├── credentials-v2.css
├── academic-credentials.css
├── formal-education-hierarchy.css
├── godscent-drive-pos-case-study.css
├── godscent-drive-pos-case-study-fixes.css
├── yolov11-mango-detection-case-study.css
├── yolov11-mango-detection-case-study-fixes.css
├── crisisops-case-study.css
├── smarttech-ebusiness-system-case-study.css
├── script-core.js
├── robots.txt
├── sitemap.xml
├── CNAME
├── .nojekyll
├── LICENSE
└── README.md
```

The homepage, Credentials page and project case studies store their visible content directly in HTML.

Shared navigation, mobile behaviour, accessibility support, reveal animations and interactive elements are handled through `script-core.js` and the shared stylesheets.

## Automated quality checks

The repository includes a GitHub Actions workflow that runs the portfolio validation script on pull requests and updates to `main`.

The automated checks cover:

- page titles and metadata;
- canonical URLs;
- heading and landmark structure;
- duplicate element IDs;
- image alternative text;
- internal links and page fragments;
- local scripts, stylesheets and assets;
- CSS asset references;
- sitemap coverage;
- JavaScript syntax.

The validation script is located at:

```text
scripts/check_site.py
```

The workflow configuration is located at:

```text
.github/workflows/portfolio-quality.yml
```

## Content boundaries

Godscent Drive POS is maintained in a private client repository. Only approved screenshots, technical descriptions and portfolio-ready evidence are included in the public case study.

Academic and collaborative projects identify Jerald’s individual contributions without presenting team work as solely authored.

Historical assessment evidence is labelled separately from current repository testing.

Planned functionality is distinguished from implemented functionality throughout the case studies.

## Public repository scope

This repository contains only material prepared for public portfolio use.

Private project source code, customer data, authentication credentials, API keys, residential information, student identifiers and unredacted academic documents are not included.

## Author

**Jerald Christopher Bucud**

Master of Information Technology Candidate  
Java and Spring Full-stack Development  
Brisbane, Queensland, Australia

[Portfolio](https://jeraldbucud.com) · [GitHub](https://github.com/JeraldBucud) · [LinkedIn](https://www.linkedin.com/in/jeraldbucud/) · [Email](mailto:jerald@jeraldbucud.com)
