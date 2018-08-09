<template lang="html">
  <div class="record-page">
    <div class="device-content">
      <el-table :data="computedData" class="device-table">
        <el-table-column prop="totalTime" label="借出天数" width="147"></el-table-column>
        <el-table-column prop="lendMan" label="出借人" width="200"></el-table-column>
        <el-table-column prop="lendTime" label="借出时间" width="200"></el-table-column>
        <el-table-column prop="returnTime" label="归还时间" width="200"></el-table-column>
        <el-table-column prop="phoneType" label="借出设备型号" width="200"></el-table-column>
        <el-table-column prop="assetNum" label="设备资产编号" width="200"></el-table-column>
      </el-table>

      <el-pagination
        class="pagination-area"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="this.perPageNum"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVal: "",
      currentPage: 1,
      perPageNum: 10,
      totalNum:10,
      tableData:[
      ]
    }
  },
  created(){
    this.query()
  },
  methods: {
    //查询全部记录
    query() {
      let vm = this
      let ts = Date.parse(new Date())
      this.$http.get('/api/getLendDetail',{
        params: {
          pageNum: vm.currentPage,
          ts: ts
        }
      }).then(response => {
        let _data = response.data
        if (_data.success) {
          vm.tableData =  _data.data
          vm.totalNum = Math.ceil(_data.pageNums)*10
        } else {
          vm.$message({
            type: 'error',
            message: _data.data
          });
        }
      }, response => {
        // error callback
        vm.$message({
          type: 'error',
          message: '网络问题,请重试'
        });
      });
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.query()
    }
  },
  computed: {
    computedData() {
      var _currDate
      var _data = this.tableData
      for(let i = 0; i < _data.length; i++) {
        var _currTime = _data[i].returnTime ? _data[i].returnTime : new Date()
        var _currDate = new Date(_currTime).getTime() - new Date(_data[i].lendTime).getTime()
        _data[i].totalTime = Math.ceil((_currDate)/(3600*24*1000)) + "天"
      }
      return _data
    }
  }
}
</script>

<style lang="css">
.record-page {
  margin-top: 20px;
}
.record-nav-bar {
  margin: 16px 0;
}
</style>
