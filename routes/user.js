//创建express接收express模块
const express = require("express")

//创建router对象
const router = express.Router()

router.get("/list",(req, res)=>{
    res.send("hello 我是router对象")
})

//将router暴露到模块外面
module.exports = router