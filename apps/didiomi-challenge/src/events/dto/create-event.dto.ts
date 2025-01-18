import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator';

class Consent {
  @IsString()
  id: string;
  @IsBoolean()
  enabled: boolean;
}

class User {
  @IsString()
  id: string;
}

export default class CreateEventDTO {
  user: { id: string };
  @IsArray()
  consents: Consent[];
}
