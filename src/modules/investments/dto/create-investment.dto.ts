import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}