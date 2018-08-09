const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')	//生成token
const bcrypt = require('bcryptjs') //密码入库前加密
const User = require('../modules/user')	//mongoose.model模型

router.post('/user',(req,res,next)=>{
	const {username,passwords,type} = req.body
	if(type=='login'){
		User.findOne({name:username}).then(user=>{
			if(user != null){
				if(!bcrypt.compareSync(passwords,user.password)){ //验证密码
					res.json({
						success:false,
						message:'密码错误'
					})
				}else{ //密码正确
					const userToken = {
						name:user.name,
						id:user._id
					}
					//密钥
					const secret = 'jcgg'
					//生成token，添加失效日期
					const token = jwt.sign(userToken,secret)
					res.json({
						success:true,
						message:'登录成功',
						token:token
					})
					
				}
			}else{
				res.json({
					success:false,
					message:"用户不存在"
				})
			}
		})
	}else if(type=='register'){
		const salt = bcrypt.genSaltSync(10)	//盐值，密码强度（可选1~10）
		const hash = bcrypt.hashSync(passwords,salt)	//混淆加密
		const userInfo = {
			name:username, 
			password:hash
		}
		User.findOne({name:username}).count().then(count=>{
			if(count>0){
				res.json({
					success:false,
					message:'用户名已存在'
				})
			}else{
				User.create(userInfo).then(user => {
					res.json({
						success:true,
						message:'注册成功'
					})
				})
			}
		}).catch(next)
	}
})

module.exports = router