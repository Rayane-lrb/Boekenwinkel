export interface Author {
  id: string;
  firstName: string;
  lastName: string;
}

export interface AuthorRequest {
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

export interface reservationItem {
  id: string;
  isbn: string;
  quantity: number;
  priceAtReservation: number;
}

export interface reservationItemRequest {
  isbn: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdateRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
}