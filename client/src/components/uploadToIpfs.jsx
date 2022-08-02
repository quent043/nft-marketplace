import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

const Upload = () => {

    const [file, setFile] = useState();
    const [urlArr, setUrlArr] = useState([]);
  
    const retrieveFile = (e) => {
      const data = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
  
      reader.onloadend = () => {
        setFile(Buffer(reader.result));
      };
  
      e.preventDefault();
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {

        const created = await client.add(file);
        console.log(created);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        console.log(url);

        setUrlArr((prev) => [...prev, url]);

        console.log(urlArr);

      } catch (error) {
        console.log("erreur pendant l'upload");
        console.log(error.message);
      }
    };
  
    return (
      <div className="App">  
        <div className="main">
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={retrieveFile} multiple accept='image/png , image/jpg' />
            <button type="submit" className="button">Submit</button>
          </form>
        </div>
  
        <div className="display">
          {urlArr.length !== 0
            ? urlArr.map((el) => <img src={el} key={el} alt="nfts" />)
            : <h3>Upload data</h3>}
        </div>

      </div>
    );
  };

export default Upload;