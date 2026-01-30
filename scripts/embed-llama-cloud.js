#!/usr/bin/env node

/**
 * Script to embed the @llamaindex/llama-cloud package directly into this project.
 *
 * n8n community nodes don't allow external dependencies, so this script:
 * 1. Pulls the compiled files from @llamaindex/llama-cloud npm package
 * 2. Copies them to a local vendor directory
 * 3. Rewrites internal imports to use relative paths
 * 4. Updates the node source files to import from the vendor copy
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SOURCE_PACKAGE = path.join(PROJECT_ROOT, 'node_modules', '@llamaindex', 'llama-cloud');
const VENDOR_DIR = path.join(PROJECT_ROOT, 'vendor', 'llama-cloud');
const NODES_DIR = path.join(PROJECT_ROOT, 'nodes');

// Files/directories to copy from the package (excluding src/ and non-essential files)
const INCLUDE_EXTENSIONS = ['.js', '.mjs', '.d.ts', '.d.mts', '.json'];
const EXCLUDE_DIRS = ['src', 'scripts', 'node_modules', '.git'];
const EXCLUDE_FILES = ['package.json', 'tsconfig.json', 'yarn.lock', 'package-lock.json'];

/**
 * Recursively copy directory with file filtering
 */
function copyDir(src, dest, relativePath = '') {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const currentRelative = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(entry.name)) {
        console.log(`  Skipping directory: ${currentRelative}`);
        continue;
      }
      copyDir(srcPath, destPath, currentRelative);
    } else {
      // Skip excluded files
      if (EXCLUDE_FILES.includes(entry.name)) {
        console.log(`  Skipping file: ${currentRelative}`);
        continue;
      }

      // Only copy files with allowed extensions
      const ext = path.extname(entry.name);
      if (!INCLUDE_EXTENSIONS.some(e => entry.name.endsWith(e))) {
        console.log(`  Skipping file (wrong extension): ${currentRelative}`);
        continue;
      }

      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Rewrite imports in JS/MJS files to not reference the external package
 * Internal imports are already relative (./foo.js), so we only need to ensure they stay that way
 */
function rewriteImportsInFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.js', '.mjs'].includes(ext)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // The internal files use relative imports like "./client.js" or "../core/error.js"
  // These should work as-is since we're copying the whole structure

  // However, we need to check if there are any imports from the package name itself
  // (there shouldn't be in the compiled output, but let's be safe)
  const packageImportRegex = /@llamaindex\/llama-cloud/g;
  if (packageImportRegex.test(content)) {
    console.log(`  Warning: Found @llamaindex/llama-cloud import in ${filePath}`);
    modified = true;
  }

  return modified;
}

/**
 * Recursively process all files in a directory
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else {
      rewriteImportsInFile(fullPath);
    }
  }
}

/**
 * Update imports in node source files to use vendor path
 */
function updateNodeImports() {
  console.log('\nUpdating node source files...');

  const nodeFiles = [];

  function findTsFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findTsFiles(fullPath);
      } else if (entry.name.endsWith('.ts')) {
        nodeFiles.push(fullPath);
      }
    }
  }

  findTsFiles(NODES_DIR);

  for (const filePath of nodeFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Calculate relative path from the node file to vendor directory
    const fileDir = path.dirname(filePath);
    const relativeToVendor = path.relative(fileDir, VENDOR_DIR).replace(/\\/g, '/');

    // Replace imports from @llamaindex/llama-cloud
    // Pattern 1: import LlamaCloud from '@llamaindex/llama-cloud'
    // Pattern 2: import { LlamaCloud as LlamaCloudClient } from '@llamaindex/llama-cloud'
    // Pattern 3: import { ClassifierRule } from '@llamaindex/llama-cloud/resources/classifier.js'

    // Handle main package import
    content = content.replace(
      /from ['"]@llamaindex\/llama-cloud['"]/g,
      `from '${relativeToVendor}/index.js'`
    );

    // Handle subpath imports like '@llamaindex/llama-cloud/resources/classifier.js'
    content = content.replace(
      /from ['"]@llamaindex\/llama-cloud\/([^'"]+)['"]/g,
      (match, subpath) => `from '${relativeToVendor}/${subpath}'`
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated: ${path.relative(PROJECT_ROOT, filePath)}`);
    }
  }
}

/**
 * Create a minimal package.json for the vendor directory (for ESM/CJS compatibility)
 */
function createVendorPackageJson() {
  const packageJson = {
    "name": "llama-cloud-vendor",
    "version": "0.14.1",
    "description": "Vendored copy of @llamaindex/llama-cloud for n8n community nodes",
    "type": "commonjs",
    "private": true
  };

  fs.writeFileSync(
    path.join(VENDOR_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  console.log('  Created vendor package.json');
}

/**
 * Main execution
 */
function main() {
  console.log('=== Embedding @llamaindex/llama-cloud package ===\n');

  // Check if source package exists
  if (!fs.existsSync(SOURCE_PACKAGE)) {
    console.error('Error: @llamaindex/llama-cloud not found in node_modules.');
    console.error('Please run "npm install" first.');
    process.exit(1);
  }

  // Clean existing vendor directory
  if (fs.existsSync(VENDOR_DIR)) {
    console.log('Cleaning existing vendor directory...');
    fs.rmSync(VENDOR_DIR, { recursive: true });
  }

  // Copy package files
  console.log('\nCopying package files...');
  copyDir(SOURCE_PACKAGE, VENDOR_DIR);

  // Create vendor package.json
  console.log('\nCreating vendor package.json...');
  createVendorPackageJson();

  // Process copied files to verify imports
  console.log('\nVerifying imports in vendor files...');
  processDirectory(VENDOR_DIR);

  // Update node imports
  updateNodeImports();

  console.log('\n=== Done! ===');
  console.log('\nNext steps:');
  console.log('1. Remove @llamaindex/llama-cloud from package.json dependencies');
  console.log('2. Run "npm run build" to verify everything compiles');
  console.log('3. Test the nodes to ensure they work correctly');
}

main();
