<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue';
import SiteAdapterFactory from './site-adapters/SiteAdapterFactory';
import Task from './models/Task';
import { generateFileName } from './utils/FileUtil';

// #region const
const ProgressBarColorGrey = '#323233';
const ProgressBarColorBlue = '#1989fa';
const ProgressBarColorGreen = '#07c160';
// #endregion

// #region data
let counter = ref(0);
let tasks = reactive(new Array<Task>());
let tasksLoading = ref(false);
let tasksLoadError = ref(false);
let tasksLoaded = ref(false);
let siteAdapter = SiteAdapterFactory.createAdapter();
let width = ref(0);
let height = ref(0);
let taskStatuses = {
  'waiting': '等待',
  'active': '活动',
  'paused': '暂停',
  'stop': '停止',
  'error': '错误',
  'complete': '完成'
};
let selectedTaskStatuses = ref([
  'waiting', 
  'active'
]);
// #endregion

// #region computed
let overallProgresspercentage = computed(() => {
  return counter.value;
});

let overallProgressColor = computed(() => {
  let percent = counter.value;
  if (percent <= 0) {
    return ProgressBarColorGrey;
  }
  else if (percent > 0 && percent < 100) {
    return ProgressBarColorBlue;
  }
  return ProgressBarColorGreen;
});
// #endregion

// #region methods
function loadTasks() {
  tasksLoading.value = true;
  let srcs = siteAdapter.getImageSources();
  let amount = srcs.length;
  let seq = 0;
  for (let src of srcs) {
    let task = new Task(
      src, 
      generateFileName(src, ++seq, amount)
    );
    // TODO 从indexedDB中获取文件内容
    tasks.push(task);
    console.log("创建任务", task);
  }
  tasksLoading.value = false;
  tasksLoaded.value = true;
}

function getProgressColorByTaskStatus(task: Task) : string {
  if (task.totalLength <= 0) return ProgressBarColorGrey;
  if (task.completedLength <= 0) {
    return ProgressBarColorGrey;
  }
  else if (task.completedLength < task.totalLength) {
    return ProgressBarColorBlue;
  }
  return ProgressBarColorGreen;
}

function getTaskProgressPercentage(task: Task) : number {
  if (task.totalLength <= 0) return 0;
  let percent = task.completedLength * 100 / task.totalLength;
  return percent;
}

function printTestInfo() {
  console.log(selectedTaskStatuses.value);
}
// #endregion

// #region mounted
onMounted(() => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  console.log(`body初始大小：${width.value}x${height.value}`);
  window.onresize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    console.log(`body大小发生改变：${width.value}x${height.value}`);
  };
});
// #endregion
</script>

<template>
  <div class="packer-view">
    <el-row :gutter="10" class="packer-view-row buttons">
      <el-col :span="6"> <el-button type="primary" @click="loadTasks">添加任务</el-button> </el-col>
      <el-col :span="6"> <el-button type="primary" @click="printTestInfo">测试</el-button> </el-col>
    </el-row>

    <el-row :gutter="10" class="packer-view-row overall-progress" :wrap="false">
      <el-col :span="4">总进度：</el-col>
      <el-col :span="20">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="overallProgresspercentage"
          :color="overallProgressColor"
        />
      </el-col>
    </el-row>

    <el-row class="packer-view-row">
      <el-col :span="24">
        <el-checkbox-group v-model="selectedTaskStatuses" size="large">
          <el-checkbox-button v-for="(status, key) in taskStatuses" :key="key" :label="key">
              {{ status }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>

    <el-scrollbar :height="height - 170">
      <el-row :gutter="10" v-for="task in tasks" class="packer-view-row">
        <el-col :span="4">{{ task.fileName }}</el-col>
        <el-col :span="19">
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="getTaskProgressPercentage(task)"
            :color="getProgressColorByTaskStatus(task)"
          />
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.packer-view {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 25%;
  padding: 10px;
  border: 1px solid #000;
}
.packer-view-row {
  margin-bottom: 10px;
}
.el-button {
  width: fit-content;
  height: 32px;
}
</style>
