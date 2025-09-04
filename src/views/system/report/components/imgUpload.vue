<template>
  <el-upload
    ref="uploadRef"
    :action="uploadAction"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :show-file-list="false"
    :accept="acceptTypes"
    :disabled="disabled"
  >
    <el-button type="primary" :disabled="disabled">
      <el-icon><UploadFilled /></el-icon>
      {{ buttonText }}
    </el-button>
  </el-upload>
</template>
    
  <script setup>
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

const props = defineProps({
  buttonText: { type: String, default: "上传文件" },
  accept: { type: Array, default: () => ["jpg", "jpeg", "png"] },
  maxSize: { type: Number, default: 10 }, // MB
  recommendSize: { type: String, default: "1242×2688 PNG" },
  width: { type: Number, default: 1242 },
  height: { type: Number, default: 2688 },
  disabled: { type: Boolean, default: false }, // ✅ 新增禁用配置
  uploadAction: {
    type: String,
    default: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
  },
});

const emit = defineEmits(["upload-success", "upload-error"]);

const acceptTypes = computed(() =>
  props.accept.map((ext) => "." + ext).join(",")
);

// 校验逻辑
const beforeUpload = (rawFile) => {
  return new Promise((resolve, reject) => {
    const extension = rawFile.name.split(".").pop()?.toLowerCase();
    if (!props.accept.includes(extension)) {
      ElMessage.error(
        `只能上传 ${props.accept.join("/").toUpperCase()} 格式文件`
      );
      return reject(false);
    }

    if (props.maxSize && rawFile.size > props.maxSize * 1024 * 1024) {
      ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`);
      return reject(false);
    }

    // 检查图片尺寸
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== props.width || img.height !== props.height) {
          ElMessage.error(`图片尺寸必须为 ${props.width}×${props.height}px`);
          return reject(false);
        }
        resolve(true);
      };
      img.onerror = () => {
        ElMessage.error("无法读取图片，请重试");
        reject(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(rawFile);
  });
};

// 上传成功
const handleSuccess = (response, uploadFile) => {
  ElMessage.success("文件上传成功！");
  emit("upload-success", uploadFile, response);
};

// 上传失败
const handleError = (error) => {
  ElMessage.error("文件上传失败，请重试");
  emit("upload-error", error);
};
</script>
  