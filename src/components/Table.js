import { useTable } from "react-table";

export default function Table({ columns, data }) {
    // Use the useTable Hook to send the columns and data to build the table
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable({
        columns,
        data
    });

    /* 
      Render the UI for your table
      - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
    */
    return (
        <table style={{
            "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid', "width": "100%", "tableLayout": "fixed",
            "overflowWrap": "break-word"
        }} {...getTableProps()}>
            <thead style={{
                borderBottom: 'solid black',
                color: 'black',
            }}>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th style={{}} {...column.getHeaderProps({
                                style: { minWidth: column.minWidth, width: column.width, padding: '10px' }
                            })}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} style={{
                                    padding: '5px',

                                    border: 'solid 1px gray',
                                }}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}