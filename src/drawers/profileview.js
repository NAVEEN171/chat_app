import React, { Fragment, useState, useEffect } from "react";
import "./profile.css";
import { AiOutlineClose } from "react-icons/ai";
import { storage } from "../firebase";
import { v4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  deleteObject,
} from "firebase/storage";

const Profileview = ({
  bgimg,
  setbgimg,
  currentholder,
  currentchat,
  setshowprofile,
}) => {
  //console.log("in profile")
  //console.log(currentchat)
  const [selectedfile, setselectedfile] = useState(null);

  useEffect(() => {
    if (selectedfile === null) return;
    //console.log(selectedfile);
  }, [selectedfile]);

  const deletehandler = async () => {
    let dataio = await fetch(
      `${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/photos/uploads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: currentholder._id,
          to: currentchat._id,
          downurl: "",
        }),
      }
    );
    dataio = await dataio.json();
    //console.log(dataio)
    if (dataio) {
      //console.log(dataio.data.backgroundimage)
      deleteObject(ref(storage, bgimg));

      setbgimg(dataio.data.backgroundimage);
    }
  };

  const uploadfilehandler = async () => {
    //console.log("i am running")
    let url;
    if (selectedfile === null) return;
    const imageRef = ref(storage, `uploadimages/${selectedfile.name + v4()}`);
    let data = await uploadBytes(imageRef, selectedfile);
    if (data) {
      url = await getDownloadURL(data.ref);
      //console.log(url)
    }
    if (url) {
      let dataio = await fetch(
        `${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/photos/uploads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: currentholder._id,
            to: currentchat._id,
            downurl: url,
          }),
        }
      );
      dataio = await dataio.json();
      //console.log(dataio)
      if (dataio) {
        //console.log(dataio.data.backgroundimage)
        setbgimg(dataio.data.backgroundimage);
      }
    }
  };

  return (
    <Fragment>
      <div className="profileview-wrapper">
        <div className="namewrapper">
          <div className="users">{currentchat.username}</div>
          <AiOutlineClose
            onClick={() => {
              setshowprofile(false);
            }}
            style={{
              right: "15px",
              height: "20px",
              width: "20px",
              position: "absolute",
              cursor: "pointer",
            }}
          />
        </div>
        <img
          className="photopic"
          src={
            currentchat.avatarimage.startsWith("uploads")
              ? `${process.env.REACT_APP_DEPLOYMENT_BACKEND}/${currentchat.avatarimage}`
              : currentchat.avatarimage
              ? currentchat.avatarimage
              : "https://cdn4.iconfinder.com/data/icons/user-people-2/48/6-1024.png"
          }
        />
        <div className="changephotobutton">{currentchat.email}</div>
        <div className="theme">
          changetheme
          {bgimg !== "" && (
            <DeleteIcon
              onClick={() => {
                deletehandler();
              }}
              className="deleteicon"
            />
          )}
        </div>
        <div className="uploadwrapper">
          <input
            className="uploading"
            type="file"
            onChange={(e) => {
              setselectedfile(e.target.files[0]);
            }}
          />
          <button
            type="submit"
            onClick={() => {
              uploadfilehandler();
            }}
            className="setprofilee"
          >
            upload
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Profileview;
