import { CONSENT_TYPES } from '@prisma/client';

interface Consent {
  id: CONSENT_TYPES;
  enabled: boolean;
}

interface Event {
  user: {
    id: string;
  };
  consents: Consent[];
}
export default Event;
