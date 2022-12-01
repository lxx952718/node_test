const express = require("express")
const router = express.Router()
let STUDENT_DATA = require("../data/student.json")
const fs = require("fs/promises")
const path = require("path")

//学生列表的路由
router.get("/list",(req, res)=>{
    if(req.cookies.username){
        res.render("students", { stus: STUDENT_DATA})
    }else{
        res.redirect("/")
    }
})

//添加学生的路由
router.post("/add",(req, res, next)=>{
    //获取学生id，计算最后一名学生id加1
    const newid = STUDENT_DATA.length?STUDENT_DATA.at(-1).id+1:1
    //获取添加的学生的各项信息
    const newstudent = {
        id:newid,
        name:req.body.name,
        age:+req.body.age,
        gender:req.body.gender,
        address:req.body.address
    }
    //将学生信息添加到数据列表中
    STUDENT_DATA.push(newstudent);
    next()

})

//修改学生的路由
router.get("/edit_data",(req, res)=>{
    const id = +req.query.id
    const student = STUDENT_DATA.filter(stus => stus.id === id)[0];
    console.log(student);
    res.render("edit", {student})
})
// 修改信息
router.post("/edit",(req,res,next)=>{
    console.log(req.body);
    let {id,name,age,gender,address} = req.body;
    id = +id
    age = +age
    const newstu = {id,name,age,gender,address}
    STUDENT_DATA.splice(newstu.id-1, 1, newstu);
    next()
})

//删除学生的路由
router.get("/delete",(req, res, next)=>{
    const id = +req.query.id;
    STUDENT_DATA = STUDENT_DATA.filter(stu => stu.id !== id);
    next()

})

//将学生信息写入到json文件中后重定向到学生页面
router.use((req,res,nex)=>{
    fs.writeFile(
        path.resolve(__dirname,'../data/student.json'),
        JSON.stringify(STUDENT_DATA)
    ).then(()=>{
        res.redirect("/students/list")
    }).catch(()=>{
        res.send("操作失败");
    })

})


//将router暴露到模块外面
module.exports = router