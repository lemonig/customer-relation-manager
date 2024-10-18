import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  PageHeader,
  DatePicker,
  Form,
  Tooltip,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { countActivityByPerson } from "@Api/analyse_staff";
import { InfoCircleFilled, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { SAVE_FORM } from "@Store/features/searchFormSlice";
import { salesmanList } from "@Api/set_user";
import StaffTree from "@Shared/StaffTree";
import { NavLink } from "react-router-dom";
import { SAVE_ID, DELETE_ID } from "@Store/features/staffTreeSlice";
import DrawerVisit from "@Shared/DrawerVisit";
const { RangePicker } = DatePicker;

function DealList() {
  let navigate = useNavigate();
  const [searchForm] = Form.useForm();
  let dispatch = useDispatch();
  const { form: preForm } = useSelector((state) => state.searchSlice);
  const [loading, setLoading] = useState(false);
  const [treeVis, setTreeVis] = useState(false);
  const [data, setData] = useState([]);
  const [otherdata, setOtherdata] = useState([]);
  const [column, setColumn] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [salerList, setSalerList] = useState([]);
  const [userId, setUserId] = useState([]);
  const [drawerVis, setDrawerVis] = useState({
    visit: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  useEffect(() => {
    getSalesmanList();
    getPageData();
  }, []);
  useEffect(() => {
    getPageData();
  }, [userId]);

  // 查询
  const search = () => {
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };
  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYY-MM-DD");
      values.endTime = moment(values.time[1]).format("YYYY-MM-DD");
    }

    countActivityByPerson({
      ...values,
      userIdList: userId,
    }).then((res) => {
      setData(res.data);
      setOtherdata(res.additional_data.totalList);
      setLoading(false);
      let temp = [
        ...res.additional_data.columnList.map((item, idx) => ({
          fixed: idx == 0 ? "left" : false,
          title: function () {
            return <span>{item.label}</span>;
          },
          dataIndex: item.key,
          key: item.key,
          width: 150,
          render: (value) => tableRender(value),
          sorter: item.sortable
            ? (a, b) => a[item.key]["value"] - b[item.key]["value"]
            : false,
        })),
      ];

      setColumn(temp);
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  function tableRender(value) {
    const beforeRoute = () => {
      let values = searchForm.getFieldsValue();
      let search = {};
      if (Array.isArray(values?.time) && values?.time.length > 0) {
        search.beginYear = moment(values.time[0]).format("YYYY");
        search.endYear = moment(values.time[1]).format("YYYY");
      }
      dispatch(
        SAVE_FORM({
          pageMsg: pageMsg.pagination,
          search: search,
        })
      );
    };
    if ("id" in value) {
      return (
        <NavLink to={`/analyseStaff/${value.id}`} onClick={beforeRoute}>
          {value.value}
        </NavLink>
      );
    }
    return <>{<span>{value.value}</span>}</>;
  }
  const showPeopleTree = () => {
    setTreeVis(true);
  };
  const getRowSelected = (flag, val) => {
    dispatch(DELETE_ID());
    setTreeVis(false);
    if (flag) {
      setUserId(val);
    }
  };

  return (
    <div className="deal-page">
      <PageHeader className="site-page-header" title="销售拜访统计" />

      <div className="search" style={{ marginBottom: "0px" }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            time: [moment().startOf("month"), moment()],
          }}
        >
          <Form.Item label="" name="time">
            <RangePicker allowClear={false} />
          </Form.Item>
          {/* <Form.Item label="" name="userIdList">
            <Select
              style={{ width: 200 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button type="text" onClick={showPeopleTree} icon={<EyeOutlined />}>
              {userId.length ? `已选择 ${userId.length} 人` : "按人员筛选"}
            </Button>
          </Form.Item>
        </Form>
        <div></div>
      </div>

      <Table
        scroll={{
          x: (column.length - 1) * 150 + 60 + 60,
        }}
        columns={[
          {
            title: "序号",
            key: "index",
            width: 60,
            fixed: "left",
            render: (_, record, index) =>
              pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
              index +
              1,
          },
          ...column,
          {
            title: "操作",
            key: "operation",
            width: 100,
            fixed: "right",
            render: (_, record) => {
              if ("id" in record.key_1) {
                return (
                  <NavLink
                    onClick={() => {
                      setOperateId(record.key_1.id);
                      setOperateTxt(record.key_1.value);
                      setDrawerVis({
                        ...drawerVis,
                        visit: true,
                      });
                    }}
                  >
                    查看详情
                  </NavLink>
                );
              }
            },
          },
        ]}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        title={() => (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            共{data.length}项数据
          </div>
        )}
        summary={() => (
          <Table.Summary fixed={"bottom"}>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              {otherdata &&
                otherdata?.map((item, idx) => {
                  return (
                    <Table.Summary.Cell
                      key={idx}
                      style={{ textAlign: "center" }}
                    >
                      {item.value}
                    </Table.Summary.Cell>
                  );
                })}
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <StaffTree open={treeVis} getRowSelected={getRowSelected} />

      {drawerVis.visit && (
        <DrawerVisit
          width="1000"
          visible={drawerVis.visit}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              visit: false,
            })
          }
          id={operateId}
          time={{
            beginTime: moment(searchForm.getFieldsValue().time[0]).format(
              "YYYY-MM-DD"
            ),
            endTime: moment(searchForm.getFieldsValue().time[1]).format(
              "YYYY-MM-DD"
            ),
          }}
          title={operateTxt}
        />
      )}
    </div>
  );
}

export default DealList;
