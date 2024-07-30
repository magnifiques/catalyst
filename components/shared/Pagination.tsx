"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1); // Default to 1

  const onClick = (btnType: string) => {
    const newPage = btnType === "next" ? currentPage + 1 : currentPage - 1;

    // Ensure newPage is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || "page",
        value: newPage.toString(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick("prev")}
        disabled={currentPage <= 1} // Disable when on the first page
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick("next")}
        disabled={currentPage >= totalPages} // Disable when on the last page
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
