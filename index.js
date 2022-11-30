//引入express,path,fs模块
const express = require("express")
const path = require("path")
const fs = require("fs/promises")

//获取服务器实例
const app  = express()

// 配置静态资源路径
app.use(express.static(path.resolve(__dirname, './public')))
//配置请求体解析
app.use(express.urlencoded({extended: true}))


//设置模板引擎
app.set("view engine", "ejs")
//配置模板路径
app.set("views", path.resolve(__dirname,'views'))

//引入信息表json数据
let STUDENT_DATA = require("./data/student.json")

//启动服务器
//app.listen(端口号)用来启动服务器
//服务器启动后就可以通过8888端口访问了
//协议名://ip地址:端口号/路径
app.listen(8888, ()=>{
    console.log("express服务器已经启动了");
})


//体验学生信息表的增删改查
//显示学生信息列表
app.get('/students', (req, res)=>{
    console.log("ejs模板启动");
    res.render("students",{stus:STUDENT_DATA})
})

//添加学生信息
app.post('/student_add',(req, res, next)=>{
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

//删除学生信息
app.get('/delete',(req, res, next)=>{
    const id = +req.query.id;
    STUDENT_DATA = STUDENT_DATA.filter(stu => stu.id !== id);
    next()

})

// 修改信息(信息展示)
app.get('/edit_data',(req, res)=>{
    const id = +req.query.id
    const student = STUDENT_DATA.filter(stus => stus.id === id)[0];
    console.log(student);
    res.render("edit", {student})
})
// 修改信息
app.post('/edit',(req,res,next)=>{
    console.log(req.body);
    let {id,name,age,gender,address} = req.body;
    id = +id
    age = +age
    const newstu = {id,name,age,gender,address}
    STUDENT_DATA.splice(newstu.id-1, 1, newstu);
    next()
    
})

//将学生信息写入到json文件中后重定向到学生页面
app.use((req,res,nex)=>{
    fs.writeFile(
        path.resolve(__dirname,'./data/student.json'),
        JSON.stringify(STUDENT_DATA)
    ).then(()=>{
        res.redirect('/students')
    }).catch((e)=>{
        console.log("错误信息",e);
    })

})

app.use((req, res)=>{
    res.status(404)
    res.send("<h1>您访问的地址被外星人劫持了！！！</h1>")
})


//设置get请求（路由的回调函数执行，会接收到三个参数）
// app.get("/", (req, res)=>{
//     console.log("有人访问我了");
//     //在路由中要读取用户请求(request)
//     console.log(req.url);   ///?name=111
//     //响应用户(response)
//     //sendStatus(向客户端发送响应状态)    status(设置响应状态但不给客户端发送)  send(服务器发送响应体)
//     // res.sendStatus(404)
//     res.send("请求成功，我响应了")
// })

//app.use(中间件,路径包含指定的(路径及路径子目录)都可以访问)
//next是一个函数，有多个中间件时可以设置调用，使下一个中间件处理请求
// app.use("/", (req, res, next)=>{
//     console.log("收到回复1");
//     // res.send("我是中间件1,无论是get还是post等都要通过我")
//     next()  //放行不回应(不能再处理完后使用)
// })
// app.use("/", (req, res)=>{
//     console.log("收到回复2");
//     res.send("我是中间件2,无论是get还是post等都要通过我")
// })



// app.get('/login/:id', (req, res)=>{
//     console.log(req.query);
//     console.log(req.params);    // paeams路径参数({ id: 'aaa' })
//     const user = req.query.username
//     const password = req.query.password
//     if(user === 'lxx' && password === "9527"){
//         res.send("<h1>登录成功</h1>")
//     }else{
//         res.send("<h1>用户名或密码错误</h1>")
//     }
    
// })


