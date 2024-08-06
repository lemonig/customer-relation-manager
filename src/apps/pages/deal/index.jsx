import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { DndProvider, DragSource } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Dustbin } from "./components/Dustbin";
import StageBlock from "@Components/StageBlock";
import "./index.less";
import { reqD } from "./test";
import { dealFunnel } from "@Api/deal_list";
import { salesmanList } from "@Api/set_user";
import { deptList as deptListApi } from "@Api/set_dept.js";
import {
  Input,
  Button,
  DatePicker,
  Form,
  Select,
  Tooltip,
  Spin,
  Statistic,
  TreeSelect,
} from "antd";
import { saleList } from "@Api/set_sale";
import moment from "moment";
import { arrayToTree } from "@Utils/util";

import StaffTree from "@Shared/StaffTree";
import { EyeOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Deal() {
  const [treeVis, setTreeVis] = useState(false);
  let [stageArr, setstageArr] = useState([]);
  const [stageMsg, setStageMsg] = useState(null);
  const [searchForm] = Form.useForm();
  const [pipeline, setPipeline] = useState([]); //销售流程
  const [salerList, setSalerList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState([]);

  const [showTimepicker, setShowTimepicker] = useState(false);
  const staffTreeRef = useRef();

  useEffect(() => {
    getSalesmanList();
    getDeptList();
    getPlpeline().then((_) => {
      getPageData();
    });
  }, []);
  useEffect(() => {
    getPageData();
  }, [userId]);
  const getPlpeline = async () => {
    setLoading(true);
    let { data } = await saleList();
    searchForm.setFieldValue("pipelineId", data[0]?.id);
    setPipeline(data);
  };

  //销售人员
  const getSalesmanList = async () => {
    let { data } = await salesmanList();

    setSalerList(data);
  };
  //部门
  const getDeptList = async () => {
    let { data } = await deptListApi();
    let res = arrayToTree(data);
    setDeptList(res);
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (Array.isArray(values?.time) && values?.time.length > 0) {
      values.beginTime = moment(values.time[0]).format("YYYYMMDD");
      values.endTime = moment(values.time[1]).format("YYYYMMDD");
    }
    if (values.valueList) values.valueList = values.valueList.split(",");
    values.pipelineId = 1;
    let { data } = await dealFunnel({
      ...values,
      userIdList: userId,
    });
    setstageArr(data.detailCount);
    setStageMsg(data.totalCount);
    setLoading(false);
  };
  useLayoutEffect(() => {
    const abortController = new AbortController();
    // hadleData();
    // return () => abortController.abort();
  }, []);

  const hadleData = () => {
    for (let i of reqD) {
      let res = stageArr.find((j) => j.id === i.stage_id);
      res.data.push(i);
    }
  };
  const showPeopleTree = () => {
    setTreeVis(true);
  };

  const getRowSelected = (flag, val) => {
    setTreeVis(false);
    if (flag) {
      setUserId(val);
    }
  };

  const resetForm = () => {
    searchForm.resetFields();
    setUserId([]);
    getPageData();
    if (staffTreeRef.current) {
      staffTreeRef.current.resetVal(); // 调用子组件的方法
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="search" style={{ marginBottom: "0px" }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={getPageData}
          initialValues={{
            statusList: ["1"],
          }}
        >
          <Form.Item label="" name="name">
            <Input
              placeholder="请输入商机名称、商机编号、客户公司"
              style={{ width: 240 }}
              // value={searchVal}
            />
          </Form.Item>

          <Form.Item label="" name="statusList">
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
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>

          {showTimepicker ? (
            <>
              <Form.Item label="" name="valueList">
                <Select
                  style={{ width: 120 }}
                  options={[
                    {
                      label: "1000万以上",
                      value: "10000000",
                    },
                    {
                      label: "500~1000万",
                      value: "5000000,10000000",
                    },
                    {
                      label: "100~500万",
                      value: "1000000,5000000",
                    },
                    {
                      label: "0~100万",
                      value: "0,1000000",
                    },
                  ]}
                  placeholder="预算金额"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="" name="time">
                <RangePicker />
              </Form.Item>
            </>
          ) : null}

          <Form.Item>
            <Button onClick={resetForm}>重置</Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              onClick={() => setShowTimepicker(!showTimepicker)}
              icon={!showTimepicker ? <DownOutlined /> : <UpOutlined />}
              iconPosition="end"
            >
              {!showTimepicker ? "展开" : "收起"}
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <BtnAuth word="deal:create">
              <Button onClick={handleAdd}>新建</Button>
            </BtnAuth>
          </Form.Item> */}
          <Button type="text" onClick={showPeopleTree} icon={<EyeOutlined />}>
            {userId.length ? `已选择 ${userId.length} 人` : "按人员筛选"}
          </Button>
        </Form>
      </div>
      {stageMsg && (
        <div className="data-msg">
          商机: {stageMsg.total} 笔；
          <Tooltip title="预算：商机预算金额累加和">
            <span className="blue">预算</span>
          </Tooltip>
          : <Statistic value={stageMsg.pv} valueStyle={{ fontSize: "12px" }} />{" "}
          元；
          <Tooltip title="预测：上家预算金额加权和；加权由阶段机率、信心指数确定">
            <span className="blue"> 预测</span>
          </Tooltip>
          :{" "}
          <Statistic value={stageMsg.prev} valueStyle={{ fontSize: "12px" }} />{" "}
          元
        </div>
      )}
      <div className="deal-wrap">
        <div className="deal-stage-scroll">
          <div className="deal-stage">
            {stageArr.length > 0 &&
              stageArr.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="deal-stage-item">
                    <StageBlock
                      title={item.name}
                      msgPre={item.prev}
                      msgAft={item.num}
                    />
                    <DndProvider backend={HTML5Backend}>
                      <div className="deal-main">
                        <Dustbin data={item} />
                      </div>
                    </DndProvider>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>

        <StaffTree open={treeVis} getRowSelected={getRowSelected} />
      </div>
    </Spin>
  );
}

export default Deal;
