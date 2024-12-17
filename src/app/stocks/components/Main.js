'use client'
import styles from './main.module.scss'
import Chart from 'chart.js/auto'
import { Bar, Line, Bubble, Doughnut, Radar, Pie, Scatter} from 'react-chartjs-2';
import {CategoryScale} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

import { useState } from 'react';
import { sendData } from '../api';

Chart.register(zoomPlugin);
Chart.register(CategoryScale);

localStorage.setItem('date_st', '')
localStorage.setItem('date_kon', '')

const url = 'https://f.serveo.net/api'


const BoardElem = (elem) =>{
    const [update, setUpdate] = useState(1)
    const devElem = (name, key, line, pie, bar) =>{
        setDel(true)
        let str = name+' '+String(line)+' '+String(pie)+' '+String(bar)+' '+String(key);
        let left_arr_for_ind = localStorage.getItem('left_block_lst_for_ind_stocks').split(';').filter(function(entry) { return entry.trim() != ''; })
        let right_arr_for_ind = localStorage.getItem('right_block_lst_for_ind_stocks').split(';').filter(function(entry) { return entry.trim() != ''; })
        let left_block_info = JSON.parse(localStorage.getItem('left_blocks_inf_st'))
        let right_block_info = JSON.parse(localStorage.getItem('right_blocks_inf_st'))
        let ind = left_arr_for_ind.indexOf(str)
        if(ind!==-1){
            left_arr_for_ind.splice(ind, 1)
            left_block_info.splice(ind, 1)
            localStorage.setItem('left_block_lst_for_ind_stocks', left_arr_for_ind.join(';'))
            localStorage.setItem('left_blocks_inf_st', JSON.stringify(left_block_info))
        }else{
            ind = right_arr_for_ind.indexOf(str)
            right_arr_for_ind.splice(ind, 1)
            right_block_info.splice(ind, 1)
            localStorage.setItem('right_blocks_inf_st', JSON.stringify(right_block_info))
            localStorage.setItem('right_block_lst_for_ind_stocks', right_arr_for_ind.join(';'))
        }

        setUpdate(2)
        // console.log(str)
        // console.log(localStorage.getItem('left_block_lst_for_ind'))

    }
    const name = elem.elem[0];
    const line = elem.elem[1];
    const pie = elem.elem[2];
    const bar = elem.elem[3];
    const dataset = elem.elem[4];
    // console.log(elem)
    const key = elem.elem[5];
    const options = {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }}
        const [del, setDel] = useState(false);
        if(line && !del){
            return(
                    <div className={styles.board_el} key={key}>
                        <h2>{name}</h2>
                        <button className={styles.delbtn} onClick={()=>{devElem(name, key, line, pie, bar)}}><p>-</p></button>
                        <div className={styles.graf_st}>
                            <Line
                                datasetIdKey='id'
                                data={dataset}
                                options={options}
                            />
                        </div>
                    </div>
            )
        }else if(pie && !del){
            return(
                    <div className={styles.board_el} key={key}>
                        <h2>{name}</h2>
                        <button className={styles.delbtn} onClick={()=>{devElem(name, key, line, pie, bar)}}><p>-</p></button>
                        <div className={styles.graf_st}>
                            <Pie
                                datasetIdKey='id'
                                data={dataset}
                                options={options}
                            />
                        </div>
                    </div>
            )
        }else if(bar && !del){
            return(
                    <div className={styles.board_el} key={key}>
                        <h2>{name}</h2>
                        <button className={styles.delbtn} onClick={()=>{devElem(name, key, line, pie, bar)}}><p>-</p></button>
                        <div className={styles.graf_st}>
                            <Bar
                                datasetIdKey='id'
                                data={dataset}
                                options={options}
                            />
                        </div>
                    </div>
            )
        }
}

const DashBoard = () => {

    const [tickers, setTickers] = useState('')

    const [token, setToken] = useState(localStorage.getItem('token'))

    if(localStorage.getItem('left_blocks_inf_st')===null){
        localStorage.setItem('left_blocks_inf_st', JSON.stringify([]))
    }

    if(localStorage.getItem('right_blocks_inf_st')===null){
        localStorage.setItem('right_blocks_inf_st', JSON.stringify([]))
    }

    const left_blocks_inf = JSON.parse(localStorage.getItem('left_blocks_inf_st'))
    const right_blocks_inf = JSON.parse(localStorage.getItem('right_blocks_inf_st'))

    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);
    const [select, setSelect] = useState(false);
    const goSelect = () =>{
        setSelect(!select);
        console.log(localStorage.getItem('token'))
    }

    const month_to_num = (st)=>{
        switch(st){
            case 'Jan':
                return '01'
            case 'Feb':
                return '02'
            case 'Mar':
                return '03'
            case 'Apr':
                return '04'
            case 'May':
                return '05'
            case 'Jun':
                return '06'
            case 'Jul':
                return '07'
            case 'Aug':
                return '08'
            case 'Sep':
                return '09'
            case 'Oct':
                return '10'
            case 'Nov':
                return '11'
            case 'Dec':
                return '12'
        }
    }

    const selected = () => {
        // setSelect(!select);
        let start = String(state[0].startDate).split(' ')
        let finish = String(state[0].endDate).split(' ')
        let day_st = start[2]
        let day_fin = finish[2]
        let month_st = month_to_num(start[1])
        let month_fin = month_to_num(finish[1])
        let year_st = start[3]
        let year_fin = finish[3]

        let start_serv = day_st+'-'+month_st+'-'+year_st;
        let finish_serv = day_fin+'-'+month_fin+'-'+year_fin;
        if(finish_serv==='undefined-undefined-undefined'){
            finish_serv=''
        }

        localStorage.setItem('date_st', start_serv)
        localStorage.setItem('date_kon', finish_serv)
        // console.log(start_serv)
        // console.log(finish_serv)
        // console.log(state[0].startDate)
        // console.log(state[0].endDate)
    }

    const [valute, setVal] = useState(true);
    const [stav_1, setStav_1] = useState(false);
    const [course, setCourse] = useState(false);

    const [line, setLine] = useState(true);
    const [pie, setPie] = useState(false);
    const [bar, setBar] = useState(false);

    const [leftSt, setLeftSt] = useState(true);

    const dataset_valute = {
        labels: ['June', 'Jule', 'August'],
        datasets: [
        {
            id: 1,
            label: '$',
            data: [92.53, 108.41, 104.72],
         },
        {
            id: 2,
            label: '€',
            data: [98.21, 99.85, 99.34],
        },
        {
            id: 3,
            label: 'CNY',
            data: [12.72,13.96,12.89]
        }
    ],}

    const dataset_stav = {
        labels: ['Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
        {
            id: 1,
            label: 'NotCoin',
            data: [5, 6, 7,1,4,5,3,4],
         }
    ],}
    const [key, setKey] = useState(0)
    let left_block_list=[]
    let left_block_lst_for_ind=[]
    let right_block_list=[]
    let right_block_lst_for_ind=[]

    left_block_lst_for_ind = localStorage.getItem('left_block_lst_for_ind_stocks')
    right_block_lst_for_ind = localStorage.getItem('right_block_lst_for_ind_stocks')

    if(!(left_block_lst_for_ind===null && right_block_lst_for_ind===null)){
        left_block_lst_for_ind = left_block_lst_for_ind.split(';')
        right_block_lst_for_ind = right_block_lst_for_ind.split(';')
        let left_blocks_inf_1 = JSON.parse(localStorage.getItem('left_blocks_inf_st'))
        let right_blocks_inf_1 = JSON.parse(localStorage.getItem('right_blocks_inf_st'))
        for(let i=0; i<left_blocks_inf_1.length; i++){
            if (left_block_lst_for_ind[i] !== ''){
                let mini_lst=JSON.parse(localStorage.getItem('left_blocks_inf_st'))[i];

                left_block_list.push(<BoardElem elem={[mini_lst[0],mini_lst[1],mini_lst[2],mini_lst[3],mini_lst[4],mini_lst[5]]} />)
            }
        }
        for(let i=0; i<right_blocks_inf_1.length; i++){
            let mini_lst = JSON.parse(localStorage.getItem('right_blocks_inf_st'))[i]

            right_block_list.push(<BoardElem key={mini_lst[5]}  elem={[mini_lst[0],mini_lst[1],mini_lst[2],mini_lst[3],mini_lst[4],mini_lst[5]]} />)

    }
        }
    else{
        let left_block_list = [
            <BoardElem elem={['Валюты',true,false,false,dataset_valute,-1]} />,
            <BoardElem elem={['Валюты',false,false,true,dataset_valute,-2]} />
        ];
    
        let left_info_lst = [['Валюты',true,false,false,dataset_valute,0],['Валюты',false,false,true,dataset_valute,1]]
    
        left_block_lst_for_ind = 'Валюты true false false 0;Валюты false false true 1';
    
        right_block_list = [
            <BoardElem elem={['Ставка',false, false, true, dataset_stav,-3]}/>,
            <BoardElem elem={['Ставка',false, true, false, dataset_stav,-4]}/>
        ];
    
        right_block_lst_for_ind = 'Ставка-ЦБ false false true 2;Ставка-ЦБ false true false 3';
        
        localStorage.setItem('left_block_lst_for_ind_stocks', left_block_lst_for_ind)
        localStorage.setItem('right_block_lst_for_ind_stocks', right_block_lst_for_ind)
    }

    // const [left_list, setLeftList] = useState(left_block_list)
    // const [right_list, setRightList] = useState(right_block_list)


    const add_new_graph = async (key, left_block_list, right_block_list, right_block_lst_for_ind, left_block_lst_for_ind) =>{
        let start = String(state[0].startDate).split(' ')
        let finish = String(state[0].endDate).split(' ')
        let day_st = start[2]
        let day_fin = finish[2]
        let month_st = month_to_num(start[1])
        let month_fin = month_to_num(finish[1])
        let year_st = start[3]
        let year_fin = finish[3]

        let start_ser = year_st+'-'+month_st+'-'+day_st;
        let finish_ser = year_fin+'-'+month_fin+'-'+day_fin;
        if(finish_ser==='undefined-undefined-undefined'){
            finish_ser=''
        }

        localStorage.setItem('date_st', start_ser)
        localStorage.setItem('date_kon', finish_ser)
        
        let start_serv = localStorage.getItem('date_st')
        let finish_serv = localStorage.getItem('date_kon')
        if(finish_serv===''){
            finish_serv=null;
        }
        // console.log(start_serv)
        // console.log(finish_serv)


        let st_1 = tickers.split(' ').join(', ')
        let dataset_sel = {};
        console.log(start_serv, finish_serv)
        let list_tickers = tickers.split(' ');
        let data = await sendData(url+'/moex_info/stock',{
                jwt_token: token,
                date_start: start_serv,
                date_finish: finish_serv,
                tickers: list_tickers
            })
            console.log(data)
            // console.log(name_val)


            // console.log(data)
            dataset_sel = {
                labels: data.payload[list_tickers[0]].TRADEDATE,
                datasets: [],
            }
            
            for(let i=0;i<list_tickers.length;i++){
                console.log(data.payload['SBER'])
                dataset_sel.datasets.push(
                    {
                        id: i,
                        label: list_tickers[i],
                        data: data.payload[list_tickers[i]]['CLOSE']
                    }
                )
            }
            console.log(dataset_sel)

        // console.log(key)

        // console.log(left_block_list)
        // console.log(right_block_list)

        let st = st_1+' '+String(line)+' '+String(pie)+' '+String(bar)+' '+String(key);
        // console.log(st)
        // console.log(dataset_sel)

        if(leftSt){
            left_blocks_inf.push([st_1, line,pie,bar,dataset_sel,key, start_serv])
            left_block_lst_for_ind=left_block_lst_for_ind.filter(function(entry) { return entry.trim() != ''; });
            left_block_list.push(<BoardElem elem={[st_1, line,pie,bar,dataset_sel,key]}/>)
            left_block_lst_for_ind.push(st);
            let new_lef_for_ind = left_block_lst_for_ind.join(';')
            localStorage.setItem('left_block_lst_for_ind_stocks', new_lef_for_ind)
            localStorage.setItem('left_blocks_inf_st', JSON.stringify(left_blocks_inf))
        }else{
            right_blocks_inf.push([st_1, line,pie,bar,dataset_sel,key, start_serv])
            right_block_lst_for_ind = right_block_lst_for_ind.filter(function(entry) { return entry.trim() != ''; });
            right_block_list.push(<BoardElem elem={[st_1, line,pie,bar,dataset_sel,key]}/>)
            right_block_lst_for_ind.push(st)
            let new_lef_for_ind = right_block_lst_for_ind.join(';')
            localStorage.setItem('right_block_lst_for_ind_stocks', new_lef_for_ind)
            localStorage.setItem('right_blocks_inf_st', JSON.stringify(right_blocks_inf))
        }

        // setLeftList(left_block_list)
        // setRightList(right_block_list)
        // console.log(left_block_lst_for_ind)
        // console.log(left_block_list)
        // console.log(key)
        // console.log(left_info_lst)
        setKey(key+1);
    }

    const deleteall = (key, left_block_list, right_block_list, right_block_lst_for_ind, left_block_lst_for_ind) =>{
        setKey(0);
        left_block_list=[]
        right_block_list=[]
        right_block_lst_for_ind=[]
        left_block_lst_for_ind=[]
        localStorage.setItem('right_block_lst_for_ind_stocks', '')
        localStorage.setItem('left_block_lst_for_ind_stocks','')
        localStorage.setItem('left_blocks_inf_st', JSON.stringify([]))
        localStorage.setItem('right_blocks_inf_st', JSON.stringify([]))
        setToken(token)
    }


    return(
        <>
        {select ?
        <>
            <button className={styles.goselectbtn} onClick={goSelect}>Изменить дашборд</button>
            <div className={styles.dateselector}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setState([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                            />
                            </td>
                            <td>
                                <button className={styles.selectbtn} onClick={selected}>Выбрать</button>
                                <br/>
                                <button className={styles.deletebtn} onClick={()=>{deleteall(key, left_block_list, right_block_list, right_block_lst_for_ind, left_block_lst_for_ind)}}>Очистить дашборд</button>
                                <br/>
                                <button className={styles.closebtn} onClick={()=>{setSelect(false)}}>Закрыть</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.addgraph}>
                <h1>Добавить диаграмму</h1>
                <table className={styles.add_tbl}>
                <thead>
                        <tr>
                            <td className={styles.add_stolb}><h2>Акции</h2><hr/></td>
                            <td className={styles.add_stolb}><h2>Тип диаграммы</h2><hr/></td>
                            <td className={styles.add_stolb}><h2>Столбец</h2><hr/></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.add_stolb}>
                                <label>
                                    Введите тикеры акций через пробел
                                    <br/>
                                    <br/>
                                    <input value={tickers} onChange={e=>{setTickers(e.target.value)}} className={styles.inp_stocks} placeholder='Тикеры' type='text'/>
                                </label>
                            </td>
                            <td className={styles.add_stolb}>
                                <label>
                                    <input checked={line} onChange={()=>{setLine(true);setPie(false);setBar(false)}} type='radio'/>
                                    Линейная
                                </label>
                                <br/>
                                <label>
                                    <input checked={pie} onChange={()=>{setLine(false);setPie(true);setBar(false)}} type='radio'/>
                                    Круговая
                                </label>
                                <br/>
                                <label>
                                    <input checked={bar} onChange={()=>{setLine(false);setPie(false);setBar(true)}} type='radio'/>
                                    Столбчатая
                                </label>
                            </td>
                            <td className={styles.add_stolb}>
                                <label>
                                    <input checked={leftSt} onChange={()=>{setLeftSt(true)}} type='radio'/>
                                    Левый
                                </label>
                                <br/>
                                <label>
                                    <input checked={!leftSt} onChange={()=>{setLeftSt(false)}} type='radio'/>
                                    Правый
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                {/* (key, left_block_list, right_block_list, right_block_lst_for_ind, left_block_lst_for_ind) */}
                <button className={styles.add_btn} onClick={()=>{add_new_graph(key, left_block_list, right_block_list, right_block_lst_for_ind, left_block_lst_for_ind)}}>Добавить</button>
            </div>
        </>
             : 
             <button className={styles.goselectbtn} onClick={goSelect}>Изменить дашборд</button>}

        <table className={styles.dashtable}>
            <tbody>
                <tr>
                    <td>
                        {/* <DashBoardMini/> */}
                        {/* <BoardElem  elem={['Ставка ЦБ',true,false,false,dataset_stav]} />
                        <BoardElem  elem={['Валюты',false,false,true,dataset_valute]} /> */}
                        {left_block_list}
                    </td>
                    <td>
                        {/* <BoardElem elem={['Ставка ЦБ',false, false, true, dataset_stav]}/>
                        <BoardElem elem={['Валюты',false, true, false, dataset_valute]}/> */}
                        {right_block_list}
                    </td>
                </tr>
            </tbody>
        </table>
        </>
    )
}



const Main = () =>{
    return (
        <main>
            <div className={styles.dashboard}>
                <DashBoard/>
            </div>
        </main>
    )
}

export default Main