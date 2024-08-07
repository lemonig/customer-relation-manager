import axios from "axios";
import { message } from "antd";
import { PUSH_LOADING, SHIFT_LOADING } from "@Store/features/loadSlice";
import { store } from "../../store";

axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  (config) => {
    store.dispatch(PUSH_LOADING());
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
    store.dispatch(SHIFT_LOADING());
    if (response.data && response.status === 200) {
      if (response.data instanceof Blob) {
        return Promise.resolve(response);
      }
      if (response.data.code === 401) {
        window.location.href = window.location.origin + "/loading";
      } else if (response.data.code === 403) {
      }
      else if (response.data.code !== 200) {
        return Promise.reject(response);
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
          message.error("401");
          localStorage.removeItem("token");
          window.location.href = window.location.origin + "/loading";
          break;
        case 403:
          message.error("403");
          window.location.href = window.location.origin + "/403";

          setTimeout(() => { }, 1000);
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
        message.error(err.message)
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

        message.error('error code:' + err.data.code + '   ' + err.data.message)
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
