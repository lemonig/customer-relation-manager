import React, { useEffect, useState } from "react";
import {
  Input,
  Space,
  Table,
  DatePicker,
  Form,
  Select,
  Switch,
  Tooltip,
} from "antd";
import moment from "moment";
import { activityFeeContribution as activityFeeContributionApi } from "@Api/analyse_staff";
import { useParams, NavLink } from "react-router-dom";
import SdTitle from "@Components/SdTitle";
import { InfoCircleFilled } from "@ant-design/icons";

function Table1() {
  const [searchForm] = Form.useForm();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [otherdata, setOtherdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTask, setShowTask] = useState(true);
  const [column, setColumn] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPageData(showTask);
  }, []);

  async function getPageData(flag) {
    let values = searchForm.getFieldsValue();
    if (values?.year) {
      values.year = moment(values.year).format("YYYY");
    }
    let res = await activityFeeContributionApi({
      ...values,
      userId: id,
    });

    setData(res.data);
    setOtherdata(res.additional_data.totalList);
    setLoading(false);
    let temp = [
      ...res.additional_data.columnList.map((item, idx) => {
        return {
          fixed: [0, 1].includes(idx) ? "left" : false,
          title: function () {
            if ([10, 11, 12, 13].includes(Number(item["key"].substring(4)))) {
              return (
                <span style={{ fontWeight: "bold" }} key={item.key}>
                  {item.label}
                </span>
              );
            }
            return <span>{item.label}</span>;
          },
          dataIndex: item.key,
          key: item.key,
          width: 150,
          render: (value) => tableRender(value, flag),
          sorter: item.sortable
            ? (a, b) => a[item.key]["value"] - b[item.key]["value"]
            : false,
        };
      }),
    ];
    setColumn(temp);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        // total: res.additional_data.pagination.total,
      },
    });
  }

  const onSwitchChange = (value) => {
    setShowTask(value);
    getPageData(value);
  };

  // 表单字段值变化时的回调
  const handleFormValuesChange = (changedValues, allValues) => {
    getPageData(showTask);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const $title = () => (
    <>
      <span>任务费用对商机贡献分析</span>
      <Tooltip
        title="当年完成的带费用的任务(按开始时间发生年份为当
年)，对商机阶段推进的贡献分析，查看不同商机阶段
发生的任务费用和个数。不包含未关联商机的任务或没
有发生费用的任务"
      >
        <span style={{ fontSize: "14px", cursor: "pointer" }}>
          <InfoCircleFilled />
        </span>
      </Tooltip>
    </>
  );
  return (
    <div>
      <SdTitle title={$title()}>
        <div className="search" style={{ marginBottom: "0px" }}>
          <Form
            layout="inline"
            form={searchForm}
            onValuesChange={handleFormValuesChange}
            initialValues={{
              year: moment(),
            }}
          >
            <Form.Item label="" name="name">
              <Input placeholder="请输入商机名称" style={{ width: 240 }} />
            </Form.Item>

            <Form.Item label="" name="year">
              <DatePicker picker="year" />
            </Form.Item>

            <Form.Item label="" name="status">
              <Select
                style={{ width: 120 }}
                options={[
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
                allowClear
              />
            </Form.Item>
          </Form>
          <Space>
            显示任务个数
            <Switch onChange={onSwitchChange} checked={showTask} />
          </Space>
        </div>
      </SdTitle>
      <Table
        columns={column}
        dataSource={data}
        loading={loading}
        pagination={pageMsg.pagination}
        rowKey={(record) => record.id}
        scroll={{
          x: (column.length - 1) * 150 + 60,
          y: 300,
        }}
        onChange={handleTableChange}
        summary={() => (
          <Table.Summary fixed={"bottom"}>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              {otherdata &&
                otherdata?.map((item, idx) => {
                  return (
                    <Table.Summary.Cell
                      index={idx + 1}
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
    </div>
  );
}

export default Table1;
function tableRender(value, showTask) {
  const dir = {
    赢单: "#389e0d",
    输单: "#ff4d4f",
    终止: "#ff4d4f",
  };
  if (!value) {
    return "-";
  }
  if ("id" in value) {
    return (
      <NavLink to={`/pipeline?pipelineId=${value.id}`}>{value.value}</NavLink>
    );
  }

  if ("num" in value) {
    return (
      <>
        <div>
          <span>{value.value}</span>
          {showTask ? <span>({value.num})</span> : null}
        </div>
      </>
    );
  }
  if (value.key == "key_2") {
    return (
      <span
        style={{
          color: dir[value.value],
        }}
      >
        {value.value}
      </span>
    );
  }
  return <span>{value.value}</span>;
}
