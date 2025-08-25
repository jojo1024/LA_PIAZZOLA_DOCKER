import { useCallback, useState } from "react";
import Lucide from "../../base-components/Lucide";

export interface IButton2Props {
    content: any;
    onClick: any;
    active?: any;
    disabled?: any;
}


function Button2(props: IButton2Props) {
    const { content, onClick, active, disabled } = props;

    return (
        <button
            className={`flex flex-col items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-lg
      ${active
                ? "bg-gray-300 border border-gray-500 dark:bg-[#303D5D] dark:text-slate-50 text-[#3f3f40] font-bold"
                : "text-[#65707F] dark:text-slate-300 dark:bg-[#28334E]"}
      ${!disabled
                ? "bg-white hover:bg-[#e4e6e9] hover:text-[#3f3f40] cursor-pointer"
                : "text-[#3f3f40] bg-white dark:bg-[#28334E] cursor-not-allowed"
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}


interface IPaginationNav1Props {
    gotoPage: any;
    canPreviousPage: any;
    canNextPage: any;
    pageCount: any;
    pageIndex: any;
}
function PaginationNav1(props: IPaginationNav1Props) {

    //Props
    const {
        gotoPage,
        canPreviousPage,
        canNextPage,
        pageCount,
        pageIndex,
    } = props

    const renderPageLinks = useCallback(() => {
        if (pageCount === 0) return null;
        const visiblePageButtonCount = 3;
        let numberOfButtons =
            pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
        const pageIndices = [pageIndex];
        numberOfButtons--;
        [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
            const pageNumberBefore = pageIndices[0] - 1;
            const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
            if (
                pageNumberBefore >= 0 &&
                (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
            ) {
                pageIndices.unshift(pageNumberBefore);
            } else {
                pageIndices.push(pageNumberAfter);
            }
        });
        return pageIndices.map((pageIndexToMap) => (
            <li key={pageIndexToMap}>
                <Button2
                    content={pageIndexToMap + 1}
                    onClick={() => gotoPage(pageIndexToMap)}
                    active={pageIndex === pageIndexToMap}
                />
            </li>
        ));
    }, [pageCount, pageIndex]);

    return (
        <ul className="flex gap-2">
            <li>
                <Button2
                    content={
                        <div className="flex ml-1">
                            <Lucide icon="ChevronsLeft" className="w-5 h-5" />
                        </div>
                    }
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                />
            </li>
            {renderPageLinks()}
            <li>
                <Button2
                    content={
                        <div className="flex ml-1">
                            <Lucide icon="ChevronsRight" className="w-5 h-5" />
                        </div>
                    }
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                />
            </li>
        </ul>
    );
}

interface IPaginationProps {
    pageIndex: number;
    pageCount: number;
    setPageIndex: (x: number) => void;
}
function Pagination(props: IPaginationProps) {

    //Props
    const { pageIndex, setPageIndex, pageCount } = props

    return (
        <div className="flex gap-3 flex-wrap my-3">
            <PaginationNav1
                gotoPage={setPageIndex}
                canPreviousPage={(pageIndex > 0) ? true : false}
                canNextPage={pageIndex < pageCount - 1}
                pageCount={pageCount}
                pageIndex={pageIndex}
            />
        </div>
    );
}

export { Pagination };
