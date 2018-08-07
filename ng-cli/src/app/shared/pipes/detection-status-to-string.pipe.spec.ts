import { DetectionStatus } from '@cc/db-access';

import { UtilService } from '..';
import { DetectionStatusToStringPipe } from './detection-status-to-string.pipe';

describe('Pipe: DetectionStatusToStringPipe', () => {
  let pipe: DetectionStatusToStringPipe;

  beforeEach(() => {
    pipe = new DetectionStatusToStringPipe(new UtilService());
  });

  it('providing valid detection status values', () => {
    expect(pipe.transform(DetectionStatus.NEW)).toBe('New');
    expect(pipe.transform(DetectionStatus.REOPENED)).toBe('Reopened');
    expect(pipe.transform(DetectionStatus.RESOLVED)).toBe('Resolved');
    expect(pipe.transform(DetectionStatus.UNRESOLVED)).toBe('Unresolved');
  });

  it('providing invalid detection status value', () => {
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
