<template>
  <div>
  <PageHead title="情绪日志"/>
  <TableSelect :fromItem="formItem" @search="handleSearch"/>
  <el-table :data="tableData" style="width: 100%;">
    <el-table-column prop="id" label="用户ID" width="120"/>
    <el-table-column prop="userId" label="会话ID" width="80">
      <template #default="scope">
        <el-avatar>{{ scope.row.username}}</el-avatar>
      </template>
    </el-table-column>
    <el-table-column prop="updatedAt" label="记录时间" width="120"/>
    <el-table-column prop="aiEmotionAnalysis" label="情绪评分">
      <template #default="scope">
        <el-rate :model-value="scope.row.moodScore" :max="10" disabled/>
      </template>
    </el-table-column>
    <el-table-column  label="生活指标" width="120">
      <template #default="scope">
        <div>
          <p>睡眠:{{ scope.row.sleepQuality }}</p>
          <p>压力:{{ scope.row.stressLevel }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120"/>
    <el-table-column prop="diaryContent" label="日记内容" width="250"/>
    <el-table-column label="操作"  width="150">
        <template #default="scope">
         <el-button type="primary" size="small" text @click="viewSessionDtain(scope.row)">详情</el-button>
          <el-button type="warning" size="small" text @click="deleteviewSessionDtain(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    <el-table-column prop="createdAt" label="创建时间" width="120"/>
  </el-table>
  <el-pagination
    style="margin-top: 25px;"
    :page-size="pagination.size"
    layout="prev, pager, next"
    :total="pagination.total"
    @current-change="handleChange" />
  <el-dialog
  v-model="isShow"
  title="情绪日志详情"
  width="80%"
  :close-on-click-modal="false"
  >
  <div v-if="detailDialogVisible">
    <div class="detail-section">
      <h4>用户信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ detailDialogVisible.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detailDialogVisible.nickname }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailDialogVisible.id }}</el-descriptions-item>
        <el-descriptions-item label="记录日期">{{ detailDialogVisible.diaryDate }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="detail-section">
      <h4>情绪列表</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="情绪评分">
          <el-rate :model-value="detailDialogVisible.moodScore" :max="10" disabled/>
        </el-descriptions-item>
        <el-descriptions-item label="主要情绪">{{ detailDialogVisible.dominantEmotion||'-' }}</el-descriptions-item>
        <el-descriptions-item label="睡眠质量">{{ detailDialogVisible.sleepQuality||'-'}}</el-descriptions-item>
        <el-descriptions-item label="压力水平">{{ detailDialogVisible.stressLevel||'-'}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="detail-section">
      <h4>日记内容</h4>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="情绪触发因素">{{ detailDialogVisible.emotionTriggers||'无事发生' }}</el-descriptions-item>
        <el-descriptions-item label="日记内容">{{ detailDialogVisible.diaryContentPreview||'无'}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="detail-section">
      <h4>AI情绪分析结果</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="情绪触发因素">
          {{ aiData.primaryEmotion||'-' }}
        </el-descriptions-item>
        <el-descriptions-item label="情绪强度">
           <el-progress :percentage="aiData.emotionScore" :stroke-width="8" />
        </el-descriptions-item>
        <el-descriptions-item label="风险等级">
          {{ aiData.riskLevel||'-' }}
        </el-descriptions-item>
        <el-descriptions-item label="情绪性质">
          {{ aiData.isNegative?'负面情绪':'正面情绪' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
      <div class="suggestion-section">
        <h5>专业建议</h5>
        <div class="suggestion-content">{{ aiData.suggestion||'暂无建议' }}</div>
      </div>
      <div class="ai-risk-section">
        <h5>风险描述</h5>
        <div class="risk-content">{{ aiData.riskDescription||'暂无描述' }}</div>
      </div>
      <div class="ai-improvements-section">
        <h5>改善建议</h5>
        <ul class="improvement-content">
          <li v-for="item in aiData.improvementSuggestions" :key="item">{{ item||'暂无改善建议'}}</li>
        </ul>

      </div>
  </div>
  <div>
    <p style="border-top: 1px solid #f3f3f3;margin: 20px 0 20px 0;padding-top: 20px;">分析时间:{{ detailDialogVisible.aiAnalysisUpdatedAt }}</p>
  </div>
  <div class="detail-section">
      <h4>时间信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="创建时间">{{ detailDialogVisible.createdAt||'无' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailDialogVisible.updatedAt||'无'}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button @click="isShow=false">关闭</el-button>
    </template>
  </el-dialog>
  </div>
  
</template>

<script setup>
import { onMounted, ref,reactive } from 'vue';
import PageHead from '../../components/PageHead.vue';
import TableSelect from '../../components/TableSelect.vue';
import { emotionDiary, deleteEmotion } from '../../api/admin';
import {ElMessageBox,ElMessage}from 'element-plus'

const isShow=ref(false)

const formItem=ref([
  {comp:'input',prop:'userId',label:'用户ID',placeholder:'请输入用户ID'},
  {comp:'select',prop:'moodScore',label:'情绪评分',placeholder:'请选择评分范围',Option:
  [
    {label:'低分(1-3)',value:'1-3'},
    {label:'中等(4-6)',value:'4-6'},
    {label:'高分(7-10)',value:'7-10'}
  ]},
])
const tableData=ref([])
// 切换页面
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
const handleChange=(page)=>{
  pagination.currentPage=page
  handleSearch()
}
const handleSearch=()=>{
  emotionDiary(pagination).then(res=>{
    const {records,total}=res;
    tableData.value=records;
    pagination.total=total;
  })
}
// 获取数据
const aiData=ref(null)
const detailDialogVisible=ref(null)
const viewSessionDtain=(row)=>{
  if(row.aiEmotionAnalysis){
    aiData.value=JSON.parse(row.aiEmotionAnalysis)
    // console.log(aiData);
    
  }else{
    aiData.value={}
  }
  detailDialogVisible.value=row
  isShow.value=true
}
const deleteviewSessionDtain=(row)=>{
  // console.log(row);
  ElMessageBox.confirm(
    `确认删除该条记录吗`,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'danger',
    }
  ).then(()=>{
     deleteEmotion(row.id).then(res=>{
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}


onMounted(()=>{
  handleSearch()
})

</script>

<style lang="scss" scoped>
  .detail-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    color: #303133;
    font-size: 16px;

    i {
      margin-right: 8px;
      color: #409eff;
    }
  }
}

.suggestion-section,
.ai-risk-section,
.ai-improvements-section {
  margin-top: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;

  h5 {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 14px;
    font-weight: 600;

    i {
      margin-right: 6px;
      color: #909399;
    }
  }
}

.suggestion-content,
.risk-content {
  line-height: 1.6;
  color: #606266;
  background-color: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.improvement-content {
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
    color: #606266;
    line-height: 1.5;
  }
}

.el-progress {
  .el-progress__text {
    font-size: 12px !important;
  }
}
</style>