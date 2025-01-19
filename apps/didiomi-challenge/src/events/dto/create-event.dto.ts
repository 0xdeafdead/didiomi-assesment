import { CONSENT_TYPES } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class Consent {
  @IsEnum(CONSENT_TYPES)
  id: CONSENT_TYPES;
  @IsBoolean()
  enabled: boolean;
}

class User {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export default class CreateEventDTO {
  @ValidateNested()
  @Type(() => User)
  user: User;
  @IsArray()
  @ValidateNested()
  @Type(() => Consent)
  consents: Consent[];
}
