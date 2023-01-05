import * as React from "react";
import { handleRouter } from "@Utils/menu";
const BodyLayout = React.lazy(() => import("@App/layout/lay-body"));
const NotFound = React.lazy(() => import("@App/pages-status/404")); // 404
const Noauthory = React.lazy(() => import("@App/pages-status/403")); // 403

const Login = React.lazy(() => import("@Pages/login"));
const LoadPage = React.lazy(() => import("@Pages/load-page"));
const WorkReportDownload = React.lazy(() =>
  import("@Pages/work-report-download")
);
/**
 * index: true 默认主路由不需要path
 * **/

const fouterFilter = () => {
  return (
    handleRouter().length &&
    handleRouter().map((item) => {
      let obj = {};
      if (item.auth) {
        Reflect.set(
          obj,
          "element",
          <React.Suspense fallback={<>...</>}>
            {React.createElement(
              React.lazy(() => import(`@Pages/${item.component}`))
            )}
          </React.Suspense>
        );

        if (item.index) {
          Reflect.set(obj, "index", item.index);
        } else {
          Reflect.set(obj, "path", item.path);
        }
        return obj;
      }
      // return item.auth
      //   ? {
      //       path: item.path,
      //       element: (
      //         <React.Suspense fallback={<>...</>}>
      //           {React.createElement(
      //             React.lazy(() => import(`@Pages/${item.component}`))
      //           )}
      //         </React.Suspense>
      //       ),
      //       index: !!item.index,
      //     }
      //   : null;
    })
  );
};

const config = [
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<>...</>}>
        <Login />,
      </React.Suspense>
    ),
  },
  {
    path: "blank",
    element: (
      <React.Suspense fallback={<>...</>}>
        <LoadPage />,
      </React.Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "workReportDetail1",
    element: <WorkReportDownload />,
  },
  {
    path: "403",
    element: <Noauthory />,
  },

  {
    path: "/",
    element: (
      <React.Suspense fallback={<>...</>}>
        <BodyLayout />
      </React.Suspense>
    ),
    children: fouterFilter(),
  },
];
export default config;
