import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import config from "../utils/config";
import { createToast } from '../utils/createToast';
import '../styles/Forumuri.css';

import { GlobalContext } from "../context/GlobalState";
import RaportareButon from "../components/RaportareButon/RaportareButon";

const rowsPerPage = 10;

const Forumuri = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [forums, setForums] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { authData } = useContext(GlobalContext);

    const [isCreatingForum, setIsCreatingForum] = useState(false)
    const [newForumTitle, setNewForumTitle] = useState("")
    const [userHasRights, setUserHasRights] = useState(true)
    const [userHasReportRights, setUserHasReportRights] = useState(true);
    const navigate = useNavigate()
    
    const fetchForums = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/getForumuri?page=${currentPage}&limit=${rowsPerPage}&search=${searchTerm}`);
            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setForums(data.forums || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Eroare la preluarea forumurilor:", error);
            setForums([]);
            setTotalPages(1);
        }
    };
    
    const fetchCreateForum = async () => {
        if(!authData?.token) {
            return;}
        try {
            const response = await fetch(`${config.API_URL}/api/createForum`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newForumTitle})
            })
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                createToast(`Eroare: ${response.statusText}`, false);
                return;
            }
            if(response.ok) {
                createToast("Forum creat!", true)
                setNewForumTitle('');
                setIsCreatingForum(false)
                fetchForums();
            }
        } catch(error) {
            createToast(error, false);
        }
    }

    const fetchUserRights = async () => {
        if(!authData?.token) {
            return;}
        try {
            const response = await fetch(`${config.API_URL}/api/getForumRights`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
                },
            })
            if(!response.ok) {
                createToast("Eroare la verificarea drepturilor!", false);
                setUserHasRights(false);
            }
            if(response.ok){
                const data = await response.json();
                setUserHasReportRights(data.hasReportRights);
                setUserHasRights(data.hasRights);
            }

        } catch(error) {
            createToast(error, false);
            setUserHasRights(false);
        }
    } 

    useEffect(() => {
        fetchForums();
        fetchUserRights();
    }, [currentPage, searchTerm]);

    return (

        <div className="forum-container">
            <ToastContainer />
            <div className="search-subcontainer">
            <input
                type="text"
                placeholder="Cauta forum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            </div>
            {authData.token !== null && (
                <div className="forumuri-meniu-container">
                    {isCreatingForum === false ? (
                        <div>
                            <button className="btnForum" onClick={() => { setIsCreatingForum(!isCreatingForum) }}>Creaza forum nou</button>
                        </div>
                    ) : (
                        <div>
                            <button className="btnAnuleaza" onClick={() => { setIsCreatingForum(!isCreatingForum) }}>Anuleaza</button>
                        </div>
                    )}
                    <button className="btnForum" onClick={() => {navigate('/forumuri/ForumurileMele')}}>Vezi forumurile tale</button>
                </div>
            )}

            {isCreatingForum === false ? (<>
                <table className="forums-table">
                <thead>
                    <tr>
                        <th className="table-header">Titlu Forum</th>
                        <th className="table-header">Data Crearii</th>
                        <th className="table-header">Este Deschis</th>
                        <th className="table-header">Utilizator</th>
                        {userHasReportRights && (<th className="table-header"></th>)}
                    </tr>
                </thead>
                <tbody>
                    {forums.map(forum => (
                        <tr key={forum.id} className="table-row">
                            <td className="table-cell table-forum" onClick={() => navigate(`/forumuri/${forum.id}`)}>{forum.titluForum}</td>
                            <td className="table-cell">{new Date(forum.data).toLocaleDateString()}</td>
                            <td className="table-cell">{forum.esteDeschis ? "Da" : "Nu"}</td>
                            <td className="table-cell table-username" onClick={() => navigate(`/utilizator/${forum.idUtilizator}`)}>{forum.username}</td>
                            {userHasReportRights && (<td><RaportareButon idObiect={forum.id} tipObiect={"Forum"} authData={authData}/></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={i + 1 === currentPage}
                        className={`pagination-button ${i + 1 === currentPage ? 'active' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div></>) : (
                userHasRights === true ? (
                    <div className="container-newForum">
                        <input type="text" className="create-input" placeholder="Introduceti titlul noului forum!" value={newForumTitle} onChange={(e) => {setNewForumTitle(e.target.value)}}/>
                        <button className="btnCreeaza" onClick={() => {fetchCreateForum()}}>Creeaza noul forum</button>
                    </div>) : (<div className="container-newForum"><p className="p-alert">In urma incalcarii regulamentului, nu mai aveti drepturile de a crea un forum! Pentru detalii, contactati un administrator.</p></div>)
            )}

        </div>
    );
};

export default Forumuri;
