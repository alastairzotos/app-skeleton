import { canProfilePerformActionRequest } from "../requests/profiles";
import { useQuery } from "./use-query";

export const useCanPerformActionQuery = () => {
  const { request: canPerformAction, status: canPerformActionStatus } = useQuery(canProfilePerformActionRequest);

  return { canPerformAction, canPerformActionStatus };
}
