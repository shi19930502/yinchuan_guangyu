<template>
	<div class="base">
		<van-nav-bar title="基地信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="content">
			<div class="content_children">
				<div class="swiper-container" id='base'>
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for='farmEntityView in baseArr'>
							<div class="header">
								<!--autoplay="autoplay"-->
								<video v-if='farmEntityView.showHeaderImg' poster="../assets/img/video.png"  id="video1" controls="controls" >
									<source id="mp4_src" :src="farmEntityView.showHeaderImgSrc" type="video/mp4">
									<source id="ogg_src" :src="farmEntityView.showHeaderImgSrc" type="video/ogg"> 您的浏览器不支持 HTML5 video 标签。
								</video>
								<img v-else :src="farmEntityView.showHeaderImgSrc" alt="" />
							</div>
							<div v-if='isShowEnvironment(farmEntityView.fourList)' class="base_environment">
								<div class="content_header">基地环境</div>
								<ul>
									<li>
										<p>{{farmEntityView.fourList.wd}}</p>
										<p>温度(℃)</p>
									</li>
									<li>
										<p>{{farmEntityView.fourList.sd}}</p>
										<p>湿度(PF)</p>
									</li>
									<li>
										<p>{{farmEntityView.fourList.rz}}</p>
										<p>日照时间(h)</p>
									</li>
									<li>
										<p>{{farmEntityView.fourList.wc}}</p>
										<p>昼夜温差(°N)</p>
									</li>
								</ul>
							</div>
							<div v-if='isShowBasics(farmEntityView)' class="basics_info">
								<div class="content_header">基础信息</div>
								<div class="b_i_content">
									<ul>
										<li>
											<div class="name">基地名称</div>
											<div class="b_i_c_content">
												{{farmEntityView.name!=null?farmEntityView.name:"无"}}
											</div>
										</li>
										<li>
											<div class="name">基地编码</div>
											<div class="b_i_c_content">
												{{farmEntityView.no!=null?farmEntityView.no:"无"}}
											</div>
										</li>
										<li>
											<div class="name">基地面积</div>
											<div class="b_i_c_content">
												{{farmEntityView.area!=null?farmEntityView.area:"0"}}&nbsp;{{area}}
											</div>
										</li>
										<li>
											<div class="name">模式</div>
											<div class="b_i_c_content">
												{{farmEntityView.modelName!=null?farmEntityView.modelName:"无"}}
											</div>
										</li>
										<li>
											<div class="name">年产量</div>
											<div class="b_i_c_content">
												{{farmEntityView.outputQuantity!=null?farmEntityView.outputQuantity:"0"}}&nbsp;{{unit}}
											</div>
										</li>
										<li v-if='farmEntityView.remark!=null&&farmEntityView.remark'>
											<div class="name">基地描述</div>
											<div class="b_i_c_content">
												{{farmEntityView.remark}}
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<!-- 如果需要分页器 -->
					<div class="swiper-pagination-base"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import "./../scss/base.scss"
	import { NavBar, Toast } from 'vant';
	import hefeng from '../assets/img/hefeng.png'
	import jinhe from '../assets/img/jinhe.png'
	import mianfen from '../assets/img/mianfen.png'
	import ningbao from '../assets/img/ningbao.png'
	import wanjia from '../assets/img/wanjia.png'
	import yijude from '../assets/img/yijude.png'
	import yufengliangyou from '../assets/img/yufengliangyou.png'
	import yuxin from '../assets/img/yuxin.png'
	var componentsArr = [Toast, NavBar, ]
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
				//cli,要么图片放入static里面。要么url-loader不要7位数的hash，
				farmEntityView: {
					name: '',
					no: '',
					modelName: '',
					outputQuantity: '',
					area: '',
					showHeaderImg: false,
					showHeaderImgSrc: hefeng,
				},
				baseArr: [],
				showHeaderImg: false,
				showHeaderImgSrc: hefeng,
				countNum: 4,
				unit:'公斤',		
				area:'亩',
			}
		},
		computed: {

		},
		mounted() {
			if(document.documentElement && document.documentElement.scrollTop) {
				document.documentElement.scrollTop = document.body.scrollTop = 0;
			} else if(document.body) {
				document.body.scrollTop = 0;
			}
			this.init();
			this.baseSwiper();
			if(TITLE=='宁夏伊聚徳农工贸有限公司'){
				this.unit='只'
				this.area='平方米'
			}
			if(TITLE=='宁夏金河科技股份有限公司'){
				this.area='平方米'
			}
		},
		methods: {
			init() {
				var vm = this;
				this.$root.ajax({
					url: API_URL + "traceablity/getTraceablityInfo",
					type: 'get',
					param: {
						traceablityNo: this.$route.query.traceablityNo,
					},
				}).then((d) => {
					if(d.status == 'success' && typeof d.result != 'string') {
							if(d.result.farmEntityViewList == null || d.result.farmEntityViewList.length<=0) {
								var count = setInterval(function() {
									vm.countNum = vm.countNum - 1
									Toast('farmEntityViewList为空，' + vm.countNum + '秒后跳转到首页');
									if(vm.countNum == 1) {
										clearInterval(count)
									}
								}, 1000)
								setTimeout(function() {
									Toast.clear();
									vm.$router.push({ name: 'index', query: { traceablityNo: vm.$route.query.traceablityNo } })
								}, 4000)
							} else {
								var arr=d.result.farmEntityViewList
								for(let a=0;a<arr.length;a++){
									arr[a].fourList=this.filterEnvironment(arr[a].list);
									if(arr[a].video != null && arr[a].video != "") {
										var o=this.filterVideo(arr[a].video);
										arr[a].showHeaderImg=o.showHeaderImg;
										arr[a].showHeaderImgSrc=o.showHeaderImgSrc;
									} else {
										if(TITLE=='宁夏广玉面粉有限公司'){
											arr[a].showHeaderImgSrc=mianfen
										}else if(TITLE=='宁夏贺丰种业有限公司'){
											arr[a].showHeaderImgSrc=hefeng
										}else if(TITLE=='宁夏金河科技股份有限公司'){
											arr[a].showHeaderImgSrc=jinhe
										}else if(TITLE=='宁夏宁宝世家食品科技有限公司'){
											arr[a].showHeaderImgSrc=ningbao
										}else if(TITLE=='宁夏万家香食品有限公司'){
											arr[a].showHeaderImgSrc=wanjia
										}else if(TITLE=='宁夏伊聚徳农工贸有限公司'){
											arr[a].showHeaderImgSrc=yijude
										}else if(TITLE=='灵武市玉锋粮油综合加工有限公司'){
											arr[a].showHeaderImgSrc=yufengliangyou
										}else if(TITLE=='银川育新枸杞种业有限公司'){
											arr[a].showHeaderImgSrc=yuxin
										}
										arr[a].showHeaderImg=false;
									}
									this.baseArr.push(arr[a]) 
								}
						}
					} else {
						Toast(d.result);
					}
				})
			},
			isShowEnvironment(obj){
				if(obj.wd=='无'&&obj.sd=='无'&&obj.rz=='无'&&obj.wc=='无'){
					return false
				}else{
					return true
				}
			},
			isShowBasics(obj){
				if(obj.name==null&&obj.no==null&&obj.area==null&&obj.modelName==null&&obj.outputQuantit==null){
					return false 
				}else{
					return true
				}
			},
			//過濾環境
			filterEnvironment(arr) {
				var o = {
					wd: '无',
					sd: '无',
					rz: '无',
					wc: '无',
				};
				arr.forEach(function(el) {
					if(el.type == 1) {
						o.rz = el.data
					} else if(el.type == 2) {
						o.wc = el.data
					} else if(el.type == 3) {
						o.wd = el.data
					} else if(el.type == 4) {
						o.sd = el.data
					}
				})
				return o
			},
			filterVideo(str) {
				var o = {};
				o.showHeaderImg = true
				if(
					str.split('.')[1] == 'png' ||
					str.split('.')[1] == 'PNG' ||
					str.split('.')[1] == 'jpg' ||
					str.split('.')[1] == 'JPG' ||
					str.split('.')[1] == 'jepg' ||
					str.split('.')[1] == 'JEPG'
				) {
					o.showHeaderImg = false
					o.showHeaderImgSrc = IMG_URL + str
				} else {
					if(str.indexOf("://") > 0) {
						o.showHeaderImgSrc = str
					} else { //在线视频
						o.showHeaderImgSrc = VIDEO_URL + str
					}
				}
				return o
			},
			baseSwiper() {
				var vm = this;
				var baseSwiper = new Swiper('#base', {
					autoplay :4000,
					observer: true,
					observeParents: true, //修改swiper的父元素时，自动初始化swiper
					paginationClickable: true,
					lazyLoading: true,
					lazyLoadingOnTransitionStart: true,
					centeredSlides: true, //不居中的话那个swiper.activeIndex有问题
					slidesPerView: 'auto', //显示几个silder auto
					spaceBetween: 15, //间隔
					slidesOffsetBefore: 0, //左侧的偏移量
					pagination: '.swiper-pagination-base',
					paginationType: 'fraction',
					initialSlide: 0,
					onInit: function() {
						//						alert(333)
					}
				});
			},
		}
	}
</script>

<style lang="scss">

</style>