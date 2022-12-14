import axios from "axios";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PUSH_LOADING, SHIFT_LOADING } from "@Store/features/loadSlice";

axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  (config) => {
    PUSH_LOADING();
    config.headers = {
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
    };
    if (localStorage.getItem("token") || !!localStorage.getItem("token")) {
      config.headers["token"] = localStorage.getItem("token");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    SHIFT_LOADING();
    if (response.data && response.status === 200) {
      if (response.data.code === 401) {
        // window.history.pushState('', null, '/login')
        window.location.href = "./login";
      }
      return Promise.resolve(response);
    } else {
      message.error(response.data.message);
      return Promise.reject(response);
    }
  },

  (error) => {
    SHIFT_LOADING();
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          message.error("403");
          localStorage.removeItem("token");
          setTimeout(() => {}, 1000);
          break;
        case 404:
          message.error("404");
          break;
        case 504:
          message.error("504");
          break;
        // 其他错误，直接抛出错误提示
        default:
          message.error(error.response.statusText);
      }
      return Promise.reject(error.response);
    }
  }
);

const ssoLogin = () => {
  _post("api/sso/getSsoAuthUrl", {
    clientLoginUrl: `${window.location.origin}/#/passport/login`,
  }).subscribe((res) => {
    if (res.data.isLogin) {
    } else {
      window.location.href = res.data.serverAuthUrl;
    }
  });
};

/**
 * get
 * @param url
 * @param params
 * @returns {Promise<unknown>}
 * @private
 */
export const _get = ({ url, params }) => {
  return new Promise((rlv, rej) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        rlv(res);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

/**
 * post
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 * @private
 */
export const _post = ({ url, data }) => {
  return new Promise((rlv, rej) => {
    axios
      .post(url, data, {})
      .then((res) => {
        rlv(res.data);
      })
      .catch((err) => {
        rej(err.data);
      });
  });
};

export const _download = ({ url, data, title }) => {
  let nowDate = new Date();
  let day = nowDate.getDate();
  let month = nowDate.getMonth() + 1;
  let year = nowDate.getFullYear();
  return axios({
    method: "post",
    url: url,
    data: data,
    responseType: "blob",
  }).then((res) => {
    let result = res.data;
    var blob = new Blob([result], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    a.setAttribute("href", objectUrl);
    a.setAttribute("download", `${title}-${year}-${month}-${day}.xls`);
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
};
export const _downloadPdf = ({ url, data, title }) => {
  let nowDate = new Date();
  let day = nowDate.getDate();
  let month = nowDate.getMonth() + 1;
  let year = nowDate.getFullYear();
  return axios({
    method: "post",
    url: url,
    data: data,
    responseType: "blob",
  }).then((res) => {
    let result = res.data;
    var blob = new Blob([result], {
      type: "application/pdf",
    });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    a.setAttribute("href", objectUrl);
    a.setAttribute("download", `${title}-${year}-${month}-${day}.pdf`);
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
};
