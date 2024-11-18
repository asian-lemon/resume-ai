// src/lib/templates.ts

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    category: 'modern' | 'traditional' | 'creative' | 'technical';
    features: string[];
    colorSchemes: {
      id: string;
      name: string;
      primary: string;
      secondary: string;
      accent: string;
    }[];
    layouts: {
      id: string;
      name: string;
      preview: string;
    }[];
    latexTemplate: string;
  }
  
  export const resumeTemplates: ResumeTemplate[] = [
    {
      id: "executive",
      name: "Executive Impact",
      description: "Professional template optimized for senior positions and management roles",
      category: 'traditional',
      features: [
        "Header with professional title",
        "Executive summary section",
        "Key achievements highlight",
        "Leadership experience focus",
        "Education and certifications",
        "Professional affiliations"
      ],
      colorSchemes: [
        {
          id: 'classic',
          name: 'Classic Navy',
          primary: 'rgb(29, 53, 87)',
          secondary: 'rgb(69, 123, 157)',
          accent: 'rgb(168, 218, 220)'
        },
        {
          id: 'modern',
          name: 'Modern Gray',
          primary: 'rgb(44, 51, 51)',
          secondary: 'rgb(109, 120, 120)',
          accent: 'rgb(224, 225, 221)'
        }
      ],
      layouts: [
        {
          id: 'traditional',
          name: 'Traditional',
          preview: `
  \\begin{document}
  \\begin{center}
    \\textbf{\\Huge \\VAR{name}}\\\\[0.3cm]
    \\textit{\\large \\VAR{title}}\\\\[0.2cm]
    \\VAR{contact}
  \\end{center}
  
  \\section*{Executive Summary}
  \\VAR{summary}
  
  \\section*{Professional Experience}
  \\VAR{experience}
  
  \\section*{Education}
  \\VAR{education}
  \\end{document}
          `
        }
      ],
      latexTemplate: `
  \\documentclass[11pt,letterpaper]{article}
  \\usepackage[empty]{fullpage}
  \\usepackage[utf8]{inputenc}
  \\usepackage[T1]{fontenc}
  \\usepackage{mdframed}
  \\usepackage{color}
  \\usepackage{hyperref}
  \\usepackage{fontawesome5}
  \\usepackage{geometry}
  
  \\geometry{left=0.75in,right=0.75in,top=0.75in,bottom=0.75in}
  
  \\definecolor{primary}{RGB}{29,53,87}
  \\definecolor{secondary}{RGB}{69,123,157}
  
  \\begin{document}
  %CONTENT%
  \\end{document}
      `
    },
    {
      id: "modern-tech",
      name: "Modern Technical",
      description: "Clean, minimalist design highlighting technical expertise",
      category: 'modern',
      features: [
        "Skills matrix",
        "Project showcase",
        "Technical achievements",
        "GitHub/Portfolio links",
        "Custom skill ratings",
        "Clean section dividers"
      ],
      colorSchemes: [
        {
          id: 'indigo',
          name: 'Indigo Tech',
          primary: 'rgb(99, 102, 241)',
          secondary: 'rgb(129, 140, 248)',
          accent: 'rgb(199, 210, 254)'
        },
        {
          id: 'emerald',
          name: 'Emerald Code',
          primary: 'rgb(16, 185, 129)',
          secondary: 'rgb(52, 211, 153)',
          accent: 'rgb(167, 243, 208)'
        }
      ],
      layouts: [
        {
          id: 'sidebar',
          name: 'Sidebar Skills',
          preview: `
  \\begin{document}
  \\begin{minipage}[t]{0.3\\textwidth}
    % Sidebar content
    \\section*{Skills}
    \\VAR{skills}
    
    \\section*{Languages}
    \\VAR{languages}
  \\end{minipage}
  \\hfill
  \\begin{minipage}[t]{0.65\\textwidth}
    % Main content
    \\section*{Experience}
    \\VAR{experience}
    
    \\section*{Projects}
    \\VAR{projects}
  \\end{minipage}
  \\end{document}
          `
        }
      ],
      latexTemplate: `
  \\documentclass[11pt,a4paper]{article}
  \\usepackage[utf8]{inputenc}
  \\usepackage{fontawesome5}
  \\usepackage{tikz}
  \\usepackage{xcolor}
  \\usepackage{geometry}
  \\usepackage{enumitem}
  
  \\geometry{left=1cm,right=1cm,top=1cm,bottom=1cm}
  
  \\definecolor{primary}{RGB}{99,102,241}
  \\definecolor{secondary}{RGB}{129,140,248}
  
  \\begin{document}
  %CONTENT%
  \\end{document}
      `
    },
    {
      id: "creative-professional",
      name: "Creative Professional",
      description: "Dynamic layout for creative and design roles",
      category: 'creative',
      features: [
        "Visual skill representation",
        "Portfolio integration",
        "Custom icons and graphics",
        "Timeline experience view",
        "Achievement spotlights",
        "Brand color options"
      ],
      colorSchemes: [
        {
          id: 'sunset',
          name: 'Creative Sunset',
          primary: 'rgb(244, 63, 94)',
          secondary: 'rgb(251, 113, 133)',
          accent: 'rgb(254, 205, 211)'
        },
        {
          id: 'ocean',
          name: 'Ocean Breeze',
          primary: 'rgb(14, 165, 233)',
          secondary: 'rgb(56, 189, 248)',
          accent: 'rgb(186, 230, 253)'
        }
      ],
      layouts: [
        {
          id: 'creative',
          name: 'Creative Grid',
          preview: `
  \\begin{document}
  % Header with visual elements
  \\begin{tikzpicture}
    \\node[text width=\\textwidth] {
      \\Huge{\\textbf{\\VAR{name}}}\\\\[0.2cm]
      \\large{\\VAR{title}}
    };
  \\end{tikzpicture}
  
  % Creative grid layout
  \\begin{multicols}{2}
    \\section*{Profile}
    \\VAR{profile}
    
    \\section*{Experience}
    \\VAR{experience}
  \\end{multicols}
  \\end{document}
          `
        }
      ],
      latexTemplate: `
  \\documentclass[11pt,a4paper]{article}
  \\usepackage{graphicx}
  \\usepackage{tikz}
  \\usepackage{multicol}
  \\usepackage{xcolor}
  \\usepackage{geometry}
  
  \\geometry{left=1.5cm,right=1.5cm,top=1.5cm,bottom=1.5cm}
  
  \\definecolor{primary}{RGB}{244,63,94}
  \\definecolor{secondary}{RGB}{251,113,133}
  
  \\begin{document}
  %CONTENT%
  \\end{document}
      `
    },
    {
      id: "research-academic",
      name: "Research & Academic",
      description: "Structured template for academic and research positions",
      category: 'technical',
      features: [
        "Publication list",
        "Research experience",
        "Academic achievements",
        "Conference presentations",
        "Teaching experience",
        "Grants and funding"
      ],
      colorSchemes: [
        {
          id: 'scholarly',
          name: 'Scholarly Maroon',
          primary: 'rgb(157, 23, 77)',
          secondary: 'rgb(190, 24, 93)',
          accent: 'rgb(251, 207, 232)'
        },
        {
          id: 'ivy',
          name: 'Ivy League Green',
          primary: 'rgb(21, 128, 61)',
          secondary: 'rgb(34, 197, 94)',
          accent: 'rgb(187, 247, 208)'
        }
      ],
      layouts: [
        {
          id: 'academic',
          name: 'Academic Standard',
          preview: `
  \\begin{document}
  \\begin{center}
    {\\Large \\textbf{\\VAR{name}}}\\\\[0.2cm]
    \\VAR{title} • \\VAR{institution}\\\\
    \\VAR{contact}
  \\end{center}
  
  \\section*{Education}
  \\VAR{education}
  
  \\section*{Research Experience}
  \\VAR{research}
  
  \\section*{Publications}
  \\VAR{publications}
  \\end{document}
          `
        }
      ],
      latexTemplate: `
  \\documentclass[11pt,a4paper]{article}
  \\usepackage{academicons}
  \\usepackage{fontawesome5}
  \\usepackage{hyperref}
  \\usepackage{geometry}
  
  \\geometry{left=2cm,right=2cm,top=2cm,bottom=2cm}
  
  \\definecolor{primary}{RGB}{157,23,77}
  \\definecolor{secondary}{RGB}{190,24,93}
  
  \\begin{document}
  %CONTENT%
  \\end{document}
      `
    }
  ];
  
  // Color theme presets
  export const colorThemes = {
    light: {
      background: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      mutedText: 'rgb(107, 114, 128)',
      border: 'rgb(229, 231, 235)'
    },
    dark: {
      background: 'rgb(17, 24, 39)',
      text: 'rgb(255, 255, 255)',
      mutedText: 'rgb(156, 163, 175)',
      border: 'rgb(55, 65, 81)'
    }
  };
  
  // Font combinations
  export const fontPairings = [
    {
      id: 'modern',
      name: 'Modern Sans',
      heading: 'Inter',
      body: 'Inter'
    },
    {
      id: 'professional',
      name: 'Professional Serif',
      heading: 'Merriweather',
      body: 'Source Sans Pro'
    },
    {
      id: 'minimal',
      name: 'Minimal Sans',
      heading: 'Roboto',
      body: 'Roboto'
    },
    {
      id: 'elegant',
      name: 'Elegant Mix',
      heading: 'Playfair Display',
      body: 'Lato'
    }
  ];

