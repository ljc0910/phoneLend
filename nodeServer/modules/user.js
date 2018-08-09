const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	name:{
		type:String,
		required:[true,'Name field is required'],
		unique:true  //唯一性
	},
	password:{
		type:String,
		required:[true,'Password field is required']
	},
	created_at:{
		type:Date,
		required:true,
		default:Date.now()
	}
})

const User = mongoose.model('User',userSchema)

module.exports = User
