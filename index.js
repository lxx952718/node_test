//引入express,path,fs模块
const express = require("express")
const path = require("path")
const fs = require("fs/promises")
const app = express()

// 配置静态资源路径
app.use(express.static(path.resolve(__dirname, './public')))
//配置请求体解析
app.use(express.urlencoded({extended: true}))
//设置模板引擎
app.set("view engine", "ejs")
//配置模板路径
app.set("views", path.resolve(__dirname,'views'))

//Router是express中创建的一个对象
const router = express.Router()
//router实际上是一个中间件，可以在该中间件上去绑定各种路由以及其它的中间件
app.use("/students", require("./routes/student"))


app.listen(8080, ()=>{
    console.log("express服务器已经启动了");
})

app.use((req, res)=>{
    res.status(404)
    res.send("<h1>您访问的地址被外星人劫持了！！！</h1>")
})
