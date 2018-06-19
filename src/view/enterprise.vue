<template>
	<div class="enterprise">
		<van-nav-bar title="企业信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="header">
			<van-swipe :autoplay="4000"  @change='headerSwiperChange' v-if='headerBanner'>
				<div class="imgBF" v-for="(image, index) in banner">
					<van-swipe-item :key="index">
						<div class="imgB" :style="{background: 'url('+image+') no-repeat',filter:'blur(20px)',zIndex:'2'}"></div>
						<div @click="onChange">
							<!--懒加载有些图片加载有问题-->
							<!--<img v-lazy="image" />-->
							<img :src="image" alt="" />
						</div>
					</van-swipe-item>
				</div>
			</van-swipe>
			<van-popup v-model="headerOneImgShow">
				<img style="width: 7.4rem;" @click='oneImg' :src="headerOneImg" alt="" />
			</van-popup>
			<div class="header_addr">
				<div class="name">{{company.name}}</div>
				<div class="addr">
					<van-icon name="location" />{{company.address}}</div>
			</div>
		</div>
		<div class="content">
			<div class="honor">
				<div class="content_header">资质荣誉</div>
				<!--资质荣誉-->
				<div v-if='honor.length>0' class="swiper-container honorSwiper" id='honorSwiper'>
					<div class="swiper-wrapper">

					</div>
					<!-- 如果需要分页器 -->
					<div class="swiper-pagination-honor"></div>
				</div>
				<div v-else style="text-align: center;font-size: .4rem; color: #797A78;">
					暂未上传荣誉证照
				</div>
			</div>
			<van-popup v-model="popupShow">
				<div class="swiper-container honorShow" id=''>
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="item in honorImg">
							<img :data-src="item" alt="" class="swiper-lazy" />
						</div>
					</div>
					<div class="swiper-pagination-honorShow"></div>
				</div>
			</van-popup>
			<div class="introduction">
				<div class="content_header">企业介绍</div>
				<div class="introduction_texrt">{{company.introduction}}</div>
			</div>
			<div class="tow_code" v-if='isCodeShow'>
				<div class="content_header">联系我们</div>
				<img :src="codeImg" alt="" />
				<p>
					扫描或长按二维码，获取更多养生之道
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import "./../scss/enterprise.scss"
	import wanjia_QRcode from '../assets/img/wanjia_code.png'
	import jinhe_QRcode from '../assets/img/jinhe_code.png'
	import {  Swipe, SwipeItem, Lazyload, Toast, NavBar, Popup, ImagePreview } from 'vant';
	Vue.use(Lazyload);
	var componentsArr = [ Swipe, SwipeItem, Toast, NavBar, Popup]
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
				headerBanner: true,
				headerBannerCount: 0,
				headerOneImgShow: false,
				headerOneImg: '',
				popupShow: false,
				honor: [],
				honorImg: [],
				honorShowSwiper: {},
				banner: [],
				company: {
					name:'',
					address:'',
					introduction:'',
				},
				isCodeShow:false,
				codeImg:'',
			}
		},
		computed: {

		},
		mounted() {
			if(TITLE=='宁夏万家香食品有限公司'){
				this.isCodeShow=true;
				this.codeImg=wanjia_QRcode
			}else if(TITLE=='宁夏金河科技股份有限公司'){
				this.codeImg=jinhe_QRcode
				this.isCodeShow=true;
			}
			if(document.documentElement && document.documentElement.scrollTop) {
				document.documentElement.scrollTop = document.body.scrollTop = 0;
			} else if(document.body) {
				document.body.scrollTop = 0;
			}
			this.init();
		},
		methods: {
			init() {
				this.$root.ajax({
					url: API_URL + "traceablity/getTraceablityInfo",
					type: 'get',
					param: {
						traceablityNo: this.$route.query.traceablityNo,
					},
				}).then((d) => {
					if(d.status == 'success' && typeof d.result != 'string') {
						Object.assign(this.company, d.result.company)
						this.honor = this.company.honor;
						for(let n = 0; n < this.honor.length; n++) {
							this.honorImg.push(IMG_URL + this.company.honor[n])
						}
						if(this.company.banner.length <= 0) {
							this.headerBanner = false;
						} else {
							for(let a = 0; a < this.company.banner.length; a++) {
								this.banner.push(IMG_URL + this.company.banner[a])
							}
						}
						if(this.honor.length>0&&this.honor!=null){
							this.$nextTick(() => {
								this.honorSwiper();
								this.honorShow();
							})
						}
					} else {
						Toast(d.result);
					}
				})
			},
			headerSwiperChange(index) {
				this.headerBannerCount = index
			},
			onChange() {
				if(this.banner.length >= 2) {
					const instance = ImagePreview(this.banner, this.headerBannerCount);
				} else {
					this.headerOneImgShow = true;
					this.headerOneImg = this.banner[0]
				}
			},
			oneImg(){
				this.headerOneImgShow = false;
			},
			//资质荣誉显示大图片的swiper
			honorShow() {
				var vm = this
				var honorShow = new Swiper('.honorShow', {
					//					observer: true,
					observeParents: true,
					lazyLoading: true,
					lazyLoadingOnTransitionStart: true,
					centeredSlides: true,
					//					virtualTranslate : true,
					width: window.innerWidth, //innerHeight
					height: window.innerHeight,
					pagination: '.swiper-pagination-honorShow',
					paginationType: 'fraction',
					onInit: function(swiper) {
						for(let i = 0; i < vm.honor.length; i++) {
							swiper.slides[i].style.transform = 'translate3d(' + ((vm.honor.length - 1) * 0.5) * swiper.width + 'px, 0px, 0px)';
						}
					},
					onClick:function(){
						honorShow.on('click', function(swiper){
						    vm.popupShow = false;
						})
					}
				});
//				if(vm.$root.getOS()=='pcOS'){
//					honorShow.on('click', function(swiper){
//					    vm.popupShow = false;
//					})
//				}else{
//					honorShow.on('tap', function(swiper){
//					    vm.popupShow = false;
//					})
//				}
				Object.assign(this.honorShowSwiper, honorShow)
			},
			//资质荣誉swiper
			honorSwiper() {
				var vm = this;
				var honorSwiper = new Swiper('#honorSwiper', {
					observeParents: true, //修改swiper的父元素时，自动初始化swiper
					paginationClickable: true,
					lazyLoading: true,
					lazyLoadingOnTransitionStart: true,
					centeredSlides: true,
					autoplay :4000,
					effect: 'coverflow',
					slidesPerView: 2, //显示几个silder
					spaceBetween: 50, //间隔
					slidesOffsetBefore: 0, //左侧的偏移量
					coverflow: {
						rotate: 0, //两侧的翻转角度
						stretch: 0, //左右的间隔
						depth: 200,
						modifier: 2,
						slideShadows: true
					},
					pagination: '.swiper-pagination-honor',
					paginationType: 'fraction',
					initialSlide: 1,
					onInit: function(swiper) {
						var isOneImgStr = '';
						if(vm.honor.length == 1) {
							isOneImgStr = '<img src="'
						} else {
							isOneImgStr = '<img data-src="'
						}
						for(var i = 0; i < vm.honor.length; i++) {
							var str = '<div class="swiper-slide">' +
								isOneImgStr + IMG_URL + vm.honor[i] + '" class="swiper-lazy" /> ' +
								'</div>'
							swiper.appendSlide(str);
						}
//						swiper.slideTo(1);
					},
					onClick:function(swiper){
						vm.honorShowSwiper.slideTo(swiper.activeIndex)
						vm.popupShow = true;
					}
				});
				//tap这种300ms的延迟点透在Safari上面有问题
//				if(vm.$root.getOS()=='pcOS'){
//					honorSwiper.on('click', function(swiper){
//						vm.honorShowSwiper.slideTo(swiper.activeIndex)
//						vm.popupShow = true;
//					})
//				}else{
//					honorSwiper.on('tap', function(swiper){
//						vm.honorShowSwiper.slideTo(swiper.activeIndex)
//						vm.popupShow = true;
//					})
//				}
			},
		}
	}
</script>

<style lang="scss">

</style>