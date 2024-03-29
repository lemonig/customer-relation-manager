const menu = [
  {
    id: 1,
    pid: 0,
    key: 1,
    path: "/",
    name: "workCalendar",
    component: "work-calendar",
    auth: true,
    label: "工作台历",
    icon: "V",
    isleaf: true,
    index: true,
  },

  {
    key: 2,
    id: 2,
    pid: 0,
    path: "",
    name: "",
    component: "layout",
    label: "商机管理",
    icon: "feiyongduoweifenxi",
    isleaf: false,
  },
  {
    key: 3,
    id: 3,
    pid: 0,
    path: "",
    name: "",
    component: "layout",
    label: "行为管理",
    icon: "shichanghuodong",
    isleaf: false,
  },
  {
    key: 8,
    id: 8,
    pid: 0,
    path: "",
    name: "",
    component: "layout",
    label: "费用控制",
    icon: "feiyong",
    isleaf: false,
  },
  {
    key: 994,
    id: 994,
    pid: 8,
    path: "feeFefund",
    name: "feeFefund",
    component: "fee-refund",
    auth: true,
    label: "报销统计",
    isleaf: true,
  },
  {
    key: 993,
    id: 993,
    pid: 8,
    path: "feeSetting",
    name: "feeSetting",
    component: "fee-set",
    auth: true,
    label: "费用设置",
    isleaf: true,
  },

  {
    key: 4,
    id: 4,
    path: "pipeline",
    name: "pipeline",
    component: "deal-detail",
    auth: true,
    label: "商机详情",
    icon: "",
    isleaf: true,
  },
  {
    key: 999,
    id: 999,
    pid: 2,
    path: "dealList",
    name: "dealList",
    component: "deal-list",
    auth: true,
    label: "商机列表",
    isleaf: true,
  },
  {
    key: 5,
    id: 5,
    pid: 2,
    path: "deal",
    name: "deal",
    component: "deal",
    auth: true,
    label: "商机漏斗",
    isleaf: true,
  },

  {
    key: 998,
    id: 998,
    path: "dealEdit",
    name: "dealEdit",
    component: "deal-edit",
    auth: true,
    label: "商机编辑",
    isleaf: true,
  },

  {
    key: 996,
    id: 996,
    pid: 2,
    path: "dealConfirm",
    name: "deal-confirm",
    component: "deal-confirm",
    auth: true,
    label: "商机确认",
    isleaf: true,
  },

  {
    key: 6,
    id: 6,
    pid: 3,
    path: "workPlan",
    name: "workPlan",
    component: "work-plan",
    auth: true,
    label: "销售计划",
    isleaf: true,
  },
  {
    key: 7,
    id: 7,
    pid: 3,
    path: "workReport",
    name: "WorkReport",
    component: "work-report",
    auth: true,
    label: "工作报告",
    isleaf: true,
  },
  {
    key: 995,
    id: 995,
    path: "workReportDetail",
    name: "WorkReportDetail",
    component: "work-report-detail",
    auth: true,
    label: "工作报告详情",
    isleaf: true,
  },
  {
    key: 997,
    id: 997,
    pid: 0,
    path: "contract",
    name: "contract",
    component: "contract",
    auth: true,
    label: "合同管理",
    icon: "hetong",
    isleaf: true,
  },
  {
    key: 15,
    id: 15,
    pid: 0,
    path: "",
    name: "",
    component: "",
    auth: true,
    label: "信息维护",
    icon: "gongsi2",
    isleaf: false,
  },
  {
    key: 16,
    id: 16,
    pid: 15,
    path: "",
    name: "",
    component: "",
    auth: true,
    label: "客户管理",
    isleaf: false,
  },
  {
    key: 17,
    id: 17,
    pid: 16,
    path: "msgCompany",
    name: "msgCompany",
    component: "msg-company",
    auth: true,
    label: "客户公司",
    isleaf: true,
  },
  {
    key: 18,
    id: 18,
    pid: 16,
    path: "MsgCustomer",
    name: "MsgCustomer",
    component: "msg-customer",
    auth: true,
    label: "联系人",
    isleaf: true,
  },
  {
    key: 20,
    id: 20,
    pid: 15,
    path: "msgCooprate",
    name: "msgCooprate",
    component: "msg-cooprate",
    auth: true,
    label: "合作伙伴",
    isleaf: true,
  },
  {
    key: 201,
    id: 201,
    pid: null,
    path: "msgCoopratePeople",
    name: "msgCoopratePeople",
    component: "msg-cooperate-people",
    auth: true,
    label: "合作伙伴",
    isleaf: true,
  },
  {
    key: 21,
    id: 21,
    pid: 15,
    path: "msgAgent",
    name: "msgAgent",
    component: "msg-agent",
    auth: true,
    label: "招标代理",
    isleaf: true,
  },
  {
    key: 31,
    id: 31,
    pid: null,
    path: "msgAgentLink",
    name: "msgAgentLink",
    component: "msg-agent-link",
    auth: true,
    label: "",
    isleaf: true,
  },

  {
    key: 22,
    id: 22,
    pid: 15,
    path: "msgOppnent",
    name: "msgOppnent",
    component: "msg-oppnent",
    auth: true,
    label: "竞争对手信息库",
    isleaf: true,
  },
  {
    key: 23,
    id: 23,
    pid: 15,
    path: "msgExpert",
    name: "msgExpert",
    component: "msg-expert",
    auth: true,
    label: "专家库",
    isleaf: true,
  },
  {
    key: 30,
    id: 30,
    pid: 15,
    path: "productManage",
    name: "product-manage",
    component: "product-manage",
    auth: true,
    label: "产品管理",
    isleaf: true,
  },

  {
    key: 24,
    id: 24,
    pid: 0,
    path: "",
    name: "",
    component: "",
    auth: true,
    label: "系统设置",
    isleaf: false,
    icon: "shezhi",
  },
  {
    key: 25,
    id: 25,
    pid: 24,
    path: "settingActive",
    name: "setting-active",
    component: "setting-active",
    auth: true,
    label: "活动类型",
    isleaf: true,
  },
  {
    key: 26,
    id: 26,
    pid: 24,
    path: "settingLose",
    name: "setting-lose",
    component: "setting-lose",
    auth: true,
    label: "丢单原因",
    isleaf: true,
  },
  {
    key: 28,
    id: 28,
    pid: 24,
    path: "settingAbort",
    name: "setting-abort",
    component: "setting-abort",
    auth: true,
    label: "终止原因",
    isleaf: true,
  },
  {
    key: 27,
    id: 27,
    pid: 24,
    path: "settingSale",
    name: "setting-sale",
    component: "setting-sale",
    auth: true,
    label: "销售流程",
    isleaf: true,
  },
  {
    key: 29,
    id: 29,
    pid: null,
    path: "settingSaleStage",
    name: "setting-sale-stege",
    component: "setting-sale-stage",
    auth: true,
    label: "销售流程阶段",
    isleaf: true,
  },
  {
    key: 32,
    id: 32,
    pid: 24,
    path: "settingUser",
    name: "setting-user",
    component: "setting-user",
    auth: true,
    label: "用户管理",
    isleaf: true,
  },

  // {
  //   key: 99,
  //   id: 99,
  //   pid: 0,
  //   path: "test",
  //   name: "test",
  //   component: "test",
  //   auth: true,
  //   label: "测试",
  //   icon: "feiyong",
  //   isleaf: true,
  // },
];

export default menu;
