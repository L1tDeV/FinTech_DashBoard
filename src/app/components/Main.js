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
import { sendData } from './api';

Chart.register(zoomPlugin);
Chart.register(CategoryScale);

localStorage.setItem('date_st', '')
localStorage.setItem('date_kon', '')

const url = 'https://f.serveo.net/api';


const BoardElem = (elem) =>{
    const [update, setUpdate] = useState(1)

    const devElem = (name, key, line, pie, bar) =>{
        setDel(true)
        let str = name+' '+String(line)+' '+String(pie)+' '+String(bar)+' '+String(key);
        let left_arr_for_ind = localStorage.getItem('left_block_lst_for_ind').split(';').filter(function(entry) { return entry.trim() != ''; });
        let right_arr_for_ind = localStorage.getItem('right_block_lst_for_ind').split(';').filter(function(entry) { return entry.trim() != ''; });
        let left_block_info = JSON.parse(localStorage.getItem('left_blocks_inf'))
        let right_block_info = JSON.parse(localStorage.getItem('right_blocks_inf'))
        let ind = left_arr_for_ind.indexOf(str)
        if(ind!==-1){
            left_arr_for_ind.splice(ind, 1)
            left_block_info.splice(ind, 1)
            localStorage.setItem('left_block_lst_for_ind', left_arr_for_ind.join(';'))
            localStorage.setItem('left_blocks_inf', JSON.stringify(left_block_info))
        }else{
            ind = right_arr_for_ind.indexOf(str)
            right_arr_for_ind.splice(ind, 1)
            right_block_info.splice(ind, 1)
            localStorage.setItem('right_block_lst_for_ind', right_arr_for_ind.join(';'))
            localStorage.setItem('right_blocks_inf', JSON.stringify(right_block_info))
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

const BoardElem_Valutes = (elem)=>{

    const [update_1, setUpdate_1] = useState(1)
    const devElem = (name, key, line, pie, bar) =>{
        setDel(true)
        let str = name+' '+String(line)+' '+String(pie)+' '+String(bar)+' '+String(key);
        let left_arr_for_ind = localStorage.getItem('left_block_lst_for_ind').split(';').filter(function(entry) { return entry.trim() != ''; });
        let right_arr_for_ind = localStorage.getItem('right_block_lst_for_ind').split(';').filter(function(entry) { return entry.trim() != ''; });
        let left_block_info = JSON.parse(localStorage.getItem('left_blocks_inf'))
        let right_block_info = JSON.parse(localStorage.getItem('right_blocks_inf'))
        let ind = left_arr_for_ind.indexOf(str)
        console.log(str, left_arr_for_ind, ind)
        if(ind!==-1){
            left_arr_for_ind.splice(ind, 1)
            left_block_info.splice(ind, 1)
            localStorage.setItem('left_block_lst_for_ind', left_arr_for_ind.join(';'))
            localStorage.setItem('left_blocks_inf', JSON.stringify(left_block_info))
            localStorage.setItem('left_val',null)
        }else{
            ind = right_arr_for_ind.indexOf(str)
            right_arr_for_ind.splice(ind, 1)
            right_block_info.splice(ind, 1)
            localStorage.setItem('right_block_lst_for_ind', right_arr_for_ind.join(';'))
            localStorage.setItem('right_blocks_inf', JSON.stringify(right_block_info))
            localStorage.setItem('right_val',null)
        }
        setUpdate_1(2)

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
    const date = elem.elem[6];

    let val_list = []
    for(let i=0;i<dataset.CharCode.length;i++){
        val_list.push(
            <li>
                <div className={styles.board_el_mini}>
                    <h3>{dataset.Name[i]}</h3>
                    <p>Code: {dataset.CharCode[i]}</p>
                    <p>ID: {dataset.ID[i]}</p>
                    <h4>{dataset.Value[i]} руб</h4>
                    <p>Дата: {date}</p>
                </div>
            </li>
        )
    }


        const [del, setDel] = useState(false);
        if(!del){
            return(
                    <div className={styles.board_el_val} key={key}>
                        <h2>{name}</h2>
                        <button className={styles.delbtn_val} onClick={()=>{devElem(name, key, line, pie, bar)}}><p>-</p></button>
                        <ul>
                            {val_list}
                        </ul>
                    </div>
            )
        }

}

const DashBoard = () => {

    const [idValute, setIdValute] = useState('')

    const [token, setToken] = useState(localStorage.getItem('token'))

    if(localStorage.getItem('left_blocks_inf')===null){
        localStorage.setItem('left_blocks_inf', JSON.stringify([]))
    }

    if(localStorage.getItem('right_blocks_inf')===null){
        localStorage.setItem('right_blocks_inf', JSON.stringify([]))
    }

    const left_blocks_inf = JSON.parse(localStorage.getItem('left_blocks_inf'))
    const right_blocks_inf = JSON.parse(localStorage.getItem('right_blocks_inf'))

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
        // console.log(state[0].startDate)
        // console.log(state[0].endDate)
        // console.log(start_serv)
        // console.log(finish_serv)
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

    left_block_lst_for_ind = localStorage.getItem('left_block_lst_for_ind')
    right_block_lst_for_ind = localStorage.getItem('right_block_lst_for_ind')

    if(!(left_block_lst_for_ind===null && right_block_lst_for_ind===null)){
        left_block_lst_for_ind = left_block_lst_for_ind.split(';')
        right_block_lst_for_ind = right_block_lst_for_ind.split(';')
        let left_blocks_inf_1 = JSON.parse(localStorage.getItem('left_blocks_inf'))
        let right_blocks_inf_1 = JSON.parse(localStorage.getItem('right_blocks_inf'))
        console.log(left_blocks_inf_1)
        for(let i=0; i<left_blocks_inf_1.length; i++){
            if (left_block_lst_for_ind[i] !== ''){
                // let mini_lst = left_block_lst_for_ind[i].split(' ')
                // mini_lst[1]=(mini_lst[1]==='true')
                // mini_lst[2]=(mini_lst[2]==='true')
                // mini_lst[3]=(mini_lst[3]==='true')
                let mini_lst = JSON.parse(localStorage.getItem('left_blocks_inf'))[i]
                if(mini_lst[0]!=='Валюты'){
                    left_block_list.push(<BoardElem key={mini_lst[5]}  elem={[mini_lst[0],mini_lst[1],mini_lst[2],mini_lst[3],mini_lst[4],mini_lst[5]]} />)
                }else{
                    left_block_list.push(<BoardElem_Valutes elem={mini_lst}/>)
                }
                // console.log(mini_lst)
                // if(mini_lst[0]=='Валюты'){
                //     let k = mini_lst[4]
                //     mini_lst[4]=dataset_valute;
                //     mini_lst.push(Number(k))
                // }else{
                //     let k = mini_lst[4]
                //     mini_lst[4]=dataset_stav;
                //     mini_lst.push(Number(k))
                // }
            }
        }
        for(let i=0; i<right_blocks_inf_1.length; i++){
            let mini_lst = JSON.parse(localStorage.getItem('right_blocks_inf'))[i]
            // let mini_lst = right_block_lst_for_ind[i].split(' ')
            // mini_lst[1]=(mini_lst[1]==='true')
            // mini_lst[2]=(mini_lst[2]==='true')
            // mini_lst[3]=(mini_lst[3]==='true')
            // if(mini_lst[0]==='Валюты'){
            //     let k = mini_lst[4]
            //     mini_lst[4]=dataset_valute;
            //     mini_lst.push(Number(k))
            // }else{
            //     let k = mini_lst[4]
            //     mini_lst[4]=dataset_stav;
            //     mini_lst.push(Number(k))
            // }


            if(mini_lst[0]!=='Валюты'){
                right_block_list.push(<BoardElem key={mini_lst[5]}  elem={[mini_lst[0],mini_lst[1],mini_lst[2],mini_lst[3],mini_lst[4],mini_lst[5]]} />)
            }else{
                right_block_list.push(<BoardElem_Valutes elem={mini_lst}/>)
            }

    }
        }
    else{
        localStorage.setItem('left_block_lst_for_ind', '')
        localStorage.setItem('right_block_lst_for_ind', '')
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

        let start_ser = day_st+'-'+month_st+'-'+year_st;
        let finish_ser = day_fin+'-'+month_fin+'-'+year_fin;
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
        let st_1 = ''
        let dataset_sel = {};
        if(valute){
            st_1 = 'Валюты';
            // dataset_sel = dataset_valute
            let data = await sendData(url+'/cb_info/currency_list',{
                jwt_token: token,
                date: start_serv,
            })
            // console.log(data.payload)
            dataset_sel = data.payload

            // console.log(dataset_sel)
        }else if(course){
            st_1='Курс';
            dataset_sel = dataset_valute
            let name_val = ''
            let data_val = JSON.parse(localStorage.getItem('left_val'))
            data_val = data_val[4]
            console.log(data_val)
            if(data_val===null){
                data_val = JSON.parse(localStorage.getItem('right_val'))
                if(data_val===null){
                    name_val=idValute
                }else{
                    let ind_val = data_val.ID.indexOf(idValute)
                    name_val = data_val.CharCode[ind_val]
                }
            }else{
                console.log(data_val)
                let ind_val = data_val.ID
                console.log(data_val)
                ind_val = ind_val.indexOf(idValute)
                name_val = data_val.CharCode[ind_val]
            }
            let data = await sendData(url+'/cb_info/exchange_rates',{
                jwt_token: token,
                date_start: start_serv,
                date_finish: finish_serv,
                id: idValute
            })
            console.log(data)
            console.log(name_val)
            let data_values = data.payload.Value
            console.log(data_values)
            data_values = data_values.map((n)=>n.replace(',', '.'))
            console.log(data_values)
            // console.log(data)
            dataset_sel = {
                labels: data.payload.Date,
                datasets: [
                {
                    id: 1,
                    label: name_val,
                    data: data_values,
                 }
            ],}
            
        }else if(stav_1){
            st_1='Ставка-ЦБ';
            // dataset_sel = dataset_stav
            // console.log(token, start_serv, finish_serv)
            // console.log(token)
            let data = await sendData(url+'/cb_info/key_rate',{
                jwt_token: token,
                date_start: start_serv,
                date_finish: finish_serv
            })
            // console.log(data)
            dataset_sel = {
                labels: data.payload['Дата'].reverse(),
                datasets: [
                {
                    id: 1,
                    label: '%',
                    data: data.payload['Ставка'].reverse(),
                 }
            ],}

            // console.log(dataset_sel)
        }

        // console.log(key)

        // console.log(left_block_list)
        // console.log(right_block_list)

        let st = st_1+' '+String(line)+' '+String(pie)+' '+String(bar)+' '+String(key);
        // console.log(st)
        // console.log(dataset_sel)

        if(leftSt){
            left_blocks_inf.push([st_1, line,pie,bar,dataset_sel,key, start_serv])
            if(st_1!=='Валюты'){
                left_block_list.push(<BoardElem elem={[st_1, line,pie,bar,dataset_sel,key]}/>)
            }else{
                left_block_list.push(<BoardElem_Valutes elem={[st_1, line,pie,bar,dataset_sel,key, start_serv]}/>)
            }
            // console.log([st_1, line,pie,bar,dataset_sel,key, start_serv])
            left_block_lst_for_ind.push(st);
            left_block_lst_for_ind=left_block_lst_for_ind.filter(function(entry) { return entry.trim() != ''; });
            let new_lef_for_ind = left_block_lst_for_ind.join(';')
            localStorage.setItem('left_block_lst_for_ind', new_lef_for_ind)
            localStorage.setItem('left_blocks_inf', JSON.stringify(left_blocks_inf))
            localStorage.setItem('left_val', JSON.stringify([st_1, line,pie,bar,dataset_sel,key, start_serv]))
        }else{
            right_blocks_inf.push([st_1, line,pie,bar,dataset_sel,key, start_serv])
            if(st_1!=='Валюты'){
                right_block_list.push(<BoardElem elem={[st_1, line,pie,bar,dataset_sel,key]}/>)
            }else{
                right_block_list.push(<BoardElem_Valutes elem={[st_1, line,pie,bar,dataset_sel,key, start_serv]}/>)
            }
            right_block_lst_for_ind.push(st)
            right_block_lst_for_ind = right_block_lst_for_ind.filter(function(entry) { return entry.trim() != ''; });
            let new_lef_for_ind = right_block_lst_for_ind.join(';')
            localStorage.setItem('right_block_lst_for_ind', new_lef_for_ind)
            localStorage.setItem('right_blocks_inf', JSON.stringify(right_blocks_inf))
            localStorage.setItem('right_val', JSON.stringify([st_1, line,pie,bar,dataset_sel,key, start_serv]))
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
        localStorage.setItem('right_block_lst_for_ind', '')
        localStorage.setItem('left_block_lst_for_ind','')
        localStorage.setItem('left_blocks_inf', JSON.stringify([]))
        localStorage.setItem('right_blocks_inf', JSON.stringify([]))
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
                            <td className={styles.add_stolb}><h2>ID Валюты</h2><hr/></td>
                            <td className={styles.add_stolb}><h2>Данные</h2><hr/></td>
                            <td className={styles.add_stolb}><h2>Тип диаграммы</h2><hr/></td>
                            <td className={styles.add_stolb}><h2>Столбец</h2><hr/></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.add_stolb}>
                                <label>
                                    Введите 1 ID валюты
                                    <br/>
                                    <input className={styles.inp_val} value={idValute} onChange={e=>{setIdValute(e.target.value)}} type='text' placeholder='ID'/>
                                </label>
                            </td>
                            <td className={styles.add_stolb}>
                                <label>
                                    <input checked={valute} onChange={()=>{setVal(true);setCourse(false);setStav_1(false)}} type='radio'/>
                                    Валюты
                                </label>
                                <br/>
                                <label>
                                    <input checked={course} onChange={()=>{setCourse(true);setStav_1(false);setVal(false)}} type='radio'/>
                                    Курс валют
                                </label>
                                <br/>
                                <label>
                                    <input checked={stav_1} onChange={()=>{setStav_1(true);setCourse(false);setVal(false)}} type='radio'/>
                                    Ставка-ЦБ
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
                        {/* {JSON.parse(localStorage.getItem('left_block_list'))} */}
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