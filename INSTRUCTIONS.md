# Fluent Chat Widget Project - LLM Instructions

## Project Overview

**Project Name:** Fluent Chat Widget
**Repository:** `fluent-chat-widget` (separate from main CRM)
**Purpose:** Embeddable JavaScript chat widget for websites that integrates with Fluent's conversation-first CRM
**Technology Stack:** Nuxt 3, Vue 3, TypeScript, Vite, TailwindCSS
**Distribution:** CDN-hosted widget script for customer websites

## Core Philosophy & Architecture

### Conversation-First Approach
This is NOT a traditional chat widget. Fluent is a "conversation-first CRM" that treats conversations as the primary entity, not contacts or deals. The widget must:
- Maintain unified conversation threads across all channels (email, phone, SMS, widget)
- Preserve context when switching between communication methods
- Feed into a vector-based conversation system for semantic search and AI responses
- Support natural, flowing conversations rather than rigid support ticket workflows

### Architectural Decisions

#### 1. Separate Repository Strategy
- **Why:** Independent optimization, versioning, and distribution from main CRM
- **Benefits:** Widget can be optimized for size/performance, different release cycles, potential open-source
- **Coordination:** Shared API contracts, consistent data models, webhook integration

#### 2. Nuxt 3 Build System
- **Why:** Component-based development with optimized build output
- **Structure:** Uses `app/` directory (not `src/`)
- **Output:** Multiple formats (IIFE, ESM, UMD) for broad compatibility
- **Entry Point:** `app/widget.ts` - main entry for build system

#### 3. Class-Based Widget Instance
- **Pattern:** `FluentWidgetInstance` class manages lifecycle
- **Global API:** `FluentWidget` object provides convenient methods
- **Auto-initialization:** Detects `window.FluentWidgetConfig` and initializes automatically

## Project Structure

```
fluent-chat-widget/
├── app/                              # Main application code (Nuxt 4 convention)
│   ├── widget.ts                     # Main entry point for build
│   ├── components/
│   │   ├── WidgetApp.vue            # Root Vue component
│   │   ├── ChatHeader.vue           # Header with company info
│   │   ├── ChatMessages.vue         # Message list component
│   │   ├── ChatInput.vue            # Input area with features
│   │   ├── EmojiPicker.vue          # Emoji selection
│   │   ├── FileUpload.vue           # File upload handling
│   │   └── SatisfactionSurvey.vue   # Post-conversation survey
│   ├── composables/
│   │   ├── useWidgetApi.ts          # API communication
│   │   ├── useWebSocket.ts          # Real-time updates
│   │   ├── useStorage.ts            # LocalStorage handling
│   │   └── useFileUpload.ts         # File upload logic
│   ├── types/
│   │   └── widget.ts                # Comprehensive TypeScript types
│   ├── utils/
│   │   ├── api.ts                   # HTTP client utilities
│   │   ├── formatting.ts            # Date/time formatting
│   │   └── validation.ts            # Input validation
│   └── assets/
│       └── css/
│           └── main.css           # Widget-specific styles
├── scripts/
│   ├── build.js                     # Custom build script for multiple formats
│   ├── deploy.js                    # CDN deployment automation
│   └── release.js                   # Version management and release
├── playground/
│   └── index.html                   # Development testing environment
├── examples/                        # Integration examples
│   ├── basic-integration/
│   ├── wordpress/
│   ├── shopify/
│   ├── react/
│   └── vue/
├── dist/                            # Build output
│   ├── fluent-widget.js             # Development version
│   ├── fluent-widget.min.js         # Production minified
│   ├── fluent-widget.esm.js         # ES Module
│   ├── fluent-widget.umd.js         # UMD format
│   └── fluent-widget.css            # Extracted styles
├── docs/                            # Documentation
├── tests/                           # Test suites
└── package.json
```

## Key Components & Architecture

### 1. Entry Point (`app/widget.ts`)
- **FluentWidgetInstance class:** Manages widget lifecycle, DOM manipulation, Vue app mounting
- **FluentWidget global API:** Provides convenience methods for customer integration
- **Auto-initialization:** Detects configuration and initializes automatically
- **Error handling:** Graceful degradation and comprehensive error catching
- **Cleanup:** Proper destruction and memory management

### 2. Vue Component Structure
- **WidgetApp.vue:** Root component managing state and orchestrating child components
- **Reactive state:** Messages, conversation status, typing indicators, online status
- **Event system:** WebSocket integration for real-time updates
- **Props-based configuration:** All customization through props from main config

### 3. API Integration (`composables/useWidgetApi.ts`)
- **RESTful communication:** HTTP client for message sending, file uploads
- **FormData support:** File uploads with metadata
- **Error handling:** Network failures, API errors, rate limiting
- **Response processing:** Handle AI responses, conversation creation, status updates

### 4. Real-time Features (`composables/useWebSocket.ts`)
- **WebSocket connection:** Real-time message delivery, typing indicators
- **Reconnection logic:** Automatic reconnection with exponential backoff
- **Event handling:** Message received, agent typing, conversation status changes
- **Authentication:** Token-based WebSocket authentication

## Configuration System

### Widget Configuration Interface
Located in `app/types/widget.ts` - comprehensive configuration options:

```typescript
interface WidgetConfig {
  // Required
  apiKey: string

  // Appearance
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  companyName?: string
  greeting?: string
  avatar?: string

  // Features
  enableFileUpload?: boolean
  enableEmojis?: boolean
  enableSatisfactionSurvey?: boolean
  maxFileSize?: number
  allowedFileTypes?: string[]

  // Behavior
  autoOpen?: boolean
  showOnMobile?: boolean

  // Callbacks
  onReady?: () => void
  onMessage?: (message: string, isUser: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}
```

### Customer Integration Pattern
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

## Build & Distribution System

### Build Process (`scripts/build.js`)
1. **Multiple formats:** IIFE (main), ESM, UMD for compatibility
2. **Minification:** Terser for production builds with console.log removal
3. **CSS extraction:** Bundled CSS for self-contained distribution
4. **Version injection:** Package.json version embedded in builds
5. **Integrity hashes:** SHA384 hashes for CDN security (SRI)

### CDN Distribution Strategy
```
https://cdn.fluent.ai/widget/
├── latest/fluent-widget.min.js          # Always latest stable
├── v1/fluent-widget.min.js              # Latest v1.x (recommended)
└── v1.2.0/fluent-widget.min.js          # Specific version
```

### Build Commands
```bash
npm run build:widget        # Build all formats
npm run build -- --docs     # Include documentation
npm run playground          # Start development playground
npm run release             # Version bump and deploy
```

## API Integration Points

### Main CRM API Endpoints
- **POST /api/v1/widget/messages** - Send message with files
- **GET /api/v1/widget/conversations/{id}** - Get conversation history
- **POST /api/v1/widget/typing** - Send typing indicators
- **WebSocket /ws** - Real-time updates

### Request/Response Patterns
```typescript
// Send message request
interface SendMessageRequest {
  content: string
  visitorId: string
  conversationId?: string
  files?: File[]
  metadata?: {
    url: string
    userAgent: string
    timestamp: string
  }
}

// API response
interface SendMessageResponse {
  success: boolean
  messageId: string
  conversationId: string
  reply?: string                    # AI-generated response
  actions?: WidgetAction[]         # Additional actions (badge, redirect, etc.)
}
```

## Development Workflow

### Local Development
1. **Start Nuxt dev server:** `npm run dev`
2. **Use playground:** `npm run playground` for testing
3. **Build and test:** `npm run build:widget` then test in playground
4. **Mock API responses:** Playground includes AI response simulation

### Testing Strategy
- **Unit tests:** Component testing with Vue Testing Library
- **Integration tests:** API communication and WebSocket functionality
- **E2E tests:** Cross-browser testing with real website integration
- **Playground testing:** Interactive development environment

### Code Quality
- **TypeScript:** Comprehensive typing throughout
- **ESLint + Prettier:** Code formatting and quality
- **Vue 3 Composition API:** Modern Vue patterns
- **Error boundaries:** Graceful error handling

## Styling & CSS Strategy

### CSS Architecture
- **Scoped styles:** Component-specific styling
- **CSS isolation:** Prevent conflicts with host page styles using `!important` where necessary
- **TailwindCSS:** Utility-first CSS framework
- **CSS custom properties:** Theme-able colors and spacing
- **Responsive design:** Mobile-first approach

### Style Isolation Techniques
```css
.fluent-widget-container {
  all: initial !important;                /* Reset all inherited styles */
  position: fixed !important;
  z-index: 2147483647 !important;        /* Highest z-index */
  font-family: -apple-system, ... !important;
}

.fluent-widget-container * {
  box-sizing: border-box !important;      /* Consistent box model */
}
```

## Advanced Features Implementation

### File Upload System
- **Drag & drop support:** Visual feedback and validation
- **File type validation:** MIME type and extension checking
- **Size limits:** Configurable per-file and total limits
- **Progress indicators:** Upload progress with cancellation
- **Preview generation:** Thumbnails for images

### Emoji Picker
- **Unicode emoji support:** Latest emoji standards
- **Categories:** Organized emoji selection
- **Search functionality:** Find emojis by name
- **Recent/frequently used:** User preference tracking

### Satisfaction Survey
- **Star rating:** 1-5 star scale
- **Text feedback:** Optional comment field
- **Trigger logic:** After conversation resolution
- **Analytics integration:** Feed into CRM metrics

### Real-time Features
- **Typing indicators:** Show when agent is typing
- **Online status:** Agent availability indicators
- **Message delivery:** Read receipts and delivery status
- **Connection status:** Handle offline/online transitions

## Security Considerations

### Data Protection
- **API key validation:** Verify legitimate widget installations
- **CORS configuration:** Restrict API access to authorized domains
- **Input sanitization:** Prevent XSS through message content
- **File upload security:** Virus scanning, type validation

### Privacy Compliance
- **GDPR support:** Data access, deletion, portability
- **Cookie consent:** Respect user privacy preferences
- **Data minimization:** Collect only necessary information
- **Anonymization options:** Configurable visitor tracking

## Performance Optimization

### Bundle Size Optimization
- **Tree shaking:** Remove unused code
- **Code splitting:** Dynamic imports where beneficial
- **Minification:** Aggressive compression for production
- **Gzip compression:** CDN-level compression

### Runtime Performance
- **Virtual scrolling:** For long conversation histories
- **Lazy loading:** Load features on demand
- **Debounced inputs:** Prevent excessive API calls
- **Memory management:** Proper cleanup and garbage collection

### Loading Strategy
- **Async loading:** Non-blocking widget initialization
- **Progressive enhancement:** Basic functionality first
- **Fallback modes:** Graceful degradation for older browsers
- **Caching strategy:** Leverage browser and CDN caching

## Common Development Patterns

### State Management
- **Reactive state:** Vue 3 ref/reactive for component state
- **Props down, events up:** Clear data flow patterns
- **Global state:** Minimal, mostly for widget-level configuration
- **Persistence:** LocalStorage for visitor ID and preferences

### Error Handling
```typescript
try {
  await apiCall()
} catch (error) {
  console.error('Fluent Widget: API call failed', error)
  showUserFriendlyError()
  // Don't break the widget - graceful degradation
}
```

### Event System
```typescript
// Component communication
emit('message-sent', { content, timestamp })

// Global widget events
window.FluentWidgetConfig.onMessage?.(content, isUser)
```

## Integration Examples

### Basic Integration
```html
<script>
  window.FluentWidgetConfig = {
    apiKey: 'your_api_key',
    companyName: 'Your Company'
  };
</script>
<script src="https://cdn.fluent.ai/widget/v1/fluent-widget.min.js" async></script>
```

### Advanced Integration
```javascript
FluentWidget.init({
  apiKey: 'your_api_key',
  onMessage: (message, isUser) => {
    // Custom analytics tracking
    gtag('event', 'widget_message', { isUser });
  },
  onOpen: () => {
    // Track widget engagement
    analytics.track('Widget Opened');
  }
});
```

### Platform-Specific Examples
- **WordPress:** PHP function to inject widget code
- **Shopify:** Liquid template integration
- **React:** Component wrapper for React applications
- **Vue:** Plugin for Vue applications

## Debugging & Troubleshooting

### Common Issues
1. **Widget not appearing:** Check API key, network requests, console errors
2. **Styles conflicts:** Inspect CSS specificity, check for host page interference
3. **Messages not sending:** Verify API endpoint, check CORS configuration
4. **WebSocket issues:** Check connection status, authentication, firewall rules

### Debug Mode
```javascript
window.FluentWidgetConfig = {
  debugMode: true,  // Enables verbose logging
  // ... other config
};
```

### Development Tools
- **Browser DevTools:** Network tab for API calls, Console for errors
- **Vue DevTools:** Component inspection and state debugging
- **Playground environment:** Isolated testing with mock responses

## Deployment & Release Process

### Version Management
- **Semantic versioning:** Major.Minor.Patch following semver
- **Git tags:** Tag releases for rollback capability
- **Changelog:** Maintain detailed change documentation

### CDN Deployment
1. **Build all formats:** Development, production, ES modules
2. **Generate integrity hashes:** SRI for security
3. **Upload to CDN:** Versioned and latest paths
4. **Cache invalidation:** Ensure new versions are distributed
5. **Monitoring:** Track adoption and error rates

### Release Checklist
- [ ] All tests passing
- [ ] Playground testing completed
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] CDN deployment successful
- [ ] Integration examples tested
- [ ] Performance regression testing

## Future Considerations

### Planned Features
- **Voice messages:** Audio recording and playback
- **Video calls:** WebRTC integration for video support
- **Screen sharing:** Customer support screen sharing
- **Co-browsing:** Shared browser sessions
- **Advanced AI:** Smarter conversation routing and responses

### Scalability Plans
- **Micro-frontend architecture:** Multiple widget types
- **Plugin system:** Extensible feature additions
- **Multi-language support:** Internationalization framework
- **Performance monitoring:** Real-user monitoring integration

### Technical Debt
- **Browser compatibility:** Progressive enhancement strategy
- **Bundle size:** Continued optimization efforts
- **API versioning:** Backward compatibility strategy
- **Documentation:** Keep examples and docs current

## Quick Start for New LLMs

When starting work on this project:

1. **Understand the philosophy:** This is conversation-first, not traditional support chat
2. **Review the types:** `app/types/widget.ts` contains the complete data model
3. **Check the playground:** `playground/index.html` for interactive testing
4. **Examine the entry point:** `app/widget.ts` for architecture understanding
5. **Build and test:** `npm run build:widget && npm run playground`
6. **Read the main CRM docs:** Understand the broader Fluent ecosystem

The widget must feel like a natural extension of human conversation, not a mechanical support tool. Every feature should enhance the conversational experience while maintaining the technical excellence expected from a modern web component.

Remember: The goal is to make business relationships flow naturally through technology, not to create another generic chat widget.