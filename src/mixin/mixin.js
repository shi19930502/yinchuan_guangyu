import axios from 'axios';
import { Toast } from 'vant';
export default {
	data() {
		return {
			traceablityNo:'',
			longitude:null,
			latitude:null,
		}
	},
	mounted() {
		if(TITLE=='宁夏贺丰种业有限公司'){
			var hash=window.location.hash;
			if(hash.match('traceablityNo=')==null){
				Toast('请传入traceablityNo参数');
			}else{
				//微信扫码的时候会自动加入带有&的参数
				this.traceablityNo=hash.split('traceablityNo=')[1].split('&')[0]
			}
			this.getGeolocation();
		}
	},
	methods: {
		init() {
			this.ajax({
				url: API_URL + "traceablity/getTraceablityInfo",
				type: 'get',
				param: {
					traceablityNo: this.traceablityNo,
					longitude:	this.longitude,
					latitude: this.latitude,
				},
			}).then(d => {
				//要么引入vueX进行全局状态管理，较少请求次数
				console.log('d',d)
			})
		},
		getGeolocation() {
			var vm = this;
			var geolocation;
			var mapGeolocation = new AMap.Map('', {
				resizeEnable: true
			});
			mapGeolocation.plugin('AMap.Geolocation', function() {
				geolocation = new AMap.Geolocation({});
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', vm.onComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', vm.onError); //返回定位出错信息
			});
		},
		//获取成功的经纬度
		onComplete(data) {
			this.longitude=data.position.getLng();
			this.latitude=data.position.getLat()
//			alert("经度："+this.longitude+';纬度：'+this.latitude)
			this.init();
		},
		//获取失败调用
		onError(err) {
			console.log(err)
			this.init();
		},
		ajax({
			url: url,
			param: parmas,
			type: type,
		} = {}) {
			if(type == 'post' || type == 'get') {
				type = type
			} else {
				type = 'post'
			}
			if(type == 'post') {
				return new Promise((resolve, reject) => {
					axios({
							method: type,
							url: url,
							headers: { "Content-Type": "application/x-www-form-urlencoded" },
							data: parmas,
							transformRequest: [function(params) {
								var paramStr = '';
								for(var key in params) {
									paramStr += key + "=" + params[key] + "&";
								}
								return paramStr;
							}],
						}).then(function(response) {
							if(response.data.status == 'success') {
								resolve(response.data)
							} else {
								resolve(response.data)
								Toast(response.data.msg);
							}
						})
						.catch(function(error) {
							console.log(error);
							Toast('接口异常');
						});
				})
			} else {
				return new Promise((resolve, reject) => {
					axios.get(url, {
							params: parmas
						})
						.then(function(response) {
							if(response.data.status == 'success') {
								resolve(response.data)
							} else {
								resolve(response.data)
								Toast(response.data.msg);
							}

						})
						.catch(function(error) {
							console.log(error);

						});
				})
			}
		},
		//判断是否电脑的模拟手机并且给swiper加onClick或者onTap事件
		getOS() {
			if(this.isPcOS()) {
				return 'pcOS'
			} else {
				return 'sjOS'
			}
		},
		//判断操作系统
		isPcOS() {
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			if(isWin) return true; //'Win'
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			if(isMac) return true; //'Mac'
			var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
			if(isUnix) return true; //'Unix'
			var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
			if(isLinux) return true; //'Linux'
		},
		//获取是否PC端
		isPc() {
			var ua = navigator.userAgent;
			console.log(ua)
			if((ua.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))) {
				if(/iPhone|iPad|iPod/.test(ua)) {
					//'ios'
					return false
				} else if(/Android/.test(ua)) {
					//'android'
					return false
				}
			} else {
				//'pc'
				return true
			}
		},
		//获取手机名称
		getDeviceInfo(ua, a) {
			//		var ua = navigator.userAgent;
			//		var mm = ['iPhone', 'iPad', 'iPod', 'Nexus', 'BenQ-Siemens', 'Meizu', 'Xiaomi', 'BlackBerry', 'CoolPad', 'Dell', 'HTC', 'Huawei', 'Kindle', 'K-Touch', 'Lenovo', 'LG', 'Motorola', 'Nintendo', 'Nokia', 'Onda', 'OPPO', 'OLPC', 'Palm', 'PlayStation', 'Samsung', 'SonyXperia', 'SonyEricsson', 'vivo', 'ZTE', 'UbuntuPhone', 'UbuntuTablet', 'WindowsPhone']
			var devices = a,
				device,
				c,
				i = 0;
			while(device = devices[i++]) {
				var d = new RegExp("(" + device + ")", "i");
				if(d.test(ua.toLowerCase())) c = device;
			}
			switch(c) {
				case undefined:
					c = 'Android';
					break;
				case 'iPhone OS':
					c = 'iOS';
					break;
			}
			return c;
		},
		//获取时间格式化
		getDate(date) {
			var year = date.getFullYear()
			var month = date.getMonth()
			var day = date.getDate()
			var d = date.getFullYear() + '-' + (month < 10 ? '0' + (month + 1) : (month + 1)) + '-' + (day < 10 ? '0' + day : day)
			return d
		},
		//导航栏路由跳转
		onClickLeft() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
		},
		//获取url参数
		getQueryString(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		//获取来源渠道
		sources() {
			var ua = navigator.userAgent;
			var f = this.getQueryString('f');
			if(f != null) {
				return f;
			}
			var wxFrom = this.getQueryString('from');
			if(wxFrom != null) {
				if(wxFrom == 'groupmessage') {
					return 'Wechat';
				} else if(wxFrom == 'singlemessage') {
					return 'Weixin';
				}
			}
			if(f == null && wxFrom == null) {
				if(ua.match(/QQ/i) == "QQ") {
					return "QQ";
				}
				if(ua.match(/MicroMessenger/i) == "MicroMessenger") {
					return "Weixin";
				}
				return 'FitIdx'
			}
		}
	},
}