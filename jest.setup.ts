import '@testing-library/jest-dom'

// Mock uuid globally
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

// Mock I18nContext globally
jest.mock('@/i18n/I18nContext', () => {
  // Import actual translations for the mock
  // We need to use require because jest.mock is hoisted
  const { es } = require('./src/i18n/locales/es');
  
  return {
    useI18n: () => ({
      t: es,
      locale: 'es',
      setLocale: jest.fn(),
    }),
    I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
