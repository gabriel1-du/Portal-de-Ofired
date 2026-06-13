import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Esto extiende el objeto 'expect' de Vitest con los métodos de jest-dom
expect.extend(matchers);