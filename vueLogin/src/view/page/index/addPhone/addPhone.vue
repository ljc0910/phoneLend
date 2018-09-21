<template>
<!-- 增加弹层start -->
<div class="addPhone">
  <v-result-alert v-on:hideHandleAlert="hideHandleAlert" :handleType.sync="handleType">
  </v-result-alert>

  <!-- <el-button type="text" @click="addOrchange()">增加</el-button> -->

  <el-dialog :visible.sync="addPhoneForm.dialogVisible" width="800px">
    <header class="addPhonse" v-if='!deviceId'>新增设备</header>
    <header class="changePhonse" v-if='deviceId'>修改设备信息</header>
    <el-form ref="addPhoneForm" :model="addPhoneForm" :rules="addRules" label-width="120px" class="addPhoneForm">
      <el-form-item label="资产编号" prop="assetNum" required style="float:none;">
        <el-input v-model='addPhoneForm.assetNum'>
        </el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="brand" required>
        <el-input v-model='addPhoneForm.brand'>
        </el-input>
      </el-form-item>
      <el-form-item label="手机型号" prop="phoneType" required>
        <el-input v-model='addPhoneForm.phoneType'>
        </el-input>
      </el-form-item>
      <el-form-item label="系统版本" prop="systemVersion" required >
        <el-input v-model='addPhoneForm.systemVersion'>
        </el-input>
      </el-form-item>
       <el-form-item label="是否在线" prop="onLine" required>
        <el-radio v-model="addPhoneForm.onLine" label="0">是</el-radio>
        <el-radio v-model="addPhoneForm.onLine" label="1">否</el-radio>
      </el-form-item>
      <el-form-item label="CPU" prop="CPU">
        <el-input v-model='addPhoneForm.CPU'>
        </el-input>
      </el-form-item>
      <el-form-item label="GPU" prop="GPU">
        <el-input v-model='addPhoneForm.GPU'>
        </el-input>
      </el-form-item>
      <el-form-item label="分辨率">
        <el-input style="width:46%;" v-model='addPhoneForm.resolution.height'>
        </el-input>
        *
        <el-input style="width:46%;" v-model='addPhoneForm.resolution.width'>
        </el-input>
      </el-form-item>
      <el-form-item label="屏幕尺寸" prop="screenSize">
        <el-input v-model='addPhoneForm.screenSize'>
        </el-input>
      </el-form-item>
      <el-form-item label="RAM" prop="RAM" required>
        <el-input v-model='addPhoneForm.RAM'>
        </el-input>
      </el-form-item>
      <el-form-item label="ROM" prop="ROM" required>
        <el-input v-model='addPhoneForm.ROM'>
        </el-input>
      </el-form-item>
      <el-form-item label="网络制式" prop="netSystem">
        <el-input v-model='addPhoneForm.netSystem'>
        </el-input>
      </el-form-item>
      <el-form-item label="是否Root" prop="root">
        <el-radio v-model="addPhoneForm.root" label="1">是</el-radio>
        <el-radio v-model="addPhoneForm.root" label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="序列号" prop="serialNum">
        <el-input v-model='addPhoneForm.serialNum'>
        </el-input>
      </el-form-item>
      <el-form-item label="IMEI" prop="IMEI">
        <el-input v-model='addPhoneForm.IMEI'>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSubmit('addPhoneForm')">取 消</el-button>
          <el-button type="primary" @click="submitAddForm('addPhoneForm')" v-if='!deviceId'>提 交</el-button>
          <el-button type="primary" @click="submitAddForm('addPhoneForm')" v-if='deviceId'>修 改</el-button>
        </span>
  </el-dialog>
</div>
<!-- 增加弹层end -->
</template>

<script>
import store from "../../../../store/store"
export default {
  name: 'addPhone',
  data() {
    return {
      handleType: {
        hide: false, //显示 隐藏弹层
        result: false, //成功、失败
        message: '' //操作名称
      },
      addPhoneForm: {
        dialogVisible: false,
        id: null, //增加、修改
        assetNum: '',
        brand: '',
        phoneType: '',
        systemVersion: '',
        CPU: '',
        GPU: '',
        resolution: {
          height: '',
          width: ''
        },
        screenSize: '',
        RAM: '',
        ROM: '',
        netSystem: '',
        root: '',
        serialNum: '',
        IMEI: '',
        onLine:''
      },
      addRules: {
          assetNum: [{
            required: true,
            message: '请输入资产编号',
            trigger: 'blur'
          }],
          brand: [{
            required: true,
            message: '请输入品牌',
            trigger: 'blur'
          }],
          phoneType: [{
            required: true,
            message: '请输入手机型号',
            trigger: 'blur'
          }],
          systemVersion: [{
            required: true,
            message: '请输入系统版本',
            trigger: 'blur'
          }],
          RAM: [{
            required: true,
            message: '请输入RAM',
            trigger: 'blur'
          }],
          ROM: [{
            required: true,
            message: '请输入ROM',
            trigger: 'blur'
          }],
          onLine:[{
            required: true,
            message: '请输入在线情况',
            trigger: 'blur'
          }]
        }
    }
  },
  props: {
    childPhoneVisible: {
      require: true
    },
    deviceId: {
      required: true
    }
  },
  watch: {
    childPhoneVisible: {
      handler(curVal, oldVal) {
        this.addOrchange()
      },
      deep: true
    }
  },
  methods: {
     restetaddForm(addPhoneForm) {
        this.$refs[addPhoneForm].resetFields(); 
        this.addPhoneForm= {
        dialogVisible: false,
        id: null, //增加、修改
        assetNum: '',
        brand: '',
        phoneType: '',
        systemVersion: '',
        CPU: '',
        GPU: '',
        resolution: {
          height: '',
          width: ''
        },
        screenSize: '',
        RAM: '',
        ROM: '',
        netSystem: '',
        root: '',
        serialNum: '',
        IMEI: '',
        onLine:''
      }
    },
    addOrchange() {
      if (this.deviceId) {
        this.getMobileDetail()
      } else {
        this.addPhoneForm.dialogVisible = true;
      }
    },
    hideHandleAlert() {
      this.handleType.hide = false;
    },
    getMobileDetail() {
      var that = this;
      this.$http.get(`${this.API}Getphone`, {
        params: {
          id: that.deviceId //设备ID
        }
      }).then(function(res) {
        if (res.data.success) {
          var mobileBean = res.data.data;
          var resolutionArr = mobileBean.resolution.split('*')
          that.addPhoneForm = {
            dialogVisible: true,
            handleType: false, //增加、修改
            assetNum: mobileBean.assetNum,
            brand: mobileBean.brand,
            phoneType: mobileBean.phoneType,
            systemVersion: mobileBean.systemVersion,
            CPU: mobileBean.CPU,
            GPU: mobileBean.GPU,
            resolution: {
              height: resolutionArr[0],
              width: resolutionArr[1]
            },
            screenSize: mobileBean.screenSize,
            RAM: mobileBean.RAM,
            ROM: mobileBean.ROM,
            netSystem: mobileBean.netSystem,
            root: mobileBean.root+'',
            serialNum: mobileBean.serialNum,
            IMEI: mobileBean.IMEI,
            onLine:mobileBean.isDelete+''
          }
        }
      })
    },
    cancelSubmit(addPhoneForm) {
        this.restetaddForm(addPhoneForm);
    },  
    submitAddForm(addPhoneForm) {
      var that = this;
      var dataArr = that.addPhoneForm;
      that.$refs[addPhoneForm].validate((valid) => {
        if (valid) {
          that.$http.post(`${this.API}Addorchange`, {
            id: that.deviceId,
            assetNum: dataArr.assetNum,
            brand: dataArr.brand,
            phoneType: dataArr.phoneType,
            systemVersion: dataArr.systemVersion,
            resolution: dataArr.resolution.height + '*' + dataArr.resolution.width,
            RAM: dataArr.RAM,
            ROM: dataArr.ROM,
            CPU: dataArr.CPU,
            GPU: dataArr.GPU,
            netSystem: dataArr.netSystem,
            root: dataArr.root,
            IMEI: dataArr.IMEI,
            serialNum: dataArr.serialNum,
            screenSize: dataArr.screenSize,
            isDelete:dataArr.onLine
          }).then(function(res) {
            if (res.data.success) {
              that.restetaddForm(addPhoneForm);           
              that.handleType = {
                hide: true, //显示 隐藏弹层
                result: true, //成功、失败
                message: dataArr.handleType ? '新增' : '修改', //操作名称
              };
              store.commit('updateQueryState', true);
            }else {
              that.handleType = {
                hide: true, //显示 隐藏弹层
                result: false, //成功、失败
                message: '网络错误，请稍候重试！'
              };
            }
          }).catch(function(err) {
            console.log(err)
            that.handleType = {
              hide: true, //显示 隐藏弹层
              result: false, //成功、失败
              message: '网络错误，请稍候重试！'
            };
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 私用 */

.addPhone .addPhonse::before {
  font-family: 'iconfont';
  content: '\e608';
  margin-right: 10px;
}

.addPhone .changePhonse::before {
  font-family: 'iconfont';
  content: '\e644';
  margin-right: 10px;
}
</style>
