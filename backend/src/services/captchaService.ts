import jwt from 'jsonwebtoken';

const CAPTCHA_SECRET = process.env.JWT_SECRET || 'captcha-secret-key-2026';
const CHARACTERS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid confusing chars like 0/O, 1/I

export interface CaptchaResult {
  svg: string;
  token: string;
}

export const generateCaptcha = (): CaptchaResult => {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }

  const width = 140;
  const height = 48;

  // Generate random lines for noise
  let noiseLines = '';
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    const colors = ['#f472b6', '#38bdf8', '#c084fc', '#93c5fd', '#fbcfe8'];
    const stroke = colors[Math.floor(Math.random() * colors.length)];
    noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" opacity="0.6" />`;
  }

  // Generate characters with slight rotation & pastel colors
  let textElements = '';
  const charColors = ['#db2777', '#0284c7', '#7c3aed', '#059669', '#ea580c'];
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const x = 20 + i * 28 + (Math.random() * 6 - 3);
    const y = 32 + (Math.random() * 6 - 3);
    const rotate = Math.floor(Math.random() * 30) - 15;
    const color = charColors[Math.floor(Math.random() * charColors.length)];
    textElements += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="${color}" transform="rotate(${rotate}, ${x}, ${y})">${char}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; user-select: none;">
    <rect width="100%" height="100%" fill="#fdf2f8" opacity="0.6"/>
    ${noiseLines}
    ${textElements}
  </svg>`;

  const token = jwt.sign(
    { code: code.toLowerCase(), exp: Math.floor(Date.now() / 1000) + 300 }, // 5 mins
    CAPTCHA_SECRET
  );

  return { svg, token };
};

export const verifyCaptcha = (answer: string, token: string): boolean => {
  if (!answer || !token) return false;
  try {
    const decoded = jwt.verify(token, CAPTCHA_SECRET) as { code: string };
    return decoded.code.toLowerCase() === answer.trim().toLowerCase();
  } catch (error) {
    return false;
  }
};
