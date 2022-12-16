import React, { useState } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Statistic,
  Tooltip,
} from "antd";
import EChartsReact from "echarts-for-react";
import * as ReactDOM from "react-dom";
import MyTimePicker from "@Components/MyTimePicker";
import IconFont from "@Components/IconFont";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
const img =
  "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp";

const ImgItem = ({ id, waitRender }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
    <img src={img} width={200} alt="" />
    列表{id}
  </div>
);
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFalag] = useState(false);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const [date, setDate] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    console.log(values);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //echarts 配置
  const toolTipFun = (params) => {
    let html = `<div>${params[0].axisValue}</div>`;

    params.map((item) => {
      if (item.value || item.value === 0) {
        html += `<div>${item.marker} ${item.seriesName}：${item.value} %</div>`;
      }
    });
    return html;
  };
  const getOption = () => {
    let xData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let yData1 = [23, 24, 18, 25, 27, 28, 25];
    let yData2 = [23, 24, 18, 25, 27, 28, 25];
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          return toolTipFun(params);
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        // max: 100,
      },
      yAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          interval: 0,
          // rotate: 30,
        },
      },
      series: [
        {
          name: "达标率",
          barGap: 0,
          type: "bar",
          data: yData1,
          itemStyle: {
            normal: {
              color: "#1C47BF",
            },
          },
          // label: {
          //   show: true,
          //   position: 'outside',
          //   formatter: ' {@score}%',
          // },
          barMaxWidth: "20",
        },
        {
          name: "同比",
          type: "bar",
          data: yData2,
          itemStyle: {
            normal: {
              color: "#DA4688",
            },
          },
          // label: {
          //   show: true,
          //   position: 'outside',
          //   formatter: ' {@score}%',
          // },
          barMaxWidth: "20",
        },
      ],
    };
    return option;
  };
  let textA = "<a>xxx</a>";
  console.log(textA.substring(1, textA.length - 2));

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
    // if (Number.isNaN(date)) {
    //   return;
    // }
    // if (!("date" in value)) {
    //   setDate(date);
    // }
    setDate(date);
  };
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Primary Button
      </Button>
      <Button onClick={() => setIsModalOpen(true)}>Primary Button</Button>
      <EChartsReact option={getOption()} lazyUpdate={true} />
      <MyTimePicker />
      <div
        dangerouslySetInnerHTML={{
          __html: textA,
        }}
      />
      {React.createElement("div", { className: "sidebar" }, "Click Me")}
      <IconFont iconName="ren" size={18}></IconFont>
      <IconFont iconName="icon-test " size="32" />;
      <IconFont iconName="huodong" color="#87d068" size="32" />
      <IconFont iconName="renminbi" color="#d48806" size="32"></IconFont>
      <Form name="deal-edit" {...formItemLayout} form={form}>
        {/* <div className="ant-descriptions-title">基本信息</div> */}

        <Statistic
          prefix={
            <Tooltip title="prompt text">
              <span>Active Users</span>
            </Tooltip>
          }
          value={112893}
        />

        <Row gutter={24}>
          <Col span={11}>
            <Form.Item name="code" label="商机编号">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label="项目名称" name="title">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button
        onClick={async () => {
          let arr = [];
          console.time();
          for (let i = 0; i < 10000; i++) {
            arr.push(i);
          }
          setList(arr);
          setFalag(true);
          await 1;
          console.log("执行---");
          console.timeEnd();
        }}
      >
        渲染
      </Button>
      {flag && list.map((item) => <ImgItem id={item} key={item} />)}
      {/* 弹出表单 */}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <DatePicker onChange={onDateChange} value={date} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Test;
