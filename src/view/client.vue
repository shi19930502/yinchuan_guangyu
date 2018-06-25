<template>
	<div class="client">
		<van-nav-bar title="顾客反馈信息" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="header">
			<div class="header_left">
				<div class="header_left_content">{{dataCount}}</div>
				<div class="header_left_label">反馈条数</div>
			</div>
			<!--<a href="tel:17380559502" >直接拨号</a>-->
			<router-link v-if='true' :to="{name:'feedback',query:{traceablityNo:$route.query.traceablityNo,specifications:$route.query.specifications,varietyId:$route.query.varietyId,varietySpecId:$route.query.varietySpecId}}">
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
					<div v-if='item.photo&&item.photo!=null' v-for='(i,n) in item.photo.split(",")' class="list_img">
						<img :src="img_url+i" @click='lookImg(item.photo,n)' alt="" />
					</div>
					<div class="list_content" v-html="item.content">{{item.content}}</div>
				</div>
			</van-list>
		</div>
		<van-popup v-model="listPopupShow">
			<div class="swiper-container listPopupShow" id='listPopupShow'>
				<div class="swiper-wrapper">

				</div>
				<!-- 如果需要分页器 -->
				<div class="swiper-pagination-farmChildrenPopupShow"></div>
			</div>
		</van-popup>
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
				dataCount: 0,
				img_url: IMG_URL,
				list: [],
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: 10,
				listPopupShow: false,
				ListPopupShowObj: {},
			}
		},
		mounted() {
			this.listPopupShowSwiper()
			console.log(this.$route.query.varietySpecId)
			console.log(this.$route.query.varietyId)
		},
		methods: {
			lookImg(str, num) {
				var vm = this;
				var arr = str.split(',');
				//移除所有的swiper
				this.ListPopupShowObj.removeAllSlides();
				setTimeout(function() {
					vm.farmChildrenClick(arr, num)
				}, 400)
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
					lazyLoading: true,
					lazyLoadingOnTransitionStart: true,
					lazyLoadingInPrevNext: true,
					centeredSlides: true,
					width: window.innerWidth, //innerHeight
					height: window.innerHeight,
					pagination: '.swiper-pagination-farmChildrenPopupShow',
					onSlideChangeStart: function(swiper) {
						Object.assign(vm.ListPopupShowObj, swiper)
					},
					paginationType: 'fraction',
				});
				Object.assign(this.ListPopupShowObj, ListPopupShowObj)
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