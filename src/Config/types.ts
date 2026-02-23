export type UserSession = {
    token: string | null;
    setToken: (token: string | null) => void;
  };