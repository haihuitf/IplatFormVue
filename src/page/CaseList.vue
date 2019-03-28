<template>
    <div class="fillcontain">
        <head-top></head-top>
      <div class="table_container">
            <el-table :data="tableData" style="width: 100%"><el-table-column prop="models_name" label="模块名称" width="180"></el-table-column>
              <el-table-column prop="models_desc" label="模块概述" width="220"></el-table-column>
              <el-table-column prop="other_desc" label="其他信息" width="180"></el-table-column>
              <!--<el-table-column prop="admin" label="权限"></el-table-column>-->
              <el-table-column prop="status" label="状态"></el-table-column>
              <!--<el-table-column prop="create_time" label="创建时间"></el-table-column>-->
              <el-table-column prop="create_time" label="操作"></el-table-column>
            </el-table>
          <div class="Pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total, prev, pager, next" :total="count">
            </el-pagination>
          </div>
      </div>
    </div>
</template>

<script>
// import headTop from '../components/headTop'
// import {adminList, adminCount} from '@/api/getData'
import {CaseList} from '@/api/getData'
export default {
  data () {
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1
    }
  },
  components: {
    //
  },
  created () {
    this.getAdmin()
  },
  methods: {
    // async initData () {
    //   try {
    //     const countData = await adminCount()
    //     if (countData.status === 1) {
    //       this.count = countData.count
    //     } else {
    //       throw new Error('获取数据失败')
    //     }
    //     this.getAdmin()
    //   } catch (err) {
    //     console.log('获取数据失败', err)
    //   }
    // },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      this.getAdmin()
    },
    async getModelList () {
      const res = await adminList()
      console.log('s')
    },
    async getAdmin () {
      try {
        console.log('jin')
        // const res = await adminList({offset: this.offset, limit: this.limit})
        const res = await CaseList()
        console.log(res)
        console.log(res.status)
        res.data.forEach(item => {
          item.forEach(im => {
            const tableItem = {
              models_name: im.models_name,
              models_desc: im.models_desc,
              other_desc: im.other_desc,
              status: im.status_id
            }
            this.tableData.push(tableItem)
          })
          // console.log(item[0].models_name)
          // console.log(item.models_name)
          // const tableItem = {
          //   models_name: item[0].models_name
          // }
          // console.log(tableItem)
          // this.tableData.push(tableItem)
        })
        if (res.status === 1) {
          this.tableData = []
          res.data.forEach(item => {
            const tableItem = {
              create_time: item.create_time,
              user_name: item.user_name,
              admin: item.admin,
              city: item.city
            }
            this.tableData.push(tableItem)
          })
        } else {
          throw new Error(res.message)
        }
      } catch (err) {
        console.log('获取数据失败', err)
      }
    }
  }
}
</script>

<style lang="less">
  @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>
