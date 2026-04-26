import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { TOKEN_KEY } from '../api/client';
import { authService } from '../api/authService';
import { decodeJwt, isTokenValid } from '../lib/jwt';
import type { AuthUser, LoginDTO, RegisterDTO, Role } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginDTO) => Promise<AuthUser>;
  register: (payload: RegisterDTO) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

function buildUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  const rawRole = (payload.role ??
    payload[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ]) as Role | Role[] | undefined;
  const role: Role = Array.isArray(rawRole)
    ? (rawRole[0] as Role)
    : ((rawRole as Role) ?? 'Student');

  const id =
    payload.sub ??
    (payload[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ] as string | undefined) ??
    '';
  const email =
    payload.email ??
    (payload[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ] as string | undefined) ??
    '';

  return { id, email, role, token };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && isTokenValid(stored)) {
      setUser(buildUserFromToken(stored));
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginDTO) => {
    const { Token } = await authService.login(payload);
    localStorage.setItem(TOKEN_KEY, Token);
    const built = buildUserFromToken(Token);
    if (!built) throw new Error('Token inválido');
    setUser(built);
    return built;
  }, []);

  const register = useCallback(async (payload: RegisterDTO) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
