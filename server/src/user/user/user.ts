import { JwtPayload } from '../../authentication/interfaces/jwt-payload.interface';

export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly role: string,
    public readonly email: string,
  ) {}

  toJwtPayload(): JwtPayload {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      email: this.email,
    };
  }
}
