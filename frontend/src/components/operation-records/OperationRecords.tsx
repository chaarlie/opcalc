import { useContext, useEffect, useId, useMemo, useState } from 'react'
import {
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
import RecordFilter from './RecordFilter'

function OperationRecords() {
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
            let result = val

            if (amount > 0) {
                result = result === totalPages - 1 ? totalPages - 2 : result
            } else {
                result = result <= 0 ? 1 : result
            }

            result += amount

            return result
        })
    }

    const handlePreviousPage = () => {
        handleNextPageClick(-1)
    }

    const handleNextPage = () => {
        handleNextPageClick(1)
    }

    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value)

        addMeta({
            itemRank,
        })

        return itemRank.passed
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
    })

    return (
        <div className="p-2">
            <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 fs-5 shadow border border-secondary-subtle shadow-sm p-3 mb-1 bg-body-tertiary rounded"
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
                                                        <RecordFilter
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
            <div className="d-flex align-items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => setPageNumber(0)}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handlePreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => handleNextPage()}
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

export default OperationRecords
