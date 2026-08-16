# Contributing to EduIQ

Thank you for your interest in contributing to EduIQ!

## Development Guidelines
1. **Type Safety**: Ensure strict TypeScript compliance (`npx tsc -b`).
2. **Code Style**: Follow React 18 functional component patterns and Tailwind CSS utilities.
3. **State Management**: Perform state mutations through `dataStore.ts` to maintain reactive UI consistency.
4. **No Developer Errors Standard**: End users in demo mode must never see internal database error tracebacks.

## Testing & Build Verification
Before opening a pull request, run:
```bash
# Type check
npx tsc --noEmit

# Production build test
npm run build
```
