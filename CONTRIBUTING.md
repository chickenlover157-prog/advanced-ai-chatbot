# Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
bash scripts/setup.sh
cd frontend && npm install
npm run dev
```

## Code Standards

### TypeScript

- Strict mode enabled
- Full type coverage
- No `any` types
- Interfaces for objects

### Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
npm run test:watch
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make commits
git commit -m "feat: add new feature"

# Push
git push origin feature/your-feature

# Create PR
```

## Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
test: add tests
refactor: refactor code
chore: update dependencies
```

## PR Guidelines

1. Describe your changes clearly
2. Reference related issues
3. Add tests for new features
4. Update documentation
5. Ensure all tests pass

## Code Review

- Be respectful
- Ask questions
- Suggest improvements
- Test locally

## Issues

- Search before creating
- Provide clear description
- Include steps to reproduce
- Share environment info

## License

MIT - See LICENSE file
