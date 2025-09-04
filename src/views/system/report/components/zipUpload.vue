<template>
  <div class="generic-file-upload">
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      :action="uploadAction"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :on-exceed="handleExceed"
      :accept="acceptTypes"
      :disabled="disabled"
    >
      <el-icon
        class="el-icon--upload"
        v-if="fileList.length === 0 && !disabled"
      >
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-if="fileList.length === 0 && !disabled">
        拖拽文件到此处或 <em>点击上传</em>
      </div>
      <div v-else class="upload-disabled-text">
        {{ disabled ? "上传功能已禁用" : "请先删除现有文件后再上传新文件" }}
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 {{ requiredFileName }} 文件
          {{ maxSize ? `，且不超过 ${maxSizeMB}MB` : "" }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

const props = defineProps({
  requiredFileName: { type: String, required: true }, // 必须的文件名
  maxSize: { type: Number, default: null }, // MB，不传则不限制
  uploadAction: {
    type: String,
    default: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
  },
  modelValue: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }, // ✅ 外部控制上传开关
});

const emit = defineEmits([
  "update:modelValue",
  "upload-success",
  "upload-error",
  "file-remove",
]);

const uploadRef = ref();
const fileList = ref([...props.modelValue]);

const maxSizeMB = computed(() => props.maxSize);
const maxSizeBytes = computed(() =>
  props.maxSize ? props.maxSize * 1024 * 1024 : undefined
);

const acceptTypes = computed(() => {
  const extension = props.requiredFileName.split(".").pop()?.toLowerCase();
  return extension ? `.${extension}` : "*";
});

watch(
  () => props.modelValue,
  (newValue) => {
    fileList.value = [...newValue];
  },
  { deep: true }
);

watch(
  fileList,
  (newValue) => {
    emit("update:modelValue", [...newValue]);
  },
  { deep: true }
);

// 校验逻辑：外部 disabled 优先控制
const beforeUpload = (rawFile) => {
  if (props.disabled) {
    ElMessage.warning("上传功能已禁用");
    return false;
  }

  if (rawFile.name !== props.requiredFileName) {
    ElMessage.error(`文件名必须为 ${props.requiredFileName}`);
    return false;
  }

  const requiredExtension = props.requiredFileName
    .split(".")
    .pop()
    ?.toLowerCase();
  const fileExtension = rawFile.name.split(".").pop()?.toLowerCase();

  if (fileExtension !== requiredExtension) {
    ElMessage.error(`只能上传 ${requiredExtension?.toUpperCase()} 格式的文件`);
    return false;
  }

  if (props.maxSize && rawFile.size > maxSizeBytes.value) {
    ElMessage.error(`文件大小不能超过 ${maxSizeMB.value}MB`);
    return false;
  }

  if (fileList.value.length >= 1) {
    ElMessage.error("只能上传一个文件，请先删除现有文件");
    return false;
  }

  ElMessage.success("文件验证通过，开始上传...");
  return true;
};

const handleSuccess = (response, uploadFile) => {
  ElMessage.success("文件上传成功！");
  emit("upload-success", uploadFile, response);
};

const handleError = (error) => {
  ElMessage.error("文件上传失败，请重试");
  emit("upload-error", error);
};

const handleRemove = (uploadFile) => {
  emit("file-remove", uploadFile);
  return true;
};

const handleExceed = () => {
  ElMessage.warning("只能上传一个文件，请先删除现有文件后再上传");
};

defineExpose({
  clearFiles: () => {
    fileList.value = [];
    uploadRef.value?.clearFiles();
  },
  getFileList: () => fileList.value,
  uploadRef,
});
</script>

<style scoped>
.generic-file-upload {
  width: 100%;
  max-width: 600px;
}

.upload-disabled-text {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}
</style>
