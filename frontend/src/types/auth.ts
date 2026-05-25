export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserDto;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}