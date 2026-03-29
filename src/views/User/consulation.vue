<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image style="width: 25px;height: 25px;" :src="robotfill"/>
        </div>
        <div class="assistant-name">宁渡AI助手</div>
        <div class="online-status"><div class="status-dot"/>在线服务中</div>
      </div>
      <!-- 情绪花园 -->
       <div class="emotion-garden">
        <div class="garden-header">
            <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
            <div class="emotion-name">{{currentEmotion.primaryEmotion}}</div>
            <div class="emotion-score">{{currentEmotion.emotionScore}}</div>
        </div>
        <div class="warm-tips">
            <div class="emotion-status-text">
                <span class="status-label">今天感觉</span>
                <span class="status-emotion">{{ currentEmotion.isNegative?'需要关注':'不错' }}</span>
            </div>
            <div class="emotion-intensity">
                <div class="intensity-dots">
                    <span v-for="dot in 3" :key="dot" class="dot" :class="{'active':getinClass(currentEmotion.emotionScore)>dot}"></span>
                </div>
                <div class="intensity-text">
                    {{ getRiskText(currentEmotion.riskLevel) }}
                </div>
            </div>
            <!-- 温暖建议卡片 -->
            <div class="warm-suggestion" v-if="currentEmotion.suggestion">
                <div class="suggestion-icon">❤️</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">温暖建议</div>
                    <div class="suggestion-text">{{currentEmotion.suggestion}}</div>
                </div>
            </div>
            <!-- 治愈行动清单 -->
             <div class="healing-actions" v-if="currentEmotion.improvementSuggestions?.length>0">
                <div class="actions-title">治愈小行动</div>
                <div class="actions-list">
                     <div v-for="action in currentEmotion.improvementSuggestions":key=action class="action-item">
                        <div class="action-icon">🌟</div>
                        <div class="action-text">{{action}}</div>
                     </div>
                </div>
             </div>
             <!-- 风险提醒 -->
              <div class="risk-notice" v-if="currentEmotion.riskLevel>1 &&currentEmotion.isNegative">
                <div class="notice-icon">{{currentEmotion.icon}}</div>
                <div class="notice-content">
                    <div class="notice-title">温馨提示</div>
                    <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
                </div>
              </div>
        </div>
       </div>
      <!-- 会话历史 -->
       <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
            <div v-for=" session in sessionList" :key="session.id" class="session-item" @click="handleGet(session)">
                <div class="session-info">
                    <div class="session-title">
                        <span>{{ session.sessionTitle }}</span>
                    <div class="session-meta">
                        <span>{{ session.startedAt}}</span>
                    </div>
                    <div class="session-preview">
                        {{session.lastMessageContent}}
                    </div>
                    <div class="session-stats">
                       <span>
                        <el-icon><ChatRound/></el-icon>
                        {{ session.messageCount||0 }}
                       </span>
                       <span>
                        <el-icon><Clock/></el-icon>
                        {{ session.durationMinutes||0 }}分钟
                       </span>
                    </div>
                </div>
                    <div class="session-actions">
                        <el-button @click="handleDelete(session.id)"  text type="danger">
                            <el-icon><Delete/></el-icon>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
       </div>
    </div>

    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image style="width: 30px;height: 30px;" :src="like"></el-image>
          </div>
          <div class="chat-info">
            <h2>宁渡AI助手</h2>
            <p>您的贴心AI心理健康助手</p>
          </div>
        </div>
        <el-button circle title="新建会话" @click="createNewSession"><el-icon><Plus/></el-icon></el-button>
      </div>
      <!-- 聊天区域 -->
      <div class="chat-messages">
        <!-- 欢迎用语 -->
        <div class="message-item ai-message" v-if="messages.length===0">
          <div class="message-avatar">
            <el-image :src="robotfill" style="width: 18px;height: 18px;"/>
          </div>
          <div class="message-content">
            <p class="message-bubble">你好!我是小暖,您的AI助手,很高兴陪伴你,为您提供温暖的心理支持,请告诉我,您今天感觉怎么样,有什么想要分享的?</p>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <!-- 消息列表 -->
         <div v-for="mes in messages" :class="mes.senderType===1? 'user-message':'ai-message'" :key="mes.id" class="message-item">
            <div class="message-avatar">
                <el-image style="width: 18px;height: 18px;" v-if="mes.senderType===1" :src="users" />
                <el-image style="width: 18px;height: 18px;" v-if="mes.senderType===2" :src="robotfill" />
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <!-- AI思考中 -->
                    <div v-if="mes.senderType===2 && isSending && !mes.content"  class="typing-indecator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                    <!-- AI错误提示 -->
                     <div v-else-if="mes.isError" class="error-message">
                        <p>{{ mes.content }}</p>
                     </div>
                     <!-- 正常返回信息 -->
                      <MarkdownRenderer v-else-if="mes.senderType===2&&!mes.isError" :content="mes.content" :isAiMessage="true"/>
                      <p v-else-if="mes.senderType===1 && mes.content" v-html="formatMessage(mes.content)"/>
                      
                </div>
                <div class="message-time">{{mes.senderType===2&&isSending?'正在输入中': mes.createdAt }}</div>
            </div>
         </div>
      </div>
      <div class="chat-input">
        <div class="input-container">
          <el-input
          v-model="inputMessage"
          placeholder="请输入您想分享的内容"
          clearable
          class="message-input"
          type="textarea"
          :rows="3"
          :disabled="isSending"
          @keyup="handleKeydown"
          />
          <div class="input-footer">
            <span>按Enter发送,shift+Enter换行</span>
            <span>{{ inputMessage.length }}/500</span>
          </div>
        </div>
        <el-button :disabled="!inputMessage.trim() ||inputMessage.length>500"  @click="sendMessage" type="primary" class="send-btn"><el-icon><Promotion/></el-icon></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import robotfill from '../../assets/robot-fill.png'
import like from '../../assets/like.png'
import users from '../../assets/users.png'
import { createstartSession, getSessionList,deleteSession,getMessageList,getEmotionResult } from '../../api/admin';
import { ref,onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
const inputMessage=ref('')
const isSending=ref(false)
// 创建列表数据
const sessionList=ref([])
const handleKeydown=(e)=>{
  if(e.key==='Enter'&&!e.shiftKey){
    e.preventDefault();
    sendMessage(); 
  }
}

// 情绪花园
const currentEmotion=ref({
    primaryEmotion:'中性',
    emotionScore:99,
    isNegative:false,
    riskLevel:0,
    suggestion:'请保持情绪',
    improvementSuggestions:['继续保持好心情','可以尝试分享一下你的快乐给朋友哦','保持积极的心态，享受美好的一天！'],
    riskDescription :'当前情绪状态良好，无需特别关注'
})

const getinClass=(score)=>{
    if(score>61) return 3
    if(score>31) return 2
    return 1
}
const getRiskText=(riskLevel)=>{
    if(riskLevel===0) return '正常'
    if(riskLevel===1) return '关注'
    if(riskLevel===2) return '预警'
    if(riskLevel===3) return '危机'
    return '未知风险'
}
const loadSeesionEmotion=(sessionId)=>{
    // 确保格式正确
    if(!sessionId) return
    sessionId.toString().startsWith(`session_`)?sessionId:`session_${sessionId}`
    getEmotionResult(sessionId).then(res=>{
        currentEmotion.value=res
    })
}

// 会话
// 当前的会话对象
const currentSesstion=ref(null)

const createNewSession=()=>{
  // 创建一个新的会话对象
  const newSession={
    sessionId:`temp_${Date.now()}`,
    sessionStatus:'TEMP',
    sessionTitle:'新会话',
  }
  currentSesstion.value=newSession
  messages.value = []

  currentEmotion.value = {
    primaryEmotion: '中性',
    emotionScore: 99,
    isNegative: false,
    riskLevel: 0,
    suggestion: '请保持情绪',
    improvementSuggestions: ['继续保持好心情', '可以尝试分享一下你的快乐给朋友哦', '保持积极的心态，享受美好的一天！'],
    riskDescription: '当前情绪状态良好，无需特别关注',
    icon: '🚨'
  }

  ElMessage.success('已创建新会话')
}


// 新建会话
const sendMessage=()=>{
  if(!inputMessage.value.trim()) return 
  if(isSending.value){
    ElMessage.error('消息发送中，请稍后再试')
    return
  }
  
  const message=inputMessage.value.trim()
  inputMessage.value=''

  if(currentSesstion.value.sessionStatus==='TEMP'){
    startNewSession(message)
  }else{
    // 现有对话
    messages.value.push({
        id:Date.now(),
        senderType:1,
        content:message,
        createAt:new Date().toLocaleString(),
    })
    // 调用后端接口
    startAIResponse(currentSesstion.value.sessionId,message)
  }
}

const startNewSession=(message)=>{
  // 构建说话参数
  const sessionParams={
    initialMessage:message
  }
  if(currentSesstion.value.sessionTitle==='新会话'){
    sessionParams.sessionTitle=`宁渡AI助手-${new Date().toLocaleString()}`
  }else{
    // 如果是历史会话记录
    sessionParams.sessionTitle=currentSesstion.value.sessionTitle
  }
  // 调用后端接口
  createstartSession(sessionParams).then(res=>{
    const sessionData={
    sessionId:res.sessionId,
    sessionStatus:res.status,
    sessionTitle:res.startTime,
    }
    // 判断如果是临时会话，更新数据
    if(currentSesstion.value.sessionStatus==='TEMP'&&currentSesstion.value){
        Object.assign(currentSesstion.value,sessionData)
    }else{
        // 否则，创建一个新的会话对象
        currentSesstion.value=sessionData
    }
    // 更新会话列表
    sessionListData()
    // 添加初试会话消息
    messages.value.push({
        id:Date.now(),
        senderType:1,
        content:message,
        createAt:new Date().toLocaleString(),
    })

    // 开始流式对话
    startAIResponse(currentSesstion.value.sessionId,message)
  })
}

// 流式对话
const startAIResponse=(sessionId,userMessage)=>{
    if(isSending.value){
        ElMessage.error('消息发送中，请稍后再试')
        return
    }
    isSending.value=true
    // 消息数据
    const aiMessage={
        id:`ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderType:2,
        content:'',
        createdAt:new Date().toLocaleString(),
    }
    messages.value.push(aiMessage)
    // 调用后端接口
    const ctrl=new AbortController()// JS自带取消请求的
    fetchEventSource(`/api/psychological-chat/stream`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'token':localStorage.getItem(`token`),
            'Accept':`text/event-stream`
        },
        body:JSON.stringify({sessionId,userMessage}),
        signal:ctrl.signal,
        onopen:(response)=>{
            console.log(response);
            if(response.headers.get('Content-Type')!== 'text/event-stream'){
                ElMessage.error(`服务器返回非流式数据`)
            }
            
        },
        onmessage:(event)=>{
            const raw=event.data.trim()
            if(!raw) return
            const eventName=event.event
            const aimessage=messages.value[messages.value.length-1]
            if(eventName==='done'){
                isSending.value=false
                ctrl.abort()
                loadSeesionEmotion(currentSesstion.value.sessionId)
                return
            }
            const payload=JSON.parse(raw)
            const ok=String(payload.code)==='200'
            if(ok&&payload.data&&payload.data.content){
                aimessage.content+=payload.data.content
            
            }else{
                // 错误回复的显示
                handleError(payload.message||'AI回复失败1')
            }
        },
        onerror:(error)=>{
            handleError(error||'AI回复失败2')
            throw error
        },
        onclose:()=>{
            // 开始情绪分析
            loadSeesionEmotion(currentSesstion.value.sessionId)
        }
    })
    
}

// 错误处理函数
const handleError=(error)=>{
    const aimessage=messages.value[messages.value.length-1]
    if(aimessage){
        aimessage.content=`ai回复失败3,请重试`
    }
    isSending.value=false
    ElMessage.error(`ai回复失败4,请重试`)
}


// 初始化列表渲染
const sessionListData=()=>{
    getSessionList(
        {
            pageNum:1,
            pageSize:10,
        }
    ).then(res=>{
        sessionList.value=res.records

    })
}

const handleDelete=(id)=>{
    deleteSession(id).then(res=>{
        ElMessage.success(`删除成功`)
        sessionListData()
    })
}
// 初始化对话消息
const messages=ref([])
const handleGet=(session)=>{

    getMessageList(session.id).then(res=>{
        messages.value=res
        // console.log(res);
    })
    // 更新当前会话对象数据
    const sessionData={
        sessionId:'session_'+session.id,
        sessionStatus:'ACTIVE',
        sessionTitle:session.startTime,
    }
    loadSeesionEmotion(sessionData.sessionId)
    currentSesstion.value=sessionData
}

// 正则换行
const formatMessage=(content)=>{
    return content.replace(/\n/g,'<br>')
}

onMounted(()=>{
    // 初始化列表
    sessionListData()
    // 初始化创建一个新会话
    createNewSession()
})
</script>

<style lang="scss" scoped>
  .consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b4513;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b4513;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }


    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }
                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }



        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>