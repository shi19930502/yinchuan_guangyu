<template>
	<div class="store">
		<van-nav-bar title="店铺分布" right-text="首页" @click-right="$root.onClickRight" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div" ref='navDiv'></div>
		<div class="map_content">
			<div class="map" id='container' :style="mapStyle" ref='container'>

			</div>
			<div class="right_icon">
				<div @click='dingwei' class="right_icon_top">
					<img src="../assets/img/dingwei.png" alt="" />
				</div>
				<a href="tel:9090900" class="right_icon_bottom">
					<img src="../assets/img/phone.png" class="" alt="" />
				</a>

			</div>
			<div class="search_input">
				<input class="input" type="text" placeholder="搜地点、搜店铺" />
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { NavBar } from 'vant';
	import "./../scss/store.scss"
	var componentsArr = [NavBar]
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
				mapStyle: {
					width: '100%'
				}
			}
		},
		destroyed(){
			 var winWidth = window.innerWidth;
        	// console.log(winWidth);
        	document.documentElement.style.fontSize = winWidth / 750 * 100 + 'px';
		},
		mounted() {
       		document.documentElement.style.fontSize = '16px';

			var mapHeight = window.innerHeight - this.$refs.navDiv.clientHeight - 5
			console.log(window.innerHeight)
			console.log(this.$refs.navDiv.clientHeight)
			this.mapStyle = {
				width: '100%',
				height: mapHeight + 'px'
			}
			var map, geolocation;
			map = new AMap.Map('container', {
				resizeEnable: true,
				//		      	center: [104.06, 33.67],
				zoom: 15,
			});
			map.plugin('AMap.Geolocation',
				function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000, //超过10秒后停止定位，默认：无穷大
						buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false

					});
					map.addControl(geolocation);
					geolocation.getCurrentPosition();
					AMap.event.addListener(geolocation, 'complete', this.onComplete); //返回定位信息
					AMap.event.addListener(geolocation, 'error', this.onError); //返回定位出错信息
				}); 
			//地图中添加地图操作ToolBar插件
//			map.plugin(["AMap.ToolBar"], function() {
//				toolBar = new AMap.ToolBar({ locationMarker: customMarker }); //设置地位标记为自定义标记
//				map.addControl(toolBar);
//			});
			this.init()
		},
		methods: {
			onComplete(data){
				console.log(data)
			},
			onError(data){
				console.log(data)
			},
			dingwei() {
				console.log(123)
			},
			init() {
				this.$root.ajax({
					url: API_URL + "store/getAll",
					type: 'get',
				}).then((d) => {
					console.log(d)
					if(d.status == 'success') {
						//						Toast('评论成功！');
					}

				})
			},
		},
	}
</script>

<style lang="scss">

</style>