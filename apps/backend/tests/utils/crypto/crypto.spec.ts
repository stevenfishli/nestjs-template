import { Crypto } from '../../../src/utils/crypto/crypto';
import * as bcrypt from 'bcryptjs';

describe('Crypto', () => {
  describe('hashPassword', () => {
    it('should hash password', async () => {
      const hash = await Crypto.hashPassword('pw');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const pw = 'pw';
      const hash = await bcrypt.hash(pw, 10);
      expect(await Crypto.comparePassword(pw, hash)).toBe(true);
    });
    it('should return false for wrong password', async () => {
      const hash = await bcrypt.hash('pw', 10);
      expect(await Crypto.comparePassword('wrong', hash)).toBe(false);
    });
  });
});
