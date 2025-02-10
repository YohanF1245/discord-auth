export interface User {
  snowflake: number;
  discordUsername: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: boolean;
  roles: Role[];
  promo?: Promo;
}

export interface Role {
  id: number;
  snowflake: number;
  name: string;
}

export interface Promo {
  snowflake: number;
  name: string;
} 