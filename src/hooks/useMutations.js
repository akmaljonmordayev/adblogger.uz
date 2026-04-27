import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adsService, blogService } from "../services/dataService";
import { toast } from "../components/ui/toast";

/**
 * Umumiy Update Hook (Ads yoki Blog uchun)
 * @param {string} type - 'ads' yoki 'blog'
 */
export const useUpdateItem = (type) => {
  const queryClient = useQueryClient();
  const service = type === 'ads' ? adsService.update : blogService.updatePost;

  return useMutation({
    mutationFn: ({ id, data }) => service(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      toast.success("Muvaffaqiyatli yangilandi!");
    },
  });
};

/**
 * Umumiy Delete Hook (Ads yoki Blog uchun)
 * @param {string} type - 'ads' yoki 'blog'
 */
export const useDeleteItem = (type) => {
  const queryClient = useQueryClient();
  const service = type === 'ads' ? adsService.delete : blogService.deletePost;

  return useMutation({
    mutationFn: (id) => service(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      toast.success("Muvaffaqiyatli o'chirildi!");
    },
  });
};

/**
 * Umumiy Create Hook
 */
export const useCreateItem = (type) => {
  const queryClient = useQueryClient();
  const service = type === 'ads' ? adsService.create : blogService.createPost;

  return useMutation({
    mutationFn: (data) => service(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      toast.success("Muvaffaqiyatli qo'shildi!");
    },
  });
};
