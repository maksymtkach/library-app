import { expect } from 'chai';
import { Validation } from '../src/Validation';

describe('Validation', () => {
  it('should validate a correct email', () => {
    expect(Validation.isValidEmail('test@example.com')).to.be.true;
  });
});
