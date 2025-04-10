import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Valide les identifiants de l'utilisateur
   * @param email - L'email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   * @returns L'utilisateur validé sans le mot de passe
   * @throws UnauthorizedException si les identifiants sont incorrects
   */
  async validateUser(email: string, password: string) {
    // Utilisation de la nouvelle méthode à la place de plainToInstance
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Vérification du mot de passe
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // On retourne l'utilisateur sans le mot de passe
    return plainToInstance(User, user);
  }

  /**
   * Login : Génère un token JWT pour l'utilisateur
   * @param user - L'utilisateur pour lequel générer le token
   * @returns Un objet contenant le token d'accès
   */
  async login(user: User) {
    const validatedUser = await this.validateUser(user.email, user.password);
    const payload = {
      email: validatedUser.email,
      sub: validatedUser.id,
      role: validatedUser.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
