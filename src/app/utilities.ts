import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface DrawRefAPIError {
  error: string;
}

export function parseError(input: FetchBaseQueryError | SerializedError | undefined): string | undefined {
  const fberror = input ? ((input as FetchBaseQueryError).data as DrawRefAPIError).error || String(input) : undefined;
  return fberror;
}
