<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="45%">
    <el-form :model="formData" ref="formRef" :rules="rules">
      <el-form-item label="策略名称" prop="strategy">
        <el-input
          v-model="formData.strategy"
          placeholder="请输入策略名称"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="策略描述" prop="description">
        <el-input
          v-model="formData.description"
          placeholder="请输入策略描述"
          type="textarea"
          maxlength="300"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnClick('取消')">取消</el-button>
        <el-button type="primary" @click="btnClick('确定')"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import { useThrottleFn } from "@vueuse/core";
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref } from "vue";

const emits = defineEmits(["refresh"]);

const formData = reactive({
  strategy: "",
  description: "",
});

const rules = reactive({
  strategy: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
  description: [
    { required: true, message: "策略描述不能为空", trigger: "blur" },
  ],
});

const dialogVisible = ref(false);
const dialogTitle = ref("a");
const open = (type, row) => {
  dialogTitle.value = type;
  dialogVisible.value = true;
};

const formRef = ref(null);
const btnClick = (type) => {
  switch (type) {
    case "确定":
      formRef.value?.validate((valid) => {
        if (valid) {
          emits("refresh");
        }
      });

      break;
    case "取消":
      reset();
      break;
    default:
      break;
  }
};

const showToast = useThrottleFn(
  (
    type = "success",
    content = "",
    extraInfo = {
      plain: false,
    }
  ) => {
    ElMessage({
      type,
      message,
      ...extraInfo,
    });
  },
  1000
);

const reset = () => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  dialogVisible.value = false;
};
defineExpose({
  open,
});
</script>
