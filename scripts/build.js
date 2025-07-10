#!/usr/bin/env node

import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

async function buildWidget() {
  console.log('🚀 Building Fluent Chat Widget...')
  console.log(`📦 Version: ${packageJson.version}`)

  // Define build formats
  const formats = [
    {
      format: 'iife',
      name: 'FluentWidget',
      fileName: 'fluent-widget.js',
      minify: false
    },
    {
      format: 'iife',
      name: 'FluentWidget',
      fileName: 'fluent-widget.min.js',
      minify: true
    },
    {
      format: 'es',
      fileName: 'fluent-widget.esm.js',
      minify: false
    },
    {
      format: 'umd',
      name: 'FluentWidget',
      fileName: 'fluent-widget.umd.js',
      minify: false
    }
  ]

  // Build each format
  for (const formatConfig of formats) {
    console.log(`📦 Building ${formatConfig.fileName}...`)

    await build({
      configFile: false,
      define: {
        'process.env.NODE_ENV': '"production"',
        '__WIDGET_VERSION__': `"${packageJson.version}"`
      },
      build: {
        lib: {
          entry: resolve(__dirname, '../app/widget.ts'),
          formats: [formatConfig.format],
          name: formatConfig.name,
          fileName: () => formatConfig.fileName
        },
        outDir: 'dist',
        cssCodeSplit: false,
        rollupOptions: {
          external: [],
          output: {
            globals: {},
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'main.css') {
                return 'fluent-widget.css'
              }
              return assetInfo.name
            }
          }
        },
        minify: formatConfig.minify ? 'terser' : false,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: {
            properties: {
              regex: /^_/ // Mangle private properties
            }
          }
        },
        sourcemap: !formatConfig.minify,
        target: 'es2015', // Broad browser compatibility
        chunkSizeWarningLimit: 500 // Widget should be small
      },
      esbuild: {
        legalComments: 'none'
      }
    })
  }

  // Update version in built files
  updateVersionInBuiltFiles()

  // Generate integrity hashes
  generateIntegrityHashes()

  console.log('✅ Widget build complete!')
  console.log('📁 Files generated in ./dist/')
}

function updateVersionInBuiltFiles() {
  console.log('🔧 Updating version in built files...')

  const files = [
    'dist/fluent-widget.js',
    'dist/fluent-widget.min.js',
    'dist/fluent-widget.esm.js',
    'dist/fluent-widget.umd.js'
  ]

  files.forEach((file) => {
    try {
      let content = readFileSync(resolve(__dirname, '..', file), 'utf-8')
      content = content.replace(/version:\s*["']1\.0\.0["']/, `version: "${packageJson.version}"`)
      writeFileSync(resolve(__dirname, '..', file), content)
    } catch (error) {
      console.warn(`⚠️  Could not update version in ${file}:`, error.message)
    }
  })
}

function generateIntegrityHashes() {
  console.log('🔐 Generating integrity hashes...')

  const crypto = require('crypto')
  const files = [
    'dist/fluent-widget.min.js',
    'dist/fluent-widget.css'
  ]

  const hashes = {}

  files.forEach((file) => {
    try {
      const content = readFileSync(resolve(__dirname, '..', file))
      const hash = crypto.createHash('sha384').update(content).digest('base64')
      const integrity = `sha384-${hash}`
      hashes[file] = integrity
      console.log(`🔑 ${file}: ${integrity}`)
    } catch (error) {
      console.warn(`⚠️  Could not generate hash for ${file}:`, error.message)
    }
  })

  // Write hashes to file for CDN deployment
  writeFileSync(
    resolve(__dirname, '../dist/integrity.json'),
    JSON.stringify(hashes, null, 2)
  )
}

// Additional build tasks
async function buildDocs() {
  console.log('📚 Building documentation...')

  // Use Nuxt to build static documentation
  const { execSync } = require('child_process')

  try {
    execSync('npx nuxt generate', {
      cwd: resolve(__dirname, '..'),
      stdio: 'inherit'
    })
    console.log('✅ Documentation built!')
  } catch (error) {
    console.error('❌ Documentation build failed:', error.message)
  }
}

async function copyExamples() {
  console.log('📋 Copying examples...')

  const { copyFileSync, mkdirSync } = require('fs')

  try {
    mkdirSync(resolve(__dirname, '../dist/examples'), { recursive: true })

    // Copy example files
    const examples = [
      'examples/basic-integration/index.html',
      'examples/wordpress/fluent-widget.php',
      'examples/shopify/fluent-widget.liquid',
      'examples/react/FluentWidget.jsx',
      'examples/vue/FluentWidget.vue'
    ]

    examples.forEach((example) => {
      try {
        copyFileSync(
          resolve(__dirname, '..', example),
          resolve(__dirname, '../dist', example)
        )
      } catch (error) {
        console.warn(`⚠️  Could not copy ${example}:`, error.message)
      }
    })

    console.log('✅ Examples copied!')
  } catch (error) {
    console.error('❌ Failed to copy examples:', error.message)
  }
}

// Main build function
async function main() {
  const args = process.argv.slice(2)
  const shouldBuildDocs = args.includes('--docs')
  const shouldCopyExamples = args.includes('--examples')

  try {
    // Always build the widget
    await buildWidget()

    // Optional tasks
    if (shouldBuildDocs) {
      await buildDocs()
    }

    if (shouldCopyExamples) {
      await copyExamples()
    }

    console.log('')
    console.log('🎉 Build completed successfully!')
    console.log('📁 Output directory: ./dist/')
    console.log('')
    console.log('📦 Generated files:')
    console.log('  - fluent-widget.js (Development version with source maps)')
    console.log('  - fluent-widget.min.js (Production version, minified)')
    console.log('  - fluent-widget.esm.js (ES Module version)')
    console.log('  - fluent-widget.umd.js (UMD version)')
    console.log('  - fluent-widget.css (Styles)')
    console.log('  - integrity.json (SRI hashes)')
    console.log('')
    console.log('🚀 Ready for CDN deployment!')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

// Run the build
main().catch(console.error)
