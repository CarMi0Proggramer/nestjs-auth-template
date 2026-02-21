import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'O nome é obrigatório' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name: string;

  @IsString({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsString({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
