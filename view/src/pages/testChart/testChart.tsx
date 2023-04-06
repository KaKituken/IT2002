import './testChart.css'
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useTable } from 'react-table'
import * as api from "../../service/api"

function TableDisplay() {

    const location = useLocation()

    const [tableData, setTableData] = useState<api.TableData>({ columns: [], rows: [] })
    let a: api.TableData = { columns: [], rows: [] }

    const handleDeleteClick = (rowIndex: number) => {
        console.log('Delete button clicked for row:', rowIndex)
        // Implement your delete functionality here
    }

    const navigate = useNavigate()

    useEffect(() => {
        const requestParam = location.state.param
        console.log(requestParam)
        console.log('hello');
        (async () => {
            console.log('arrow')
            let success = await api.postComplexQery(requestParam)
            if (success.status) {
                setTableData(success.tableData)
                a = success.tableData
                console.log(success.tableData)
            }
            else {
                console.log(success.tableData)
            }
        })()
    }, [])

    const columns = React.useMemo(() => {
        return tableData.columns.map((columnName) => ({
            Header: columnName,
            accessor: columnName,
        }))
    }, [tableData.columns])

    const data = React.useMemo(() => tableData.rows, [tableData.rows])

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data })

    return (
        <div className="chart-page">
            <button id="back-btn" onClick={()=>navigate('/admin')}>back</button>
            <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    style={{
                                        borderBottom: 'solid 2px #4D5D72',
                                        background: '#4D5D72',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        textAlign: 'left',
                                        padding: '12px 8px',
                                    }}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, rowIndex) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: '8px',
                                            border: 'solid 1px #E1E1E1',
                                        }}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                                <td style={{ padding: '8px' }}>
                                    <button
                                        style={{
                                            background: 'red',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            lineHeight: '24px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleDeleteClick(rowIndex)}
                                    >
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableDisplay