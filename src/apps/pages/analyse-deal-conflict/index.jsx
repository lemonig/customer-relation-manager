import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Input,
  message,
  DatePicker,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, NavLink } from "react-router-dom";
import { saleList } from "@Api/set_sale";
import { salesmanList } from "@Api/set_user";
import { countConflictDealDeal } from "@Api/deal_list";
import DrawerDeal from "@Shared/DrawerDeal";
import moment from "moment";
import { InfoCircleFilled, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

function Index() {
  const [loading, setLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
  const [searchForm] = Form.useForm();
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [drawerVis, setDrawerVis] = useState({
    deal: false,
  });
  const [operateId, setOperateId] = useState(null);
  const [operateTxt, setOperateTxt] = useState(null);

  let navigate = useNavigate();
  useEffect(() => {
    getSalesmanList();
  }, []);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 70,
      fixed: true,
      render: (_, record, idx) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1,
    },
  ];

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };

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
    if (values.userIdList) values.userIdList = [values.userIdList];
    // if (values.approveStatusList)
    //   values.approveStatusList = [values.approveStatusList];
    // if (values.valueList) values.valueList = values.valueList.split(",");
    countConflictDealDeal(values).then(
      ({ data: getdata, additional_data, success }) => {
        if (!success) {
          return;
        }
        let newCol = additional_data.columnList.map((item) => {
          return {
            title: <p>{item.label}</p>,
            dataIndex: item.key,
            key: item.key,
            render: (value) => tableRender(value),
          };
        });

        getdata.forEach((item, idx) => {
          item.key = pageMsg.pagination.current + "-" + idx;
        });
        setColumns(newCol);
        setData(getdata);
        setLoading(false);
        setPagemsg({
          ...pageMsg,
          pagination: {
            ...pageMsg.pagination,
            total: additional_data.pagination.total,
          },
        });
      }
    );
  };

  const gotoDealDetail = (id) => {
    navigate({
      pathname: "/pipeline",
      search: `?pipelineId=${id}`,
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  function tableRender(value) {
    if (!value) {
      return "-";
    }

    if (value.key == "key_3") {
      return (
        <NavLink
          onClick={() => {
            setOperateId(value.id);
            setOperateTxt(value.value);
            setDrawerVis({
              ...drawerVis,
              deal: true,
            });
          }}
        >
          {value.value}
        </NavLink>
      );
    }
    if (["key_4"].includes(value.key)) {
      return (
        <Statistic value={value.value} valueStyle={{ fontSize: "12px" }} />
      );
    }

    return <>{<span>{value.value}</span>}</>;
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={
          <>
            <span>商机冲突发现</span>
            <Tooltip title="核实同一客户下不同销售跟进的商机，原则上一个商机只能由一个销售人员跟进">
              <span style={{ fontSize: "14px", cursor: "pointer" }}>
                <InfoCircleFilled style={{ color: "rgba(0,0,0,0.4)" }} />
              </span>
            </Tooltip>
          </>
        }
      />
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            time: [moment().subtract(2, "years"), moment()],
          }}
        >
          <Form.Item label="" name="time">
            <RangePicker allowClear={false} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={[...normalCol, ...columns]}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          ...pageMsg.pagination,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
        // title={() => (
        //   <div style={{ textAlign: "right", fontSize: "12px" }}>
        //     共{pageMsg.pagination.total}项数据
        //   </div>
        // )}
      />

      {drawerVis.deal && (
        <DrawerDeal
          width="1000"
          visible={drawerVis.deal}
          onClose={() =>
            setDrawerVis({
              ...drawerVis,
              deal: false,
            })
          }
          id={operateId}
          title={operateTxt}
        />
      )}
    </div>
  );
}

export default Index;
