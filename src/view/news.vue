<template>
	<div class="news">
		<van-nav-bar title="时事动态" left-text="返回" left-arrow @click-left="$root.onClickLeft" />
		<div class="nav_div"></div>
		<div class="news_content" >
			<div class="title">{{newsObj.title}}</div>
			<div class="header">
				<img src="../assets/img/icon_logo.png" alt="" />
				<div class="right">
					<div class="right_1">金河乳液</div>
					<div class="right_2">{{newsObj.author}}&nbsp;|&nbsp;{{newsObj.publishTime}}</div>
				</div>
			</div>
			<div class="html_content"  v-html="newsObj.content">{{newsObj.content}}</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import "./../scss/news.scss"
	import { NavBar, Toast } from 'vant';
	var componentsArr = [NavBar, Toast ]
	Vue.use(function(Vue) {
		componentsArr.map(component => {
			Vue.component(component.name, component);
		});
		for(var key in componentsArr[0].components) {
			Vue.component(componentsArr[0].components[key].name, componentsArr[0].components[key]);
		}
	})
	export default{
		data(){
			return {
				newsObj:{
					title:'',
					author:'',
					content:'',
					cover:'',
					publishTime:'',
				},
			}
		},
		mounted(){
			if(document.documentElement && document.documentElement.scrollTop) {
				document.documentElement.scrollTop = document.body.scrollTop = 0;
			} else if(document.body) {
				document.body.scrollTop = 0;
			}
       		document.documentElement.style.fontSize = '16px';
			this.init()
		},
		methods:{
			init(){
				this.$root.ajax({
					url: API_URL + "news/getVisitCount/"+this.$route.query.newsId,
					type: 'get',
				}).then((d) => {
					this.newsObj=d.result
				})
			},
		},
		destroyed(){
			 var winWidth = window.innerWidth;
        	// console.log(winWidth);
        	document.documentElement.style.fontSize = winWidth / 750 * 100 + 'px';
		}
		
	}
</script>

<style>
</style>