# Open API Web: A Web Client for LLM Interactions

Open API Web is a feature-rich web application that provides a user-friendly interface for interacting with large language models like Open through their APIs. This locally-run client offers robust chat functionality while keeping all data stored in the browser.

## Core Functionality

The application serves as a complete chat interface with AI models, supporting:

*   Seamless conversation management with both streaming and fetch response modes
*   Local storage of all chat history using IndexedDB
*   Multi-chat sessions with easy switching between conversations
*   Full-text search across all chat history

## Key Features

### Chat Management

*   Create, delete, and navigate between multiple chat sessions
*   System prompt configuration for customizing AI behavior
*   Re-generate responses and create new chats directly from the interface

### Media & Input Support

*   Image upload capability for visual context in conversations
*   Image generation functionality
*   Voice input via Whisper integration
*   Support for text-to-speech

### User Experience

*   Multi-language support with automatic browser language detection
*   Dark/light mode toggle
*   Responsive design with sidebar for chat navigation
*   Auto-scrolling with toggle option

### Technical Features

*   Token usage tracking and management
*   Cost calculation for API usage
*   Template system for reusing prompts and API configurations
*   Tool integration capabilities for enhanced AI functionality

## Privacy & Data

The application prioritizes privacy by storing all data locally in the browser's IndexedDB and localStorage, with no server-side storage:

*   Chat history stored in IndexedDB
*   Settings and templates stored in localStorage
*   All processing happens client-side

## Technical Implementation

Built with modern web technologies:

*   React and TypeScript
*   Vite as the build tool
*   Tailwind CSS for styling
*   Radix UI components for accessible UI elements

## Notes

This is a privacy-focused Open/AI chat client that runs entirely in the browser. All conversations and settings are stored locally, making it a good option for users who want to interact with AI models while maintaining control over their data. The search functionality is particularly useful for finding past conversations across all chat sessions.