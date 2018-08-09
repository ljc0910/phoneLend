<template>
<!-- 增加弹层start -->
<div class="resultAlert">
  <el-dialog :visible.sync="handleType.hide" width="470px">
    <i class='iSuccess' v-if="handleType.result"></i>
    <i class="iFalse" v-if="!handleType.result"></i>
    <h1 v-if="handleType.result">完成</h1>
    <h2 v-if="!handleType.result">错误信息如下</h2>
    <p v-if="handleType.result">{{handleType.message}}设备成功</p>
    <p v-if="!handleType.result">{{handleType.message}}</p>
    <el-button @click="hideAlert">返回</el-button>
  </el-dialog>
</div>
<!-- 增加弹层end -->
</template>

<script>
export default {
  name: 'resultAlert',
  props: {
    'handleType': [Object]
  },
  data() {
    return {}
  },
  methods: {
    hideAlert() {
      this.$emit('hideHandleAlert');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 公用 */

* {
  margin: 0;
  padding: 0;
}

.el-dialog {
  border-radius: 16px;
}

/* 私用 */

.resultAlert .iSuccess {
  width: 70px;
  display: block;
  margin: 0 auto;
}

.resultAlert .iFalse {
  width: 70px;
  display: block;
  margin: 0 auto;
}

.resultAlert .iSuccess::before {
  font-family: 'iconfont';
  content: '\e774';
  color: #38e389;
  font-size: 70px;
  font-style: normal;
}

.resultAlert .iFalse::before {
  font-family: 'iconfont';
  content: '\e6ee';
  color: #ff7664;
  font-size: 70px;
  font-style: normal;
  margin: 0 auto;
}

.resultAlert h1 {
  font-size: 16px;
  color: #38e389;
  line-height: 40px;
  text-align: center;
}

.resultAlert h2 {
  font-size: 16px;
  color: #ff7664;
  line-height: 40px;
  text-align: center;
}

.resultAlert p {
  font-size: 12px;
  color: #aaa;
  text-align: center;
}

.resultAlert .el-dialog__wrapper .el-dialog__body {
  padding-top: 70px;
}

.resultAlert button {
  display: block;
  width: 120px;
  margin: 0 auto;
  margin-top: 24px;
  margin-bottom: 50px;
}
</style>
