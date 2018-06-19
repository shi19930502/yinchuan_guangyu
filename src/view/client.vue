<template>
<div class="client">
	<van-nav-bar title="基地信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
	<div class="nav_div"></div>
	<div class="header">
		<div class="header_left">
			<div class="header_left_content">1236</div>
			<div class="header_left_label">反馈条数</div>
		</div>
		<!--<a href="tel:17380559502" >直接拨号</a>-->
		<router-link v-if='true' :to="{name:'feedback',query:{traceablityNo:$route.query.traceablityNo}}">
			<div class="header_right">
				<div><van-icon name="edit-data" /></div>
				<div>撰写反馈</div>
			</div>
		</router-link>
	</div>
	<div class="content">
		<div class="content_list">
			<div class="list_name">快来玩按市场</div>
			<div class="list_start">
				<van-rate
				  v-model="startValue"
				  :size="25"
				  :count="5"
				  color="#F8C328"
				 disabled-color='#F8C328'
				 disabled
				  void-color="#ceefe8"
				/> 
				 <div class="timeF"><span class="time">2018-06-15</span></div>
			</div>
			<div v-if='false' class="list_img">
				<img src="" alt="" />
			</div>
			<div class="list_content">整体感觉还不错呢，他家的面粉特别棒</div>
		</div>
		<div class="content_list">
			<div class="list_name">快来玩按市场</div>
			<div class="list_start">
				<van-rate
				  v-model="startValue"
				  :size="25"
				  :count="5"
				  color="#F8C328"
				 disabled-color='#F8C328'
				 disabled
				  void-color="#ceefe8"
				/> 
				 <div class="timeF"><span class="time">2018-06-15</span></div>
			</div>
			<div v-if='false' class="list_img">
				<img src="" alt="" />
			</div>
			<div class="list_content">整体感觉还不错呢，他家的面粉特别棒</div>
		</div>
	</div>
</div>
</template>

<script>
	import Vue from 'vue'
	import { NavBar,Rate   } from 'vant';
	import "./../scss/client.scss"
	var componentsArr = [NavBar,Rate  ]
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
			startValue:3,
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			///Comment/pageInfo
			this.$root.ajax({
					url: API_URL + "Comment/pageInfo",
					type: 'get',
					param: {
//						traceablityNo: this.$route.query.traceablityNo,
					},
			}).then((d) => {
				console.log(d)
			})
		},
	    onRead(file) {
	      console.log(file)
	    }
	},
}
</script>

<style lang="scss">

</style>