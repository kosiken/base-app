/* eslint-disable react/jsx-key */
import * as React from 'react';
import { NextPage, GetServerSidePropsContext } from 'next';
import { useTable, Column, usePagination } from 'react-table'
import { useQuery } from 'react-query';
import Select from '../../../components/Select';
import { SERVER_URL } from '../../../constants';
import Api from '../../../service/pollsApi';
import { WithSideBar } from '../../../components/SidebarLayout';
import Button from '../../../components/Button';
import { ILga } from '../lga';
import { on } from 'events';


interface IData{
    party: string;
    score: number;
}

const LgaResult:  NextPage<{data: {[x: string]: number}; page: number; lgas: ILga[]; lgaId: number }> = ({data, lgas, lgaId}) => {

    const [announcedResults, setAnnouncedResults] = React.useState<IData[]>([])
    const [rows, setRows] = React.useState(0);
    const [selectedLga, setSelectedLga] = React.useState<number>(lgaId);


    React.useEffect(() => {
        const ans: IData[] = [];
        for(let key in data) {
            ans.push({party: key, score: data[key]})
        }
        setAnnouncedResults(ans);
        setRows(ans.length);
    }, [data])

    const onSubmit = React.useCallback((toLga: number) => {
        if(toLga !== lgaId) {
            window.location.pathname = `/modules/lga_result/${toLga}`
        }
    }, [lgaId])
    React.useEffect(() => {
        onSubmit(selectedLga);
    }, [selectedLga])


    const tableData = React.useMemo(() => announcedResults, [announcedResults]);

    const columns: Column<IData>[] = React.useMemo(
        () => [
            {
                Header: 'Party',
                accessor: 'party', // accessor is the "key" in the data
            },
            {
                Header: 'Party Score',
                accessor: 'score',
            },

        ], [])

    const tableInstance = useTable({
        columns, data: tableData,
        initialState: { pageIndex: 0, pageSize: 20 } as any, // Pass our hoisted table state
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



    


    return (
        <div className="flex flex-col max-h-[700px] h-[80vh]">
            <form onSubmit={e => e.preventDefault()}>
                <Select value={selectedLga}
onChange={e => {
    setSelectedLga(parseInt((e.target as any).value))

}}
>
<option value="-1">-- Select LGA --</option>
{lgas.map((lga, i) => (
    <option key={`lga-${i}`} value={lga.lga_id}>
        {`LgaId:${lga.lga_id} - ${lga.lga_name}`}
    </option>
))}
</Select>
            </form>
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
                                                 
                                    </tr>
                                )
                            })}

                    </tbody>
                </table>
            </div>
            <div className="pagination mt-2">
       
            {announcedResults.length === 0 ? (
                    // Use our custom loading state to show a loading indicator
                    <p className="py-2 pl-2 bg-secondary text-primary font-medium text-sm leading-6 whitespace-nowrap border-b border-t border-secondary dark:border-otherColor">
                        No Results for this LGA
                    </p>
                ) : (
                    <p className="py-2 pl-2 bg-secondary text-primary pr-2 font-medium text-sm leading-6 whitespace-nowrap border-b border-t border-secondary dark:border-otherColor">
                        Showing {page.length} of ~1{' '}
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
                    <Button className="mr-4" onClick={() => nextPage()} disabled>
                        {'>'}
                    </Button>
                    <Button onClick={() => gotoPage(pageCount - 1)} disabled>
                        {'>>'}
                    </Button>
                </div>

                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of 1
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        disabled
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <Select
                    disabled
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


export async function getServerSideProps({params}: GetServerSidePropsContext) {
    // Fetch data from external API
    const res = await fetch(`${SERVER_URL}/get-results-for-lga/${params!.lga_id}`)
    const data = await res.json()
    console.log(data, params)
    // Pass data to the page via props
    
    return { props: { data: data.data.results, lgas: data.data.lgas, lgaId: params?.lga_id } }
}

export default WithSideBar(LgaResult, 'lga');