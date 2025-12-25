# Publishing Guide

## Prerequisites

1. Make sure you have an npm account (create one at https://www.npmjs.com/signup if needed)
2. Build the package first: `npm run build` or `pnpm build`
3. Test the package locally if needed

## Publishing Steps

### 1. Update package.json

- Update the `version` field in `package.json`
- Update the `author` field with your name and email
- Update the `repository.url` with your GitHub repository URL (if you have one)

### 2. Login to npm

```bash
npm login
```

### 3. Build the package

```bash
npm run build
```

This will create the `dist` folder with compiled JavaScript and TypeScript definitions.

### 4. Publish to npm

```bash
npm publish
```

For a scoped package (e.g., @yourusername/dialux), use:
```bash
npm publish --access public
```

### 5. Verify

Check your package on npm: `https://www.npmjs.com/package/dialux`

## Versioning

Follow semantic versioning:
- `1.0.0` → `1.0.1` for patch releases (bug fixes)
- `1.0.0` → `1.1.0` for minor releases (new features)
- `1.0.0` → `2.0.0` for major releases (breaking changes)

Update version with:
```bash
npm version patch  # for 1.0.0 → 1.0.1
npm version minor  # for 1.0.0 → 1.1.0
npm version major  # for 1.0.0 → 2.0.0
```

This automatically updates package.json and creates a git tag.

## Moving to Standalone Repository

If you want to move this to its own repository:

1. Create a new repository on GitHub (or your preferred Git host)
2. Update the remote:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
3. Update `package.json` repository URL
4. Publish as described above

