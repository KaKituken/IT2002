import './admin.css'
import Icon from '../../components/Icon/Icon'
import FilterBox from '../../components/FilterBox/FilterBox'
import FilterBar from '../../components/FilterBar/FilterBar'
import Select from 'react-select'
import MyChart from '../../components/MyChart/MyChart'
import { useState, useEffect } from 'react'
import * as api from '../../service/api'

function Admin(){

    const [currentTable, setCurrentTable] = useState<{ value: string; label: string; }[]>()
    const [allTableNames, setChoosenTable] = useState<string[]>(Array<string>())   // current tables (right one)
    const [tableChoosenIndicator, setTableChoosenIndicator] = useState(Array<boolean>()) 
    // whole table info
    const [attributeInfo, setTableInfo] = useState<api.TableAttributes[]>([
        {
            name: "houses",
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
            name: "bids",
            "attribute":[
               {
                    "attributeName": "att1",
                    "type": "INT",
                    "count": [
                        {"value1": 9},
                        {"value2": 20},
                    ],
               },
               {
                    "attributeName": "att2",
                    "type": "NUMERIC",
                    "count": [
                        {"min": 9},
                        {"max": 20},
                    ],
               }
            ],
        }
    ])


    // 记录join on的六个框各选了哪个table
    const [joinOnTables, setJoinOnTables] = useState<string[]>(Array(6).fill(''))   // 有6个框
    // 记录join on显示的attribute列表
    const [joinOnTableAttributeList, setJoinOnTableAttributeList] = useState<Array<string[]>>(Array(6).fill(Array(0)))  // 有6个框
    // 记录join on选择的attribute
    const [joinOnTableAttributes, setJoinOnTableAttributes] = useState<string[]>(Array(6).fill('')) // 有6个框

    // 记录filter中点了哪些
    const clickedIndicator:Record<string, boolean[]> = {}   // tableName: isClicked[]

    // 记录 range filter 的 attribute 和 value
    const [rangeFilterAttributes, setRangeFilterAttributes] = useState<Record<string, Record<string, number>>>({})
    

    const handleIsClickedChange = (tableName:string, updatedIsClicked: boolean[]) => {
        // handle filter 中的 click
        clickedIndicator[tableName] = updatedIsClicked
        console.log("Updated isClicked array:", clickedIndicator);
    };

    const handleSliderChange = (value: number, tableName: string, attName: string) => {
        const newRangeFilterAttributes = {...rangeFilterAttributes}
        if (!newRangeFilterAttributes[tableName]) {
            newRangeFilterAttributes[tableName] = {}
        }
        newRangeFilterAttributes[tableName][attName] = value
        setRangeFilterAttributes(newRangeFilterAttributes)
        console.log('Selected value:', value)
    };

    async function getAllTableInfo(param:string[]){
        // let success = await api.getAttributeInfo(param)
        // if(success.status){
        //     setTableInfo(success.tableAttributes)
        //     // const newCurrentTable = success.tableAttributes.map()
        // }
        // else{
        //     window.alert(success.details)
        // }
    }

    function handleTableClickedChange(index: number){
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
        getAllTableInfo(selectedTables)
    }

    function handleJoinTableChange(option:any, index:number){
        const newJoinOnTables = [...joinOnTables]
        newJoinOnTables[index] = option.value
        setJoinOnTables(newJoinOnTables)
        // joinOnTableAttributeList[index] 为 option.value 的attribute
        const newJoinOnTableAttributeList = [...joinOnTableAttributeList]
        newJoinOnTableAttributeList[index].length = 0
        for (let i = 0; i < attributeInfo.length; i++) {
            const element = attributeInfo[i];
            console.log('element:', element)
            if(element.name === option.value){
                newJoinOnTableAttributeList[index] = element.attribute.map((item, index) => (
                    item.attributeName
                ))
                break
            }
        }
        setJoinOnTableAttributeList(newJoinOnTableAttributeList)
        console.log(newJoinOnTableAttributeList)
        console.log(option, index)
    }

    function handleAttributeChoose(option:any, index:number){
        const newJoinOnTableAttributes = [...joinOnTableAttributes]
        newJoinOnTableAttributes[index] = option.value
        setJoinOnTableAttributes(newJoinOnTableAttributes)
    }

    function handleDisplayClick(){
        const param:api.ConplexQueryCondition = {
            fromTable: [],
            joinOn: [],
            filterEqual: {},
            filterLess: {}
        }
        param.fromTable = allTableNames.map((tableName, index) => ({tableName, bool: tableChoosenIndicator[index]}))
        .filter(({bool}) => bool)
        .map(({ tableName }) => tableName)
        for (let index = 0; index < 6; index+=2) {
            const leftTableName = joinOnTables[index]
            const leftAttName = joinOnTableAttributes[index]
            const rightTableName = joinOnTables[index+1]
            const rightAttName = joinOnTableAttributes[index+1]
            if(leftTableName != null && rightTableName != null && leftAttName != null && rightAttName != null){
                param.joinOn.push({[leftAttName]: leftAttName, [rightTableName]: rightAttName})
            }
        }
        Object.entries(clickedIndicator).forEach(([tableAttributeName, valueChoosed]) => {
            const parts = tableAttributeName.split('.')
            const tableName = parts[0]
            const attName = parts[1]
            if(valueChoosed.every(ele => ele === false)){
                return
            }
            // 遍历 attributeInfo 拿到这个tableName对应的信息
            if(!param.filterEqual[tableName]){
                param.filterEqual[tableName] = {}
            }
            for (let index = 0; index < attributeInfo.length; index++) {
                const singleTableInfo = attributeInfo[index];
                if(singleTableInfo.name === tableName){
                    // parse singleAttInfo
                    singleTableInfo.attribute.forEach((singleAttributeInfo, singleAttributeInfoIndex)=>{
                        if(singleAttributeInfo.attributeName === attName){
                            // use valueChoosed to filter
                            for (let i = 0; i < singleAttributeInfo.count.length; i++) {
                                if(valueChoosed[i]){
                                    param.filterEqual[tableName][attName] = Object.keys(singleAttributeInfo.count[i])[0]
                                }
                            }
                        }
                    })
                    break
                }
            }
        })
        console.log(param)

        // attributeInfo.forEach((singleTableInfo, index) => {
        //     param.filterEqual[singleTableInfo.name] = {}
        //     const singleTableIndicator = [...clickedIndicator[singleTableInfo.name]]
        //     let boolIndicatorIndex = 0
        //     if(!singleTableIndicator.every(ele => ele === false)){
        //         // 有被选中的
        //         singleTableInfo.attribute.forEach((singleAttributeInfo, attIndex) => {
        //             if()
        //         })
        //     }
        // })
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
                            onChange={(option) => handleJoinTableChange(option, 2*index)}
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
                            <Select id='att-left' options={joinOnTableAttributeList[index].map((attName, attIndex) => (
                                {value: attName, label: attName}
                            ))}
                            onChange={(option) => handleAttributeChoose(option, 2*index)}
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
                            onChange={(option) => handleJoinTableChange(option, 2*index+1)}
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
                            <Select id='att-right' options={joinOnTableAttributeList[index+1].map((attName, attIndex) => (
                                {value: attName, label: attName}
                            ))}
                            onChange={(option) => handleAttributeChoose(option, 2*index+1)}
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
                                    <FilterBar min={att.count[0]['min']} max={att.count[1]['max']} 
                                    onChange={(value) => handleSliderChange(value, tableInfo['name'], att['attributeName'])}></FilterBar>
                                </div>
                                : <span></span>
                            ))
                        ))}
                    </div>
                </div>
                <button id='display-result' onClick={handleDisplayClick}>Display Result</button>
            </div>
            <div id='current-table'>
                <div id='current-table-head'>Current Tables</div>
                {allTableNames.map((tableName, index)=>(
                    <div className={'table-item' + (tableChoosenIndicator[index]? ' activate' : '')} 
                    onClick={()=>handleTableClickedChange(index)}>{tableName}</div>
                ))}
            </div>
        </div>
    )
}

export default Admin