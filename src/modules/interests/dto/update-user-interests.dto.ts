import { IsArray, IsNumber } from 'class-validator';

export class UpdateUserInterestsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];
}