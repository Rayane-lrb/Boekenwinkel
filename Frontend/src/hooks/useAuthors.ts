import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor } from "../api/authors";
import type { AuthorRequest } from "../types";

export const useAuthors = () => {
  useQuery({
    queryKey: ["authors"],
    queryFn: ({ signal }) => getAuthors(signal),
  });
};

export const useAuthor = (id: string) => {
  useQuery({
    queryKey: ["authors", id],
    queryFn: ({ signal }) => getAuthor(id, signal),
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AuthorRequest) => createAuthor(input),
    onSuccess: (author) => {
      queryClient.setQueryData(["authors", author.id], author),
      queryClient.invalidateQueries({ queryKey: ["authors"] })
    }
  });
};

export const useUpdateAuthor = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AuthorRequest) => updateAuthor(id, input),
    onSuccess: (author) => {
      queryClient.setQueryData(["authors", author.id], author),
      queryClient.invalidateQueries({ queryKey: ["authors"]} )
    }
  });
};

export const useDeleteAuthor = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAuthor(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["authors", id]}),
      queryClient.invalidateQueries({ queryKey: ["authors"] })
    }
  });
};