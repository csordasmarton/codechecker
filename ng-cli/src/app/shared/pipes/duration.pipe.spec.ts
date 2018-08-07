import { DurationPipe } from './duration.pipe';

describe('Pipe: DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('providing positive duration values', () => {
    expect(pipe.transform(0)).toBe('00:00:00');
    expect(pipe.transform(1)).toBe('00:00:01');
    expect(pipe.transform(10)).toBe('00:00:10');
    expect(pipe.transform(59)).toBe('00:00:59');
    expect(pipe.transform(60)).toBe('00:01:00');
    expect(pipe.transform(61)).toBe('00:01:01');
    expect(pipe.transform(120)).toBe('00:02:00');
    expect(pipe.transform(600)).toBe('00:10:00');
    expect(pipe.transform(3600)).toBe('01:00:00');
  });

  it('providing negative duration values', () => {
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(-100)).toBe('');
  });
});
