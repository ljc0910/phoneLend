<template>
    <div class="nullPoint">
       this is null point
       <h1 @click="addStore()">{{test}}</h1>
    </div>
</template>

<script>	
export default {
  name: 'Content',
  data () {
    return {
      test:this.$store.state.count
    }
  },
  methods:{
     addStore(){
       this.$store.commit('increment')
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
</style>
