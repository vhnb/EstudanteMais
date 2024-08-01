import styles from './styles.module.css'
import { signIn, signOut, useSession } from 'next-auth/react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { IoMenu } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function Header() {
    const { data: session, status } = useSession()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function handleToHomePage() {
        window.location.href = '/'
    }

    return (
        <header className={styles.header}>
            <div className={styles.contentHeader}>
                <h1 onClick={handleToHomePage}>Estudante<span>+</span></h1>
                {status === 'loading' ? (
                    <Spinner animation="border" variant="primary" />
                ) : session ? (
                    <div className={styles.contentLogin}>
                        <a href='/postagens'>Postagens</a>
                        <a href='/painel'>Painel de estudos</a>
                        <div className={styles.containerUser}>
                            <button onClick={() => signOut()}>
                                <p style={{ marginBottom: '0px', }} className={styles.textNameUser}>{session?.user?.name}</p>
                                <p className={styles.textLogout}>Sair</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.contentLogout}>
                        <a href='/postagens'>Postagens</a>
                        <button style={{ marginLeft: '15px', }} onClick={() => signIn("google")}>Entrar</button>
                    </div>
                )}
                <IoMenu onClick={handleShow} className={styles.iconMenu} />
            </div>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header style={{backgroundColor:'#080e1c', color:'#fff',}} closeButton closeVariant="white">
                    <Offcanvas.Title style={{color:'#fff',}}>Opções</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{backgroundColor:'#080e1c', display:'flex', alignItems:'start', justifyContent:'start', flexDirection:'column'}}>
                    {status === 'loading' ? (
                        <Spinner animation="border" variant="primary" />
                    ) : session ? (
                        <div style={{display:'flex', alignItems:'start', justifyContent:'start', flexDirection:'column', width:'100%',}} className={styles.contentLogin}>
                            <a style={{padding:'10px', textDecoration:'none', border:'1px solid #111c36', borderRadius:'10px', width:'100%', fontSize:'18px', color:'#fff', marginBottom:'10px',}} href='/postagens'>Postagens</a>
                            <a style={{padding:'10px', textDecoration:'none', border:'1px solid #111c36', borderRadius:'10px', width:'100%', fontSize:'18px', color:'#fff', marginBottom:'10px',}} href='/painel'>Painel de estudos</a>
                            <div style={{width:'100%',}} className={styles.containerUser}>
                                <p style={{padding:'10px', textDecoration:'none', border:'1px solid #111c36', borderRadius:'10px', width:'100%', fontSize:'18px', color:'#fff', marginBottom:'10px', display:'flex', alignItems:'center', justifyContent:'start',}}><FaUser style={{marginRight:'10px',}}/> {session?.user?.name}</p>
                                <button style={{borderRadius:'10px', width:'100%', fontSize:'18px', padding:'8px', backgroundColor:'#d44c4c', color:'#fff', border:'none',}} onClick={() => signOut()}>
                                    <p style={{ marginBottom: '0px', }} className={styles.textNameUser}>Sair</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{display:'flex', alignItems:'start', justifyContent:'start', flexDirection:'column', width:'100%',}} className={styles.contentLogout}>
                            <a style={{padding:'10px', textDecoration:'none', border:'1px solid #111c36', borderRadius:'10px', width:'100%', fontSize:'18px', color:'#fff', marginBottom:'10px',}} href='/postagens'>Postagens</a>
                            <button style={{borderRadius:'10px', width:'100%', fontSize:'18px', padding:'8px', backgroundColor:'#0089f9', color:'#fff', border:'none',}} onClick={() => signIn("google")}>Entrar</button>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </header>
    )
}