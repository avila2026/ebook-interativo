```markdown
# ebook-interativo Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches best practices for contributing to the `ebook-interativo` JavaScript codebase. You'll learn about the project's coding conventions, file organization, import/export patterns, and how to write and run tests. These guidelines ensure consistency and maintainability across the repository.

## Coding Conventions

### File Naming
- Use **kebab-case** for all filenames.
  - Example:  
    ```
    interactive-component.js
    user-profile.test.js
    ```

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { myFunction } from './utils/helper-functions.js';
    ```

### Export Style
- Use **named exports** rather than default exports.
  - Example:
    ```javascript
    // In utils/helper-functions.js
    export function myFunction() { ... }
    export const CONSTANT = 42;
    ```

### Commit Messages
- Commit messages are **freeform** (no enforced prefixes), but should be clear and concise.
- Average commit message length: ~77 characters.
  - Example:
    ```
    Add navigation logic to interactive ebook pages
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new feature or component  
**Command:** `/add-feature`

1. Create a new file using kebab-case naming.
2. Write your feature using named exports.
3. Import any dependencies using relative paths.
4. Write corresponding tests in a `.test.js` file.
5. Commit your changes with a clear, descriptive message.

### Fixing a Bug
**Trigger:** When resolving a bug or issue  
**Command:** `/fix-bug`

1. Locate the relevant file(s) using kebab-case naming.
2. Make the necessary code changes.
3. Update or add tests to cover the fix.
4. Commit with a message describing the bug and fix.

### Writing Tests
**Trigger:** When adding or updating tests  
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.js`.
2. Write tests for your feature or bugfix.
3. Ensure tests use named imports/exports as needed.
4. Run the tests to verify correctness.

## Testing Patterns

- Test files follow the pattern: `*.test.js`
  - Example: `interactive-component.test.js`
- The testing framework is **unknown**, but tests should reside alongside or near the code they test.
- Tests should use named imports/exports and follow the same import style as the main codebase.

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /add-feature | Start the workflow for adding a feature |
| /fix-bug     | Start the workflow for fixing a bug     |
| /write-test  | Start the workflow for writing tests    |
```