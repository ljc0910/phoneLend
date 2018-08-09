const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lendInfoSchema = new Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    lendMan:{
        type:String,
        required:true,
        unique:false,
    },
    lendManLeader:{
        type:String,
        required:true,
        unique:false,
    },
    lendFloor:{
        type:String,
        required:true,
    },
    lendCenter:{
        type:String,
        required:true,
    },
    expectReturnTime:{
        type:String,
        required:true,
    },
    lendFormNum:{
        type:String,
        required:false,
    },
    returnTime:{
        type:String,
        required:false
    },
    lendTime:{
        type:String,
        required:false
    },
    loanType:{
        type:String,
        default:0
    }
})

const Lendinfo = mongoose.model('Lendinfo',lendInfoSchema)

module.exports = Lendinfo
