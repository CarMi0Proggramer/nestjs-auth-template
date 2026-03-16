import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsString({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'johndoe@gmail.com',
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsString({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha da conta',
    example: 'john1234',
    minLength: 6,
  })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsString({ message: 'A senha é obrigatória' })
  password: string;
}
