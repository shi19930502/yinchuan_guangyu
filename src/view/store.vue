<template>
	<div class="store">
		<van-nav-bar title="店铺分布" right-text="首页" @click-right="$root.onClickRight" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div" ref='navDiv'></div>
		<div class="map_content">
			<div class="map" id='container' :style="mapStyle" ref='container'>

			</div>
			<div class="right_icon">
				<div id='dingwei' class="right_icon_top">
					<img src="../assets/img/dingwei.png" alt="" />
				</div>
				<a href="tel:0951-8960318" class="right_icon_bottom">
					<img src="../assets/img/phone.png" class="" alt="" />
				</a>

			</div>
			<div class="search_input">
				<input v-model='inputValue' @focus='inputFocus' class="input" type="text" name="keyword" id='keyword' placeholder="搜地点、搜店铺" />
			</div>
		</div>
	</div>
</template>

<script>
	var map, geolocation, toolBar, autocomplete;
	var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
	var windowsArr = [];
	var marker = [];
	import Vue from 'vue'
	import { NavBar } from 'vant';
	import "./../scss/store.scss"
	import iconImg from '../assets/img/location.png'
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
				},
				inputValue: ''
			}
		},
		destroyed() {
			var winWidth = window.innerWidth;
			// console.log(winWidth);
			document.documentElement.style.fontSize = winWidth / 750 * 100 + 'px';
		},
		mounted() {
			var vm = this;
			//设置根字体
			document.documentElement.style.fontSize = '16px';
			//设置地图高度
			var mapHeight = window.innerHeight - this.$refs.navDiv.clientHeight - 5
			this.mapStyle = {
				width: '100%',
				height: mapHeight + 'px'
			}
			//创建地图
			map = new AMap.Map('container', {
				resizeEnable: true,
				zoom: 20,
				keyboardEnable: false
			});

			map.plugin('AMap.Geolocation', function() {
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					timeout: 10000, //超过10秒后停止定位，默认：无穷大
					buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					buttonPosition: 'RB',
					useNative: true,
					buttonDom: document.getElementById('dingwei')
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', vm.onComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', vm.onError); //返回定位出错信息
			});
			this.$nextTick(() => {
				AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {
					var autoOptions = {
						//						city: "北京", //城市，默认全国
						input: "keyword" //使用联想输入的input的id
					};
					autocomplete = new AMap.Autocomplete(autoOptions);
					var placeSearch = new AMap.PlaceSearch({
						//						city: '北京',
						map: map
					})
					AMap.event.addListener(autocomplete, "select", function(e) {
						//TODO 针对选中的poi实现自己的功能
						placeSearch.setCity(e.poi.adcode);
						placeSearch.search(e.poi.name)
					});
				});

			})

			this.init()
		},
		methods: {
			inputFocus() {
				this.inputValue = ''
			},
			onComplete(data) {
				this.inputValue = ''
				console.log(data)
			},
			onError(data) {
				console.log(data)
			},
			markerClick(e){
				var arr=[];
				arr.push(e.target.title)
				arr.push(e.target.content)
				infoWindow.setContent(arr.join("<br/>") );
				infoWindow.open(map, e.target.getPosition());
			},
			init() {
				var vm=this
				this.$root.ajax({
					url: API_URL + "store/getAll",
					type: 'get',
				}).then((d) => {
					console.log(d)
					if(d.status == 'success') {
						d.result.forEach(function(i) {
							for(var i = 0, marker; i < d.result.length; i++) {
								var marker = new AMap.Marker({
									map: map,
									icon: iconImg,
									position: [d.result[i].longitude, d.result[i].latitude],
								});
								marker.title=d.result[i].name;
								marker.content = d.result[i].remark;
								marker.on('click', vm.markerClick);
//								marker.emit('click', { target: marker });
							}
//							  map.setFitView();
						})
					}

				})
			},
		},
	}
</script>

<style lang="scss">

</style>