export class SignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile_picture: string;
  blocked: boolean;
}

export class LoginDto {
  email: string;
  password: string;
}
