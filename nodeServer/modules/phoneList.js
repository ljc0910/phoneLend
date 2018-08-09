const mongoose = require('mongoose')
const Schema = mongoose.Schema

const phoneListSchema = new Schema({
    id:{
        type:String,
        required:false,
        unique:false
    },
    assetNum:{
        type:String,
        required:true,
        unique:false
    },
    brand:{
        type:String,
        required:true,
        unique:false
    },
    phoneType:{
        type:String,
        required:true,
        unique:false
    },
    systemVersion:{
        type:String,
        required:true,
        unique:false
    },
    CPU:{
        type:String,
        required:false,
        unique:false
    },
    GPU:{type:String,
        required:false,
        unique:false
    },
    resolution:{
        type:String,
        required:false,
        unique:false
    },
    screenSize:{
        type:String,
        required:false,
        unique:false
    },
    RAM:{
        type:String,
        required:false,
        unique:false
    },
    ROM:{
        type:String,
        required:false,
        unique:false
    },
    netSystem:{
        type:String,
        required:false,
        unique:false
    },
    root:{
        type:String,
        required:false,
        unique:false
    },
    serialNum:{
        type:String,
        required:false,
        unique:false
    },
    IMEI:{
        type:String,
        required:false,
        unique:false
    },
    loanType:{      //筛选过滤 -1为全部  0为持有  1为已借出 2为已逾期
        type:Number,
        required:true,
        unique:false,
        default:0  
    },
    isDelete:{      //是否在线
        type:Number,
        required:true,
        unique:false
    },
    lendMan:{      //是否在线
        type:String,
        required:false,
        unique:false
    }
})

const Phonelist = mongoose.model('phoneList',phoneListSchema)

module.exports = Phonelist 