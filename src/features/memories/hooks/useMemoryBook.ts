import { useMemo, useState } from "react";

export const useMemoryBook = (memoryCount: number) => {
  const [currentPage, setCurrentPage] = useState(0);
  // Cover + contents + Hailey introduction + two pages per memory + back cover.
  const totalPages = memoryCount * 2 + 4;
  const currentMemory = useMemo(() => {
    if (currentPage <= 2) return 0;
    return Math.min(memoryCount, Math.max(1, Math.ceil((currentPage - 2) / 2)));
  }, [currentPage, memoryCount]);

  return {
    currentPage,
    currentMemory,
    totalPages,
    setCurrentPage,
    atStart: currentPage <= 0,
    atEnd: currentPage >= totalPages - 1,
  };
};
