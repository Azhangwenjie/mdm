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
      :disabled="fileList.length >= 1"
    >
      <el-icon class="el-icon--upload" v-if="fileList.length === 0">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-if="fileList.length === 0">
        拖拽文件到此处或 <em>点击上传</em>
      </div>
      <div v-else class="upload-disabled-text">
        请先删除现有文件后再上传新文件
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 {{ requiredFileName }} 文件{{
            maxSize ? `，且不超过 ${maxSizeMB}MB` : ""
          }}
        </div>
      </template>
    </el-upload>

    <div v-if="fileList.length > 0" class="file-list-container">
      <h4>已上传文件</h4>
      <div v-for="file in fileList" :key="file.uid" class="file-item">
        <div class="file-info">
          <el-icon class="file-icon">
            <document />
          </el-icon>
          <div class="file-details">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ formatFileSize(file.size) }}</div>
            <div class="file-status" :class="getStatusClass(file.status)">
              {{ getStatusText(file.status) }}
            </div>
          </div>
        </div>
        <div class="file-actions">
          <el-button
            type="primary"
            size="small"
            @click="downloadFile(file)"
            :disabled="file.status !== 'success'"
          >
            <el-icon><download /></el-icon>
            下载
          </el-button>
          <el-button type="danger" size="small" @click="removeFile(file)">
            <el-icon><delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  UploadFilled,
  Document,
  Download,
  Delete,
} from "@element-plus/icons-vue";
import type {
  UploadProps,
  UploadUserFile,
  UploadFile,
  UploadRawFile,
} from "element-plus";

interface Props {
  requiredFileName: string; // 必须的文件名，如 "bootanimation.zip" 或 "bootSound.ogg"
  maxSize?: number; // 最大文件大小，单位MB，可选参数，不传则不限制大小
  uploadAction?: string; // 上传接口地址
  modelValue?: UploadUserFile[]; // v-model 双向绑定
}

const props = withDefaults(defineProps<Props>(), {
  uploadAction: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
  modelValue: () => [],
});

const emit = defineEmits<{
  "update:modelValue": [value: UploadUserFile[]];
  "upload-success": [file: UploadFile, response: any];
  "upload-error": [error: Error];
  "file-remove": [file: UploadFile];
}>();

const uploadRef = ref();
const fileList = ref<UploadUserFile[]>([...props.modelValue]);

const maxSizeMB = computed(() => props.maxSize);
const maxSizeBytes = computed(() =>
  props.maxSize ? props.maxSize * 1024 * 1024 : undefined
);

const acceptTypes = computed(() => {
  const extension = props.requiredFileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "zip":
      return ".zip";
    case "ogg":
      return ".ogg";
    case "mp3":
      return ".mp3";
    case "wav":
      return ".wav";
    default:
      return "*";
  }
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

const beforeUpload: UploadProps["beforeUpload"] = (rawFile: UploadRawFile) => {
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

  if (props.maxSize && rawFile.size > maxSizeBytes.value!) {
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

const handleSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  ElMessage.success("文件上传成功！");
  emit("upload-success", uploadFile, response);
  console.log("上传成功:", response, uploadFile);
};

const handleError: UploadProps["onError"] = (error) => {
  ElMessage.error("文件上传失败，请重试");
  emit("upload-error", error);
  console.error("上传失败:", error);
};

const handleRemove: UploadProps["onRemove"] = (uploadFile) => {
  emit("file-remove", uploadFile);
  return true;
};

const handleExceed: UploadProps["onExceed"] = (files) => {
  ElMessage.warning("只能上传一个文件，请先删除现有文件后再上传");
};

const removeFile = async (file: UploadFile) => {
  try {
    await ElMessageBox.confirm("确定要删除这个文件吗？", "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const index = fileList.value.findIndex((f) => f.uid === file.uid);
    if (index > -1) {
      fileList.value.splice(index, 1);
      ElMessage.success("文件删除成功");
      emit("file-remove", file);
    }
  } catch {
    ElMessage.info("已取消删除");
  }
};

const downloadFile = (file: UploadFile) => {
  if (file.url) {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || props.requiredFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ElMessage.success("开始下载文件");
  } else {
    ElMessage.error("文件下载链接不可用");
  }
};

const formatFileSize = (size: number | undefined): string => {
  if (!size) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let fileSize = size;

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }

  return `${fileSize.toFixed(2)} ${units[index]}`;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "success":
      return "status-success";
    case "uploading":
      return "status-uploading";
    case "fail":
      return "status-fail";
    default:
      return "";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "success":
      return "上传成功";
    case "uploading":
      return "上传中...";
    case "fail":
      return "上传失败";
    default:
      return "准备上传";
  }
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

.file-list-container {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.file-list-container h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  margin-bottom: 8px;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-icon {
  font-size: 24px;
  color: #409eff;
  margin-right: 12px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.file-status {
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  color: #67c23a;
}

.status-uploading {
  color: #409eff;
}

.status-fail {
  color: #f56c6c;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.file-actions .el-button {
  padding: 4px 8px;
}

.el-upload.is-disabled {
  cursor: not-allowed;
}

.el-upload.is-disabled .el-upload-dragger {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
}
</style>
