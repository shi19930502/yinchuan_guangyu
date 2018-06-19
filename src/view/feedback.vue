<template>
	<div class="feedback">
		<van-nav-bar title="基地信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="pingfen">
			<div class="pingfen_title">评分</div>
			<div>
				<van-rate v-model="startValue" :size="25" :count="5" color="#F8C328" void-color="#c7c7c7" />
			</div>
		</div>
		<div class="content">

		</div>
		<!--http://10.2.15.43:8082/uploae-->
		<!--http://ytltzs.cn/api/gateway/comments/imgupload-->
		<form method="post" action="http://10.2.15.43:8082/upload">
			<button type="submit">提交</button>
			<br />
			<van-uploader :after-read="onRead"  name="file"  multiple>
				<van-icon name="photograph" />
			</van-uploader>
		</form>

	</div>
</template>

<script>
	import Vue from 'vue'
	import { NavBar, Uploader, Rate } from 'vant';
	import "./../scss/feedback.scss"
	var componentsArr = [Uploader, NavBar, Rate]
	Vue.use(function(Vue) {
		componentsArr.map(component => {
			Vue.component(component.name, component);
		});
		for(var key in componentsArr[0].components) {
			Vue.component(componentsArr[0].components[key].name, componentsArr[0].components[key]);
		}
	})
	export default {
		data() {
			return {
				startValue: 5,
			}
		},
		mounted() {

		},
		methods: {
			onRead(file) {
				console.log(file)
			}
		},
	}
</script>

<style lang="scss">

</style>