import '@testing-library/jest-dom'

// Mock uuid globally
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));
