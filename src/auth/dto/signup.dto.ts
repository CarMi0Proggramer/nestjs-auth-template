import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsString({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsString({ message: 'O email é obrigatório' })
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsString({ message: 'A senha é obrigatória' })
  password: string;
}
