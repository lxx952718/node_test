//引入express,path,fs模块
const express = require("express")
const path = require("path")
const fs = require("fs/promises")
const app = express()
const cookieParser = require("cookie-parser")

//解析cookie
app.use(cookieParser())
//设置模板引擎
app.set("view engine", "ejs")
//配置模板路径
app.set("views", path.resolve(__dirname,'views'))
// 配置静态资源路径
app.use(express.static(path.resolve(__dirname, './public')))
//配置请求体解析
app.use(express.urlencoded({extended: true}))

//Router是express中创建的一个对象
const router = express.Router()
//router实际上是一个中间件，可以在该中间件上去绑定各种路由以及其它的中间件
app.use("/students", require("./routes/student"))

//登录路由
app.get("/",(req, res)=>{
    res.render("login")
})

app.post("/login",(req, res)=>{
    /* 
        现在咱们这个登录，简直形同虚设，
            HTTP协议是一个无状态的协议，
                服务器无法区分请求是否发送自同一个客户端

            cookie
                - cookie是HTTP协议中用来解决无状态问题的技术
                - cookie的本质就是一个头
                    - 服务器以响应头的形式将cookie发送给客户端
                        客户端收到以后会将其存储，并在下次向服务器发送请求时将其传回
                        这样服务器就可以根据cookie来识别出客户端了
    */
    // 获取用户的用户名和密码
    const {username, password} = req.body
    console.log(req.body);
    if(username === "admin" && password === "123456"){
        // 登录成功
        // res.send("登录成功")
        // 将用户名放入cookie
        res.cookie("username", username)
        res.redirect("/students/list")
    }else{
        res.send("用户名或密码错误")
    }
})




app.listen(8080, ()=>{
    console.log("express服务器已经启动了");
})

app.use((req, res)=>{
    res.status(404)
    res.send("<h1>您访问的地址被外星人劫持了！！！</h1>")
})
