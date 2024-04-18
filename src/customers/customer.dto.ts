import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/, {
    message:
      "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 special character",
  })
  password: string;

  @IsString()
  @IsOptional()
  confirmPassword?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class VerifyAccountDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/, {
    message:
      "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 special character",
  })
  password: string;
}