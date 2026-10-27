import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUsers, getUser, createUser, updateUser, deleteUser, promoteUser, demoteUser } from "../api/user";
import type { UserRegisterRequest, UserUpdateRequest } from "../types";


export const useUsers = () => {
  useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal)
  })
};

export const useUser = (id: string) => {
  useQuery({
    queryKey: ["users", id],
    queryFn: ({ signal }) => getUser(id, signal)
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserRegisterRequest) => createUser(input),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", user.id], user),
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserUpdateRequest) => updateUser(id, input),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", id], user),
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });
};

export const useDeleteUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["users", id] }),
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });
};

export const usePromoteUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => promoteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
};

export const useDemoteUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => demoteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
};