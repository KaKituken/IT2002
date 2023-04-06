import './testChart.css'
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useTable } from 'react-table'
import * as api from "../../service/api"

function TableDisplay() {

    const location = useLocation()

    const [tableData, setTableData] = useState<api.TableData>({ columns: [], rows: [] })

    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false);
    const [newAddRowData, setNewRowData] = useState<{ [key: string]: any }>({});


    useEffect(() => {
        const requestParam = location.state.param
        console.log(requestParam)
        console.log('hello');
        (async () => {
            console.log('arrow')
            let success = await api.postComplexQery(requestParam)
            if (success.status) {
                setTableData(success.tableData)
                console.log(success.tableData)
            }
            else {
                window.alert(success.details)
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

    async function handleDeleteClick(rowIndex: number) {
        if (location.state.isJoin) {
            window.alert("Can't delete entries from a joined table")
            return
        }
        const param: api.DeleteEntryInfo = { entryInfo: {} }
        tableData.rows.forEach((ele, index) => {
            param.entryInfo[Object.keys(ele)[0]] = param.entryInfo[Object.values(ele)[0]]
        })
        let success = await api.postDeleteEntry(param)
        if (success.status) {
            // remove rowIndex
            const newTableData = { ...tableData }
            newTableData.rows.splice(rowIndex, 1)
            setTableData(newTableData)
        }
        else {
            window.alert(success.details)
        }
    }

    function deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    async function handleCellChange(e: React.ChangeEvent<HTMLInputElement>, cellInfo: any) {
        if (location.state.isJoin) {
            window.alert("Can't modify entries in a joined table")
            return
        }
        const orgRowData = deepCopy(tableData.rows)
        const newRowData = [...tableData.rows];
        newRowData[cellInfo.row.index][cellInfo.column.id] = e.target.value;
        console.log('old:', orgRowData[cellInfo.row.index])
        console.log('new:', newRowData[cellInfo.row.index])
        let success = await api.postUpdateEntry({
            orgRow: orgRowData[cellInfo.row.index],
            newRow: newRowData[cellInfo.row.index]
        })
        if (success.status) {
            const newTableData = { ...tableData }
            newTableData.rows = newRowData
            setTableData(newTableData)
        }
        else {
            window.alert(success.details)
        }
        // setTableData(newData)
        console.log(newRowData);
    };

    async function handleAddRow() {
        const param:api.AddEntryInfo = {entryInfo: {}}
        param.entryInfo = newAddRowData
        let success = await api.postAddRow(param);
        if (success.status) {
            const newTableData = { ...tableData };
            newTableData.rows.push(newAddRowData);
            setTableData(newTableData);
            setShowModal(false);
        } else {
            window.alert(success.details);
        }
        console.log('add')
    }


    return (
        <div className="chart-page">
            <button id="back-btn" onClick={() => navigate('/admin')}>back</button>
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
                                        <input
                                            type="text"
                                            value={cell.value}
                                            onChange={e => handleCellChange(e, cell)}
                                            style={{ border: 'none', background: 'transparent' }}
                                        ></input>
                                        {/* {cell.render('Cell')} */}
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
            <button id='add-btn' onClick={() => setShowModal(true)}>Add Row</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Row</h2>
                        {tableData.columns.map((columnName) => (
                            <div key={columnName} className="input-group">
                                <label>{columnName}</label>
                                <input
                                    type="text"
                                    value={newAddRowData[columnName] || ""}
                                    onChange={(e) =>
                                        setNewRowData({
                                            ...newAddRowData,
                                            [columnName]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}
                        <button onClick={handleAddRow}>Submit</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default TableDisplay