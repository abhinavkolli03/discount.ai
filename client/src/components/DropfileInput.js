import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ImageConfig } from '../config/ImageConfig'; 
import uploadImg from '../media/cloud-upload-regular-240.png';

const DropFileInput = props => {
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [isValidFile, setIsValidFile] = useState(false);

    const onDragEnter = () => wrapperRef.current.classList.add('opacity-60');
    const onDragLeave = () => wrapperRef.current.classList.remove('opacity-60');
    const onDrop = () => wrapperRef.current.classList.remove('opacity-60');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const fileType = newFile.type;
            if (fileType === "text/csv" || fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel") {
                setIsValidFile(true);
                setFileList([newFile]);
                props.onFileChange([newFile]);
            } else {
                setIsValidFile(false);
                alert("Invalid file format! Please upload a CSV or Excel file.");
            }
        }
    }

    const fileRemove = (file) => {
        const updatedList = [];
        setFileList(updatedList);
        props.onFileChange(updatedList);
        setIsValidFile(false);
    }

    return (
        <div className="flex flex-col items-center">
            <div
                ref={wrapperRef}
                className="relative w-full md:w-[400px] h-[200px] border-2 border-dashed flex items-center justify-center bg-gray-200"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="text-center text-gray-600 font-semibold p-2.5">
                    <img src={uploadImg} alt="" className="w-[100px] mx-auto" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input 
                    type="file" 
                    value="" 
                    onChange={onFileDrop} 
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            {
                fileList.length > 0 ? (
                    <div className="w-full md:w-[400px] mt-7.5">
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="relative mt-10 flex items-center justify-between mb-2.5 bg-gray-100 p-3.5 rounded-lg shadow">
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" className="w-[50px] mr-5" />
                                    <div className="flex flex-col justify-between flex-grow">
                                        <p className="font-semibold text-gray-700">{item.name}</p>
                                        <p className="text-gray-500">{item.size}B</p>
                                    </div>
                                    <span className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center absolute top-1/2 right-2.5 transform -translate-y-1/2 cursor-pointer hover:bg-gray-400 transition-opacity duration-300" onClick={() => fileRemove(item)}>x</span>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </div>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
