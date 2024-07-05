export interface AuthRequest {
  email: string;
  password: string;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}


export interface JwtDecodedUser {
  exp: number;
  iat: number;
  id: number;
  username: string;
}
