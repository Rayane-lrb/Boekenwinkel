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
  description: string | null;
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

export interface ReservationItem {
  id: string;
  isbn: string;
  quantity: number;
  priceAtReservation: number;
}

export interface ReservationItemRequest {
  isbn: string;
  quantity: number;
}

export interface Reservation {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: string;
  confirmedAt: string | null;
  items: ReservationItem[];
}

export interface ReservationRequest {
  userId: string;
}

export interface Review {
  id: string;
  score: number;
  text: string;
  createdAt: string;
  email: string;
  isbn: string;
}

export interface ReviewRequest {
  isbn: string;
  score: number;
  text: string;
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