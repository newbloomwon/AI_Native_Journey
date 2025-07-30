# Testing Documentation

## Play Functionality Tests

This directory contains tests for the play functionality in the Molecular Dynamics Visualization application. The tests are written using Vitest and React Testing Library.

### Test Files

1. **App.test.jsx**
   - Simple tests for the PlayButton component
   - Tests the toggle behavior of the play/pause button
   - Tests the handlePlayPause function in isolation

2. **PlayFunctionality.test.jsx**
   - Comprehensive tests for all play-related functionality
   - Tests individual functions that control playback behavior
   - Organized into logical test suites:
     - `handlePlayPause Function`: Tests the play/pause toggle functionality
     - `handleStepChange Function`: Tests step navigation
     - `handleMarkerClick Function`: Tests marker click behavior
     - `toggleFreezeOption Function`: Tests the freeze at step start option
     - `Step Completion Handling`: Tests step advancement and completion behavior

### Testing Approach

The tests follow these principles:

1. **Isolation**: Each function is tested in isolation to ensure it behaves correctly regardless of the surrounding component structure.

2. **State Management**: Tests verify that state updates occur correctly when functions are called.

3. **Behavior Verification**: Tests confirm that functions produce the expected behavior under different conditions.

4. **Edge Cases**: Tests cover special cases like the last step completion and the freeze at step start option.

### Running Tests

To run the tests:

```bash
npm test
```

To run tests in watch mode (for development):

```bash
npm run test:watch
```

### Test Configuration

The test environment is configured in:

- `vitest.config.js`: Main Vitest configuration
- `src/test/setup.js`: Test environment setup, including mocks for React Three Fiber and related libraries

### Mocking Strategy

The tests use mocking to isolate the functionality being tested:

1. **State Setters**: React's state setter functions are mocked using `vi.fn()` to verify they are called with the correct arguments.

2. **Component Mocks**: Complex components like MoleculeViewer are mocked to simplify testing and avoid dependencies on Three.js.

3. **Function Simulation**: State updates are simulated by capturing and executing the update functions passed to state setters.