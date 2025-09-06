import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api";

export function useQueryErrorHandler() {
  const { push } = useToast();

  return useCallback(
    (err: unknown) => {
      push({ type: "error", title: getErrorMessage(err) });
    },
    [push]
  );
}

