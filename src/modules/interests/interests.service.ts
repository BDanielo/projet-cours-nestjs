import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from './dto/create-interest.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  /**
   * Récupère un intérêt par son ID.
   * @param id - L'ID de l'intérêt à récupérer.
   * @returns L'intérêt correspondant à l'ID fourni.
   * @throws NotFoundException si l'intérêt n'est pas trouvé.
   */
  async findOne(id: number): Promise<Interest> {
    const interest = await this.interestsRepository.findOneBy({ id });
    if (!interest) {
      throw new NotFoundException(`Intérêt avec l'ID ${id} introuvable`);
    }
    return interest;
  }

  /**
   * Crée un nouvel intérêt.
   * @param createInterestDto - Les données de l'intérêt à créer.
   * @returns L'intérêt créé.
   */
  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const interest = this.interestsRepository.create(createInterestDto);
    return this.interestsRepository.save(interest);
  }

  /**
   * Ajoute des intérêts à un utilisateur.
   * @param userId - L'ID de l'utilisateur auquel ajouter les intérêts.
   * @param interestIds - Les IDs des intérêts à ajouter.
   * @returns L'utilisateur mis à jour avec les nouveaux intérêts.
   */
  async addInterestsToUser(userId: string, interestIds: number[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    // On vérifie si l'utilisateur existe
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} introuvable`);
    }

    // On vérifie si des intérêts existent
    const interests = await Promise.all(
      interestIds.map(async (id) => {
        const interest = await this.findOne(id);
        return interest;
      }),
    );

    // On initialise les intérêts de l'utilisateur s'ils n'existent pas
    if (!user.interests) {
      user.interests = [];
    }

    // Et on ajoute les nouveaux intérêts
    user.interests = [...user.interests, ...interests];

    return this.usersRepository.save(user);
  }

  /**
   * Récupère les intérêts d'un utilisateur.
   * @param userId - L'ID de l'utilisateur dont on veut récupérer les intérêts.
   * @returns La liste des intérêts de l'utilisateur.
   */
  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} introuvable`);
    }

    return user.interests || [];
  }

  /**
   * Recommande des projets basés sur les intérêts de l'utilisateur.
   * @param userId - L'ID de l'utilisateur pour lequel on veut des recommandations.
   * @returns Une liste de projets recommandés.
   */
  async getRecommendedProjects(userId: string): Promise<string> {
    // !TODO : Implémenter la logique de recommandation de projets
    const interests = await this.getUserInterests(userId);

    return `Projets recommandés pour l'utilisateur ${userId} basés sur ${interests.length} intérêts`;
  }
}