/* eslint-disable react/jsx-key */
import * as React from 'react';
import { NextPage } from 'next'
import { useTable, Column, usePagination } from 'react-table'
import { useQuery } from 'react-query'
import Api from '../../service/pollsApi';
import { WithSideBar } from '../../components/SidebarLayout';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { SERVER_URL } from '../../constants';
import Link from 'next/link';




export interface ILga {
    uniqueid: number;
    lga_id: number;
    lga_name: string;
    state_id: number;
    lga_description: string;
    entered_by_user: string;
    date_entered: Date;
    user_ip_address: string;   
}

const Lga: NextPage<{
    data: {
        payload: ILga[]; page: number;
        total: number;
        size: number;
        rows: number;

    }
}> = ({ data }) => {
    const [lgas, setLgas] = React.useState<ILga[]>([])
    const [rows, setRows] = React.useState(0);
    const [limit, setLimit] = React.useState(50);

    const [total, setTotal] = React.useState(0);

    const [enabled, setEnabled] = React.useState(false);
    

    React.useEffect(() => {
        // if(data.payload[0].lga_name){
        setLgas(data.payload);
        setRows(data.rows);
        setLimit(50)
        setTotal(data.total)
    }, [data])


    const tableData = React.useMemo(() => {
        if(lgas.length < 1) {
            return [];
        }
        if(lgas[0].lga_name){
            return lgas;
        }
        setEnabled(true);
        return [];
    }, [lgas]);

    const columns: Column<ILga>[] = React.useMemo(
        () => [
            {
                Header: 'Lga Id',
                accessor: 'lga_id', // accessor is the "key" in the data
            },
            {
                Header: 'Lga Name',
                accessor: 'lga_name',
            },
            {
                Header: 'Description',
                accessor: 'lga_description'
            },

        ], [])

    const tableInstance = useTable({
        columns, data: tableData,
        initialState: { pageIndex: 0, pageSize: limit } as any, // Pass our hoisted table state
        manualPagination: true, // Tell the usePagination
        // hook that we'll handle our own data fetching
        // This means we'll also have to provide our own
        // pageCount.
        pageCount: rows,
    } as any, usePagination)


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance as any;



    const memo = React.useCallback(
        async () => {

            let current = pageIndex + 1;
            let ans = await Api.getModelList<ILga>({
                modelName: 'lga',
                crieteria: {},
                page: current,
                limit: pageSize,
            })
            return ans.data
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pageIndex, pageSize],
    )
    const { data: ret, isFetching, refetch, isError } = useQuery('load-lgas', memo, {
        enabled: enabled || pageIndex > 1,
        refetchOnMount: false,
    });

    React.useEffect(() => {
        if (!ret) return;
        let ans = ret!.data;
        if (ans) {
            setLgas(ans.payload);
            setTotal(ans.total);
            setRows(ans.rows)
            //    setPageSize(ans.size)
        }
    }, [ret]);

    React.useEffect(() => {
        if (!enabled) {
            setEnabled(pageIndex > 1);

        }

        else {
            if (isFetching) return;
            refetch();
        }   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize]);


    React.useEffect(() => {
        if (isError) {
            window.alert('There was an error')
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isError]
    );


    return (
        <div className="flex flex-col max-h-[700px] h-[80vh]">
            <div className="flex-1 overflow-y-scroll">
                <table {...getTableProps()} className="w-full text-left border-collapse max-w-[800px]">
                    <thead >
                        {// Loop over the header rows
                            headerGroups.map((headerGroup: any, i: number) => (
                                // Apply the header row props
                                <tr className="h-8 border-gray-200 border-b-1 border-solid" {...headerGroup.getHeaderGroupProps()}>
                                    {// Loop over the headers in each row
                                        headerGroup.headers.map((column: { getHeaderProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableHeaderCellElement> & React.ThHTMLAttributes<HTMLTableHeaderCellElement>; render: (arg0: string) => string | number | boolean | React.ReactFragment | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal | null | undefined; }) => (
                                            // Apply the header cell props
                                            <th {...column.getHeaderProps()} className="sticky z-10 top-0 text-sm leading-6 font-semibold bg-white dark:bg-primary p-0 ">
                                                {// Render the header
                                                    column.render('Header')}
                                            </th>
                                        ))}
                                        <th className="sticky z-10 top-0 text-sm leading-6 font-semibold bg-white dark:bg-primary p-0 ">
                                           View Results 
                                        </th>

                                </tr>
                            ))}
                         
                    </thead>
                    {/* Apply the table body props */}
                    <tbody {...getTableBodyProps()}>
                        {// Loop over the table rows
                            page.map((row: any, i: number) => {
                                // Prepare the row for display
                                prepareRow(row)
                                return (
                                    // Apply the row props
                                    <tr className="h-8" {...row.getRowProps()}>
                                        {// Loop over the rows cells
                                            row.cells.map((cell: any) => {
                                   
                                                // Apply the cell props
                                                return (
                                                    <td {...cell.getCellProps()} className="py-2 pr-2 font-medium text-sm leading-6 whitespace-nowrap border-t border-secondary dark:border-otherColor">
                                                        {// Render the cell contents
                                                            cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                                        <td className="py-2 text-cyan-500 pr-2 font-medium text-sm leading-6 whitespace-nowrap border-t border-secondary dark:border-otherColor">
                                                          <Link href={'/modules/lga_result/' + lgas[i].lga_id} target="_blank"> 
                                                          View Results
                                                                </Link>
                                                        </td>

                                    </tr>
                                )
                            })}

                    </tbody>
                </table>
            </div>
            <div className="pagination mt-2">
                {isFetching ? (
                    // Use our custom loading state to show a loading indicator
                    <p className="py-2 pl-2 bg-secondary text-primary font-medium text-sm leading-6 whitespace-nowrap border-b border-t border-secondary dark:border-otherColor">Loading...</p>
                ) : (
                    <p className="py-2 pl-2 bg-secondary text-primary pr-2 font-medium text-sm leading-6 whitespace-nowrap border-b border-t border-secondary dark:border-otherColor">
                        Showing {page.length} of ~{total}{' '}
                        results
                    </p>
                )}
                <div className="flex mt-2">
                    <Button className="mr-4" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </Button>

                    <Button className="mr-4" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </Button>
                    <Button className="mr-4" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </Button>
                    <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </Button>
                </div>

                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <Select

                    value={pageSize as any}
                    onChange={e => {
                        setPageSize(Number((e as any).target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
            </div>

        </div>
    )


}

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`${SERVER_URL}/get-items/lga`)
    const data = await res.json();
    console.log(data.data.payload[0]);

    // Pass data to the page via props
    return { props: { data: data.data } }
}

export default WithSideBar(Lga, 'lga');

