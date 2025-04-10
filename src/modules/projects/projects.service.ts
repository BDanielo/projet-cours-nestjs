import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../users/types-dto/user-role.type';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  /**
   * Crée un projet
   * @param createProjectDto - DTO de création de projet
   * @param userId - ID de l'utilisateur qui crée le projet
   * @returns Le projet créé
   */
  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
    });
    return this.projectsRepository.save(project);
  }

  /**
   * Récupère tous les projets
   * @returns La liste de tous les projets
   */
  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  /**
   * Récupère un projet par son ID
   * @param id - ID du projet
   * @returns Le projet correspondant à l'ID
   * @throws NotFoundException si le projet n'est pas trouvé
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} introuvable`);
    }
    return project;
  }

  /**
   * Met à jour un projet
   * @param id - ID du projet à mettre à jour
   * @param updateProjectDto - DTO de mise à jour de projet
   * @param userId - ID de l'utilisateur qui met à jour le projet
   * @returns Le projet mis à jour
   * @throws NotFoundException si le projet n'est pas trouvé
   * @throws ForbiddenException si l'utilisateur n'est pas le propriétaire du projet
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id);

    // Vérifier que l'utilisateur est le propriétaire du projet
    if (project.ownerId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier un projet qui ne vous appartient pas',
      );
    }

    await this.projectsRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  /**
   * Supprime un projet
   * @param id - ID du projet à supprimer
   * @param userId - ID de l'utilisateur qui supprime le projet
   * @param userRole - Rôle de l'utilisateur (admin ou non)
   * @throws NotFoundException si le projet n'est pas trouvé
   * @throws ForbiddenException si l'utilisateur n'est pas le propriétaire du projet et n'est pas admin
   */
  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const project = await this.findOne(id);

    // Vérifier que l'utilisateur est le propriétaire du projet ou admin
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer un projet qui ne vous appartient pas',
      );
    }

    await this.projectsRepository.delete(id);
  }
}