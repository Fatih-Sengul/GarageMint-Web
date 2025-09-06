import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { describe, test, expect, vi, beforeEach } from "vitest";

const pushMock = vi.fn();
vi.mock("../components/ui/toast", () => ({
  useToast: () => ({ push: pushMock }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Providers from "./providers";

describe("Providers QueryClient error handling", () => {
  beforeEach(() => pushMock.mockReset());

  test("pushes toast on query error with AxiosError message", async () => {
    function QueryErr() {
      const err = new AxiosError(
        "oops",
        undefined,
        { headers: {} },
        undefined,
        { data: { message: "axios fail" }, status: 400, statusText: "", headers: {}, config: {} }
      );
      useQuery({ queryKey: ["q"], queryFn: async () => { throw err; } });
      return null;
    }
    render(
      <Providers>
        <QueryErr />
      </Providers>
    );
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith(
        expect.objectContaining({ description: "axios fail" })
      )
    );
  });

  test("pushes toast on mutation error", async () => {
    function MutationErr() {
      const mutation = useMutation({
        mutationFn: async () => {
          throw new Error("mutation fail");
        },
      });
      React.useEffect(() => {
        mutation.mutate();
      }, [mutation]);
      return null;
    }
    render(
      <Providers>
        <MutationErr />
      </Providers>
    );
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith(
        expect.objectContaining({ description: "mutation fail" })
      )
    );
  });
});
