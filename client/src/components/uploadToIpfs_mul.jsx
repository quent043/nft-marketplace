// MultipleFilesUpload Component : Uploads Multiple files to IPFS and returns the URL
import React, { useState, useEffect } from 'react'
import { MultipleFilesUpload } from 'react-ipfs-uploader'

const UploadMultiple = () => {
    const [multipleFilesUrl, setMultipleFilesUrl] = useState('')
    const [files, setFiles] = useState();

      const retrieveFile = (e) => {
      const data = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
  
      reader.onloadend = () => {
        setFiles(Buffer(reader.result));
      };
      JSON.stringify(files);
      e.preventDefault();
    };
    
    return (
        <div>
            <MultipleFilesUpload onChange={retrieveFile} setUrl={setMultipleFilesUrl} />
            MultipleFilesUrl : <a
                href={multipleFilesUrl}
                target='_blank'
                rel='noopener noreferrer'
            >
                {multipleFilesUrl}
            </a>

        </div>
    )
}

export default UploadMultiple