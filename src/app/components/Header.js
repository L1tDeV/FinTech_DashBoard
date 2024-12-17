'use client'
import { useState } from 'react'
import styles from './header.module.scss'
import { getData, sendData } from './api'

const url = 'https://f.serveo.net/api'

const NavBar = () =>{

    const [reg, setReg] = useState(false)
    const [auth, setAuth] = useState(false)

    const [name_reg, setNameReg] = useState()
    const [pass_reg, setPassReg] = useState()

    const [name_auth, setNameAuth] = useState()
    const [pass_auth, setPassAuth] = useState()

    const [token, setToken] = useState(localStorage.getItem('token'))

    localStorage.setItem('token', token)

    const registration = () =>{
        // console.log(getData('https://fin.serveo.net/api'))
        // console.log(name_reg, pass_reg)

        let data = {
            'login': name_reg,
            'password': pass_reg
        }

        // setToken(sendData('https://f.serveo.net/api/auth/register', data_for_send))
        // localStorage.setItem('token', token)

        let tok = sendData(url+'/auth/register', data)
        // console.log(tok)
        console.log(token)

        setNameReg('')
        setPassReg('')
    }

    const authorization = async () =>{
        // console.log(name_auth, pass_auth)
        setNameAuth('')
        setPassAuth('')
        let data = {
            'login': name_auth,
            'password': pass_auth
        }
        let tok = await sendData(url+'/auth/sign-in', data)
        // let token = localStorage.setItem('token', tok.jwd_token)
        setToken(tok.jwt_token)
        // console.log(localStorage.getItem('token'))
        console.log(token)
        // console.log(localStorage.getItem('token'))
    }

    return(
        <>
        <div className={styles.navbar}>
            <div className={styles.nav_el}>
                <a href='./'><button><p>Дашборд</p></button></a>
                <a href='/stocks'><button><p>Акции</p></button></a>
                <button onClick={()=>{setReg(true); setAuth(false)}} className={styles.form_btn}><p>Регистрация</p></button>
                <button onClick={()=>{setAuth(true); setReg(false)}} className={styles.form_btn}><p>Вход</p></button>
            </div>
        </div>
        {
            reg
            &&
        <div className={styles.reg_form}>
            <button onClick={()=>{setReg(false); console.log(localStorage.getItem('token'))}} className={styles.exit_btn}><p>-</p></button>
            <br/>
            <div className={styles.main_txt_reg}>
                <h2>Регистрация</h2>
            </div>
            <br/>
            <input className={styles.reg_inp} value={name_reg} onChange={e=>{setNameReg(e.target.value)}} placeholder='Логин' type='text' />
            <br/>
            <input value={pass_reg} onChange={e=>{setPassReg(e.target.value)}} placeholder='Пароль' type='text' />
            <br/>
            <div className={styles.reg_btn}>
                <button onClick={registration}><p>Отправить</p></button>
            </div>
        </div>
        }
        {
            auth
            &&
        <div className={styles.reg_form}>
            <button onClick={()=>{setAuth(false)}} className={styles.exit_btn}><p>-</p></button>
            <br/>
            <div className={styles.main_txt_reg}>
                <h2>Вход</h2>
            </div>
            <br/>
            <input value={name_auth} onChange={e=>{setNameAuth(e.target.value)}} name='name_auth' placeholder='Логин' type='text' />
            <br/>
            <input value={pass_auth} onChange={e=>{setPassAuth(e.target.value)}} name='pass_auth' placeholder='Пароль' type='text' />
            <br/>
            <div className={styles.reg_btn}>
                <button onClick={authorization}><p>Войти</p></button>
            </div>
        </div>
        }
        </>
    )
}

const Header = ()=>{
    return(
        <header className={styles.navboard}>
            <a href='./'>
                <h1 className={styles.main_wrd}>Привет<span className={styles.bank_wrd}>Банк</span></h1>
            </a>
            <NavBar />
        </header>
    )
}

export default Header