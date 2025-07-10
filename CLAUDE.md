# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Fluent Chat Widget** - an embeddable JavaScript chat widget for websites that integrates with Fluent's conversation-first CRM. The widget is distributed as a CDN-hosted script and built using Nuxt 3, Vue 3, and TypeScript.

### Key Philosophy
- **Conversation-first approach**: This is NOT a traditional chat widget. Fluent treats conversations as the primary entity, maintaining unified threads across all channels (email, phone, SMS, widget).
- **Separate repository strategy**: Independent from the main CRM for optimized size/performance and different release cycles.
- **Embeddable architecture**: Built to be injected into any website via CDN script.

## Essential Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3001)
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix
```

### Building & Testing
```bash
# Build widget for production (generates multiple formats)
pnpm build:widget

# Build Nuxt application
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Build widget with docs and examples
node scripts/build.js --docs --examples
```

### Release & Deployment
```bash
# Release new version
pnpm release

# Build documentation
pnpm docs:build
```

## Core Architecture

### Entry Point & Widget Instance
- **Main entry**: `app/widget.ts` - Contains `FluentWidgetInstance` class and global `FluentWidget` API
- **Class-based architecture**: `FluentWidgetInstance` manages DOM manipulation, Vue app mounting, and lifecycle
- **Global API**: `FluentWidget` object provides convenience methods for customer integration
- **Auto-initialization**: Detects `window.FluentWidgetConfig` and initializes automatically

### Build System & Distribution
- **Custom build script**: `scripts/build.js` generates multiple formats (IIFE, ESM, UMD)
- **CDN distribution**: Built for versioned CDN hosting (`https://cdn.fluent.ai/widget/v1/`)
- **Multiple outputs**: Development, production minified, ES modules, UMD formats
- **Integrity hashes**: SRI hashes generated for security

### Vue Component Structure
- **Root component**: `app/components/WidgetApp.vue` orchestrates all child components
- **Component directory**: `app/components/` (not `src/components/`)
- **Composables**: `app/composables/` for reusable logic (API, WebSocket, storage)
- **Types**: `app/types/widget.ts` contains comprehensive TypeScript definitions

### Configuration System
- **Main config interface**: `WidgetConfig` in `app/types/widget.ts`
- **Customer integration**: Via `window.FluentWidgetConfig` object
- **Default config**: Defined in `app/widget.ts`
- **Validation**: Built-in config validation and warnings

### API Integration
- **RESTful API**: HTTP client for message sending, file uploads
- **WebSocket**: Real-time updates via `composables/useWebSocket.ts`
- **Default API URL**: `https://api.fluent.ai`
- **Configurable endpoints**: API URL can be overridden in config

## Project Structure Notes

### Directory Layout
```
app/                    # Main application code (Nuxt 4 convention)
├── widget.ts          # Main entry point
├── components/        # Vue components
├── composables/       # Reusable logic
├── types/            # TypeScript definitions
├── utils/            # Utility functions
└── assets/css/       # Styles

scripts/               # Build and deployment scripts
├── build.js          # Multi-format build script
├── deploy.js         # CDN deployment
└── release.js        # Version management

examples/            # Platform-specific integration examples
docs/               # Documentation
```

### Key Files
- `app/widget.ts` - Main widget entry point and API
- `app/types/widget.ts` - Complete TypeScript definitions
- `app/components/WidgetApp.vue` - Root Vue component
- `scripts/build.js` - Custom build process
- `nuxt.config.ts` - Nuxt configuration
- `app/pages/index.vue` - Development test page with widget integration

## Development Patterns

### Widget Lifecycle
1. **Initialization**: `FluentWidgetInstance` constructor validates config
2. **DOM injection**: Creates isolated container with anti-conflict CSS
3. **Vue mounting**: Mounts `WidgetApp` with reactive props
4. **API setup**: Establishes HTTP and WebSocket connections
5. **Event handling**: Global event listeners for page lifecycle

### Style Isolation
- **CSS containment**: `!important` declarations prevent host page conflicts
- **Highest z-index**: `z-index: 2147483647` for overlay positioning
- **CSS reset**: `all: initial` resets inherited styles
- **Scoped components**: Component-level style scoping

### State Management
- **Props down, events up**: Clear data flow between components
- **Local storage**: Visitor ID and preferences persistence
- **Reactive state**: Vue 3 composition API patterns
- **Global provision**: Config and visitor ID provided to all components

### Error Handling
- **Graceful degradation**: Widget continues functioning with reduced features
- **Console logging**: Prefixed with "Fluent Widget:" for debugging
- **Validation**: Config validation with fallback to defaults

## Testing & Development

### Development Test Page
- **Location**: `app/pages/index.vue`
- **Purpose**: Realistic e-commerce demo site for widget testing
- **Widget integration**: Direct Vue component integration for seamless development
- **Hot reload**: Works with `pnpm dev` for rapid iteration
- **Live testing**: Widget functionality can be tested at `http://localhost:3001`

### Build Validation
- **Multiple formats**: Ensures broad compatibility
- **Size limits**: Warnings for bundles over 500KB
- **Integrity hashes**: SHA384 hashes for CDN security
- **Version injection**: Package version embedded in builds

### Browser Compatibility
- **Target**: ES2015 for broad support
- **Polyfills**: Minimal, rely on modern browser APIs
- **Mobile support**: Responsive design with mobile-specific behavior
- **Fallback modes**: Graceful degradation for older browsers

## Integration Patterns

### Customer Integration
```html
<script>
  window.FluentWidgetConfig = {
    apiKey: 'customer_api_key',
    companyName: 'Customer Company',
    primaryColor: '#3B82F6'
  };
</script>
<script src="https://cdn.fluent.ai/widget/v1/fluent-widget.min.js" async></script>
```

### Programmatic Usage
```javascript
// Initialize widget
const widget = FluentWidget.init({
  apiKey: 'your_api_key',
  onMessage: (message, isUser) => {
    // Custom handling
  }
});

// Control widget
FluentWidget.open();
FluentWidget.sendMessage('Hello!');
```

## Important Considerations

### Security
- **API key validation**: Required for all widget instances
- **CORS configuration**: Restricts API access to authorized domains
- **Input sanitization**: Prevents XSS through message content
- **File upload security**: Type validation and size limits

### Performance
- **Lazy loading**: Features loaded on demand
- **Bundle optimization**: Tree shaking and minification
- **Memory management**: Proper cleanup on widget destruction
- **Debounced inputs**: Prevents excessive API calls

### CDN Requirements
- **Versioned paths**: Support for both latest and specific versions
- **Integrity hashes**: SRI for security
- **Gzip compression**: CDN-level compression
- **Cache headers**: Appropriate caching strategies

## Configuration Management

The project uses runtime configuration through `nuxt.config.ts`:
- **API URLs**: Configurable via environment variables
- **Dev server**: Runs on port 3001 to avoid conflicts
- **Build output**: Targets `dist/` directory
- **CSS processing**: TailwindCSS with Vite plugin
- **TypeScript**: Strict mode with no shimming

## Release Process

1. **Version bump**: Update `package.json` version
2. **Build all formats**: Run `pnpm build:widget`
3. **Generate hashes**: SRI hashes for CDN deployment
4. **Deploy to CDN**: Upload to versioned and latest paths
5. **Update documentation**: Ensure examples reference new version
6. **Test integration**: Verify with development test page and examples