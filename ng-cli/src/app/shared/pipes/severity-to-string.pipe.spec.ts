import { Severity } from '@cc/db-access';

import { UtilService } from '..';
import { SeverityToStringPipe } from './severity-to-string.pipe';

describe('Pipe: SeverityToStringPipe', () => {
  let pipe: SeverityToStringPipe;

  beforeEach(() => {
    pipe = new SeverityToStringPipe(new UtilService());
  });

  it('providing valid severity values', () => {
    expect(pipe.transform(Severity.CRITICAL)).toBe('Critical');
    expect(pipe.transform(Severity.HIGH)).toBe('High');
    expect(pipe.transform(Severity.LOW)).toBe('Low');
    expect(pipe.transform(Severity.MEDIUM)).toBe('Medium');
    expect(pipe.transform(Severity.STYLE)).toBe('Style');
    expect(pipe.transform(Severity.UNSPECIFIED)).toBe('Unspecified');
  });

  it('providing invalid severity value', () => {
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
