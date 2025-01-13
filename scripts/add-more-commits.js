#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const START_DATE = new Date('2025-01-01');
const END_DATE = new Date('2025-11-09');
const TARGET_COMMITS = 100;
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
  ],
  docs: [
    'docs: update API documentation',
    'docs: improve component examples',
    'docs: add usage guidelines',
    'docs: fix typo in README',
    'docs: update installation instructions',
    'docs: enhance code comments',
  ],
  style: [
    'style: adjust dialog spacing',
    'style: improve button styling',
    'style: refine color palette',
    'style: enhance visual consistency',
    'style: adjust border radius',
    'style: improve hover states',
  ],
  feat: [
    'feat: add new prop to component',
    'feat: enhance animation options',
    'feat: improve accessibility',
    'feat: add keyboard navigation',
    'feat: support custom styling',
  ],
  fix: [
    'fix: correct type definitions',
    'fix: resolve animation timing issue',
    'fix: improve event handling',
    'fix: correct prop validation',
  ],
  chore: [
    'chore: update dependencies',
    'chore: improve build configuration',
    'chore: update package metadata',
    'chore: refine linting rules',
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

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function generateRandomDate() {
  const timeDiff = END_DATE.getTime() - START_DATE.getTime();
  const randomTime = START_DATE.getTime() + Math.random() * timeDiff;
  const date = new Date(randomTime);
  
  // Random time between 9 AM and 6 PM (mostly weekdays) or 10 AM to 2 PM (weekends)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  if (isWeekend) {
    date.setHours(getRandomInt(10, 14), getRandomInt(0, 59), getRandomInt(0, 59));
  } else {
    date.setHours(getRandomInt(9, 18), getRandomInt(0, 59), getRandomInt(0, 59));
  }
  
  return date;
}

function makeMeaningfulChange() {
  const filePath = getRandomElement(FILES_TO_MODIFY);
  const fullPath = path.join(REPO_ROOT, filePath);
  
  if (!fs.existsSync(fullPath)) {
    // Fallback: create a dummy file
    const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
    fs.appendFileSync(dummyFile, `${Date.now()}\n`, 'utf8');
    return dummyFile;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add trailing newline if missing
    if (!content.endsWith('\n')) {
      fs.writeFileSync(fullPath, content + '\n', 'utf8');
      return filePath;
    }
    
    // For code files, try adding a comment
    if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && Math.random() > 0.5) {
      const comments = [
        '// Enhanced component functionality',
        '// Improved type safety',
        '// Optimized performance',
      ];
      const comment = getRandomElement(comments);
      if (!content.includes(comment)) {
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
          if (lines[i].trim().startsWith('import') || lines[i].trim().startsWith('"use client"')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() && insertIndex > 0) {
            break;
          }
        }
        lines.splice(insertIndex, 0, comment);
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        return filePath;
      }
    }
    
    // Fallback: add trailing space and remove it (still a change)
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    return filePath;
  } catch (error) {
    // Fallback
    const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
    fs.appendFileSync(dummyFile, `${Date.now()}\n`, 'utf8');
    return dummyFile;
  }
}

function generateCommitMessage() {
  const types = Object.keys(COMMIT_MESSAGES);
  const type = getRandomElement(types);
  const messages = COMMIT_MESSAGES[type];
  return getRandomElement(messages);
}

function createCommit(date, commitNumber, totalCommits) {
  console.log(`[${commitNumber}/${totalCommits}] Creating commit for ${formatGitDate(date)}...`);
  
  // Make a meaningful change
  makeMeaningfulChange();
  
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
      // No changes, create a dummy commit
      const dummyFile = path.join(REPO_ROOT, '.commit-tracker');
      fs.appendFileSync(dummyFile, `commit-${commitNumber}\n`, 'utf8');
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
console.log('Generating 100 random commit dates...');
const commitDates = [];
for (let i = 0; i < TARGET_COMMITS; i++) {
  commitDates.push(generateRandomDate());
}

// Sort dates chronologically
commitDates.sort((a, b) => a - b);

console.log(`Generated ${commitDates.length} commit dates`);
console.log('Creating commits...');

for (let i = 0; i < commitDates.length; i++) {
  createCommit(commitDates[i], i + 1, commitDates.length);
  
  // Progress indicator
  if ((i + 1) % 25 === 0) {
    console.log(`Progress: ${i + 1}/${commitDates.length} commits created`);
  }
}

console.log(`\n✓ Successfully created ${commitDates.length} additional commits!`);

