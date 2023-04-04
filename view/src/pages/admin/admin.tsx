import './admin.css'
import Icon from '../../components/Icon/Icon'
import FilterBox from '../../components/FilterBox/FilterBox'
import FilterBar from '../../components/FilterBar/FilterBar'
import Select from 'react-select'
import { useState, useEffect } from 'react'
import * as api from '../../service/api'

function Admin(){

    const [currentTable, setCurrentTable] = useState([{ value: 'house', label: 'House' },])
    const [allTableNames, setChoosenTable] = useState<Array<string>>(Array<string>())   // current tables (right one)
    const [tableChoosenIndicator, setTableChoosenIndicator] = useState(Array<boolean>()) 
    // whole table info
    const [attributeInfo, setTableInfo] = useState<api.TableAttributes[]>([
        {
            name: "tableName1",
            attribute:[
                {
                     attributeName: "att1",
                     type: "TEXT",
                     count: [
                         {"value1": 9},
                         {"value2": 20},
                     ],
                },
                {
                     attributeName: "att2",
                     "type": "TEXT",
                     "count": [
                         {"value1": 9},
                         {"value2": 20},
                     ],
                }
             ], 
         },
        {
            "name": "tableName2",
            "attribute":[
               {
                    "attributeName": "att1",
                    "type": "TEXT/INT/NUM",
                    "count": [
                        {"value1": 9},
                        {"value2": 20},
                    ],
               },
               {
                    "attributeName": "att2",
                    "type": "NUMERIC",
                    "count": [
                        {"minValue": 9},
                        {"maxValue": 20},
                    ],
               }
            ],
        }
    ])

    // 记录filter中点了哪些
    const clickedIndicator:Record<string, boolean[]> = {}
    

    const handleIsClickedChange = (tableName:string, updatedIsClicked: boolean[]) => {
        // handle filter 中的 click
        clickedIndicator[tableName] = updatedIsClicked
        console.log("Updated isClicked array:", clickedIndicator);
    };

    const handleSliderChange = (value: number) => {
        console.log('Selected value:', value);
    };

    async function handelTableClickedChange(param:string[]){
        let success = await api.getAttributeInfo(param)
        if(success.status){
            setTableInfo(success.tableAttributes)
            // const newCurrentTable = success.tableAttributes.map()
        }
        else{
            window.alert(success.details)
        }
    }

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
                        {allTableNames.map((tableName, index)=>(
                            tableChoosenIndicator[index] ? 
                            <span>{tableName}, </span> : 
                            <span></span>
                        ))}
                    </div>
                </div>
                <div id='table-join'>
                    <div id='join-on'>Join on</div>
                        {Array(3).fill(0).map((ele, index) => (
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
                    ))}
                </div>
                <div id='filter-condition'>
                    <div id='filter-by'>Filter by</div>
                    <div id='filter-boxes'>
                        {attributeInfo?.map((tableInfo, index) => (
                            tableInfo['attribute'].map((att, attIndex)=>(
                                att['type'] !== 'NUMERIC' ? 
                                <FilterBox 
                                onIsClickedChange={handleIsClickedChange}attList={att['count']}
                                tableName={tableInfo['name'] + '.' + att['attributeName']}></FilterBox> 
                                : <span></span>
                            ))
                        ))}
                    </div>
                    <div>
                        {attributeInfo?.map((tableInfo, index) => (
                            tableInfo['attribute'].map((att, attIndex)=>(
                                att['type'] === 'NUMERIC' ? 
                                <div className='number-bar' id='size-bar'>
                                    <div className='bar-title'>{tableInfo.name + '.' + att.attributeName}</div>
                                    <FilterBar min={att.count[0]['minValue']} max={att.count[1]['maxValue']} onChange={handleSliderChange}></FilterBar>
                                </div>
                                : <span></span>
                            ))
                        ))}
                    </div>
                </div>
                <button id='display-result'>Display Result</button>
            </div>
            <div id='current-table'>
                <div id='current-table-head'>Current Tables</div>
                {allTableNames.map((tableName, index)=>(
                    <div className={'table-item' + (tableChoosenIndicator[index]? ' activate' : '')} 
                    onClick={()=>{
                        const newTableChoosen = [...tableChoosenIndicator]
                        newTableChoosen[index] = !newTableChoosen[index]
                        setTableChoosenIndicator(newTableChoosen)
                        const selectedTables = allTableNames.map((tableName, index) => ({tableName, bool: newTableChoosen[index]}))
                        .filter(({bool}) => bool)
                        .map(({ tableName }) => tableName)
                        const selectedTablesConfig = selectedTables.map((tableName, index)=>(
                            {value: tableName, label: tableName}
                        ))
                        console.log(tableChoosenIndicator)
                        setCurrentTable(selectedTablesConfig)
                        handelTableClickedChange(selectedTables)
                    }}>{tableName}</div>
                ))}
            </div>
        </div>
    )
}

export default Admin