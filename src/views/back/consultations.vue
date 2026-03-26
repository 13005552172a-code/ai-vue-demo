<template>
  <div>
    <PageHead title="咨询页面"/>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column label="绘画id"  width="150">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪标签"  >
        <template #default="scope">
         <div class="session-title">{{ scope.row.sessionTitle }}</div>
         <div class="session-p">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="150"/>
      <el-table-column prop="startedAt" label="时间" width="150"/>
      <el-table-column label="操作"  width="150">
        <template #default="scope">
         <el-button type="primary" size="small" text @click="viewSessionDtain(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px;"
      :page-size="pagination.size"
      layout="prev, pager, next"
      :total="pagination.total"
      @current-change="handleChange" />

    <el-dialog
      v-model="showDetail"
      title="咨询会话详情"
      width="80%"
      :close-on-click-modal="false"
      >
      <div class="session-detail">
        <div class="session-header">
          <div class="detail-row">
            <div class="detail-label">用户:{{detailData.userNickname}}</div>
          </div>
          <div class="detail-row">
            <div class="detail-value">开始时间:{{ detailData.lastMessageTime }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-value">消息数:{{ detailData.messageCount}}</div>
          </div>
        </div>
        <div class="session-detail">
          <div class="message-container">
            <h4>对话记录</h4>
          </div>
          <div class="message-list" v-loading="loadingMessage">
            <div v-for="message in Wxchat" :key="message.id"
             :class="message.senderType===1?'用户': 'AI助手'" class="message-item" >
              <div class="message-header">
                <div class="sender">{{ message.senderType===1?'用户': 'AI助手' }}</div>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-conent">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetail=false" type="warning">关闭</el-button>
      </template>
  </el-dialog> 
  </div>
  

</template>
<script setup>
import { ref,onMounted, reactive } from 'vue'
import { psychologicalSessions,psychologicalchat } from '../../api/admin';
import PageHead from '../../components/PageHead.vue'
const tableData = ref([])
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})

const detailData=ref({})
const loadingMessage=ref(false)
const Wxchat=ref([])
const viewSessionDtain=(row)=>{
  loadingMessage.value=true
  psychologicalchat(row.id).then(res=>{
    loadingMessage.value=false
    Wxchat.value=res
    detailData.value=row
    showDetail.value=true
  })
}
// 切换页数
const handleChange=(page)=>{
  pagination.currentPage=page
  handleSearch()
}
// 获取咨询会话列表
const handleSearch=()=>{
  psychologicalSessions(pagination).then(res=>{
    const {records,total}=res;
    tableData.value=records;
    pagination.total=total;
    // console.log(records);
    
  })
}
// 是否显示详情弹窗
const showDetail=ref(false)
onMounted(()=>{
  handleSearch()
})
</script>


<style lang="scss" scoped>
// 表格内会话标题和内容样式
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-p {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 弹窗详情外层容器
.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  // 详情头部信息栏
  .session-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  // 详情行样式
  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }

  // 消息容器（包含对话记录标题）
  .message-container {
    margin-top: 20px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }

  // 消息列表容器
  .message-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;

    // 单个消息项
    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      background: #f8f9fa;

      &:last-child {
        margin-bottom: 0;
      }

      // 修复：匹配你模板里动态绑定的中文类名
      &.用户 {
        background: #e8f4fd !important; // 用户消息-浅蓝色
      }

      &.AI助手 {
        background: #f0f9f0 !important; // AI消息-浅绿色
      }
    }

    // 消息头部（发送者+时间）
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }

    // 严格匹配你模板里的拼写错误：message-conent
    .message-conent {
      color: #333;
      line-height: 1.6;
      white-space: pre-wrap;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>