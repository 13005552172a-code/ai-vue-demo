<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-image style="width: 60px;height: 60px;" :src="imgUrl1"></el-image>
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>今日评分1-10</p>
          <el-rate v-model="diaryData.moodScore"
          :max="10" size="large"
           :texts="['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']"
            show-text />
        </div>
      </div>

      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="emotion-grid">
          <div v-for="emtion in emotionOptions" :key="emtion.name" :class="{'selected':emtion.name===diaryData.dominantEmotion}" class="emotion-card" @click="selectEmtion(emtion.name)">
            <el-image style="width: 50px;height: 50px;" :src="emtion.url"/>
            <div class="emotion-name">{{emtion.name}}</div>
          </div>
        </div>
      </div>

      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
          <div class="form-group">
            <div class="form-label">情绪触发因素</div>
          <el-input placeholder="今天有什么情绪影响到您了" type="textarea" :rows="3" :maxlength="1000" show-word-limit v-model="diaryData.emotionTriggers"></el-input>
          </div>
          
          <div class="form-group">
            <div class="form-label">今日感想</div>
          <el-input placeholder="写下您今天的想法...." type="textarea" :rows="5" :maxlength="2000" show-word-limit v-model="diaryData.diaryContent"></el-input>
          </div>
        </div>
        <!--生活指标 -->
        <div class="life-indicators">
          <div class="indicator-group">
            <div class="form-label">睡眠质量</div>
            <el-select  v-model="diaryData.sleepQuality" placeholder="请选择您的睡眠质量">
              <el-option label="很差" value="1"></el-option>
              <el-option label="较差" value="2"></el-option>
              <el-option label="一般" value="3"></el-option>
              <el-option label="良好" value="4"></el-option>  
              <el-option label="很好" value="5"></el-option>
            </el-select>
          </div>
          <div class="indicator-group">
            <div class="form-label">压力水平</div>
            <el-select  v-model="diaryData.stressLevel" placeholder="请选择您的压力质量">
              <el-option label="很低" value="1"></el-option>
              <el-option label="较低" value="2"></el-option>
              <el-option label="中等" value="3"></el-option>
              <el-option label="较高" value="4"></el-option>  
              <el-option label="很高" value="5"></el-option>
            </el-select>
          </div>
        </div>
        <div style="margin-top: 20px;" class="action-buttons">
          <el-button @click="restForm" type="primary" size="large">重置</el-button>
          <el-button @click="submit" type="success" size="large">提交</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref ,reactive} from 'vue';
import imgUrl1 from '../../assets/like.png'
import { dayjs } from 'element-plus';
import { ElMessage } from 'element-plus';
import { createorUpdateemotionDiary } from '../../api/admin';
// 重置
const restForm=()=>{
  Object.assign(diaryData, {
    diaryDate:dayjs().format('YYYY-MM-DD'),
    moodScore:null,
    dominantEmotion:'',
    emotionTriggers:'',
    diaryContent:'',
    sleepQuality:null,
    stressLevel:null
  })
}
const submit=()=>{
  console.log(diaryData);
  
  if(!diaryData.moodScore){
    ElMessage.error('请选择您的情绪评分');
    return;
  }
  createorUpdateemotionDiary(diaryData).then(res=>{
    ElMessage.success('提交成功');
    restForm();
  })
}

// 情绪的选项：
const emotionOptions = [
  {name:'开心',url:new URL('../../assets/开心.png', import.meta.url).href},
  {name:'平静',url:new URL('../../assets/平静.png', import.meta.url).href},
  {name:'焦虑',url:new URL('../../assets/焦虑.png', import.meta.url).href},
  {name:'悲伤',url:new URL('../../assets/悲伤.png', import.meta.url).href},
  {name:'兴奋',url:new URL('../../assets/兴奋.png', import.meta.url).href},
  {name:'疲惫',url:new URL('../../assets/疲惫.png', import.meta.url).href},
  {name:'惊讶',url:new URL('../../assets/惊讶.png', import.meta.url).href},
  {name:'困惑',url:new URL('../../assets/困惑.png', import.meta.url).href},
]
const selectEmtion=(name)=>{
  diaryData.dominantEmotion=name
}

const diaryData=reactive({
  diaryDate:dayjs().format('YYYY-MM-DD'),
  moodScore:null,
  dominantEmotion:'',
  emotionTriggers:'',
  diaryContent:'',
  sleepQuality:null,
  stressLevel:null
})
</script>

<style lang="scss">
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                        color: #374151;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }
            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
            }
        }
    }
}  
</style>