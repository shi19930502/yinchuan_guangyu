<template>
	<div class="client">
		<van-nav-bar title="顾客反馈信息" 
			left-text="返回" 
			left-arrow 
			right-text="首页" @click-right="$root.onClickRight"
			@click-left="$root.onClickLeft" 
			/>
		<div class="nav_div"></div>
		<div class="header">
			<div class="header_left">
				<div class="header_left_content">{{dataCount}}</div>
				<div class="header_left_label">反馈条数</div>
			</div>
			<!--<a href="tel:17380559502" >直接拨号</a>-->
			<router-link v-if='true' :to="{name:'feedback',query:{traceablityNo:$route.query.traceablityNo,varietyId:$route.query.varietyId,varietySpecId:$route.query.varietySpecId}}">
				<div class="header_right">
					<div>
						<van-icon name="edit-data" />
					</div>
					<div>撰写反馈</div>
				</div>
			</router-link>
		</div>
		<div class="content">
			<van-list v-model="loading" :finished="finished" @load="onLoad">
				<div v-for="item in list" class="content_list">
					<div class="list_name">{{item.breedName}} <span class="zd" v-if='item.top==1'>顶</span></div>
					<div class="list_start">
						<van-rate v-model="item.star" :size="25" :count="5" color="#F8C328" disabled-color='#F8C328' disabled void-color="#ceefe8" />
						<div class="timeF"><span class="time">{{item.createTime}}</span></div>
					</div>
					<div v-if='item.photo&&item.photo!=null'  class="list_img">
						<img v-for='(i,n) in item.photo.split(",")' :src="img_url+i" @click='lookImg(item.photo,n)' alt="" />
					</div>
					<div class="list_content" v-html="item.content">{{item.content}}</div>
				</div>
			</van-list>
		</div>
		<!--<div class="daodila">
			已经到底了，没有更多啦~~~~~
		</div>-->
		<van-popup @click-overlay='closePopup' v-model="listPopupShow">
			<div class="swiper-container listPopupShow" id='listPopupShow'>
				<div class="swiper-wrapper">

				</div>
				<!-- 如果需要分页器 -->
				<div class="swiper-pagination-farmChildrenPopupShow"></div>
			</div>
		</van-popup>
		<div :style="scrollTopStyle" @click="goTop" class="scrollTop">
			<van-icon name="upgrade" />
		</div>
		<div class="footer">
	    	<p class='footerName'>{{title}}追溯查询系统</p>
	    	<p class="jszc">技术支持：成都九洲电子信息系统股份有限公司</p>
	    </div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { NavBar, Rate, List, Popup } from 'vant';
	import "./../scss/client.scss";
	var componentsArr = [NavBar, Rate, List, Popup]
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
				dataCount: 0,
				img_url: IMG_URL,
				list: [],
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: 10,
				listPopupShow: false,
				ListPopupShowObj: {},
				scrollTopStyle: {
					display: "none"
				},
				imgArr:[],
			}
		},
		mounted() {
			this.listPopupShowSwiper()
			var vm = this;
			document.onscroll = function() {
				var scrollTop = 0;
				if(document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if(document.body) {
					scrollTop = document.body.scrollTop;
				}

				if(scrollTop > 300) {
					vm.orderDateStyle = {
						position: "fixed",
						top: 0
					}
					vm.isShowOrderDateFlexd = true;
				} else {
					vm.orderDateStyle = {
						position: "",
						top: 0
					}
					vm.isShowOrderDateFlexd = false;
				}
				if(scrollTop > 280) {
					vm.scrollTopStyle = { display: 'block' }
				} else {
					vm.scrollTopStyle = { display: 'none' }
				}
			}
		},
		methods: {
			goTop() {
				var timer = setInterval(function() {
					//获取滚动条的滚动高度
					var osTop = document.documentElement.scrollTop || document.body.scrollTop;
					//用于设置速度差，产生缓动的效果
					var speed = Math.floor(-osTop / 6);
					if(document.documentElement && document.documentElement.scrollTop) {
						document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
					} else if(document.body) {
						document.body.scrollTop = osTop + speed;
					}
					//      document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
					var isTop = true; //用于阻止滚动事件清除定时器
					if(osTop == 0) {
						clearInterval(timer);
					}
				}, 30);
			},
			lookImg(str, num) {
				var vm = this;
				var arr = str.split(',');
				console.log(arr)
				vm.listPopupShow=true;
				for(let a=0;a<arr.length;a++){
					this.ListPopupShowObj.virtual.appendSlide(`<div class="swiper-slide">
					    <img  src=${IMG_URL}${arr[a]} alt="" class="swiper-lazy list_img" />
					</div>`)
				}
				
				//移除所有的swiper
//				this.ListPopupShowObj.removeAllSlides();
//				setTimeout(function() {
//					vm.farmChildrenClick(arr, num)
//				}, 400)
			},
			farmChildrenClick(arr, num) {
				//動態SWIPER的str
				var vm = this
				vm.ListPopupShowObj.appendSlide(this.showSwiperAppendArr(arr));
				var count = null;
				if(arr.length == 1) {
					count = 2
				}
				count = arr.length;
				vm.ListPopupShowObj.slideTo(1);
				vm.ListPopupShowObj.slideTo(num);
				for(var i = 0; i < vm.ListPopupShowObj.slides.length; i++) {
					vm.ListPopupShowObj.slides[i].style.transform = 'translate3d(' + ((count - 1) * 0.5) * vm.ListPopupShowObj.width + 'px, 0px, 0px)';
				}
				this.listPopupShow = true
			},
			showSwiperAppendArr(arr) {
				var arrStr = [];
				for(let m = 0; m < arr.length; m++) {
					var str = '';
					str += `<div  class="swiper-slide">
									<img src=${IMG_URL+arr[m]} alt="" />
									</div>`
					arrStr.push(str)
				}
				return arrStr
			},
			//图片查看
			listPopupShowSwiper() {
				var vm = this
				var ListPopupShowObj = new Swiper('#listPopupShow', {
					observeParents: true,
					lazy: {
						loadPrevNext: true,
						loadPrevNextAmount: 1,
					},
					centeredSlides: true,
					width: window.innerWidth, //innerHeight
					height: window.innerHeight,
					pagination: {
						el: '.swiper-pagination-farmChildrenPopupShow',
						type: 'fraction'
					},
					virtual:true,
					on:{
						click:function(){
							vm.listPopupShow=false;
							this.virtual.slides.length=0;
           					this.virtual.cache=[]; 
						},
						slideChangeTransitionStart:function(){
							vm.ListPopupShowObj=this;
						},
					}
				});
				this.ListPopupShowObj=ListPopupShowObj
			},
			closePopup(){
				
				this.ListPopupShowObj.virtual.slides.length=0;
           		this.ListPopupShowObj.virtual.cache=[]; 
			},
			onLoad() {
				this.$root.ajax({
					url: API_URL + "Comment/page",
					type: 'get',
					param: {
						pageNum: this.pageNum,
						pageSize: 10
					}
				}).then((d) => {
					console.log(d)
					if(d.status == 'success') {
						this.dataCount = d.result.dataCount;
						for(let a = 0; a < d.result.listData.length; a++) {
							d.result.listData[a].createTime = this.filterTime(d.result.listData[a].createTime)
						}
						this.list = this.list.concat(d.result.listData)
						this.pageNum += 1
						this.loading = false;
						if(this.list.length >= d.result.dataCount) {
							this.finished = true;
						} else {
							this.finished = false;
						}
					} else {
						this.loading = false;
					}
				})
			},
			filterTime(time) {
				var date = new Date(time)
				return this.getDateAll(date)
			},
			getDateAll(date) {
				var year = date.getFullYear()
				var month = date.getMonth()
				var day = date.getDate()
				var h = date.getHours();
				var min = date.getMinutes();
				var s = date.getSeconds()
				var d = date.getFullYear() + '-' + (month < 10 ? '0' + (month + 1) : (month + 1)) + '-' + (day < 10 ? '0' + day : day) +
					' ' + (h < 10 ? '0' + h : h) + ":" + (min < 10 ? '0' + min : min) + ":" + (s < 10 ? '0' + s : s)
				return d
			},
		},
	}
</script>

<style lang="scss">

</style>