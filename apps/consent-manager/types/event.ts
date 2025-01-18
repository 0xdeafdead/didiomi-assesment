interface Consent {
  id: string;
  enabled: boolean;
}

interface Event {
  user: {
    id: string;
  };
  consents: Consent[];
}
export default Event;
