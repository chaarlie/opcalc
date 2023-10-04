import { useContext, useEffect, useId, useMemo, useState } from 'react'
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    FilterFn,
    flexRender,
    createColumnHelper,
    PaginationState,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { useAxios } from '../../hooks'
import { AxiosCallData, OperationRecord } from '../../types'
import { GlobalContext } from '../../context/GlobalContext'
import { DebouncedInput } from '../common'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })

    return itemRank.passed
}

export default function OperationRecords() {
    const { userDetails } = useContext(GlobalContext)

    const [operationRecords, setOperationRecords] = useState(() => [])
    const [totalPages, setTotalPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(0)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 6,
    })

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    )

    const columnHelper = createColumnHelper<OperationRecord>()

    const [performRecordCallData, setPerformRecordCallData] =
        useState<AxiosCallData | null>(null)
    const {
        axiosResponse: performRecordCallDataResponse,
        axiosError: performRecordCallDataError,
    } = useAxios(
        performRecordCallData?.url!,
        performRecordCallData?.method!,
        null,
        performRecordCallData?.token,
    )

    const [performDeleteRecordCallData, setPerformDeleteRecordCallData] =
        useState<AxiosCallData | null>(null)
    const {
        axiosResponse: performDeleteRecordCallDataResponse,
        axiosError: performDeleteRecordCallDataError,
    } = useAxios(
        performDeleteRecordCallData?.url!,
        performDeleteRecordCallData?.method!,
        null,
        performDeleteRecordCallData?.token,
    )

    useEffect(() => {
        if (performRecordCallDataResponse?.status === 200) {
            setOperationRecords(performRecordCallDataResponse.data.content)
            setTotalPages(performRecordCallDataResponse.data.totalPages)
            setPerformRecordCallData(null)
        }
    }, [performRecordCallDataResponse])

    useEffect(() => {
        if (performDeleteRecordCallDataResponse?.status === 200) {
            setPerformRecordCallData({
                method: 'GET',
                url: `/record/page?pageNo=${pageNumber}&size=5`,
                token: userDetails?.token,
            })

            setPerformDeleteRecordCallData(null)
        }
    }, [performDeleteRecordCallDataResponse])

    useEffect(() => {
        setPerformRecordCallData({
            method: 'GET',
            url: `/record/page?pageNo=${pageNumber}&size=5`,
            token: userDetails?.token,
        })
    }, [])

    const columns = [
        columnHelper.accessor('id', {
            header: 'Record ID',
        }),
        columnHelper.accessor('operationId', {
            header: 'Operation Id',
        }),
        columnHelper.accessor('accountUserId', {
            header: 'User Id',
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
        }),
        columnHelper.accessor('userAccountBalance', {
            header: 'Balance',
        }),
        columnHelper.accessor('operationResponse', {
            header: 'Response',
        }),
        columnHelper.accessor('date', {
            header: 'Date',
        }),
        columnHelper.accessor('id', {
            cell: info => (
                <div className="d-flex justify-content-center">
                    <button
                        type="button"
                        onClick={e => handleDeleteRecord(info.getValue())}
                        className="btn btn-danger fw-bold"
                    >
                        x
                    </button>
                </div>
            ),
            header: 'Delete',
            enableColumnFilter: false,
            id: useId(),
        }),
    ]

    useEffect(() => {
        setPerformRecordCallData({
            method: 'GET',
            url: `/record/page?pageNo=${pageNumber}&size=5`,
            token: userDetails?.token,
        })
    }, [pageNumber])

    const handleDeleteRecord = (id: number) => {
        setPerformDeleteRecordCallData({
            method: 'DELETE',
            url: `/record/${id}`,
            token: userDetails?.token,
        })
    }

    const handleNextPageClick = (amount: number) => {
        setPageNumber((val: number) => {
            let result = amount + val

            if (amount > 0) {
                result = result >= totalPages ? totalPages : result
            } else {
                result = 0
            }

            return result
        })
    }

    const table = useReactTable({
        data: operationRecords,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <div className="p-2">
            <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search columns..."
                />
            </div>
            <div className="h-2" />
            <table className="table table-striped-columns">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className:
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                        onClick:
                                                            header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter
                                                            column={
                                                                header.column
                                                            }
                                                            table={table}
                                                        />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => setPageNumber(0)}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handleNextPageClick(-1)}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handleNextPageClick(1)}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => setPageNumber(totalPages - 1)}
                >
                    {'>>'}
                </button>
            </div>
        </div>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any, unknown>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()],
    )

    return typeof firstValue === 'number' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [
                            value,
                            old?.[1],
                        ])
                    }
                    placeholder={`Min ${
                        column.getFacetedMinMaxValues()?.[0]
                            ? `(${column.getFacetedMinMaxValues()?.[0]})`
                            : ''
                    }`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            value,
                        ])
                    }
                    placeholder={`Max ${
                        column.getFacetedMinMaxValues()?.[1]
                            ? `(${column.getFacetedMinMaxValues()?.[1]})`
                            : ''
                    }`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${
                    column.getFacetedUniqueValues().size
                })`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    )
}
