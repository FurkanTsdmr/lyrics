import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useEffect("");
    const [result, setResults] = useState([]);
    const [lyrics, setLyrics] = useState("");
    const [pagination, setPagination] = useState({prev:null,next:null});
    const navigate = useNavigate();

    const apiURL = "https://api.lyrics.ovh";

    // Şarkı Arama Fonksiyonu
    const searchSongs = async (term) =>{
        try{
            const res = await fetch(`${apiURL}/suggest/${term}`);
            const data = await res.json();
            showData(data);
        }catch(error){
            console.error("Error fetching songs : " , error);
            showAlert("Error fetching songs");
        }
    }


    // Şarkı sözlerini getirtme fonksiyonu
    const getLyrics = async (artist, songTitle) =>{
        try {     
            const rest = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
            const data = await res.json(); 
            if(data.error){
                showAlert(data.error);
            }else{
                const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"<br>");
                setLyrics(`
                    <h2><strong>${artist} - ${songTitle}</strong></h2>
                    <span>${lyrics}</span>
                    `);
            }
            setPagination({prev:null, next:null})
        } catch (error) {
            console.error("Error fetching lyrics: ", error);
            showAlert("Error fetching lyrics");
        }
    };

    // Diğer şarkıları getirme fonksinou
    const getMoreSongs = async(url)=>{
        try {
            const res = await fetch(`https://cors-anywhere.herokruapp.com/${url}`);
            const data = await res.json();
            showData(data);
        } catch (error) {
            console.error("Error fetching more songs: ", error);
            showAlert("Error fetching more songs");
        }
    };


    // Şarkı listesi ve sayfalama verilerini işleme
    const showData=(data)=>{
        setResults(data.data);
        setPagination({prev:data.prev, next:data.next});
    };


    // Bildirim mesajı gösterme
    const showAlert=(message)=>{
        const notif = document.createElement("div");
        notif.classList.add("toast");
        notif.innerText(message);
        document.body.appendChild(notif);
        setTimeout(()=>notif.remove(),2000);
    };

    // Form gönderimini işleme
    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!searchTerm.trim()){
            showAlert("Error fetching more songs");
        }else{
            searchSongs(searchTerm.trim());
        }
    };

    // Bileşen ilk yüklendiğinde bir varsayılan arama yapıyoruz
    useEffect(() =>{
        searchSongs("one");
    },[]);

    return ( 
        <div>

            <button onClick={()=> navigate("/")}>HomePage</button>{/* Ana sayfaya dönen buton */}
            <form onSubmit={handleSubmit}>
                <input 
                type="text"
                id="search"
                value={setSearchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                placeholder="Search for songs..."
                 />
                 <button type="submit">Search</button>
            </form>
        </div>
     );
};

export default Search;