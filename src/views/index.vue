<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { ElMessage, ElMessageBox } from "element-plus";
// import editDialog from "./components/editDialog.vue";
import editDialog from "./system/report/components/editDialog.vue";
import zipUpload from "./system/report/components/zipUpload.vue";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import ImgUpload from "./system/report/components/imgUpload.vue";
dayjs.locale("zh-cn");

import { RefreshRight } from "@element-plus/icons-vue";

const showToast = useThrottleFn((type = "success", message) => {
  ElMessage({
    type,
    message,
  });
}, 2000);

const dayText = dayjs().format("M月D日 dddd");

const strategySteps = ref([
  {
    title: "策略配置",
    value: "配置策略",
  },
  {
    title: "推送范围",
    value: "推送范围",
  },
  {
    title: "执行推送",
    value: "执行推送",
  },
]);
const currentStep = ref(1);
const isFirstStep = computed(() => currentStep.value <= 1);
const isLastStep = computed(
  () => currentStep.value >= strategySteps.value.length
);

const handlePrev = () => {
  if (isFirstStep.value) {
    ElMessage.warning("已经是第一步了");
    return;
  }
  currentStep.value--;
};

const handleNext = () => {
  if (isLastStep.value) {
    ElMessage.warning("已经是最后一步了");
    return;
  }

  switch (currentStep.value) {
    case 1:
      // 应用配置 builtConfigs.value
      console.log("1", builtConfigs.value);

      // 限制功能 strategyConfig
      console.log("1", strategyConfig);

      // 配置项 壁纸
      console.log("1", configureConfig);

      break;
    case 2:
      break;
    default:
      break;
  }

  const allHasPackageName = builtConfigs.value.every(
    (item) => item.packageNames
  );
  if (!allHasPackageName) {
    showToast("warning", "请检查应用配置是否有包名未填写");
    return;
  }

  currentStep.value++;
};

const strageConfig = reactive({
  currentTab: "app",
});
const pushRange = reactive({
  currentTab: "organizational",
  organizationalList: [
    {
      id: 1,
      label: "Level one 1",
      org: "组织",
      children: [
        {
          id: 4,
          label: "Level two 1-1",
          org: "组织",

          children: [
            {
              id: 9,
              label: "Level three 1-1-1",
              org: "组织",
            },
            {
              id: 10,
              label: "Level three 1-1-2",
              org: "组织",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "Level one 2",
      org: "组织",

      children: [
        {
          id: 5,
          label: "Level two 2-1",
          org: "组织",
        },
        {
          id: 6,
          label: "Level two 2-2",
          org: "组织",
        },
      ],
    },
    {
      id: 3,
      label: "Level one 3",
      org: "组织",

      children: [
        {
          id: 7,
          label: "Level two 3-1",
          org: "组织",
        },
        {
          id: 8,
          label: "Level two 3-2",
          org: "组织",
        },
      ],
    },
  ],
  selectedOrgs: [],
  // userList: [
  //   {
  //     key: "option1",
  //     label: "option1",
  //   },
  //   {
  //     key: "option2",
  //     label: "option2",
  //   },
  //   {
  //     key: "option3",
  //     label: "option3",
  //     disabled: true,
  //   },
  // ],
  // userSelectedList: [],
  deviceList: [
    {
      key: "option11",
      label: "option11",
    },
    {
      key: "option21",
      label: "option21",
      disabled: true,
    },
    {
      key: "option31",
      label: "option31",
    },
  ],
  deviceSelectedList: [],
});

const filterText = ref("");
const treeRef = ref();
const defaultProps = {
  children: "children",
  label: "label",
};

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});
watch(
  currentStep,
  async (val) => {
    if (val === 2) {
      await nextTick();
      const checkedKeys = (pushRange.selectedOrgs || []).map((o: any) => o.id);
      if (treeRef.value && Array.isArray(checkedKeys)) {
        treeRef.value.setCheckedKeys(checkedKeys, false);
      }
    }
  },
  { immediate: false }
);
const handleCheck = () => {
  pushRange.selectedOrgs = treeRef.value.getCheckedNodes();
};

const hanldeRemove = (item: any) => {
  const index = pushRange.selectedOrgs.findIndex((org) => org.id === item.id);
  if (index !== -1) {
    pushRange.selectedOrgs.splice(index, 1);
  }

  if (treeRef.value) {
    treeRef.value.setChecked(item.id, false, false);
  }
};

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const isShowExtraBtn = ref(false);
const toggleExtraBtn = () => {
  isShowExtraBtn.value = !isShowExtraBtn.value;
};

const getAssetsImg = (path) => {
  return new URL(`/src/assets/images/${path}`, import.meta.url).href;
};

const strategyConfig = reactive({
  strageName: "策略名称",
  strageDescription: "",
  strategyList: [
    {
      id: 1,
      name: "蓝牙",
      icon: "ly.png",
      enabled: false,
      description: "",
      options: [
        {
          id: 11,
          label: "禁止使用蓝牙",
          value: "disable_wifi",
          selected: false,
          description: "",
        },
        {
          id: 12,
          label: "强制开启蓝牙",
          value: "enable_wifi",
          selected: false,
          description: "",
        },
      ],
      selectedOption: 11,
    },
    {
      id: 2,
      name: "Wi-Fi网络",
      icon: "wifi.png",
      enabled: false,
      description: "",
      options: [
        {
          id: 21,
          label: "禁止使用Wi-Fi网络",
          value: "disable_wifi",
          selected: false,
          description: "",
        },
        {
          id: 22,
          label: "强制开启Wi-Fi网络",
          value: "enable_wifi",
          selected: false,
          description: "",
        },
      ],
      selectedOption: 21,
    },
    {
      id: 3,
      name: "热点管控",
      icon: "hot.png",
      enabled: false,
      description: "",
      options: [
        {
          id: 31,
          label: "禁止使用热点管控",
          value: "disable_wifi",
          selected: false,
          description: "",
        },
        {
          id: 32,
          label: "强制开启热点管控",
          value: "enable_wifi",
          selected: false,
          description: "",
        },
      ],
      selectedOption: 31,
    },
  ],

  currentTab: 1,
  tabs: [
    {
      label: "功能限制",
      value: 1,
      enable: false,
    },
    // {
    //   label: "高级限制",
    //   value: 2,
    //   enable: false,
    // },
  ],
});

const selectedStrategies = ref([
  {
    strageName: strategyConfig.strageName,
    strageDescription: strategyConfig.strageDescription,
  },
]);
const handleRefresh = (data) => {
  strategyConfig.strageName = data.strategy;
  strategyConfig.strageDescription = data.description;
  selectedStrategies.value = [
    {
      strageName: data.strategy,
      strageDescription: data.description,
    },
  ];
};

function createTabBinding(getTabs, getActive) {
  const item = computed(() => getTabs().find((t) => t.value === getActive())!);
  const enabled = computed({
    get: () => (item?.value ? item.value.enable : false),
    set: (val: boolean) => {
      if (item?.value) item.value.enable = val;
    },
  });
  return { item, enabled };
}

const { enabled: currentLimitTabEnabled } = createTabBinding(
  () => strategyConfig.tabs,
  () => strategyConfig.currentTab
);

const builtConfigs = ref([
  {
    id: 1,
    name: "已建配置1",
    packageNames: "",
    features: [
      { key: "keepAlive", label: "应用保活", enabled: false },
      { key: "uninstall", label: "应用卸载", enabled: false },
      { key: "autoStart", label: "应用自启动", enabled: false },
    ],
    basePermissions: [
      { key: "perm1", label: "权限1", enabled: false },
      { key: "perm2", label: "权限2", enabled: false },
      { key: "perm3", label: "权限3", enabled: false },
    ],
  },
]);

const currentConfigId = ref(1);

const handleAddConfig = () => {
  if (builtConfigs.value.length) {
    const lastConfig = builtConfigs.value[builtConfigs.value.length - 1];
    const pkg = (lastConfig.packageNames || "").trim();
    if (!pkg) {
      currentConfigId.value = lastConfig.id;
      showToast("warning", "请先填写上一个配置的包名");
      return;
    }
  }
  const newId = builtConfigs.value.length
    ? Math.max(...builtConfigs.value.map((c) => c.id)) + 1
    : 1;
  builtConfigs.value.push({
    id: newId,
    name: `已建配置${newId}`,
    packageNames: "",
    features: [
      { key: "keepAlive", label: "应用保活", enabled: false },
      { key: "uninstall", label: "应用卸载", enabled: false },
      { key: "autoStart", label: "应用自启动", enabled: false },
    ],
    basePermissions: [
      { key: "perm1", label: "权限1", enabled: false },
      { key: "perm2", label: "权限2", enabled: false },
      { key: "perm3", label: "权限3", enabled: false },
    ],
  });
  currentConfigId.value = newId;
};

const handleRemoveConfig = (id: number) => {
  if (builtConfigs.value.length <= 1) {
    ElMessage.warning("至少要保留一个配置！");
    return;
  }
  ElMessageBox.confirm("确认删除该配置？", "删除配置", {
    type: "warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
  })
    .then(() => {
      const idx = builtConfigs.value.findIndex((c) => c.id === id);
      if (idx !== -1) {
        builtConfigs.value.splice(idx, 1);
        if (currentConfigId.value === id) {
          currentConfigId.value =
            builtConfigs.value[builtConfigs.value.length - 1].id;
        }
        ElMessage.success("已删除配置");
      }
    })
    .catch(() => {});
};

const currentConfig = computed(
  () => builtConfigs.value.find((c) => c.id === currentConfigId.value)!
);

const configureConfig = reactive({
  currentTab: 1,
  tabs: [
    {
      label: "壁纸",
      value: 1,
      enable: false,
    },
    {
      label: "物联网卡配置",
      value: 2,
      enable: false,
    },
    {
      label: "锁屏",
      value: 3,
      enable: false,
    },
    {
      label: "开机动画",
      value: 4,
      enable: false,
    },
  ],
  // phoneDefaultPic: "default.png", //test.jpeg
  phonePicLockScreen: "default.png",
  phonePicMainScreen: "default.png",
  selectedInternetConfig: "voice-centric",
  internetCobnfigure: [
    {
      label: "voice-centric",
      value: "voice-centric",
      desc: "注册为语音中心",
    },
    {
      label: "data-centric",
      value: "data-centric",
      desc: "注册为数据中心",
    },
  ],
  bootAnimationZip: "",
  bootVoiceZip: "",
});

const handleTogglePic = () => {
  configureConfig.phonePicLockScreen = "test.jpeg";
  configureConfig.phonePicMainScreen = "test.jpeg";
};

const { enabled: currentTabEnabled } = createTabBinding(
  () => configureConfig.tabs,
  () => configureConfig.currentTab
);

const editDialogRef = ref();
const handleEdit = () => {
  editDialogRef.value.open("编辑", {
    strageName: strategyConfig.strageName,
    strageDescription: strategyConfig.strageDescription,
  });
};
</script>

<template>
  <div class="detail-box">
    <div class="top-banner">
      <div class="text">
        <span>添加Android策略</span>
        <div class="btns" v-if="currentStep === 3">
          <el-button type="primary">保存</el-button>
          <el-button type="primary">保存并推送</el-button>
          <el-button type="primary">返回列表</el-button>
        </div>
      </div>
    </div>

    <div class="strategy-container">
      <div class="left-panel">
        <div class="strage-name_box">
          <div class="strage-name">{{ strategyConfig.strageName }}</div>
          <div class="edit" @click="handleEdit">
            <el-icon> <Edit /></el-icon>
            <span>编辑</span>
          </div>
        </div>

        <div style="height: 300px; max-width: 600px">
          <el-steps direction="vertical" :active="currentStep">
            <template v-for="step in strategySteps" :key="step.value">
              <el-step :title="step.title" />
            </template>
          </el-steps>

          <div class="step-btns">
            <el-button
              v-if="!isFirstStep"
              type="primary"
              class="prev"
              @click="handlePrev"
            >
              上一步
            </el-button>

            <el-button
              v-if="!isLastStep"
              type="primary"
              class="next"
              @click="handleNext"
            >
              下一步
            </el-button>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <template v-if="currentStep === 1">
          <el-tabs v-model="strageConfig.currentTab" class="demo-tabs">
            <el-tab-pane label="应用配置" name="app">
              <div class="stages-btns">
                <div class="stages">
                  <template v-for="config in builtConfigs" :key="config.id">
                    <el-button
                      class="config-btn"
                      :class="{
                        'config-btn--active': currentConfigId === config.id,
                      }"
                      :plain="currentConfigId !== config.id"
                      @click="currentConfigId = config.id"
                    >
                      {{ config.name }}
                      <el-icon
                        v-if="builtConfigs.length > 1"
                        class="el-icon--right"
                        @click.stop="handleRemoveConfig(config.id)"
                      >
                        <Close />
                      </el-icon>
                    </el-button>
                  </template>
                </div>

                <el-button
                  type="success"
                  class="btn-success"
                  @click="handleAddConfig"
                >
                  新建配置
                  <el-icon class="el-icon--right"><Plus /></el-icon>
                </el-button>
              </div>

              <div class="package-name">
                <el-input
                  v-model="currentConfig.packageNames"
                  placeholder="请输入包名"
                  maxlength="100"
                  show-word-limit
                />
                <div class="package-tip">( tip: 多个包名用英文逗号隔开 )</div>
              </div>

              <div class="built-list mt-12 mb-20">
                <template
                  v-if="
                    currentConfig.features.length ||
                    currentConfig.basePermissions.length
                  "
                >
                  <div class="app-list" v-if="currentConfig.features.length">
                    <div
                      v-for="feature in currentConfig.features"
                      :key="feature.key"
                      class="app-item"
                    >
                      <div class="app-item_name">
                        <img src="@/assets/images/application.png" alt="应用" />
                        <span>{{ feature.label }}</span>
                      </div>
                      <el-switch
                        v-model="feature.enabled"
                        style="--el-switch-on-color: #409eff"
                      />
                    </div>
                  </div>

                  <p style="margin: 16px 0 8px">应用基础权限配置</p>
                  <div
                    class="app-list"
                    v-if="currentConfig.basePermissions.length"
                  >
                    <div
                      v-for="perm in currentConfig.basePermissions"
                      :key="perm.key"
                      class="app-item"
                    >
                      <div class="app-item_name">
                        <img
                          src="@/assets/images/auth.png"
                          alt="应用基础权限配置"
                        />
                        <span>{{ perm.label }}</span>
                      </div>
                      <el-switch
                        v-model="perm.enabled"
                        style="--el-switch-on-color: #409eff"
                      />
                    </div>
                  </div>
                </template>
                <el-empty v-else description="暂无策略" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="限制功能" name="limit">
              <div class="stages-btns mb-20">
                <template v-for="tab in strategyConfig.tabs">
                  <el-button
                    type="primary"
                    class="config-btn"
                    :class="{
                      'config-btn--active':
                        strategyConfig.currentTab === tab.value || tab.enable,
                    }"
                    :plain="strategyConfig.currentTab !== tab.value"
                    @click="strategyConfig.currentTab = tab.value"
                  >
                    {{ tab.label }}
                    <el-icon v-if="tab.enable"><Select /></el-icon>
                  </el-button>
                </template>
              </div>
              <div class="enable">
                <span>启用配置：</span>
                <el-switch
                  v-model="currentLimitTabEnabled"
                  style="--el-switch-on-color: #409eff"
                />
              </div>
              <template v-if="strategyConfig.currentTab === 1">
                <!-- <div class="tips">
                <div class="left-icon">
                  <el-icon color="#de8d2e"><WarningFilled /></el-icon>
                  <span>
                    设备策略部分功能限制项，需要指定设备或定制ROM才可正常使用，机型适配范围可参考ROM设备适配清单
                  </span>
                </div>
              </div> -->

                <div class="strage-list">
                  <div
                    v-for="strategy in strategyConfig.strategyList"
                    :key="strategy.id"
                    class="strage-item"
                  >
                    <div class="item-top">
                      <div class="icon">
                        <div class="icon-pic">
                          <img
                            :src="getAssetsImg(strategy.icon)"
                            :alt="strategy.name"
                          />
                        </div>
                        <span>{{ strategy.name }}</span>
                      </div>
                      <el-switch
                        :disabled="!currentLimitTabEnabled"
                        v-model="strategy.enabled"
                        style="--el-switch-on-color: #409eff"
                      />
                    </div>

                    <div class="item-info">
                      <div class="sub-title">{{ strategy.description }}</div>

                      <template
                        v-if="strategy.options && strategy.options.length"
                      >
                        <div class="tip">此功能限制只能选择一项</div>
                        <div class="tip-list">
                          <el-radio-group
                            v-model="strategy.selectedOption"
                            class="tip-item"
                          >
                            <div
                              v-for="option in strategy.options"
                              :key="option.id"
                            >
                              <div class="tip-header">
                                <el-radio
                                  :disabled="!strategy.enabled"
                                  v-model="option.selected"
                                  :value="option.id"
                                />
                                <span>{{ option.label }}</span>
                                <el-icon color="#ccc"><InfoFilled /></el-icon>
                              </div>
                              <div v-if="option.description" class="tip-warn">
                                {{ option.description }}
                              </div>
                            </div>
                          </el-radio-group>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <el-empty></el-empty>
              </template>
            </el-tab-pane>
            <el-tab-pane label="配置项" name="configure">
              <div class="stages-btns mb-20">
                <template v-for="tab in configureConfig.tabs">
                  <el-button
                    type="primary"
                    class="config-btn"
                    :class="{
                      'config-btn--active':
                        configureConfig.currentTab === tab.value || tab.enable,
                    }"
                    :plain="configureConfig.currentTab !== tab.value"
                    @click="configureConfig.currentTab = tab.value"
                  >
                    {{ tab.label }}
                    <el-icon v-if="tab.enable"><Select /></el-icon>
                  </el-button>
                </template>
              </div>
              <div class="enable">
                <span>启用配置：</span>
                <el-switch
                  v-model="currentTabEnabled"
                  style="--el-switch-on-color: #409eff"
                />
              </div>

              <template v-if="configureConfig.currentTab === 1">
                <div class="tips">
                  <div class="left-icon">
                    <el-icon color="#de8d2e"><WarningFilled /></el-icon>
                    <span>配置说明:</span>
                  </div>
                  <div class="right-tips">
                    <div>1.除华为设备外，其余厂商设备不支持替换锁定屏幕:</div>
                    <div>2.支持上传JPG/JPEG/PNG格式文件，大小10MB以内:</div>
                    <div>
                      3.推荐使用1242*2688px尺寸的png格式图片，如果图片过大会导致设备展示不全。
                    </div>
                  </div>
                </div>
                <div class="imgs">
                  <div class="pic">
                    <div class="tag">锁定屏幕</div>
                    <div
                      class="img"
                      :style="{
                        '--screen-bg': `url(${getAssetsImg(
                          configureConfig.phonePicLockScreen
                        )})`,
                      }"
                    >
                      <div class="time">
                        <div class="now">12:00</div>
                        <div class="day">{{ dayText }}</div>
                      </div>
                    </div>

                    <div class="upload">
                      <ImgUpload
                        :disabled="!currentTabEnabled"
                        button-text="上传背景图"
                        :accept="['jpg', 'jpeg', 'png']"
                        :max-size="10"
                        :width="1242"
                        :height="2688"
                        upload-action="/api/upload"
                        @upload-success="handleUploadSuccess"
                      />
                      <el-button
                        :disabled="!currentTabEnabled"
                        type="primary"
                        :icon="RefreshRight"
                        @click="handleTogglePic"
                        >重置
                      </el-button>
                    </div>
                  </div>
                  <div class="pic">
                    <div class="tag">主屏幕</div>
                    <div
                      class="img"
                      :style="{
                        '--screen-bg': `url(${getAssetsImg(
                          configureConfig.phonePicMainScreen
                        )})`,
                      }"
                    ></div>
                    <div class="upload">
                      <ImgUpload
                        :disabled="!currentTabEnabled"
                        button-text="上传背景图"
                        :accept="['jpg', 'jpeg', 'png']"
                        :max-size="10"
                        :width="1242"
                        :height="2688"
                        upload-action="/api/upload"
                        @upload-success="handleUploadSuccess"
                      />
                      <el-button
                        :disabled="!currentTabEnabled"
                        type="primary"
                        :icon="RefreshRight"
                        @click="handleTogglePic"
                      >
                        重置
                      </el-button>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="configureConfig.currentTab === 2">
                <el-radio-group
                  v-model="configureConfig.selectedInternetConfig"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                  "
                >
                  <template
                    v-for="item in configureConfig.internetCobnfigure"
                    :key="item.label"
                  >
                    <el-radio
                      :value="item.value"
                      :disabled="!currentTabEnabled"
                    >
                      <div style="display: flex; align-items: center">
                        <div>
                          {{ item.label }}
                        </div>
                        <div style="color: #409eff; margin-left: 20px">
                          {{ item.desc }}
                        </div>
                      </div>
                    </el-radio>
                  </template>
                </el-radio-group>
              </template>

              <template v-else-if="configureConfig.currentTab === 4">
                <div class="file">
                  <el-icon color="#409eff"><FolderOpened /></el-icon>
                  <a
                    class="boot-file"
                    href="https://www.iconfont.cn/search/index?searchType=icon&q=%E5%BC%80%E6%9C%BA%E6%96%87%E4%BB%B6&page=1&fromCollection=-1"
                    target="_blank"
                  >
                    开机动画指导文件
                  </a>
                </div>
                <div class="upload-section">
                  <h3>开机动画上传</h3>
                  <zipUpload
                    :disabled="!currentTabEnabled"
                    required-file-name="bootanimation.zip"
                    :max-size="20"
                    v-model="configureConfig.bootAnimationZip"
                  />
                </div>
                <div class="upload-section">
                  <h3>关机动画上传</h3>
                  <zipUpload
                    :disabled="!currentTabEnabled"
                    required-file-name="bootanimation.zip"
                    :max-size="20"
                    v-model="configureConfig.bootAnimationZip"
                  />
                </div>

                <div class="upload-section">
                  <h3>开机铃声上传</h3>
                  <zipUpload
                    :disabled="!currentTabEnabled"
                    required-file-name="bootSound.ogg"
                    :max-size="20"
                    v-model="configureConfig.bootVoiceZip"
                  />
                </div>
              </template>

              <template v-else>
                <el-empty></el-empty>
              </template>
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-if="currentStep === 2">
          <el-tabs v-model="pushRange.currentTab" class="demo-tabs">
            <el-tab-pane label="组织架构" name="organizational">
              <div class="org">
                <div class="unselected-list">
                  <el-input
                    v-model="filterText"
                    style="width: 300px; margin-bottom: 5px"
                    placeholder="请输入"
                  />

                  <el-tree
                    ref="treeRef"
                    node-key="id"
                    style="max-width: 600px"
                    class="filter-tree"
                    :data="pushRange.organizationalList"
                    :props="defaultProps"
                    :check-strictly="true"
                    default-expand-all
                    show-checkbox
                    :filter-node-method="filterNode"
                    @check="handleCheck"
                  />
                </div>
                <div class="selected-list">
                  <div class="choiced">已选中</div>
                  <template
                    v-if="
                      pushRange.selectedOrgs && pushRange.selectedOrgs.length
                    "
                  >
                    <template v-for="item in pushRange.selectedOrgs">
                      <div class="selected-item">
                        <el-icon><User /></el-icon>
                        <div class="item-label">{{ item.label }}</div>
                        <el-icon @click="hanldeRemove(item)" color="#f56c6c">
                          <Delete />
                        </el-icon>
                      </div>
                    </template>
                  </template>
                  <el-empty style="padding: 0" v-else></el-empty>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="用户组" name="user">
              <el-transfer
                filterable
                :titles="['用户组', '已选择用户组']"
                v-model="pushRange.userSelectedList"
                :data="pushRange.userList"
              />
            </el-tab-pane>
            <el-tab-pane label="设备组" name="device">
              <el-transfer
                :titles="['设备组', '已选择设备组']"
                v-model="pushRange.deviceSelectedList"
                :data="pushRange.deviceList"
              />
            </el-tab-pane> -->
          </el-tabs>

          <div class="device" style="margin-top: 20px">
            <div class="device_title" @click="toggleExtraBtn">
              <p>添加例外设备</p>
              <el-icon size="16" v-if="isShowExtraBtn"
                ><ArrowDownBold
              /></el-icon>
              <el-icon size="14" v-else><ArrowRightBold /></el-icon>
            </div>

            <el-transfer
              v-if="isShowExtraBtn"
              :titles="['例外设备', '已选设备']"
              v-model="pushRange.deviceSelectedList"
              :data="pushRange.deviceList"
            />
          </div>
        </template>
        <template v-if="currentStep === 3">
          <el-card header="已选择推送设备策略">
            <el-table :data="selectedStrategies" border>
              <el-table-column prop="strageName" label="策略名称" />
              <el-table-column prop="strageDescription" label="策略描述" />
            </el-table>
          </el-card>
          <el-card header="已选择推送范围" style="margin-top: 20px">
            <el-table :data="pushRange.selectedOrgs" border>
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="label" label="已选择推送范围" />
              <el-table-column prop="org" label="推送范围类型" />
            </el-table>
          </el-card>
        </template>
      </div>
    </div>

    <editDialog ref="editDialogRef" @refresh="handleRefresh" />
  </div>
</template>


<style lang="scss" scoped>
/* @import url("../style/index.scss"); */
@import url("./system/report/style/index.scss");
</style>