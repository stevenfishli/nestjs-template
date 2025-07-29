import bcrypt from 'bcryptjs';

export class Crypto {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // 可以根據需要調整
    const salt = bcrypt.genSaltSync(saltRounds);
    return await bcrypt.hashSync(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compareSync(password, hash);
  }
}
