export interface Author {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Book {
  isbn: string;
  title: string;
  desription: string | null;
  price:  number;
  stock: number;
  authorFirstName: string;
  authorLastName: string;
}

export interface BookRequest {
  isbn: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  authorId: string;
}