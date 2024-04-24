import React from "react";
import { Avatar, PageHeader } from "antd";
import "./index.less";
import { useEffect, useState } from "react";
import { userinfo as userinfoApi } from "@Api/analyse_staff";
import { useParams, useNavigate } from "react-router-dom";

function Head() {
  let navigate = useNavigate();
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
      <PageHeader
        className="site-page-header"
        style={{ padding: "0 24px" }}
        onBack={() => navigate(-1, {})}
        title=" "
      />
      <div className="head-img">
        <Avatar
          style={{ background: "#87d068" }}
          src={userinfo?.avatar}
          onClick={(e) => e.preventDefault()}
          size={90}
        />
      </div>
      <div className="cover-title">{userinfo?.nickname}</div>
    </div>
  );
}

export default Head;
