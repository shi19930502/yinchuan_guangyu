<template>
	<div class="feedback">
		<van-nav-bar title="顾客反馈信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="pingfen">
			<div class="pingfen_title">评分</div>
			<div>
				<van-rate v-model="startValue" :size="25" :count="5" color="#F8C328" void-color="#c7c7c7" />
			</div>
		</div>
		<div class="content">
			<!--<van-cell-group>
				<van-field v-model="message" label="留言" type="textarea" placeholder="请输入留言" rows="1" autosize />
			</van-cell-group>-->
			<textarea class="textarea" placeholder="写评论...(最多200字)" name="" rows="" cols="">
				
			</textarea>
		</div>
		<van-uploader id='file' name='file' :after-read="onRead" multiple>
			<van-icon name="photograph" />
		</van-uploader>
		<van-button size="large" @click='submit'>提交</van-button>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios';
	import { NavBar, Uploader, Rate, Button, Field } from 'vant';
	import "./../scss/feedback.scss"
	var componentsArr = [Uploader, NavBar, Rate, Button, Field]
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
				if(Array.isArray(file)) {
					this.fileList = file
				} else {
					this.fileList = [file]
				}

			},
			submit() {
				var uploadImg = new FormData();
				uploadImg.append('file', this.fileList[0].file);
				console.log(uploadImg)
				axios({
						method: 'post',
						url: API_URL + 'upload',
						async: false,
						//						url: 'http://ytltzs.cn/api/gateway/comments/imgupload',
						//						headers: { "Content-Type": "application/x-www-form-urlencoded/" },
						//						headers:{},
						data: uploadImg,
						contentType: false,
						processData: false,
						transformRequest: [function(data) {
							// 对 data 进行任意转换处理
							console.log(data)
							return data;
						}],
					}).then((response) => {
						console.log(response.data)
					})
					.catch((error) => {
						console.log(error)
					})
			}
		},
	}
</script>

<style lang="scss">

</style>