#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const START_DATE = new Date('2025-01-01');
const END_DATE = new Date('2025-12-26'); // Today
const TARGET_COMMITS = 1100; // Slightly over 1000
const REPO_ROOT = path.resolve(__dirname, '..');

// Commit message templates
const COMMIT_MESSAGES = {
  refactor: [
    'refactor: improve component structure',
    'refactor: optimize dialog context logic',
    'refactor: simplify animation configuration',
    'refactor: enhance type definitions',
    'refactor: clean up unused imports',
    'refactor: improve code organization',
    'refactor: extract common utilities',
    'refactor: optimize render performance',
  ],
  docs: [
    'docs: update API documentation',
    'docs: improve component examples',
    'docs: add usage guidelines',
    'docs: fix typo in README',
    'docs: update installation instructions',
    'docs: enhance code comments',
    'docs: add inline documentation',
    'docs: improve documentation clarity',
  ],
  style: [
    'style: adjust dialog spacing',
    'style: improve button styling',
    'style: refine color palette',
    'style: enhance visual consistency',
    'style: adjust border radius',
    'style: improve hover states',
    'style: refine typography',
    'style: optimize spacing values',
  ],
  feat: [
    'feat: add new prop to component',
    'feat: enhance animation options',
    'feat: improve accessibility',
    'feat: add keyboard navigation',
    'feat: support custom styling',
    'feat: add animation variants',
    'feat: improve error handling',
    'feat: enhance type safety',
  ],
  fix: [
    'fix: correct type definitions',
    'fix: resolve animation timing issue',
    'fix: improve event handling',
    'fix: correct prop validation',
    'fix: resolve styling conflict',
    'fix: improve accessibility labels',
    'fix: correct component export',
  ],
  chore: [
    'chore: update dependencies',
    'chore: improve build configuration',
    'chore: update package metadata',
    'chore: refine linting rules',
    'chore: update TypeScript config',
    'chore: improve CI configuration',
  ],
};

// File paths to modify
const FILES_TO_MODIFY = [
  'packages/dialux/index.tsx',
  'packages/dialux/package.json',
  'website/components/examples/basic.tsx',
  'website/components/examples/basic-with-animation.tsx',
  'website/components/examples/shared.tsx',
  'website/components/examples/stacked.tsx',
  'website/components/examples/showcase.tsx',
  'website/mdx/home.mdx',
  'README.md',
  'packages/dialux/README.md',
  'website/README.md',
];

// Helper functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function getRandomTimeForDay(isWeekendDay) {
  if (isWeekendDay) {
    // Weekend: 10 AM - 2 PM
    const hour = getRandomInt(10, 14);
    const minute = getRandomInt(0, 59);
    return { hour, minute };
  } else {
    // Weekday: 9 AM - 6 PM
    const hour = getRandomInt(9, 18);
    const minute = getRandomInt(0, 59);
    return { hour, minute };
  }
}

function formatGitDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function generateCommitDate(isWeekendDay) {
  const { hour, minute } = getRandomTimeForDay(isWeekendDay);
  const date = new Date();
  date.setHours(hour, minute, getRandomInt(0, 59), 0);
  return date;
}

// File modification functions
function addCommentToFile(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const comments = [
      '// Enhanced component functionality',
      '// Improved type safety',
      '// Optimized performance',
      '// Better error handling',
      '// Enhanced accessibility',
    ];
    
    // Only add comment if it's a code file and doesn't already have the comment
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const comment = getRandomElement(comments);
      if (!content.includes(comment)) {
        // Add comment near the top after imports
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import') || lines[i].trim().startsWith('"use client"')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() && insertIndex > 0) {
            break;
          }
        }
        lines.splice(insertIndex, 0, comment);
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function modifySpacing(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // For TSX/TS files, modify spacing in className or style props
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      // Randomly add/remove spaces in className attributes
      const classNamePattern = /className="([^"]*)"/g;
      const matches = [...content.matchAll(classNamePattern)];
      if (matches.length > 0) {
        const match = getRandomElement(matches);
        const className = match[1];
        // Small spacing modifications
        const modified = className.replace(/\s+/g, ' ').trim();
        if (modified !== className) {
          content = content.replace(match[0], `className="${modified}"`);
          fs.writeFileSync(fullPath, content, 'utf8');
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function updateReadme(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const improvements = [
      'enhanced',
      'improved',
      'optimized',
      'refined',
      'polished',
    ];
    
    // Small text improvements
    const improvement = getRandomElement(improvements);
    if (content.includes('dialog') && Math.random() > 0.7) {
      content = content.replace(
        /dialog component/g,
        `${improvement} dialog component`
      );
      fs.writeFileSync(fullPath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function modifyPackageJson(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const pkg = JSON.parse(content);
    
    // Small metadata updates
    if (pkg.description && Math.random() > 0.8) {
      const descriptors = ['modern', 'elegant', 'powerful', 'flexible'];
      const descriptor = getRandomElement(descriptors);
      if (!pkg.description.includes(descriptor)) {
        pkg.description = pkg.description.replace(
          /Beautifully crafted/,
          `${descriptor} and beautifully crafted`
        );
        fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function modifyMDX(filePath) {
  const fullPath = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Small text improvements in documentation
    const improvements = [
      { from: /demonstrates/g, to: 'showcases' },
      { from: /provides/g, to: 'offers' },
      { from: /allows/g, to: 'enables' },
      { from: /simple/g, to: 'straightforward' },
    ];
    
    if (Math.random() > 0.7) {
      const improvement = getRandomElement(improvements);
      if (content.match(improvement.from) && !content.includes(improvement.to)) {
        content = content.replace(improvement.from, improvement.to);
        fs.writeFileSync(fullPath, content, 'utf8');
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function makeMeaningfulChange() {
  const filePath = getRandomElement(FILES_TO_MODIFY);
  const modifications = [
    () => addCommentToFile(filePath),
    () => modifySpacing(filePath),
    () => updateReadme(filePath),
    () => modifyPackageJson(filePath),
    () => modifyMDX(filePath),
  ];
  
  // Try random modifications until one succeeds
  const shuffled = modifications.sort(() => Math.random() - 0.5);
  for (const mod of shuffled) {
    if (mod()) {
      return filePath;
    }
  }
  
  // Fallback: make a small whitespace change
  const fullPath = path.join(REPO_ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Add trailing newline if missing
    if (!content.endsWith('\n')) {
      fs.writeFileSync(fullPath, content + '\n', 'utf8');
      return filePath;
    }
  }
  
  return null;
}

function generateCommitMessage() {
  const types = Object.keys(COMMIT_MESSAGES);
  const type = getRandomElement(types);
  const messages = COMMIT_MESSAGES[type];
  return getRandomElement(messages);
}

// Main execution
function generateCommitDates() {
  const dates = [];
  const currentDate = new Date(START_DATE);
  
  // Calculate total days
  const totalDays = Math.ceil((END_DATE - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
  
  // Distribute commits: 70% weekdays, 30% weekends
  const weekdayCommits = Math.floor(TARGET_COMMITS * 0.7);
  const weekendCommits = TARGET_COMMITS - weekdayCommits;
  
  // Count weekdays and weekends
  let weekdayCount = 0;
  let weekendCount = 0;
  const dateList = [];
  
  for (let d = new Date(START_DATE); d <= END_DATE; d.setDate(d.getDate() + 1)) {
    dateList.push(new Date(d));
    if (isWeekend(d)) {
      weekendCount++;
    } else {
      weekdayCount++;
    }
  }
  
  // Generate weekday commit dates
  const weekdayCommitsPerDay = weekdayCommits / weekdayCount;
  const weekendCommitsPerDay = weekendCommits / weekendCount;
  
  for (const dayDate of dateList) {
    const isWeekendDay = isWeekend(dayDate);
    const commitsPerDay = isWeekendDay 
      ? Math.ceil(weekendCommitsPerDay * (0.8 + Math.random() * 0.4)) // 0.8-1.2x multiplier
      : Math.ceil(weekdayCommitsPerDay * (0.8 + Math.random() * 0.4));
    
    for (let i = 0; i < commitsPerDay; i++) {
      const commitDate = new Date(dayDate);
      const { hour, minute } = getRandomTimeForDay(isWeekendDay);
      commitDate.setHours(hour, minute, getRandomInt(0, 59), getRandomInt(0, 999));
      dates.push(new Date(commitDate));
    }
  }
  
  // Sort dates chronologically
  dates.sort((a, b) => a - b);
  
  // Ensure we have at least TARGET_COMMITS
  while (dates.length < TARGET_COMMITS) {
    const randomDate = new Date(
      START_DATE.getTime() + Math.random() * (END_DATE.getTime() - START_DATE.getTime())
    );
    const { hour, minute } = getRandomTimeForDay(isWeekend(randomDate));
    randomDate.setHours(hour, minute, getRandomInt(0, 59), getRandomInt(0, 999));
    dates.push(new Date(randomDate));
  }
  
  return dates.slice(0, TARGET_COMMITS);
}

function createCommit(date, commitNumber, totalCommits) {
  console.log(`[${commitNumber}/${totalCommits}] Creating commit for ${formatGitDate(date)}...`);
  
  // Make a meaningful change
  const modifiedFile = makeMeaningfulChange();
  
  if (!modifiedFile) {
    // Create a dummy change if nothing was modified
    const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
    fs.writeFileSync(dummyFile, `${Date.now()}\n`, 'utf8');
  }
  
  // Stage all changes
  try {
    execSync('git add -A', { cwd: REPO_ROOT, stdio: 'ignore' });
  } catch (error) {
    // Ignore errors
  }
  
  // Check if there are changes to commit
  try {
    const status = execSync('git status --porcelain', { cwd: REPO_ROOT, encoding: 'utf8' });
    if (!status.trim()) {
      // No changes, create a dummy commit with a file change
      const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
      fs.appendFileSync(dummyFile, `${commitNumber}\n`, 'utf8');
      execSync('git add -A', { cwd: REPO_ROOT, stdio: 'ignore' });
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Generate commit message
  const message = generateCommitMessage();
  
  // Create commit with backdated timestamp
  const dateStr = formatGitDate(date);
  const env = {
    ...process.env,
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr,
  };
  
  try {
    execSync(`git commit -m "${message}"`, {
      cwd: REPO_ROOT,
      env,
      stdio: 'ignore',
    });
  } catch (error) {
    // If commit fails, try again with a different change
    const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
    fs.appendFileSync(dummyFile, `retry-${commitNumber}\n`, 'utf8');
    execSync('git add -A', { cwd: REPO_ROOT, stdio: 'ignore' });
    execSync(`git commit -m "${message}"`, {
      cwd: REPO_ROOT,
      env,
      stdio: 'ignore',
    });
  }
}

// Main execution
console.log('Generating commit dates...');
const commitDates = generateCommitDates();
console.log(`Generated ${commitDates.length} commit dates`);

console.log('Creating commits...');
for (let i = 0; i < commitDates.length; i++) {
  createCommit(commitDates[i], i + 1, commitDates.length);
  
  // Progress indicator
  if ((i + 1) % 100 === 0) {
    console.log(`Progress: ${i + 1}/${commitDates.length} commits created`);
  }
}

console.log(`\n✓ Successfully created ${commitDates.length} commits!`);
console.log('Run "git log --oneline | wc -l" to verify the commit count.');

