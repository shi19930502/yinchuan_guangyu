<template>
	<div class="feedback">
		<van-nav-bar title="撰写反馈" right-text="首页" @click-right="$root.onClickRight" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="pingfen">
			<div class="pingfen_title">评分</div>
			<div>
				<van-rate v-model="form.star" :size="25" :count="5" color="#F8C328" void-color="#c7c7c7" />
			</div>
		</div>
		<div class="content">
			<!--<van-cell-group>
				<van-field v-model="message" label="留言" type="textarea" placeholder="请输入留言" rows="1" autosize />
			</van-cell-group>-->
			<textarea @input="descInput" class="textarea" maxlength="200" v-model="form.content" placeholder="写评论...(最多200字)" name="" rows="" cols="">
				
			</textarea>
			<span class="residue">{{residue}}/200</span>
		</div>
		<!--<van-uploader id='file' name='file' :after-read="onRead" multiple>
			<van-icon name="photograph" />
		</van-uploader>-->
		<div class="upload_width">
			<el-upload ref="upload" :file-list="fileList" :limit='3' :on-error='onError' :on-success='onSuccess' :on-exceed='exceed' :on-change='imgChange' :accept='acceptImg' :action="imgAction" :auto-upload='autoUpload' list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
				<i class="el-icon-plus"></i>
			</el-upload>
		</div>
		<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>
		<van-button size="large" v-show='showUpload' @click='uploadImg'>上传图片</van-button>
		<van-button v-show='showSubmit' size="large" @click='submit'>提交</van-button>
		<p class="warning"><span style="color: red;">*注:&nbsp;</span>为了你的流量，请选好图片且浏览满意后，在点击上传图片。最后提交！</p>
		<div class="footer">
	    	<p class='footerName'>{{title}}追溯查询系统</p>
	    	<p class="jszc">技术支持：成都九洲电子信息系统股份有限公司</p>
	    </div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios';
	import { Upload, Dialog } from 'element-ui';
	import { NavBar, Uploader, Rate, Button, Field, Toast } from 'vant';
	import "./../scss/feedback.scss"
	var componentsArr = [Uploader, NavBar, Rate, Button, Field, Toast]
	Vue.use(Upload)
	Vue.use(Dialog)
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
				title:TITLE,
				form: {
					star: 5,
					commentId: null,
					varietyId: '',
					varietySpecId: '',
					content: '',
					photo: '',
					top: 0,
					visible: 1,
				},
				dialogImageUrl: '',
				dialogVisible: false,
				imgAction: API_URL + 'upload',
				autoUpload: false,
				acceptImg: 'image/*',
				residue: 200,
				imgCount: 0,
				imgSuccessCount: 0,
				showUpload: false,
				showSubmit: true,
				fileList: [],
			}
		},
		mounted() {
			this.form.varietySpecId = this.$route.query.varietySpecId
			this.form.varietyId = this.$route.query.varietyId
		},
		methods: {
			descInput() {
				var txtVal = this.form.content.length;
				this.residue = 200 - txtVal;
			},
			exceed(files, fileList) {
				console.log(files, fileList);
				console.log()
			},
			//改变图片
			imgChange(file, fileList) {
				console.log(file, fileList);
				const isLt2M = file.size / 1024 / 1024 < 2;
				if(!isLt2M) {
					Toast('上传图片不能大于2M')
					this.fileList = []
				} else {
					this.fileList = fileList;
					this.showUpload = true;
					this.showSubmit = false;
					if(fileList.length == 3) {
						document.getElementsByClassName('el-upload')[0].style = 'display:none'
					}
				}
				return isLt2M;
			},
			//移除图片
			handleRemove(file, fileList) {
				console.log(file, fileList);
				if(fileList.length == 0) {
					this.showUpload = false;
					this.showSubmit = true;
				}
				if(fileList.length < 3) {
					document.getElementsByClassName('el-upload')[0].style = 'display:inline-block'
				}
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			onRead(file) {
				console.log(file)
				if(Array.isArray(file)) {
					this.fileList = file
				} else {
					this.fileList = [file]
				}
			},
			uploadImg() {
				this.$refs.upload.submit();
				Toast.loading({
					mask: true,
					duration: 0,
					message: '图片上传中...'
				});
			},
			submit() {
				if(this.form.content) {
					this.$root.ajax({
						url: API_URL + "Comment/save",
						type: 'post',
						param: this.form,
					}).then((d) => {
						console.log(d)
						if(d.status == 'success') {
							Toast('评论成功！');
							this.$router.push({ name: 'client', query: { traceablityNo: this.$route.query.traceablityNo, varietyId: this.$route.query.varietyId, varietySpecId: this.$route.query.varietySpecId } })
						}

					})
				} else {
					Toast('请输入内容！')
				}
				console.log(this.form.content)

			},
			onError(response, file, fileList) {
				console.log(123)

			},
			onSuccess(response, file, fileList) {
				if(this.form.photo) {
					this.form.photo += "," + response.result
				} else {
					this.form.photo += response.result
				}
				var isSuccess = true;
				for(let a = 0; a < fileList.length; a++) {
					if(fileList[a].status == 'success') {
						isSuccess = true;
					} else {
						isSuccess = false;
						break
					}
				}
				if(isSuccess) {
					this.$nextTick(() => {
						this.showUpload = false;
						this.showSubmit = true;
					})
					Toast.clear();
				}
				if(response.status == "error") {
					Toast('图片上传成功，但未获取到返回路径，无法保存图片！')
				}

			},
		},
	}
</script>

<style lang="scss">

</style>