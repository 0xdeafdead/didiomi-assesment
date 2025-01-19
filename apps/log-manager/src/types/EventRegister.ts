import { CONSENT_TYPES } from '@prisma/client';

export type EventRegister = {
  requestedBy: string;
  updatedAt: Date;
  data: {
    user: {
      id: string;
    };
    consents: {
      id: CONSENT_TYPES;
      enabled: boolean;
    }[];
  };
};
