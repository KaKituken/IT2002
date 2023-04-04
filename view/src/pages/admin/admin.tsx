import './admin.css'
import Icon from '../../components/Icon/Icon'
import FilterBox from '../../components/FilterBox/FilterBox'
import FilterBar from '../../components/FilterBar/FilterBar'
import Select from 'react-select'
import { useState, useEffect } from 'react'
import * as api from '../../service/api'

function Admin(){

    const [currentTable, setCurrentTable] = useState([{ value: 'house', label: 'House' },])
    const [allTables, setChoosenTable] = useState(Array<string>())   // current tables (right one)
    const [tableChoosenIndicator, setTableChoosenIndicator] = useState(Array<boolean>()) 
    const clickedIndicator:Record<string, boolean[]> = {}
    

    const handleIsClickedChange = (tableName:string, updatedIsClicked: boolean[]) => {
        // handle filter 中的 click
        clickedIndicator[tableName] = updatedIsClicked
        console.log("Updated isClicked array:", clickedIndicator);
    };

    const handleSliderChange = (value: number) => {
        console.log('Selected value:', value);
    };

    useEffect(() => {
        // async () => {
        //     let success = await api.getTableName()
        //     if(success.status === true) {
        //         setChoosenTable(success.tableNameList)
        //         setTableChoosenIndicator(Array<boolean>(success.tableNameList.length).fill(false))
        //     }
        // }
        setChoosenTable(['houses', 'bids', 'providers'])
        setTableChoosenIndicator(Array<boolean>(3).fill(false))
      }, []); // 空数组使得 useEffect 仅在组件挂载后运行一次

    return (
        <div className='admin-page'>
            <Icon color="white"></Icon>
            <div className='white-box'>
                <h1>Filtering</h1>
                <div id='table-selected'>
                    <div id='from-table'>From table</div>
                    <div id='from-table-display'>
                        {allTables.map((tableName, index)=>(
                            tableChoosenIndicator[index] ? 
                            <span>{tableName}, </span> : 
                            <span></span>
                        ))}
                    </div>
                </div>
                <div id='table-join'>
                    <div id='join-on'>Join on</div>
                    <div id='join-on-condition'>
                        <Select id='table-left' options={currentTable}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255, 255, 255, 0.26)',
                                border: '1px solid #4D5D72',
                                width: 133,
                                height: 42,
                            }),
                        }} />
                        <div className='dot'></div>
                        <Select id='att-left' options={currentTable}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255, 255, 255, 0.26)',
                                border: '1px solid #4D5D72',
                                width: 170,
                                height: 42,
                            }),
                        }} />
                        <div className='equal'>
                            <div className='equal-half'></div>
                            <div className='equal-half'></div>
                        </div>
                        <Select id='table-right' options={currentTable}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255, 255, 255, 0.26)',
                                border: '1px solid #4D5D72',
                                width: 133,
                                height: 42,
                            }),
                        }} />
                        <div className='dot'></div>
                        <Select id='att-right' options={currentTable}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255, 255, 255, 0.26)',
                                border: '1px solid #4D5D72',
                                width: 170,
                                height: 42,
                            }),
                        }} />
                    </div>
                </div>
                <div id='filter-condition'>
                    <div id='filter-by'>Filter by</div>
                    <div id='filter-boxes'>
                        <FilterBox attList={['firstName', 'LastName', 'firstName', 'LastName', 'firstName', 'LastName', 'firstName', 'LastName', 'firstName', 'LastName']}
                            onIsClickedChange={handleIsClickedChange}
                            tableName='Houses'></FilterBox>
                        <FilterBox 
                            onIsClickedChange={handleIsClickedChange}attList={['firstName']}
                            tableName='Bids'></FilterBox>
                        <FilterBox onIsClickedChange={handleIsClickedChange} attList={['firstName']}
                            tableName='Provider'></FilterBox>
                        <FilterBox onIsClickedChange={handleIsClickedChange} attList={['firstName']}
                            tableName='Renter'></FilterBox>
                        <FilterBox onIsClickedChange={handleIsClickedChange} attList={['firstName']}
                            tableName='Visit'></FilterBox>
                        <FilterBox onIsClickedChange={handleIsClickedChange} attList={['firstName']}
                            tableName='Holder'></FilterBox>
                    </div>
                    <div className='number-bar' id='price-bar'>
                        <div className='bar-title'>Price</div>
                        <FilterBar min={0} max={100} onChange={handleSliderChange}></FilterBar>
                    </div>
                    <div className='number-bar' id='size-bar'>
                        <div className='bar-title'>Size</div>
                        <FilterBar min={0} max={100} onChange={handleSliderChange}></FilterBar>
                    </div>
                </div>
                <button id='display-result'>Display Result</button>
            </div>
            <div id='current-table'>
                <div id='current-table-head'>Current Tables</div>
                {allTables.map((tableName, index)=>(
                    <div className={'table-item' + (tableChoosenIndicator[index]? ' activate' : '')} 
                    onClick={()=>{
                        const newTableChoosen = [...tableChoosenIndicator]
                        newTableChoosen[index] = !newTableChoosen[index]
                        setTableChoosenIndicator(newTableChoosen)
                    }}>{tableName}</div>
                ))}
            </div>
        </div>
    )
}

export default Admin