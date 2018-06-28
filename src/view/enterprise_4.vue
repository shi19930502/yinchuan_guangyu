<template>
	<div class="enterprise">
		<van-nav-bar right-text="首页" @click-right="$root.onClickRight" title="企业信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="header">
			<van-swipe :autoplay="4000" @change='headerSwiperChange' v-if='headerBanner'>
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
						<!--<div class="swiper-slide" v-for="item in honorImg">
							<img :data-src="item" alt="" class="swiper-lazy" />
						</div>-->
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
		<div class="footer">
			<p class='footerName'>{{title}}追溯查询系统</p>
			<p class="jszc">技术支持：成都九洲电子信息系统股份有限公司</p>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	//	import VueLazyload from 'vue-lazyload'
	import "./../scss/enterprise.scss"
	import wanjia_QRcode from '../assets/img/wanjia_code.png'
	import jinhe_QRcode from '../assets/img/jinhe_code.png'
	import { Swipe, SwipeItem, Lazyload, Toast, NavBar, Popup, ImagePreview } from 'vant';
	Vue.use(Lazyload);
	//	Vue.use(VueLazyload)
	var componentsArr = [Swipe, SwipeItem, Toast, NavBar, Popup]
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
				title: TITLE,
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
					name: '',
					address: '',
					introduction: '',
				},
				isCodeShow: false,
				codeImg: '',
			}
		},
		computed: {

		},
		mounted() {
			if(TITLE == '宁夏万家香食品有限公司') {
				this.isCodeShow = true;
				this.codeImg = wanjia_QRcode
			} else if(TITLE == '宁夏金河科技股份有限公司') {
				this.codeImg = jinhe_QRcode
				this.isCodeShow = true;
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
						if(this.honor.length > 0 && this.honor != null) {
							this.$nextTick(() => {
								this.honorShow();
								this.honorSwiper();

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
			oneImg() {
				this.headerOneImgShow = false;
			},
			//资质荣誉显示大图片的swiper
			honorShow() {
				var vm = this
				var honorShow = new Swiper('.honorShow', {
					//					observer: true,
					observeParents: true,
					lazy: {
						loadPrevNext: true,
						loadPrevNextAmount: 1,
					},
					centeredSlides: true,
					width: window.innerWidth, //innerHeight
					height: window.innerHeight,
					pagination: {
						el: '.swiper-pagination-honorShow',
						type: 'fraction'
					},
					virtual: {
						slides: vm.honor,
						//				        renderExternal:function(data){
						//    						console.log(data)
						//				        },
						renderSlide: function(slide, index) {
							return `<div class="swiper-slide">
				    					<img  src=${IMG_URL}${slide} alt="" class="swiper-lazy list_img" />
				    				</div>`;
						},
					},
					on: {
						click: function() {
							honorShow.on('click', function(swiper) {
								vm.popupShow = false;
							})
						},
						slideChangeTransitionStart: function() {
							vm.countTransform(this, this.activeIndex)
						},
					},
					onClick: function() {
						honorShow.on('click', function(swiper) {
							vm.popupShow = false;
						})
					},
					onInit: function(swiper) {
						for(let i = 0; i < vm.honor.length; i++) {
							swiper.slides[i].style.transform = 'translate3d(' + ((vm.honor.length - 1) * 0.5) * swiper.width + 'px, 0px, 0px)';
						}
					},
				});

				//swiper4 Obje.assign突然就不行了
				//				Object.assign(this.honorShowSwiper, honorShow)
				this.honorShowSwiper = honorShow
			},
			//重新计算position过后的transform
			countTransform(swiper, activeIndex) {
				if(swiper.virtual.to - swiper.virtual.from == 0) {
					swiper.slideTo(activeIndex);
				} else if(swiper.virtual.to - swiper.virtual.from == 1) {
					swiper.slideTo(activeIndex);
					for(let i = 0; i < 2; i++) {
						swiper.slides[i].style.transform = 'translate3d(' + ((2 - 1) * 0.5) * swiper.width + 'px, 0px, 0px)';
					}
				} else {
					swiper.slideTo(activeIndex);
					for(let i = 0; i < 3; i++) {
						swiper.slides[i].style.transform = 'translate3d(' + ((2 - 1) * 0.5) * swiper.width + 'px, 0px, 0px)';
					}
				}
			},
			//资质荣誉swiper
			honorSwiper() {
				var vm = this;
				var honorSwiper = new Swiper('#honorSwiper', {
					observeParents: true, //修改swiper的父元素时，自动初始化swiper
					paginationClickable: true,
					lazy: {
						loadPrevNext: true,
						loadPrevNextAmount: 2,
					},
					//					lazyLoadingOnTransitionStart: true,
					centeredSlides: true,
					autoplay: {
						delay: 4000,
					},
					effect: 'coverflow',
					slidesPerView: 2, //显示几个silder
					spaceBetween: 50, //间隔
					slidesOffsetBefore: 0, //左侧的偏移量
					coverflowEffect: {
						rotate: 0, //两侧的翻转角度
						stretch: 0, //左右的间隔
						depth: 200,
						modifier: 2,
						slideShadows: true
					},
					pagination: '.swiper-pagination-honor',
					paginationType: 'fraction',
					pagination: {
						el: '.swiper-pagination-honor',
						type: 'fraction'
					},
					initialSlide: 1,
					on: {
						init: function(swiper) {
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
								this.appendSlide(str);
							}
							//						swiper.slideTo(1);
						},
						click: function() {
							console.log(this.activeIndex)
							vm.countTransform(vm.honorShowSwiper, this.activeIndex)
							//							if(this.activeIndex==0||this.activeIndex==(vm.honor.length-1)){
							//								//当只有一个的时候
							//								if(vm.honor.length==1){
							//									vm.honorShowSwiper.slideTo(this.activeIndex);
							//								}else{
							//									vm.honorShowSwiper.slideTo(this.activeIndex);
							//									//当点击第一个，但是后面还有的时候，触发两个
							//									for(let i = 0; i < 2; i++) {
							//										vm.honorShowSwiper.slides[i].style.transform = 'translate3d(' + ((2- 1) * 0.5) * vm.honorShowSwiper.width + 'px, 0px, 0px)';
							//									}
							//								}
							//								console.log('s',vm.honorShowSwiper.virtual.from);
							//								console.log('j',vm.honorShowSwiper.virtual.to);
							//							}else{
							//								for(let i = 0; i < 3; i++) {
							//									vm.honorShowSwiper.slides[i].style.transform = 'translate3d(' + ((2- 1) * 0.5) * vm.honorShowSwiper.width + 'px, 0px, 0px)';
							//								}
							//							}
							//							
							vm.popupShow = true;
						}
					},
					onClick: function(swiper) {
						vm.honorShowSwiper.slideTo(swiper.activeIndex)
						vm.popupShow = true;
					}
				});
			},
		}
	}
</script>

<style lang="scss">

</style>