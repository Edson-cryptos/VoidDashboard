export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface Area {
  id: string;
  name: string;
  sectorId: string;
}

export interface Progress {
  sector: string;
  area: string;
  tecnico: string;
  semana1: number;
  semana2: number;
  semana3: number;
}

export interface FarmInput {
  sector: string;
  area: string;
  tecnico: string;
  produtores: number;
  sementeX: {
    distribuidos: number;
    recebidos: number;
  };
  sementeY: {
    distribuidos: number;
    recebidos: number;
  };
}