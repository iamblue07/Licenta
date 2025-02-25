import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import config from "../../utils/config";
import { ToastContainer } from "react-toastify";
import { createToast } from "../../utils/createToast";
import { GlobalContext } from "../../context/GlobalState";
import "./Forum.css";
import defaultavatar from "../../assets/stock.jpg";

const Forum = () => {
  const { idForum } = useParams();
  const { authData } = useContext(GlobalContext);
  const [userHasRights, setUserHasRights] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [forumMessages, setForumMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [forumTitle, setForumTitle] = useState("");
  const [pText, setPText] = useState("");
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages(currentPage);
    fetchTitle();
    if (authData.token) {
      checkRights();
    } else {
      setUserHasRights(false)
      setPText("");
    }
  }, [currentPage]);

  const fetchMessages = async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${config.API_URL}/api/forum/${idForum}?page=${page}&limit=${messagesPerPage}`,
        { method: "GET" }
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setForumMessages(data.messages);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.log("Error fetching messages: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTitle = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/api/forum/${idForum}/getTitle`,
        { method: "GET" }
      );
      if (!response.ok) {
        createToast("Eroare la preluarea titlului!", false);
        return;
      }
      const data = await response.json();
      setForumTitle(data.title);
    } catch (error) {
      console.log("Error fetching title: ", error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/api/forum/${idForum}/createMessage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );
      if (!response.ok) {
        createToast("Eroare la trimiterea mesajului!", false);
        return;
      }
      setNewMessage("");
      fetchMessages(currentPage);
    } catch (error) {
      createToast("Eroare la trimiterea mesajului!", false);
      console.log("Error sending message: ", error);
    }
  };

  const checkRights = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/getForumRights`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        createToast("Eroare la verificarea drepturilor!", false);
        return;
      }

      const data = await response.json();
      setUserHasRights(data.hasRights);
      if (!data.hasRights) {
        setPText(
          "În urma încălcării regulamentului, drepturile dumneavoastră de a trimite mesaje au fost retrase."
        );
      }
    } catch (error) {
      createToast("Eroare la verificarea drepturilor!", false);
      console.log("Error checking rights: ", error);
    }
  };

  return (
    <>
      <div className="forumDetails-container">
        <h1 className="forumDetails-title">{forumTitle}</h1>

        {isLoading ? (
          <p className="forumDetails-loadingText">Loading messages...</p>
        ) : (
          <>
            {forumMessages.length === 0 ? (
              <p className="p-no-rights">
                Forumul nu contine mesaje!
              </p>
            ) : (
              <div className="forumDetails-posts">
                {forumMessages.map((message, index) => (
                  <div key={index} className="forumDetails-post">
                    <div className="forumDetails-postHeader">
                      <img
                        src={
                          message.avatar
                            ? `${config.API_URL}${message.avatar}`
                            : defaultavatar
                        }
                        alt={`${message.username}'s avatar`}
                        className="forumDetails-postAvatar"
                      />
                      <div className="forumDetails-postUserDate">
                        <span className="forumDetails-postUsername">
                          {message.username}
                        </span>
                        <span className="forumDetails-postDate">
                          {new Date(message.data).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="forumDetails-postContent">
                      {message.continut}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="forumDetails-pagination">
              <div className="forumDetails-pageNumbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={i + 1 === currentPage}
                    className={`pagination-button ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {userHasRights ? (
          <div className="div-input">
            <input
              type="text"
              className="input-message"
              placeholder="Tastează un mesaj nou..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
            />
            <button
              className="btnTrimite"
              onClick={async () => {
                await sendMessage();
                fetchMessages(currentPage);
              }}
            >
              Trimite
            </button>
          </div>
        ) : (
          <p className="p-no-rights">{pText}</p>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Forum;
