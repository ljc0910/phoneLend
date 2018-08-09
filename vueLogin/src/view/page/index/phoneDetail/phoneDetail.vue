<template>
    <!-- 增加弹层start -->
    <div class="phoneDetail">
     
      <el-dialog
        :visible.sync="phoneFormDetail.dialogVisible"
        width="600px"
       >
        <header>设备详情</header>
        <el-form ref="phoneFormDetail" :model="phoneFormDetail"  label-width="120px" class="phoneFormDetail">
          <el-form-item label="资产编号：" style="float:none;">
                        <p>{{phoneFormDetail.assetNum}}</p>
					</el-form-item>
           <el-form-item label="品牌：">
						<p>{{phoneFormDetail.brand}}</p>
					</el-form-item>
          <el-form-item label="手机型号：">
						<p>{{phoneFormDetail.phoneType}}</p>
					</el-form-item>
          <el-form-item label="系统版本：" >
						<p>{{phoneFormDetail.systemVersion}}</p>
					</el-form-item>
		  <el-form-item label="是否在线：" >
						<p>{{phoneFormDetail.onLine}}</p>
					</el-form-item>
          <el-form-item label="CPU：">
						<p>{{phoneFormDetail.CPU}}</p>
					</el-form-item>
          <el-form-item label="GPU：">
						<p>{{phoneFormDetail.GPU}}</p>
					</el-form-item>
          <el-form-item label="分辨率：">
						<p>{{phoneFormDetail.resolution}}</p>
					</el-form-item>
          <el-form-item label="屏幕尺寸：">
						<p>{{phoneFormDetail.screenSize}}</p>
					</el-form-item>
          <el-form-item label="RAM：">
						<p>{{phoneFormDetail.RAM}}</p>
					</el-form-item>
          <el-form-item label="ROM：">
						<p>{{phoneFormDetail.ROM}}</p>
					</el-form-item>
          <el-form-item label="网络制式：">
						<p>{{phoneFormDetail.netSystem}}</p>
					</el-form-item>
           <el-form-item label="是否Root：">
						<p>{{phoneFormDetail.rootBool}}</p>
					</el-form-item>
          <el-form-item label="序列号：">
						<p>{{phoneFormDetail.serialNum}}</p>
					</el-form-item>
          <el-form-item label="IMEI：">
						<p>{{phoneFormDetail.IMEI}}</p>
					</el-form-item>
        </el-form>
    <el-form ref="lendPhoneDetail" :model="lendPhoneDetail" :rules="lendPhoneDetail.lendRules" label-width="120px" class="lendPhoneDetail" v-if="lendPhoneDetail.lendMan">
        <el-form-item label="出借人：" style="float:none;">
                <p>{{lendPhoneDetail.lendMan}}</p>
        </el-form-item>
        <el-form-item label="直属上级：" style="float:none;">
                <p>{{lendPhoneDetail.lendManLeader}}</p>
        </el-form-item>
        <el-form-item label="楼层：" >
                <p>{{lendPhoneDetail.lendFloor}}</p>
        </el-form-item>
        <el-form-item label="中心/工作室：">
                <p>{{lendPhoneDetail.lendCenter}}</p>
        </el-form-item>
        <el-form-item label="出借时间：" >
                <p>{{lendPhoneDetail.lendTime}}</p>
        </el-form-item>
        <el-form-item label="预计归还时间：" >
                <p>{{lendPhoneDetail.returnTime}}</p>
        </el-form-item>
        <el-form-item label="表格编号：" >
                <p>{{lendPhoneDetail.lendFormNum}}</p>
        </el-form-item>
         <el-form-item class="timeLength">
                <h1>{{lendPhoneDetail.timeLngth}}天</h1>
                <p v-show="lendPhoneDetail.beyondTime">逾期{{lendPhoneDetail.beyondTime}}天</p>
        </el-form-item>
    </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm()">取 消</el-button>
          <el-button type="primary" @click="resetForm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 增加弹层end -->
</template>

<script>
export default {
  name: 'phoneDetail',
  data () {
    return {
      phoneFormDetail:{
        dialogVisible: false,
        assetNum:'',
        brand:'',
        phoneType:'',
        systemVersion:'',
        CPU:'',
        GPU:'',
        resolution:'',
        screenSize:'',
        RAM:'',
        ROM:'',
        netSystem:'',
        rootBool:'',
        serialNum:'',
        IMEI:'',
        onLine:''
      },
      lendPhoneDetail:{
        lendMan:'',
        lendManLeader:'',
        lendFloor:'',
        lendCenter:'',
        lendTime:'',
        returnTime:'',
        lendFormNum:'',
        timeLngth:'',
        beyondTime:''
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
      handler(curVal,oldVal){
        this.getMobileDetail(this.deviceId)
      },
      deep:true
    }
  },
   methods: {
      resetForm(){
         this.phoneFormDetail.dialogVisible = false
         this.lendPhoneDetail={
          lendMan:'',
          lendManLeader:'',
          lendFloor:'',
          lendCenter:'',
          lendTime:'',
          returnTime:'',
          lendFormNum:'',
          timeLngth:'',
          beyondTime:''
        }
      },
      getMobileDetail(id){
      	var that = this;
      	var curTime = new Date().getTime();
      	this.$http.get("/api/getPhoneInfo", {
      		params:{
      			id:id,		//设备ID
      			curTime:curTime
      		}
      	}).then(function(res){
      		if(res.data.success){
            var mobileBean = res.data.data.mobileBean;
            if(res.data.data.borrowBean&&res.data.data.borrowBean.loanType!=0){
              var borrowBean = res.data.data.borrowBean;
            	var expectReturnTime = borrowBean.expectReturnTime.substring(0,19).replace(/-/g,'/')
              var borrowTime = borrowBean.lendTime.substring(0,19).replace(/-/g,'/')
              var timeLngth  = ((new Date().getTime() - new Date(borrowTime).getTime())/86400000).toFixed(1)  //已借出时长
              var beyondTime = ((new Date().getTime() - new Date(expectReturnTime).getTime())/86400000).toFixed(1)  //超时时长
              var isBeyondTime = beyondTime>0?beyondTime:false; //判断是否超时
              that.lendPhoneDetail={
                  lendMan:borrowBean.lendMan,
                  lendManLeader:borrowBean.lendManLeader,
                  lendFloor:borrowBean.lendFloor,
                  lendCenter:borrowBean.lendCenter,
                  lendTime:borrowBean.lendTime,
                  returnTime:borrowBean.expectReturnTime,
                  lendFormNum:borrowBean.lendFormNum,
                  timeLngth:timeLngth,
                  beyondTime:isBeyondTime
              }
            }
            var isRoot = ''; 
            if(mobileBean.root){
              isRoot = mobileBean.root>1?'否':'是';
            }
	      		that.phoneFormDetail={
	      			dialogVisible: true,
			        assetNum:mobileBean.assetNum,
			        brand:mobileBean.brand,
			        phoneType:mobileBean.phoneType,
			        systemVersion:mobileBean.systemVersion,
			        CPU:mobileBean.CPU,
			        GPU:mobileBean.GPU,
			        onLine:mobileBean.isDelete>0?'否':'是',
			        resolution:mobileBean.resolution,
			        screenSize:mobileBean.screenSize,
			        RAM:mobileBean.RAM,
			        ROM:mobileBean.ROM,
			        netSystem:mobileBean.netSystem,
			        rootBool:isRoot,
			        serialNum:mobileBean.serialNum,
			        IMEI:mobileBean.IMEI
	      		}
	      	}
      	}).catch(function(err){
      		console.log(err)
      	})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* 私用 */
  .phoneDetail header::before{font-family: 'iconfont';content:'\e63a' ;margin-right: 10px;}
  .phoneDetail .phoneFormDetail{overflow: hidden;margin-top: 20px;}
  .phoneDetail .phoneFormDetail p{font-size: 12px;color: #999;text-align: left;}
  .phoneDetail .lendPhoneDetail{overflow: hidden;background: #f8f9fa;border: 1px solid #eff3f8;border-radius: 16px;padding:20px 0 !important;position: relative;width:476px ;margin: 0 auto;;}
  .phoneDetail .lendPhoneDetail p{font-size: 12px;color: #999;text-align: left;}
  .phoneDetail .el-dialog__body .el-form{padding:0 5% ;}
  .phoneDetail .el-form-item{margin-bottom: 0;}
  .phoneDetail .timeLength{position: absolute;right: 0;top:26px;}
  .phoneDetail .timeLength h1{font-size: 30px;color: #3d8fff;line-height: 40px;text-align: left;margin:0;}
  .phoneDetail .timeLength p{font-size: 12px;color: #ff6969;line-height: 12px;}
  .phoneDetail .el-dialog{margin-top: 8vh !important;}
</style>
