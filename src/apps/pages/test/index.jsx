import React, { useState } from "react";
import { Space, Table, Tag, Button, Modal, Form, Input } from "antd";
import EChartsReact from "echarts-for-react";
import * as ReactDOM from "react-dom";

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

function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFalag] = useState(false);
  const [list, setList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
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
  return (
    <div>
      {/* <Table columns={columns} dataSource={data} />
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Primary Button
      </Button>
      <Button onClick={() => setIsModalOpen(true)}>Primary Button</Button>
      <EChartsReact option={getOption()} /> */}
      <div
        dangerouslySetInnerHTML={{
          __html: textA,
        }}
      />
      {React.createElement("div", { className: "sidebar" }, "Click Me")}

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
        </Form>
      </Modal>
    </div>
  );
}

export default Test;
