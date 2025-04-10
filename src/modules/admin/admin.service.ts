import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {

  getDashboard(): string {
    return 'Accès au dashboard administrateur';
  }

  getUsersList(): string {
    return 'Liste de tous les utilisateurs de la plateforme';
  }

  getProjectsList(): string {
    return 'Liste de tous les projets sur la plateforme';
  }

  getInvestmentsList(): string {
    return 'Liste de tous les investissements effectués sur la plateforme';
  }
}