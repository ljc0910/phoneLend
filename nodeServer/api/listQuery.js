const express = require('express')
const router = express.Router()
const Phonelist = require('../modules/phoneList')	//mongoose.model模型
const Lendinfo = require('../modules/lendInfo')	//mongoose.model模型

let add0 = (m)=>{
    return m < 10 ? '0' + m : m
}
let getTime  =()=>{
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      return year + '-' + add0(month) + '-' +add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
}
let isYuQi = (t)=>{
    var time = t+'';
    return new Date(time).getTime() - new Date().getTime()>0?false:true;
}
router.get('/getPhoneList',(req,res,next)=>{                //获取设备表单
    const{search,loanType,pageNum,perPageNum,isDelete} = req.query
    let Count = (pageNum-1)*perPageNum;
    let pageNums = '';  //总页数长度
    let regex = new RegExp(search, 'ig');
    let loanTyperegex = loanType==-1?[0,1,2]:loanType 
    let isDeleteregex = isDelete==-1?[0,1]:isDelete
    let yuqiArr = []    //逾期id
    Lendinfo.find({loanType:1},{expectReturnTime:1,id:1},(err,docs)=>{      //查找逾期数据
        if(docs.length>0){
            for(let i=0;i<docs.length;i++){
                if(isYuQi(docs[i].expectReturnTime)){
                    yuqiArr.push(docs[i].id)
                }
            }
            Phonelist.update({id:yuqiArr},{'$set':{loanType:2}},{multi: true},(err,docs)=>{
                yuqiArr = []
            })
        }
    })
    Phonelist.find({ $or: [ { assetNum: regex },{brand:regex},{phoneType:regex}],
        isDelete: isDeleteregex ,loanType:loanTyperegex}).then((docs)=>{
            pageNums = docs.length/perPageNum;
            Phonelist.find({ $or: [ { assetNum: regex },{brand:regex},{phoneType:regex}],
                isDelete: isDeleteregex ,loanType:loanTyperegex}).limit(parseInt(perPageNum)).skip(Count).then((docs)=>{
                    res.json({
                        success:true,
                        data:docs,
                        pageNums:pageNums
                    })
                }).catch(next)
        })
})

router.post('/deletePhone',(req,res,next)=>{                //删除设备
    const id = req.body.id
    Phonelist.remove({id:id}).then(
        del =>{
            res.json({
                success:true,
                message:'删除成功'
            }) 
        }
    ).catch(next)

})

router.post('/lendPhone',(req,res,next)=>{                  //借出设备
    const{mobileId,lendMan,lendManLeader,lendFloor,lendCenter,expectReturnTime,lendFormNum} = req.body
    let idArr = mobileId.split(',')
    let arrList = [];
    for(let i =0;i<idArr.length;i++){
        arrList.push({
            id:idArr[i],
            loanType:1,
            lendMan:lendMan,
            lendManLeader:lendManLeader,
            lendFloor:lendFloor,
            lendCenter:lendCenter,
            expectReturnTime:expectReturnTime,
            lendFormNum:lendFormNum,
            lendTime:getTime(),
            returnTime:''
        })
    }
    Lendinfo.find({id:idArr},(err,docs)=>{
        if(docs.length>0){      //修改
            Lendinfo.update({id:idArr},{'$set':{loanType:1,lendMan:lendMan,lendManLeader:lendManLeader,
                lendFloor:lendFloor,lendCenter:lendCenter,expectReturnTime:expectReturnTime,lendFormNum:lendFormNum,
                lendTime:getTime(),returnTime:''}},{multi: true},(err,docs)=>{
            })
            Lendinfo.create(arrList,(err,docs)=>{
            })
        }else{                  //新增
            Lendinfo.create(arrList,(err,docs)=>{
            })
        }
        Phonelist.update({id:idArr},{'$set':{loanType:1}},{multi: true}).then(
            loan=>{         
                res.json({
                    success:true,
                    message:'借出成功' 
                })
            }
        )
    })

    Phonelist.update({id:idArr},{'$set':{lendMan:lendMan}},{multi: true})
})

router.post('/returnPhone',(req,res,next)=>{                //归还设备
    const mobileId  = req.body.mobileId
    let idArr = mobileId.split(',')
    let cutTime = getTime()
    Lendinfo.update({id:idArr},{'$set':{returnTime:cutTime,loanType:0}},{multi: true},(err,docs)=>{
        Phonelist.update({id:idArr},{'$set':{loanType:0}},{multi: true}).then(
            loan=>{
                res.json({
                    success:true,
                    message:'归还成功' 
                })
            }
         )
    })

})

router.get('/getPhoneInfo',(req,res,next)=>{
    const id = req.query.id
    Phonelist.find({id:id},(err,docs1)=>{
        Lendinfo.find({id:id},(err,docs2)=>{
            res.json({
                success:true,
                data:{
                    mobileBean:docs1[0],
                    borrowBean:docs2?docs2[0]:''
                }
            })
        })
    })
})

router.get('/getLendDetail',(req,res,next)=>{
    let pageNum = req.query.pageNum-1
    Phonelist.find({},{phoneType:1,assetNum:1,id:1},(err,docs)=>{
        Lendinfo.find({},{lendMan:1,lendTime:1,returnTime:1,id:1},(err,docs2)=>{
            let dataArr = [];
            for(let i =0;i<docs.length;i++){
                for(let j = 0;j<docs2.length;j++){
                    if(docs[i].id==docs2[j].id){
                        dataArr.push({
                            phoneType:docs[i].phoneType,
                            assetNum:docs[i].assetNum,
                            lendMan:docs2[j].lendMan,
                            lendTime:docs2[j].lendTime,
                            returnTime:docs2[j].returnTime,
                        })
                    }
                }
            }
            let limitData =(dataArr.length-pageNum*10)<10?dataArr.slice(pageNum*10,dataArr.length) :dataArr.slice(pageNum*10,pageNum*10+10)
            res.json({
                success:true,
                data:limitData,
                pageNums:dataArr.length/10
            })   
        })
    })
})
module.exports = router