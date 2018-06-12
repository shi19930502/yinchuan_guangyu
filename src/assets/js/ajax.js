import axios from 'axios';
import { Toast } from 'vant';
var ajax=function({
		url:url,
		param:parmas,	
		type:type,
	}={}){
		if(type=='post'||type=='get'){
			type=type
		}else{
			type='post'
		}
		if(type=='post'){
			return new Promise((resolve,reject)=>{
				axios({
					method: type,
					url: url,
				   	headers: {"Content-Type": "application/x-www-form-urlencoded"},
					data: parmas,
					transformRequest:[function (params) {
					  	var paramStr='';
					  	for(var key in params){
					        paramStr += key + "=" + params[key] + "&";
					    }
					    return paramStr;
					}],
				}).then(function (response) {
					if(response.data.status=='success'){
				    	resolve(response.data)
					}else{
						resolve(response.data)
						Toast(response.data.msg);
					}
				})
				.catch(function (error) {
				    console.log(error);
				    Toast('接口异常');
				});
			})
		}else{
			url='./static/assets/json/ce1.json'
			url='./static/assets/json/ce2.json'
			return new Promise((resolve,reject)=>{
				axios.get( url, {
			    	params: parmas
				})
				.then(function (response) {
					if(response.data.status=='success'){
				    	resolve(response.data)
					}else{
						resolve(response.data)
						Toast(response.data.msg);
					}

				})
				.catch(function (error) {
				    console.log(error);
				    
				});
			})
		}
		
	
}
//export default和export的区别：export:{ajax},在前面可以import {ajax} from './.js'   default:import co from './.js' 
export {ajax} 
//function $ajax({
//	url: url,
//	param: parmas,
//	type: type,
//} = {}) {
//	if(type == 'post' || type == 'get') {
//		type = type
//	} else {
//		type = 'post'
//	}
//	return new Promise((resolve, reject) => {
//		axios({
//			method: type,
//			url: url,
//			headers: { "Content-Type": "application/x-www-form-urlencoded" },
//			data: parmas,
//			transformRequest: [function(params) {
//				var paramStr = '';
//				for(var key in params) {
//					paramStr += key + "=" + params[key] + "&";
//				}
//				return paramStr;
//			}],
//		}).then(function(response) {
//			resolve(response.data)
//		})
//		.catch(function(error) {
//			console.log(error);
//			Toast('接口异常');
//		});
//	})
//}