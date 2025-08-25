import clsx from 'clsx';
import React from 'react';
import { FormCheck } from '../../base-components/Form';
import { Pagination } from './Pagination';


export interface TableColumn<T> {
    header: string;
    accessor?: keyof T;
    renderCell?: (value: any, row: T, onChange: (newValue: any) => void) => React.ReactNode;
    visible?: boolean;
    className?: string;
    width?: string;
    tableTextPosition?: string;
}

interface GenericTableProps<T> {
    onRowDoubleClick?: (item: T) => void;
    headerClassname?: string;
    startIndex?: number;
    endIndex?: number;
    pageIndex?: number;
    pageCount?: number;
    setPageIndex?: (index: number) => void;
    tableClassname?: string;
    data: T[];
    columns: TableColumn<T>[];
    rowKey: (row: T) => React.Key;
    onRowUpdate?: (updatedRow: T) => void;
    selectedRows?: T[];  // Utilisation d'un tableau pour les lignes sélectionnées
    onSelectRow?: any;
    onSelectAllRows?: any;
    onDeleteSelectRows?: any
    search?: string
    setSearch?: any
    dataInitial?: any
    showSearchBar?: boolean
}

const CustomDataTable = <T,>({
    data,
    columns,
    rowKey,
    onRowUpdate,
    selectedRows = [],
    onSelectRow,
    onSelectAllRows,
    headerClassname,
    startIndex = 0,
    endIndex = data.length + 1,
    pageIndex,
    pageCount,
    setPageIndex,
    onRowDoubleClick,
    tableClassname,
    onDeleteSelectRows,
    search,
    setSearch,
    dataInitial,
    showSearchBar
}: GenericTableProps<T>) => {
    const handleInputChange = (key: React.Key, field: keyof T, newValue: any) => {
        const updatedRow = selectedRows.find(row => rowKey(row) === key);
        if (updatedRow) {
            updatedRow[field] = newValue;
            onRowUpdate && onRowUpdate(updatedRow);
        }
    };
    // Fonction qui vérifie si une ligne (row) est sélectionnée
    const isRowSelected = (item: T) => selectedRows.some(selectedItem => rowKey(selectedItem) === rowKey(item));
    // Fonction qui vérifie si toutes les lignes (row) sont sélectionnées
    const allRowsSelected = data.length > 0 && data.every(row => isRowSelected(row));
    // Fonction qui vérifie si au moins une ligne (row) est sélectionnée
    const isAnyRowSelected = data.some(row => isRowSelected(row));

    return (
        <div className=' z-0'>
            <div className="flex justify-between mt-3">
                <div className='ml-3 my-1 text-sm'>
                    Total:<span className='mr-5 font-bold'> {data?.length}</span>
                    {/* Selectionnés: <span className='font-bold'>{selectedRows?.length}</span> */}
                </div>
            </div>
            <table className={`w-[98%]  divide-y ml-2  mx-3 ${tableClassname}`}>
                <thead className={`font-bold rounded-t-lg box dark:text-slate-50 text-sm sticky top-[-5px] ${headerClassname}`}>
                    <tr>
                        {/* {onSelectAllRows && (
                            <th scope="col" className=" py-3 pl-3 text-left font-medium uppercase tracking-wider ">
                                <FormCheck className="mt-2">

                                    <FormCheck.Input
                                        id="checkbox-switch-all"
                                        type="checkbox"
                                        checked={allRowsSelected}
                                        onChange={(e) => onSelectAllRows(e.target.checked)}
                                    />
                                </FormCheck>
                            </th>
                        )} */}
                        {columns.map((column, index) => (
                            column.visible !== false && (
                                <th
                                    key={index}
                                    scope="col"
                                    style={{ width: column.width }}  // Appliquer la largeur définie
                                    className={clsx("py-3 pl-3  font-medium tracking-wider", `${column.tableTextPosition ? column.tableTextPosition : "text-center"} ${column.className}`)}>
                                    {column.header}
                                </th>
                            )
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.slice(startIndex, endIndex).map((row, rowIndex) => {
                        const isSelected = isRowSelected(row);
                        return (
                            <tr
                                key={rowKey(row)}
                                className={clsx([
                                    'cursor-pointer pl-3 border-b hover:bg-slate-200 dark:hover:bg-[#232D45]',
                                ])}
                            // onClick={() => onSelectRow && onSelectRow(row)}
                            >
                                {/* {onSelectRow && (
                                    <td className="py-3 pl-3 text-center">
                                        <div className="text-sm">
                                            <FormCheck className="mt-2">
                                                <FormCheck.Input
                                                    id={`checkbox-${rowIndex}`}
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => onSelectRow(row)}
                                                />
                                            </FormCheck>
                                        </div>
                                    </td>
                                )} */}

                                {columns.map((column, colIndex) => (
                                    <td onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row) : () => null} key={colIndex} className={`py-2 pl-3 ${column.tableTextPosition ? column.tableTextPosition : "text-center"} ${column.className}`}>
                                        {(column.renderCell
                                            ? column.renderCell(
                                                column.accessor ? (isSelected ? selectedRows.find(r => rowKey(r) === rowKey(row))?.[column.accessor] : row[column.accessor]) : null,
                                                row,
                                                column.accessor
                                                    ? (newValue: any) => handleInputChange(rowKey(row), column.accessor!, newValue)
                                                    : () => { }
                                            )
                                            : row[column.accessor!]) as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {setPageIndex &&
                <div className='flex mr-2 justify-end items-center'>
                    <Pagination
                        pageIndex={pageIndex!}
                        setPageIndex={setPageIndex!}
                        pageCount={Math.ceil(pageCount!)}
                    />
                </div>
            }
        </div>
    );
};

export default CustomDataTable;
