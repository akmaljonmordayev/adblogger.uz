import { useQuery } from "@tanstack/react-query";
import { adsService } from "../services/dataService";

export const useAds = (params) => {
  return useQuery({
    queryKey: ["ads", params],
    queryFn: () => adsService.getAll(params),
    keepPreviousData: true,
  });
};



export const useAdDetail = (id) => {
  return useQuery({
    queryKey: ["ad", id],
    queryFn: () => adsService.getOne(id),
    enabled: !!id,
  });
};
