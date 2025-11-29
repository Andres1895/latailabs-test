export type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  login: {
    uuid: string;
  };
  location?: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    postcode: string;
  };
  company?: string;
};
