<template lang="html">
  <div class="footer">
    <p style = ''>thisisfooter</p>
  </div>
</template>

<script>
export default {
    data(){
        return{
            height:''
        }
    },
    created () {
        this.height = document.body.clientHeight +'px';
    }
}
</script>

<style lang="css">
    .footer{height: 100px;}
    .footer p{text-align: center;color: #dddddd;font-size: 14px;line-height: 100px;}
</style>
