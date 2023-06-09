<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';
import SiteAdapterFactory from './site-adapters/SiteAdapterFactory';
import { Task } from './models/Task';
import { generateFileName } from './utils/FileUtil';

import { liveQuery } from 'dexie';
import TaskDatabase from './databases/TaskDatabase';
import { useObservable } from '@vueuse/rxjs';

import Logger from './utils/Logger';

import DownloadManager from './utils/DownloadManager';

// #region const
const ProgressBarColorGrey = '#323233';
const ProgressBarColorBlue = '#1989fa';
const ProgressBarColorGreen = '#07c160';
// #endregion

// #region data
let counter = ref(0);
let tasksLoading = ref(false);
let tasksLoadError = ref(false);
let tasksLoaded = ref(false);
let width = ref(0);
let height = ref(0);
let selectedTaskStatuses = ref([
  'waiting', 
  'active'
]);

let referer = window.location.href;
let tasks = useObservable( liveQuery(
    () => db.tasks.where("referer").equals(referer).toArray()
  ) as any
) as Readonly<Ref<Task[]>>;

let siteAdapter = SiteAdapterFactory.createAdapter();
let logger = Logger.getLogger("PackerApp");
let db = new TaskDatabase();
let downloadMgr = new DownloadManager(db);
let taskStatuses = {
  'waiting': '等待',
  'active': '活动',
  'paused': '暂停',
  'stop': '停止',
  'error': '错误',
  'complete': '完成'
};
// #endregion

// #region computed
let overallProgressPercentage = computed(() => {
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
/**
 * 加载任务
 */
function loadTasks() {
  tasksLoading.value = true;
  if (tasks.value.length == 0) {
    // 任务列表为空，开始创建任务
    logger.info("任务列表为空，开始创建任务");
    createTasks();
  }
  else {
    logger.info("已从indexedDB读取任务列表");
  }

  // 加载完成
  tasksLoading.value = false;
  tasksLoaded.value = true;
}

/**
 * 创建任务
 */
function createTasks() {
  let srcs = siteAdapter.getImageSources();
  let amount = srcs.length;

  let seq = 0;
  for (let src of srcs) {
    let task = new Task(
      src, 
      referer, 
      generateFileName(src, ++seq, amount)
    );
    db.tasks.add(task);
    logger.info("创建任务", task);
  }
}

/**
 * 根据任务状态获取进度条颜色
 * @param task 
 */
function getProgressColorByTaskStatus(task: Task) : string {
  if (task.total <= 0) return ProgressBarColorGrey;
  if (task.loaded <= 0) {
    return ProgressBarColorGrey;
  }
  else if (task.loaded < task.total) {
    return ProgressBarColorBlue;
  }
  return ProgressBarColorGreen;
}

/**
 * 获取任务进度条百分比文本
 * @param task 
 */
function getTaskProgressPercentage(task: Task) : number {
  if (task.total <= 0) return 0;
  let percent = task.loaded * 100 / task.total;
  return percent;
}

function printTestInfo() {
  logger.info(selectedTaskStatuses.value);
}
// #endregion

// #region mounted
onMounted(() => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  logger.info(`body初始大小：${width.value}x${height.value}`);
  window.onresize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    logger.info(`body大小发生改变：${width.value}x${height.value}`);
  };
});
// #endregion
</script>

<template>
  <div class="packer-view">
    <el-row :gutter="10" class="packer-view-row buttons">
      <el-col :span="6"> <el-button type="primary" @click="loadTasks">加载任务</el-button> </el-col>
      <el-col :span="6"> <el-button type="primary" @click="printTestInfo">测试</el-button> </el-col>
    </el-row>

    <el-row :gutter="10" class="packer-view-row overall-progress" :wrap="false">
      <el-col :span="4">总进度：</el-col>
      <el-col :span="20">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="overallProgressPercentage"
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
