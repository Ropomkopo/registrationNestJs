import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty({ required: true })
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty({required: true})
  @MinLength(5)
  readonly password: string
  
}
