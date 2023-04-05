import './MyChart.css'
import { useTable } from 'react-table'

interface TableData {
    columns: string[];
    rows: Array<Record<string, any>>;
}

interface MyTableProps {
    tableData: TableData;
}


function MyChart(props: MyTableProps) {
    const generateColumns = (columnNames: string[]) => {
        return columnNames.map(columnName => ({
            Header: columnName,
            accessor: columnName,
        }));
    };

    const columns = generateColumns(props.tableData.columns);
    const data = props.tableData.rows;
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    return (
        <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray', background: 'papayawhip' }}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default MyChart