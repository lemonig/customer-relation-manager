import React from "react";
import { Avatar } from "antd";
import "./index.less";
import { useEffect, useState } from "react";
import { userinfo as userinfoApi } from "@Api/analyse_staff";
import { useParams } from "react-router-dom";

function Head() {
  const { id } = useParams();
  const [userinfo, setUserinfo] = useState({});
  useEffect(() => {
    const getPageData = async () => {
      let res = await userinfoApi({
        userId: id,
      });
      setUserinfo(res.data);
    };
    getPageData();
  }, []);

  return (
    <div className="head-wrap">
      <div className="head-img">
        <Avatar
          style={{ background: "#87d068" }}
          src={userinfo?.avatar}
          onClick={(e) => e.preventDefault()}
        />
      </div>
      <div className="cover-title">{userinfo?.nickname}</div>
    </div>
  );
}

export default Head;
