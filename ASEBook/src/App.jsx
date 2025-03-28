import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/App.css';
import Login from './pages/Login';
import Forumuri from './pages/Forumuri';
import Cauta from './pages/Cauta';
import DespreNoi from './pages/DespreNoi';
import Contact from './pages/Contact';
import Profil from './pages/Profil';
import Acasa from './pages/Acasa';
import Bazar from './pages/Bazar';
import Forum from './subpages/Forum';
import DetaliiCarte from './subpages/DetaliiCarte';
import ForumurileMele from './subpages/ForumurileMele';
import AnunturileMele from './subpages/AnunturileMele';
import CreeazaAnunt from './subpages/CreeazaAnunt';
import VeziAnunt from './subpages/VeziAnunt';
import ConversatiileMele from './subpages/ConversatiileMele';
import { GlobalContext } from './context/GlobalState';

const App = () => {
    const navigate = useNavigate();
    const { authData } = useContext(GlobalContext);
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true)

    useEffect(() => {
        if (location.pathname === '/' && authData.userId !== 0) {
            navigate(`/acasa`);
        }
    }, [location, authData, navigate]);

    return (
        <div className="main-container">
            <div className="header">
                <p className='header-title'>ASEBook</p>
                <ToastContainer/>
            </div>

            {showNavbar ? (
                <div className='navbar-and-arrow'>
                    <div className="navbar">
                        <button onClick={() => navigate(`/Acasa`)}>Acasa</button>
                        <button onClick={() => navigate(`/forumuri`)}>Forumuri</button>
                        <button onClick={() => navigate(`/bazar`)}>Bazar</button>
                        <button onClick={() => navigate(`/cauta`)}>Cauta</button>
                        <button onClick={() => navigate(`/despre-noi`)}>Despre Noi</button>
                        <button onClick={() => navigate(`/contact`)}>Contact</button>
                        {authData.token === null ? (
                            <button onClick={() => navigate(`/conecteaza-te`)}>Conecteaza-te</button>
                            ) : (
                            <button onClick={() => navigate(`/profil`)}>Profil</button>
                        )}
                    </div>
                    <button className='arrow' onClick={() => {setShowNavbar(!showNavbar)}}>↑</button>
                </div>) : (<div className='navbar-and-arrow'><button className='arrow' onClick={() => {setShowNavbar(!showNavbar)}}>↓</button></div>)}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Acasa />} />
                    <Route path="/forumuri" element={<Forumuri />} />
                    <Route path="/bazar" element={<Bazar />} />
                    <Route path="/cauta" element={<Cauta />} />
                    <Route path="/despre-noi" element={<DespreNoi />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/conecteaza-te" element={<Login />} />
                    <Route path="acasa" element={<Acasa />} />
                    <Route path="/forumuri" element={<Forumuri />} />
                    <Route path="/bazar" element={<Bazar />} />
                    <Route path="/bazar/creeaza-anunt" element={<CreeazaAnunt/>}/>
                    <Route path='/bazar/AnunturileMele' element={<AnunturileMele/>}/>
                    <Route path='/bazar/conversatii' element={<ConversatiileMele/>}/>
                    <Route path='/bazar/anunt/:idAnunt' element={<VeziAnunt/>}/>
                    <Route path="/cauta" element={<Cauta />} />
                    <Route path="/cauta/carte/:idCarte" element={<DetaliiCarte />} />
                    <Route path="/despre-noi" element={<DespreNoi />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path='/forumuri/:idForum' element={<Forum/>}/>
                    <Route path='/forumuri/ForumurileMele' element={<ForumurileMele/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default App;