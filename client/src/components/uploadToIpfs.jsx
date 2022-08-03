import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");


const Upload = () => {

    
    const [urlArr, setUrlArr] = useState([]);

    const initialFormData = Object.freeze({
        name: "",
        description: "",
        price : 0,
        file : {}
      });

    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
          ...formData,
          [e.target.name]: e.target.value.trim()
        });
      };

    const retrieveFile = (e) => {
      e.preventDefault();
      const data = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        updateFormData({
            ...formData,
            [e.target.file]: Buffer(reader.result)     
           
            });
        }
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    const {name, description, price } = formData;

    if (!name || !description || !price || !urlArr) return;

    const data = JSON.stringify({
        name, description, image : urlArr    
    })

      try {
        const created = await client.add(data);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        console.log(url);
        setUrlArr((prev) => [...prev, url]);
        console.log(urlArr);
        console.log(data);

      } catch (error) {
        console.log("erreur pendant l'upload");
        console.log(error.message);
      }
    };
  
    return (
      <div className="App">  
        <div className="main">
          <form  className="container mt-4" onSubmit={handleSubmit}>
            <input type="text" className="form-control" onChange={handleChange} required  name="name" id="name" placeholder="name" />
            <textarea name="description" id="description" onChange={handleChange} className="form-control" required  cols="20" rows="10"></textarea>
            <input type="file" onChange={retrieveFile} required className="form-control"  />
            <input type="text" className="form-control" required onChange={handleChange}  name="price" id="price" placeholder="price" />
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
