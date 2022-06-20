import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "./Loader";
import Paginate from "./Paginate";

const Giphy = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

       const [currentPage, setCurrentPage] = useState(1);
       const [itemsPerPage, setItemsPerPage] = useState(12);
       const indexOfLastItem = currentPage*itemsPerPage;
       const indexOfFirstItem = indexOfLastItem-itemsPerPage;
       const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

    useEffect(()=>{
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const results = await axios("https://api.giphy.com/v1/gifs/trending", {
                params: {
                    api_key: "8FTXvFvxB5xZ3BblXvdsAbhuSFM5Kiax",
                    limit: 50
                }
            });
            console.log(results);
            setData(results.data.data);
            
            } catch (err) {
                setIsError(true)
                setTimeout(() => {setIsError(false)
                    
                }, 4000);
            }
            
            

            setIsLoading(false);
        };
        fetchData();
    }, []);

    const renderGifs = () => {
        if(isLoading) {
            return <Loader/>;
        }
        return currentItems.map(el => {
            return (
              <div key={el.id} className="gif">
                <img src={el.images.fixed_height.url} alt="gif"/>
              </div>
            );
        });
    };
    const renderError = () => {
        if(isError){
            return(
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Unable to get Gifs, please try again in a few minutes
                </div>
            );
        }
    };
     
    const  handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
            event.preventDefault();
            setIsError(false);
            setIsLoading(true);

            try {
                const results = await axios("https://api.giphy.com/v1/gifs/search", {
                params:{
                    api_key: "8FTXvFvxB5xZ3BblXvdsAbhuSFM5Kiax",
                    q: search,
                    limit: 1000
                }
            });
            setData(results.data.data);
            } catch (err) {
                setIsError(true)
                setTimeout(() => {setIsError(false)
                    
                }, 4000);

            }
            
            
            setIsLoading(false);
        
    };
     
    const pageSelected = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    return ( 
        <div className="m-2">
            {renderError()}
            <form className="form-inline d-flex justify-content-center my-4">
                <input value={search} onChange={handleSearchChange} type="text" placeholder="search gifs"/>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary mx-2">Go</button>
            </form>
            <Paginate pageSelected={pageSelected} currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={data.length}/>
          <div className="container gifs">{renderGifs()}</div>
        </div>
    )
    
};

export default Giphy;
