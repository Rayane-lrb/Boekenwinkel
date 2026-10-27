  import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
  import { getBooks, getBook, createBook, updateBook, deleteBook } from "../api/books";

  export const useBooks = () =>
    useQuery({
      queryKey: ["books"],
      queryFn: ({ signal }) => getBooks(signal),
    });

  export const useBook = (isbn: string) =>
    useQuery({
      queryKey: ["books", isbn],
      queryFn: ({ signal }) =>getBook(isbn, signal)
    });

  export const useCreateBook = () =>
  {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: createBook,
      onSuccess: (book) => {
        queryClient.setQueryData(["books", book.isbn], book);
        queryClient.invalidateQueries({ queryKey: ["books"] });

      },
    });
  };

  export const useUpdateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: updateBook,
      onSuccess: (book) => {
        queryClient.setQueryData(["books", book.isbn], book);
        queryClient.invalidateQueries({ queryKey: ["books"] });
      },
    });
  };

  export const useDeleteBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: deleteBook,
      onSuccess: (_, isbn) => {
        queryClient.removeQueries({ queryKey: ["books", isbn] });
        queryClient.invalidateQueries({ queryKey: ["books"] });
      },
    });
  };