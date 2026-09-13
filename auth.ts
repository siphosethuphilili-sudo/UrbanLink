export interface User {
  uid?: string;
  id?: string;
  email?: string;
  full_name?: string;
  displayName?: string;
  roles?: string[];
}

export interface LoginResponse {
  success?: boolean;
  user?: User;
  token?: string;
  error?: string;
}
