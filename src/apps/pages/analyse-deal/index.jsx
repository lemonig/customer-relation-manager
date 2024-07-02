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
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, NavLink } from "react-router-dom";
import { saleList } from "@Api/set_sale";
import { salesmanList } from "@Api/set_user";
import { changeDealList } from "@Api/deal_list";
import DrawerDeal from "@Shared/DrawerDeal";

const { Option } = Select;

function AnalyseDeal() {
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
      width: 50,
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

    if (values.userIdList) values.userIdList = [values.userIdList];
    // if (values.approveStatusList)
    //   values.approveStatusList = [values.approveStatusList];
    // if (values.valueList) values.valueList = values.valueList.split(",");
    changeDealList({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    }).then(({ data: getdata, additional_data, success }) => {
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
    });
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

    if (value.key == "key_2") {
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
    return <>{<span>{value.value}</span>}</>;
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="商机变化" />
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            status: "",
          }}
        >
          <Form.Item label="" name="status">
            <Select
              style={{ width: 120 }}
              options={[
                {
                  label: "全部",
                  value: "",
                },
                {
                  label: "创建中",
                  value: "0",
                },
                {
                  label: "进行中",
                  value: "1",
                },
                {
                  label: "赢单",
                  value: "2",
                },
                {
                  label: "输单",
                  value: "3",
                },
                {
                  label: "终止",
                  value: "4",
                },
              ]}
              placeholder="商机状态"
            />
          </Form.Item>
          <Form.Item label="" name="userId">
            <Select
              style={{ width: 120 }}
              options={salerList}
              placeholder="销售人员"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
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
        title={() => (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            共{pageMsg.pagination.total}项数据
          </div>
        )}
      />

      {drawerVis.deal && (
        <DrawerDeal
          width="10000"
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

export default AnalyseDeal;
