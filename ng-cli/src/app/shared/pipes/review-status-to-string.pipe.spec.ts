import { ReviewStatus } from '@cc/db-access';

import { UtilService } from '..';
import { ReviewStatusToStringPipe } from './review-status-to-string.pipe';

describe('Pipe: ReviewStatusToString', () => {
  let pipe: ReviewStatusToStringPipe;

  beforeEach(() => {
    pipe = new ReviewStatusToStringPipe(new UtilService());
  });

  it('providing valid review status values', () => {
    expect(pipe.transform(ReviewStatus.CONFIRMED)).toBe('Confirmed bug');
    expect(pipe.transform(ReviewStatus.FALSE_POSITIVE)).toBe('False positive');
    expect(pipe.transform(ReviewStatus.INTENTIONAL)).toBe('Intentional');
    expect(pipe.transform(ReviewStatus.UNREVIEWED)).toBe('Unreviewed');
  });

  it('providing invalid review status value', () => {
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
