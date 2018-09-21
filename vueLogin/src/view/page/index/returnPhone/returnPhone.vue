<template>
<!-- 增加弹层start -->
<div class="returnPhone">
  <v-result-alert v-on:hideHandleAlert="hideHandleAlert" :handleType.sync="handleType">
  </v-result-alert>
  <el-dialog :visible.sync="returnPhone.dialogVisible" width="700px">
    <header>归还设备</header>
    <el-form ref="returnPhone" :model="returnPhone" label-width="120px" class="returnPhone">
      <el-form-item label="设备" style="float:none;width:100%;" class="phoneListItem">
        <ul class="phoneList">
          <li v-for="(v,i) in returnPhone.repayData">
            <i class="cover" @click='deletePhone(i)'></i>
            <h1>{{v.phoneType}}</h1>
            <p>{{v.assetNum}}</p>
          </li>
        </ul>
      </el-form-item>
      <!--<el-form-item label="归还时间" >
                     <el-date-picker
                        v-model="returnPhone.returnTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
		  </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="returnPhone.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="returnHandle()">归 还</el-button>
        </span>
  </el-dialog>
</div>
<!-- 增加弹层end -->
</template>

<script>
import store from "../../../../store/store"
export default {
  name: 'returnPhone',
  data() {
    return {
      handleType: {
        hide: false, //显示 隐藏弹层
        result: false, //成功、失败
        message: '' //操作名称
      }, //操作类型
      phoneType: {}, //手机型号
      returnPhone: {
        repayData: store.state.storeRepayList,
        dialogVisible: false,
        //      returnTime:''
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
        this.returnPhone.dialogVisible = true
      },
      deep: true
    }
  },
  methods: {
    hideHandleAlert() {
      this.handleType.hide = false;
    },
    hideDeleteAlert() {
      this.phoneType.hide = false;
    },
    returnHandle() {

      var that = this;
      var mobileId = '';
      that.returnPhone.repayData.forEach(function(v) {
        mobileId = mobileId + v.id + ',';
      })
      this.$http.post(`${this.API}returnPhone`,{mobileId:mobileId}).then(function(res) {
        if (res.data.success) {
          that.returnPhone.dialogVisible = false;
          that.handleType = {
            hide: true, //显示 隐藏弹层
            result: true, //成功、失败
            message: '归还' //操作名称
          }
          that.returnPhone.repayData.splice(0, that.returnPhone.repayData.length);
          store.commit('updateRepayList', that.returnPhone.repayData);
          //调用主组件Query接口
          store.commit('updateQueryState', true);
        } 
        // else if (res.data.code == 1) {
        //   that.handleType = {
        //     hide: true, //显示 隐藏弹层
        //     result: false, //成功、失败
        //     message: '网络错误，请稍候重试！'
        //   };
        // } else if (res.data.code == 2) {
        //   that.handleType = {
        //     hide: true, //显示 隐藏弹层
        //     result: false, //成功、失败
        //     message: '登录超时，请重新登录！'
        //   };
        // }
      }).catch(function(err) {
        console.log(err)
      })
    },
    deletePhone(i) {
      this.returnPhone.repayData.splice(i, 1);
      // store.commit('updateRepayList', []);
      store.commit('updateRepayList', this.returnPhone.repayData);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


/*公用*/

.phoneList {
  overflow: hidden;
}

.phoneListItem .el-form-item__content {
  width: 80% !important;
}

.phoneList li {
  float: left;
  height: 28px;
  padding: 8px 12px;
  border: 1px solid #dde3e7;
  background: #f4f6f8;
  border-radius: 6px;
  margin: 7px 14px 7px 0;
  text-align: left;
  position: relative;
  padding-left: 30px;
}

.phoneList li::before {
  font-family: 'iconfont';
  content: '\e600';
  color: #3d8fff;
  font-size: 26px;
  margin-right: 6px;
  position: absolute;
  left: 4px;
  top: 4px;
}

.phoneList li h1 {
  font-size: 12px;
  color: #333;
  line-height: 18px;
}

.phoneList li p {
  font-size: 12px;
  color: #3d8fff;
  line-height: 12px;
}

.phoneList li .cover {
  width: 100%;
  height: 44px;
  background: #8dd3ff;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 6px;
  z-index: 2;
  cursor: pointer;
  display: none;
}

.phoneList li .cover::after {
  font-family: 'iconfont';
  content: '\e70b';
  display: block;
  width: 100%;
  text-align: center;
  font-style: normal;
  line-height: 46px;
  color: #fff;
  font-size: 20px;
}

.phoneList li:hover .cover {
  display: block;
}

/* 私用 */

.returnPhone header::before {
  font-family: 'iconfont';
  content: '\e64b';
  margin-right: 10px;
}
</style>
