const express = require('express')
const router = express.Router()
const Phonelist = require('../modules/phoneList')	//mongoose.model模型


router.get('/Getphone',(req,res,next)=>{
    const id = req.query.id
    Phonelist.findOne({id:id},(err,docs) =>{
        if(err) return console.log(err);
        res.json({
            success:true,
            data:docs 
        })
    }).catch(next)
})


router.post('/Addorchange',(req,res,next)=>{
    const {id,assetNum,brand,phoneType,systemVersion,resolution,RAM,ROM,CPU,GPU,netSystem,root,
        IMEI,serialNum,screenSize,isDelete} = req.body
    if(id==null){   //新增操作
        Phonelist.find({},{id:1},(err,count)=>{    //查询已存id数
            if (err) return handleError(err);
            let newId = count.length>0?Number(count[count.length-1].id)+1:0;//当前集合最大id+1            
            Phonelist.create({
                id:newId,
                isDelete:isDelete,
                assetNum:assetNum,
                brand:brand,
                phoneType:phoneType,
                systemVersion:systemVersion,
                resolution:resolution,
                RAM:RAM,
                ROM:ROM,
                CPU:CPU,
                GPU:GPU,
                netSystem:netSystem,
                root:root,
                IMEI:IMEI,
                serialNum:serialNum,
                screenSize:screenSize
            }).then(Add =>{
                res.json({
                    success:true,
                    message:'添加成功'
                })
            }).catch(next)
        })
    }else{          //修改操作
        Phonelist.update({'id':id},{
            isDelete:isDelete,
            assetNum:assetNum,
            brand:brand,
            phoneType:phoneType,
            systemVersion:systemVersion,
            resolution:resolution,
            RAM:RAM,
            ROM:ROM,
            CPU:CPU,
            GPU:GPU,
            netSystem:netSystem,
            root:root,
            IMEI:IMEI,
            serialNum:serialNum,
            screenSize:screenSize
        },{multi: true}).then(  //multi是否允许更新多个
            change =>{
                res.json({
                    success:true,
                    message:'修改成功'
                }) 
            }
        )
    }
})

module.exports = router