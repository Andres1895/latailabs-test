export type User = {
  id: {
    name: string;
    value: string;
  };
  gender: "male" | "female";
  name: {
    title: string;  
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  dob: {
    date: string;
    age: number;
  };
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
    country: string;
    postcode: string;
  };
  company?: string;
};
