//引入express,path,fs模块
const express = require("express")
const path = require("path")
const fs = require("fs/promises")
const app = express()
const session = require("express-session")
//引入file-store
const filestore = require("session-file-store")(session)


//设置模板引擎
app.set("view engine", "ejs")
//配置模板路径
app.set("views", path.resolve(__dirname,'views'))
// 配置静态资源路径
app.use(express.static(path.resolve(__dirname, './public')))
//配置请求体解析
app.use(express.urlencoded({extended: true}))

//设置session中间件
app.use(session({
    store: new filestore({
        //指定存储路径
        path:path.resolve(__dirname,"./session"),
        //加密
        secret:"999",
        //有效时间(s/默认一个小时)
        ttl:3600,
        //默认每隔一小时清除失效session
        reapInterval:3600
    }),
    //设置加密
    secret:"lxx9527"
}))

//Router是express中创建的一个对象
const router = express.Router()
//router实际上是一个中间件，可以在该中间件上去绑定各种路由以及其它的中间件
app.use("/students", require("./routes/student"))

//登录路由
app.get("/",(req, res)=>{
    res.render("login")
})

app.get("/logout",(req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
})

app.post("/login",(req, res)=>{

    // 获取用户的用户名和密码
    const {username, password} = req.body
    if(username === "admin" && password === "123456"){
        // 登录成功
        // res.send("登录成功")
        // 将用户名放入session
        req.session.loginuser = username
        //手动立即存储session
        req.session.save(()=>{
            res.redirect("/students/list")
        })
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
