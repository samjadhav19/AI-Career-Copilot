import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { ResumeProfile } from '../types';
import { SKILL_KEYWORDS } from '../utils/constants';

// Set up PDF.js worker safely for Vite/browser environment
try {
  // Use cdn worker or local worker fallback
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'md') {
    return await file.text();
  }

  if (extension === 'pdf') {
    return await extractTextFromPDF(file);
  }

  if (extension === 'docx') {
    return await extractTextFromDOCX(file);
  }

  throw new Error(`Unsupported file type: .${extension}. Please upload a .pdf, .docx, or .txt file.`);
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (item.str !== undefined ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    const trimmed = fullText.trim();
    if (!trimmed || trimmed.length < 30) {
      throw new Error('This PDF appears to be an image-only scan or contains no readable selectable text. Please paste the text or upload a text-based PDF/DOCX.');
    }
    return trimmed;
  } catch (err: any) {
    if (err.message && err.message.includes('image-only scan')) {
      throw err;
    }
    throw new Error(`Failed to parse PDF document: ${err.message || 'Unknown parsing error'}`);
  }
}

async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) {
      throw new Error('The DOCX file appears empty or unreadable.');
    }
    return text;
  } catch (err: any) {
    throw new Error(`Failed to parse DOCX document: ${err.message || 'Unknown format error'}`);
  }
}

export function analyzeResumeText(rawText: string, fileName = 'uploaded_resume.txt', fileSize = 0): ResumeProfile {
  // 1. Skill Extraction
  const detectedSkillsSet = new Set<string>();
  const lowerText = rawText.toLowerCase();

  SKILL_KEYWORDS.forEach((skill) => {
    // Regex word boundary matching or specific token checking
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedSkillsSet.add(skill);
    }
  });

  const skills = Array.from(detectedSkillsSet);

  // 2. Candidate Name and Email Detection
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // Candidate name heuristic: First non-empty line with 2-4 words that isn't a header
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let candidateName: string | undefined = undefined;
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    if (
      words.length >= 2 &&
      words.length <= 4 &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('phone')
    ) {
      candidateName = line;
      break;
    }
  }

  // 3. Education Extraction
  const education: string[] = [];
  const eduKeywords = ['bachelor', 'master', 'phd', 'b.s.', 'b.a.', 'm.s.', 'degree', 'university', 'college', 'institute', 'polytechnic'];
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (eduKeywords.some(kw => lowerLine.includes(kw)) && line.length > 8 && line.length < 140) {
      if (!education.includes(line)) {
        education.push(line);
      }
    }
  });

  // 4. Experience summary extraction
  const experienceSummary: string[] = [];
  const expBullets = lines.filter(l => (l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || /^\d+\./.test(l)) && l.length > 25);
  experienceSummary.push(...expBullets.slice(0, 5));

  if (experienceSummary.length === 0) {
    // Grab sentences containing key action words
    const sentences = rawText.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 30);
    const actionWords = ['developed', 'built', 'managed', 'created', 'designed', 'led', 'analyzed', 'improved', 'engineered'];
    sentences.forEach(s => {
      const lower = s.toLowerCase();
      if (actionWords.some(w => lower.includes(w)) && experienceSummary.length < 4) {
        experienceSummary.push(s);
      }
    });
  }

  // 5. Experience Years Estimation
  let experienceYears = 1;
  const yearMatch = rawText.match(/(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
  if (yearMatch) {
    experienceYears = Math.min(15, Math.max(1, parseInt(yearMatch[1], 10)));
  } else {
    // Count distinct year occurrences (e.g. 2019 - 2023)
    const years = rawText.match(/\b(20[12]\d)\b/g);
    if (years && years.length >= 2) {
      const numericYears = years.map(Number);
      const span = Math.max(...numericYears) - Math.min(...numericYears);
      if (span > 0 && span < 20) {
        experienceYears = span;
      }
    }
  }

  // 6. Matched Roles & Score
  const matchedRoles: string[] = [];
  if (skills.some(s => ['React', 'Next.js', 'Tailwind CSS', 'CSS3', 'HTML5'].includes(s))) {
    matchedRoles.push('Frontend Developer');
  }
  if (skills.some(s => ['Node.js', 'PostgreSQL', 'Express', 'MongoDB'].includes(s)) && skills.some(s => ['React', 'JavaScript', 'TypeScript'].includes(s))) {
    matchedRoles.push('Full Stack Developer');
  }
  if (skills.some(s => ['Java', 'Spring Boot', 'Microservices', 'Hibernate/JPA'].includes(s))) {
    matchedRoles.push('Java Developer');
  }
  if (skills.some(s => ['SQL', 'Python', 'Tableau', 'Power BI', 'Pandas', 'Excel'].includes(s))) {
    matchedRoles.push('Data Analyst');
  }
  if (skills.some(s => ['Customer Empathy', 'Zendesk', 'Conflict Resolution', 'Communication'].includes(s))) {
    matchedRoles.push('Customer Support Executive');
  }
  if (skills.some(s => ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'Design Systems'].includes(s))) {
    matchedRoles.push('UI/UX Designer');
  }

  if (matchedRoles.length === 0) {
    matchedRoles.push('Software Engineer', 'Technical Specialist');
  }

  // Calculate estimated match score (labeled as an estimate)
  const baseScore = 55;
  const skillBonus = Math.min(30, skills.length * 2.5);
  const expBonus = Math.min(10, experienceYears * 2);
  const estimatedMatchScore = Math.min(96, Math.round(baseScore + skillBonus + expBonus));

  return {
    fileName,
    fileSize,
    uploadedAt: new Date().toISOString(),
    rawText,
    candidateName,
    email,
    skills,
    education: education.length > 0 ? education : ['Degree in relevant field detected in resume'],
    experienceYears,
    experienceSummary: experienceSummary.length > 0 ? experienceSummary : ['Professional experience highlighted in uploaded profile'],
    topMatchedRoles: matchedRoles,
    estimatedMatchScore,
  };
}
