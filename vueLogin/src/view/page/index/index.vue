<template lang="html">
  <div class="device-page">
    <div class="device-nav-bar clearfix">
      <el-input v-model="searchVal"  class="input-with-select" placeholder="资产编号、品牌、型号、出借人">
        <el-button slot="append" icon="el-icon-search" @click="requestQuery()"></el-button>
      </el-input>
      <el-select v-model="selectVal" placeholder="请选择" class="device-select" @change="requestQuery()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="onselectVal" placeholder="请选择" class="device-select" @change="requestQuery()">
      	<el-option
          v-for="item in onOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="device-icon-area clearfix">
        <div class="iconfont icon-xinzeng" @click="addDevice()"></div>
        <div class="iconfont lend"
        :class="lendData.length > 0 ? '' :'unable'"
        @click="lendDevice()">借<span class="icon-num" v-show="lendData.length > 0">{{lendData.length}}</span></div>
        <div class="iconfont repay"
        :class="repayData.length > 0 ? '' :'unable'"
        @click="repayDevice()">还<span class="icon-num" v-show="repayData.length > 0">{{repayData.length}}</span></div>
      </div>
    </div>
    <div class="device-content">
      <el-table :data="tableData" class="device-table" :row-class-name="tableRowClassName">
        <el-table-column width="67">
          <template slot-scope="scope">
            <span class="iconfont icon-daizi" v-if="scope.row.isDelete=='上线中'" @click="selectDevice(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="assetNum" label="资产编号" width="120"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="100"></el-table-column>
        <el-table-column prop="phoneType" label="型号" width="100"></el-table-column>
        <el-table-column prop="systemVersion" label="系统版本" width="120"></el-table-column>
        <el-table-column prop="RAM" label="RAM" width="100"></el-table-column>
        <el-table-column prop="ROM" label="ROM" width="100"></el-table-column>
        <el-table-column prop="loanType" label="借出状态" width="120">
          <template slot-scope="scope">
              <span v-if="scope.row.loanType == 0">持有</span>
              <span v-if="scope.row.loanType == 1" style="color:#ff8575;">已借出</span>
              <span v-if="scope.row.loanType == 2" style="color:red;">已逾期</span>
          </template>
        </el-table-column>
        <el-table-column prop="lendMan" label="出借人" width="120"></el-table-column>
        <el-table-column prop="isDelete" label="状态" width="100"></el-table-column>
        <el-table-column label="" width="100">
          <template slot-scope="scope">
            <div class="last-icon">
              <span class="iconfont icon-xiangqing" @click="showDeviceDetail(scope.row)"></span>
              <span class="iconfont icon-xiugai" @click="editDevice(scope.row)"></span>
              <span class="iconfont icon-shanchu" @click="deleteDevice(scope.row)"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-area"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="this.perPageNum"
        @current-change="handleCurrentChange">
      </el-pagination>
      <CaddPhone :childPhoneVisible="addPhoneVisible" :deviceId="currentDeviceId"></CaddPhone>
      <CphoneDetail :childPhoneVisible="phoneDetailVisible" :deviceId="detailDeviceId"></CphoneDetail>
      <ClendPhone :childPhoneVisible="lendVisible"></ClendPhone>
      <CreturnPhone :childPhoneVisible="returnVisible"></CreturnPhone>
    </div>
  </div>
</template>

<script>
import store from "../../../store/store"
import cAddPhone from './addPhone/addPhone' //新增设备
import cLendPhone from './lendPhone/lendPhone' //借设备
import cReturnPhone from './returnPhone/returnPhone' //还设备
import cPhoneDetail from './phoneDetail/phoneDetail' //设备详情


export default {
  components: {
    CaddPhone:cAddPhone,
    CphoneDetail:cPhoneDetail,
    ClendPhone:cLendPhone,
    CreturnPhone:cReturnPhone
  },
  data() {
    return {
      searchVal: "",
      selectVal: -1,
      onselectVal:-1,
      options: [
        {value:-1 , label:"全部"},
        {value:0 , label:"持有"},
        {value:1 , label:"已借出"},
        {value:2 , label:"已逾期"}
      ],
      onOptions: [
        {value:-1 , label:"全部"},
        {value:0 , label:"上线"},
        {value:1 , label:"下线"},
      ],
      lendData: store.state.storeLendList,
      repayData: store.state.storeRepayList,
      tableData:[],
      currentPage: 1,
      perPageNum: 10,
      totalNum:0,
      currentDeviceId: null,
      detailDeviceId: null,
      addPhoneVisible: {
        visible: false,
        ts: new Date().getTime()
      },
      phoneDetailVisible: {
        visible: false,
        ts: new Date().getTime()
      },
      lendVisible: {
        visible: false,
        ts: new Date().getTime()
      },
      returnVisible: {
        visible: false,
        ts: new Date().getTime()
      }
    }
  },
  created(){
    this.query()
  },
  methods: {
    requestQuery() {
      this.currentPage = 1;
      this.query()
    },
    //查询全部设备
    query() {
      let vm = this
      let ts = Date.parse(new Date())
      this.$http.get(`${this.API}getPhoneList`,{
        params: {
          search:vm.searchVal,
          loanType: vm.selectVal,
          pageNum: vm.currentPage,
          perPageNum:parseInt(vm.perPageNum),
          isDelete:vm.onselectVal,
          ts: ts
        }
      }).then(response => {
        let _data = response.data
        if (_data.success) {
          vm.tableData =  _data.data
          vm.tableData.forEach(v=>{
          	v.isDelete = v.isDelete>0?'已下线':'上线中'
          })
          vm.totalNum = Math.ceil(_data.pageNums)*vm.perPageNum;
          store.commit('updateQueryState', false);
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
    tableRowClassName({row, rowIndex}) {
      if (row.loanType == 2) {
        return 'danger-row';
      } else if (row.loanType == 1) {
        return 'warning-row';
      }else{
        return '';
      }

    },
    //选择设备
    selectDevice(item) {
      if(item.loanType ==0) {
        this.lendData = this.toggleFunc(item,this.lendData)
      } else {
        this.repayData = this.toggleFunc(item,this.repayData)
      }
    },
    //借设备
    lendDevice() {
      if(this.lendData.length > 0) {
        store.commit('updateLendList', this.lendData);
        this.lendVisible.visible = true
        this.lendVisible.ts = new Date().getTime()
      }

    },
    //偿还设备
    repayDevice() {
      if(this.repayData.length > 0) {
        store.commit('updateRepayList', this.repayData);
        this.returnVisible.visible = true
        this.returnVisible.ts = new Date().getTime()
      }

    },
    //新增设备
    addDevice() {
      this.addPhoneVisible.visible = true
      this.addPhoneVisible.ts = new Date().getTime()
      this.currentDeviceId = null
    },
    //显示设备详情
    showDeviceDetail(item) {
      this.phoneDetailVisible.visible = true
      this.phoneDetailVisible.ts = new Date().getTime()
      this.detailDeviceId = item.id
    },
    //修改设备
    editDevice(item) {
      this.addPhoneVisible.visible = true
      this.addPhoneVisible.ts = new Date().getTime()
      this.currentDeviceId = item.id
    },
    //删除设备
    deleteDevice(item) {
      var vm = this;
      vm.$confirm(`确认删除资产编号为【${item.assetNum}】的设备吗`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() =>{
        //点击确定
          this.$http.post(`${this.API}deletePhone`,{id:item.id}).then(function(response) {
            vm.$message({
              type: 'success',
              message: '删除成功!'
            });
            vm.query();
          }).catch(function(error) {
            vm.$message({
              type: 'error',
              message: '删除失败!'
            });
          });
      }).catch(() =>{
        //点击取消
        vm.$message({
            type: 'info',
            message: '取消删除'
        });
      });
    },
   //验证是否已经选择了设备
    toggleFunc(item,list) {
      var _list = list
      var _index = this.findElement(item,_list)
      if(_index >= 0) {
        _list.splice(_index,1)
      } else {
        _list.push({
          id:item.id,
          phoneType: item.phoneType,
          assetNum: item.assetNum
        })
      }
      return _list
    },
    //查询元素是否已存在的方法
    findElement(elem, list) {
      for (let i = 0; i < list.length; i++) {
        let flag = true;
        let current = list[i];
        for (var key in current) {
          if (elem[key] !== current[key]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return i;
        }
      }
      return -1;
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.query()
    }
  },
  computed: {
    queryState() {
      return store.state.storeQueryState
    }
  },
  watch: {
    searchVal(newVal,oldVal) {
      if(oldVal !== newVal && newVal === "") {
        this.query()
      }
    },
    queryState(newVal,oldVal) {
      if(oldVal !== newVal && newVal === true) {
        this.query()
      }
    }
  }
}
</script>

<style lang="css">
/* .device-page{width: 1200px;margin: 0 auto;} */
/*search-area*/
.device-nav-bar {
  margin: 16px 0;
  overflow: hidden;
}

.input-with-select {
  width: 300px;
  float:left;
}

.input-with-select .el-input-group__append {
  background-color: #fff;
}

.input-with-select .el-input-group__append .el-icon-search {
  color: #4bb5ff;
  font-size: 18px;
}

.device-select {
  width: 120px;
  float: left;
  margin-left: 8px;
}

.device-icon-area {
  float: right;
  margin-right: 8px
}

.device-icon-area .iconfont {
  width: 44px;
  height: 44px;
  line-height: 44px;
  margin-left: 20px;
  text-align: center;
  border-radius: 50%;
  float: left;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  position: relative;
}

.device-icon-area .iconfont.unable {
  background-color: #ccc
}

.device-icon-area .iconfont .icon-num {
  display: inline-block;
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  font-size: 12px;
  line-height: 18px;
}

.device-icon-area .icon-xinzeng {
  background-color: #57beff;
}


.device-icon-area .lend {
  background-color: #ff9663;
}

.device-icon-area .lend .icon-num {
  border: 1px solid #ff9663;
  color: #ff9663;
}

.device-icon-area .repay {
  background-color: #4dfb86;
}

.device-icon-area .repay .icon-num {
  border: 1px solid #4dfb86;
  color: #4dfb86;
}
/*device-content*/

.device-content {
  width: 1200px;
  background-color: #ffffff;
  border: solid 1px #ececec;
}

.device-table {
  width: 1147px;
  min-height:550px;
  margin:46px auto;
}

.el-table .danger-row {
  background: #ffeae8;
}
.el-table .warning-row {
  background: oldlace;
}
.el-table th {
  background: #f4f6f8;
}

.el-table th>.cell {
  text-align: center;
}

.el-table td>.cell {
  text-align: center;
  color:#888888;
}

.el-table td>.cell .last-icon .iconfont {
  margin: 0 4px;
}

.el-table td>.cell .iconfont {
  color: #2da8ff;
  visibility: hidden;
  cursor: pointer;
}

.el-table--enable-row-hover .el-table__body tr:hover>td {
  background:#eaf6ff;
}

.el-table--enable-row-hover .el-table__body tr:hover .iconfont {
  visibility: visible;
}

/*iconfont */
.el-table td>.cell .icon-daizi {
  font-size: 20px;
}


.pagination-area {
  margin: 20px 0;
  text-align: center;
}



/* 公用 */

* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.el-dialog {
  border-radius: 16px;
}

.el-dialog__wrapper .addPhonse {
  font-size: 14px;
  color: #000;
}

.el-dialog__wrapper .changePhonse {
  font-size: 14px;
  color: #000;
}

.el-dialog__wrapper .el-dialog__header {
  display: none;
}

.el-dialog__wrapper .el-dialog__body {
  padding: 48px 36px 20px;
  overflow: hidden;
}

.el-dialog__wrapper .el-dialog__body header {
  text-align: left;
}

.el-dialog__wrapper .el-input__inner {
  height: 28px;
}

.el-dialog__wrapper .el-form-item__content {
  width: 64% !important;
}

.el-dialog__wrapper .el-form-item {
  width: 50%;
  float: left;
  margin-bottom: 14px;
}

.el-dialog__wrapper .el-form-item__label {
  width: 100px !important;
  font-size: 12px;
  color: #666;
}

.el-dialog__wrapper .el-form-item__content {
  margin-left: 100px !important;
}

.el-dialog__wrapper .el-dialog__footer {
  width: 300px;
  margin: 0 auto;
}

/*公用*/

.el-dialog__wrapper .dialog-footer {
  display: block;
  width: 100%;
  padding-bottom: 50px
}

.el-dialog__wrapper button {
  width: 120px;
}

.el-dialog__body .el-form {
  padding: 40px 5%;
}

</style>
