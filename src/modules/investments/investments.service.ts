import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UserRole } from '../users/types-dto/user-role.type';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
  ) {}

  /**
   * Crée un nouvel investissement
   * @param createInvestmentDto - Les données de l'investissement à créer
   * @param userId - L'ID de l'utilisateur qui effectue l'investissement
   * @returns L'investissement créé
   */
  async create(createInvestmentDto: CreateInvestmentDto, userId: string): Promise<Investment> {
    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      investorId: userId,
    });
    return this.investmentRepository.save(investment);
  }

  /**
   * Récupère tous les investissements d'un investisseur
   * @returns Une liste d'investissements
   */
  async findAllByInvestor(investorId: string): Promise<Investment[]> {
    return this.investmentRepository.find({
      where: { investorId },
      relations: ['project'],
    });
  }

  /**
   * Récupère tous les investissements d'un projet
   * @param projectId - L'ID du projet
   * @param user - L'utilisateur qui effectue la requête
   * @returns Une liste d'investissements
   */
  async findByProject(projectId: string, user: any): Promise<Investment[]> {
    const investments = await this.investmentRepository.find({
      where: { projectId },
      relations: ['investor', 'project'],
    });

    // Vérification des droits d'accès (admin ou propriétaire du projet)
    if (
      user.role === UserRole.ADMIN ||
      investments.some(inv => inv.project?.ownerId === user.id) ||
      investments.some(inv => inv.investorId === user.id)
    ) {
      return investments;
    }

    throw new ForbiddenException(
      "Vous n'avez pas les droits pour accéder à ces investissements",
    );
  }

  /**
   * Supprime un investissement
   * @param id - L'ID de l'investissement à supprimer
   * @param userId - L'ID de l'utilisateur qui effectue la requête
   * @throws NotFoundException si l'investissement n'existe pas
   * @throws ForbiddenException si l'utilisateur n'est pas l'investisseur
   * @returns void
   */
  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['investor'],
    });

    if (!investment) {
      throw new NotFoundException(`Investissement avec l'ID ${id} introuvable`);
    }

    if (investment.investorId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez annuler que vos propres investissements',
      );
    }

    await this.investmentRepository.delete(id);
  }
}