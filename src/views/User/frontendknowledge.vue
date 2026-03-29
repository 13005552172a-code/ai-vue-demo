<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image style="width: 60px;height: 60px;" :src="bookUrl"></el-image>
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧内容 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div v-for="item in knowledgeListData" :key="item.id" class="recommend-list" @click="gotoArticle(item.id)">
          <div class="recommend-item">
          <h4>{{ item.title}}</h4>
          <p class="read-count"><el-icon><Histogram/></el-icon>阅读量:{{item.readCount }}</p>
        </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="article-list">
        <div v-for="item in articleList" class="article-item">
          <el-image style="width: 240px;height: 150px;" :src="getiamge(item.coverImage)" @click="gotoArticle(item.id)"/>
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag Plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div style="margin-top: 10px;">
              <div class="flex-vox">
                <el-icon><Avatar/></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-vox">
                <el-icon><List/></el-icon>
                <span>{{ dayjs().format('YYYY-MM-DD') }}</span>
              </div>
              <div style="margin-top: 20px;" class="flex-vox">
                <el-icon><Platform/></el-icon>
                <span>观看人数:{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
    class="pagination-wrapper"
    style="margin-top: 25px;"
    :page-size="paination.size"
    layout="prev, pager, next"
    :total="paination.total"
    @current-change="handleChange" />
  </div>
</template>

<script setup>
import { ref,onMounted, reactive } from 'vue'
import bookUrl from '../../assets/book.png'
import { knowledgeList } from '../../api/admin';
import { Avatar } from '@element-plus/icons-vue';
import { dayjs } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
// 跳转到详情页面
const gotoArticle=(id)=>{
  router.push(`/frontendknowledge/article/${id}`)
}

// 分页
const handleChange=(page)=>{
  paination.currentPage=page
  getknowledgeList()
}

// 获得封面图片
const getiamge = (url) => {
  return url? `http://localhost:5173/`+url :" https://file.itndedu.com/psychology_ai.png"
}


// 左侧
const knowledgeListData = ref([])
const getknowledgeList = () => {
  // 推荐阅读列表
  const params={
    sortField:'readCount',
    sortDirection:'desc',
    currentPage:1,
    size:5
  }
  getPageData()
  knowledgeList(params).then(res=>{
    console.log(res);
    knowledgeListData.value=res.records
  })
}

// 右侧列表数据
const paination=reactive({
  currentPage:1,
  size:10,
  total:0
})

// 
const articleList=ref([])

// 获取列表数据
const getPageData = () => {
  const params={
    sortField:'publishedAt',
    sortDirection:'desc',
    ...paination
  }
  knowledgeList(params).then(res=>{
    articleList.value=res.records
    paination.total=res.total
  })
}

onMounted(()=>{
   getknowledgeList()
})
</script>

<style scoped lang="scss">
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>