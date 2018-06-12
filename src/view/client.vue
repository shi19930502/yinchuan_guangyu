<template>
<div class="client">
	顾客反馈
</div>
</template>

<script>
	import Vue from 'vue'
	import { Uploader  } from 'vant';
	import "./../scss/client.scss"
	var componentsArr = [Uploader ]
	Vue.use(function(Vue) {
		componentsArr.map(component => {
			Vue.component(component.name, component);
		});
		for(var key in componentsArr[0].components) {
			Vue.component(componentsArr[0].components[key].name, componentsArr[0].components[key]);
		}
	})
export default{
	data(){
		return {
			
		}
	},
	mounted(){
		
	},
	methods:{
	    onRead(file) {
	      console.log(file)
	    }
	},
}
</script>

<style lang="scss">

</style>