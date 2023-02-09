import { useSelector } from "react-redux";

function BtnAuth({ word, children }) {
  // const user = useSelector((state) => state.user);
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.permissions.find((ele) => ele === word) ? children : null;
}

export default BtnAuth;
