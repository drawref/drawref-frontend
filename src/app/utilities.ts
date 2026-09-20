import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Source } from "../types/drawref";

interface DrawRefAPIError {
  error: string;
}

export function parseError(input: FetchBaseQueryError | SerializedError | undefined): string | undefined {
  const fberror = input ? ((input as FetchBaseQueryError).data as DrawRefAPIError).error || String(input) : undefined;
  return fberror;
}

export function sortSources(sources: Source[]): Source[] {
  return [...sources].sort((a, b) => {
    const isSampleA = a.source_type?.toLowerCase() === "samples" || a.source_type?.toLowerCase() === "sample";
    const isSampleB = b.source_type?.toLowerCase() === "samples" || b.source_type?.toLowerCase() === "sample";

    if (isSampleA && !isSampleB) {
      return -1;
    }
    if (!isSampleA && isSampleB) {
      return 1;
    }

    const nameA = a.name ?? "";
    const nameB = b.name ?? "";

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}
