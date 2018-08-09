<template lang="html">
  <div class="header">
    <div class="header-wrap clearfix">
      <div class="top-choice clearfix">
        <router-link to="/Page/index">设备列表</router-link>
        <router-link to="/Page/lendDetail">借出统计</router-link>
        <div class="login">
        <i class="iconfont icon-face-copy"></i>
        <span>{{$store.state.loginInfo.userName}}</span>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/store"
export default {
}
</script>

<style lang="css">
.header {
  width: 100%;
  background-color: #fff;
	border-bottom:1px solid #ececec;
}
.header-wrap {
  width: 1200px;
  height: 80px;
  margin: 0 auto;
}

.header-wrap .logo{
  line-height: 80px;
  margin-top: 20px;
  float: left;
}
.header-wrap .top-choice{
  position: relative;
	width: 1200px;
	height: 80px;
  float: left;
  text-align: center;
  line-height: 80px;
}
.header-wrap .top-choice a {
  display: inline-block;
  height: 79px;
  font-size: 14px;
  color: #888888;
  text-decoration: none;
  padding: 0 10px;
  margin: 0 12px;
}

.header-wrap .top-choice .router-link-active {
  border-bottom: 2px solid #2da8ff;
}
.header-wrap .login{
  float: right;
	width: 120px;
  height: 80px;
  position: absolute;
  right:30px;top:0;
  text-align: right;
  vertical-align: middle;
  cursor: default;
}
.header-wrap .login span {
  color: #888888;
  font-size: 14px;
  line-height: 80px;
}
.header-wrap .login .iconfont{
  display: inline-block;
  color: #eaeaea;
	font-size:30px;
	padding-right: 3px;
  vertical-align: middle;
}
</style>
