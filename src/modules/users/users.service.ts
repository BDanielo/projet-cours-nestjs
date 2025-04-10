import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './types-dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise<User[]>} Liste des utilisateurs
   */
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return plainToInstance(User, users);
  }

  /**
   * Récupère un utilisateur par son id
   * @param {string} id - L'id de l'utilisateur
   * @returns {Promise<User>} L'utilisateur correspondant à l'id
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return plainToInstance(User, user);
  }

  /**
   * Récupère un utilisateur par son id
   * @param {string} id - L'id de l'utilisateur
   * @returns {Promise<User>} L'utilisateur correspondant à l'id
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // On vérifie si l'email existe déjà
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    // On hash le mot de passe
    const saltRounds = 10; //*bon équilibre sécurité/performances
    const hashPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(User, savedUser); //pour exclure le mdp de l'exposition
  }

  /**
   * Met à jour un utilisateur
   * @param {string} id - L'id de l'utilisateur
   * @param {Partial<User>} user - Les données à mettre à jour
   * @returns {Promise<User>} L'utilisateur mis à jour
   */
  async findByEmail(email: string): Promise<User> {
    return plainToInstance(User, await this.userRepository.findOneBy({ email }));
  }

  /**
   * Met à jour un utilisateur
   * @param {string} id - L'id de l'utilisateur
   * @param {Partial<User>} user - Les données à mettre à jour
   * @returns {Promise<User>} L'utilisateur mis à jour
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}