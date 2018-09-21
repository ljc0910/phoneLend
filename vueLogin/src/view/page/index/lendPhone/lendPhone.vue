<template>
<!-- 增加弹层start -->
<div class="lendPhone">
  <v-result-alert v-on:hideHandleAlert="hideHandleAlert" :handleType.sync="handleType">
  </v-result-alert>

  <el-dialog :visible.sync="lendPhone.dialogVisible" width="800px">
    <header>出借设备</header>
    <el-form ref="lendPhone" :model="lendPhone" :rules="lendPhone.lendRules" label-width="120px" class="lendPhone">
      <el-form-item label="设备" style="float:none;width:100%;" class="phoneListItem">
        <ul class="phoneList">
          <li v-for="(v,i) in lendPhone.lendPhoneList">
            <i class="cover" @click='deletePhone(i)'></i>
           <h1>{{v.phoneType}}</h1>
            <p>{{v.assetNum}}</p>

          </li>
        </ul>
      </el-form-item>
      <el-form-item label="出借人" prop="lendMan" required style="float:none;">
        <el-input v-model='lendPhone.lendMan'>
        </el-input>
      </el-form-item>
      <el-form-item label="直属上级" prop="lendManLeader" required style="float:none;">
        <el-input v-model='lendPhone.lendManLeader'>
        </el-input>
      </el-form-item>
      <el-form-item label="楼层" prop="lendFloor" required>
        <el-input v-model='lendPhone.lendFloor'>
        </el-input>
      </el-form-item>
      <el-form-item label="中心/工作室" prop="lendCenter" required>
        <el-input v-model='lendPhone.lendCenter'>
        </el-input>
      </el-form-item>
      <el-form-item label="预计归还时间" prop="returnTime" required>
        <el-date-picker v-model='lendPhone.returnTime' @change="getTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="表格编号" prop="lendFormNum">
        <el-input v-model='lendPhone.lendFormNum'>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSubmit('lendPhone')">取 消</el-button>
          <el-button type="primary" @click="lendHandle('lendPhone')">出 借</el-button>
        </span>
  </el-dialog>
</div>
<!-- 增加弹层end -->
</template>

<script>
import store from "../../../../store/store"
export default {
  name: 'lendPhone',
  data() {
    return {
      handleType: {
        hide: false, //显示 隐藏弹层
        result: false, //成功、失败
        message: '' //操作名称
      },
      lendPhone: {
        lendData: store.state.storeLendList,
        dialogVisible: false,
        radio: '1',
        lendPhoneList: store.state.storeLendList, //借出
        lendMan: '',
        lendManLeader: '',
        lendFloor: '',
        lendCenter: '',
        returnTime: '',
        lendFormNum: '',
        lendRules: {
          lendMan: [{
            required: true,
            message: '请输入出借人',
            trigger: 'blur'
          }],
          lendManLeader: [{
            required: true,
            message: '请输入直属上级',
            trigger: 'blur'
          }],
          lendFloor: [{
            required: true,
            message: '请输入楼层',
            trigger: 'blur'
          }],
          lendCenter: [{
            required: true,
            message: '请输入中心/工作室',
            trigger: 'blur'
          }],
          returnTime: [{
            required: true,
            message: '请输入预计归还时间',
            trigger: 'blur'
          }]
        }
      },
    }
  },
  props: {
    childPhoneVisible: {
      require: true
    }
  },
  watch: {
    childPhoneVisible: {
      handler(curVal, oldVal) {
        this.lendPhone.dialogVisible = true
      },
      deep: true
    }
  },
  methods: {
    hideHandleAlert() {
      this.handleType.hide = false;
    },
     restetaddForm(lendPhone) {
        this.$refs[lendPhone].resetFields();
        this.lendPhone.dialogVisible = false;
    },
    cancelSubmit(lendPhone){
      this.restetaddForm(lendPhone)
    },
    //时间转换start
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    getTime(date) {
      this.lendPhone.returnTime = date;
      var time = new Date(date);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      this.lendPhone.returnTime = year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
    },
    //end
    deletePhone(i) {
      this.lendPhone.lendData.splice(i, 1);
      store.commit('updateLendList', this.lendPhone.lendData);
    },
    lendHandle(lendPhone) {
      var that = this;
      var dataArr = that.lendPhone;
      that.$refs[lendPhone].validate((valid) => {
        if (valid) {
          var mobileId = '';
          that.lendPhone.lendPhoneList.forEach(function(v) {
            mobileId = mobileId + v.id + ',';
          })
          this.$http.post(`${this.API}lendPhone`, {
            mobileId: mobileId, //手机id
            lendMan: dataArr.lendMan,
            lendManLeader: dataArr.lendManLeader,
            lendFloor: dataArr.lendFloor,
            lendCenter: dataArr.lendCenter,
            expectReturnTime: dataArr.returnTime,
            lendFormNum: dataArr.lendFormNum,
          }).then(function(res) {
             if (res.data.success) {
              that.handleType = {
                hide: true, //显示 隐藏弹层
                result: true, //成功、失败
                message: '借出' //操作名称
              };
              that.lendPhone.dialogVisible = false;
              //重置仓库状态
              that.lendPhone.lendData.splice(0, that.lendPhone.lendData.length);
              store.commit('updateLendList', that.lendPhone.lendData);
              //调用主组件Query接口
              store.commit('updateQueryState', true);
              that.restetaddForm(lendPhone)
            } else if (res.data.code == 2) {
              //not login
            } else {
              //net err
            }
          }).catch(function(err) {
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* 私用 */

.lendPhone header::before {
  font-family: 'iconfont';
  content: '\e60e';
  margin-right: 10px;
}
</style>
