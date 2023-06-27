<template>
  <div class="workbench-wrapper">
    <div class="info ub ub-ac ub-pj">
      <ElSkeleton :loading="loading" :rows="2" animated>
        <div class="ub ub-ac">
          <UserAvata :size="2" />
          <div class="greetBlock">
            <div class="msg1">张津，你好，欢迎使用admin test平台</div>
            <div class="msg2">今日晴，20℃ - 32℃！</div>
          </div>
        </div>
        <div class="ub">
          <div class="item">
            <div class="desp">我的申请</div>
            <div class="num">20</div>
          </div>
          <div class="item">
            <div class="desp">我的审批</div>
            <div class="num">6</div>
          </div>
          <div class="item">
            <div class="desp">系统通知</div>
            <div class="num">333</div>
          </div>
        </div>
      </ElSkeleton>
    </div>
    <div class="ub ub-ac row">
      <div class="chartBlock ub-f1 first">
        <ElSkeleton :loading="loading" :rows="7" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </div>
      <div class="chartBlock ub-f1">
        <ElSkeleton :loading="loading" :rows="7" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </div>
    </div>
    <div class="ub ub-ac row">
      <div class="chartBlock ub-f1 first">
        <ElSkeleton :loading="loading" :rows="7" animated>
          <Echart :options="radarOptionData" :height="300" />
        </ElSkeleton>
      </div>
      <div class="chartBlock ub-f1">
        <ElSkeleton :loading="loading" :rows="7" animated>
          <Echart :options="lineOptionsData" :height="300" />
        </ElSkeleton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import UserAvata from "@/components/UserAvatar/index.vue"
import Echart from "@/components/Echarts/index.vue"
import { ref, onMounted, reactive } from "vue";
import { pieOptions, barOptions, radarOption, lineOptions } from "./echartOptions"
import { EChartsOption } from "echarts";
const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption
const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption
const radarOptionData = reactive<EChartsOption>(radarOption) as EChartsOption
const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption
defineOptions({
  name: "Dashboard" // 跟路由name一样workbench就会缓存不会再次刷新
})
const loading = ref(true);
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>
<style scoped lang="scss">
.workbench-wrapper {
  .info {
    padding: 20px;
    border: 1px solid #e5e7eb;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

    .greetBlock {
      margin-left: 20px;

      .msg1 {
        font-size: 20px;
      }

      .msg2 {
        margin-top: 10px;
        font-size: 14px;
        color: #999999;
      }
    }

    .item {
      width: 100px;

      .desp {
        text-align: center;
        color: #777777;
        font-size: 14px;
      }

      .num {
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }

  .row {
    margin-top: 20px;

    .chartBlock {
      height: 340px;
      border: 1px solid #e5e7eb;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      padding: 20px;

      &.first {
        margin-right: 20px;
      }
    }
  }
}
</style>