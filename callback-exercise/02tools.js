//已知一个 json 文件内容如下：

// {
//     "todos": ["吃饭", "睡觉", "打豆豆"]
//   }

// 请帮我写一个方法，调用该方法得到的结果就是 todos 数组 。


//加载核心模块
const fs=require('fs');
const http=require('http');

//自定义模块
const jsonFile=require('./02tools.json');

//创建服务器，获取实例对象
const server=http.createServer();

//监听request事件，设置世家你处理函数
server.on('request',(req,res)=>{
    //发送响应头，设置编码格式，解决乱码问题
    res.setHeader('Content-type','text/plain;charset=utf-8');
    //写一个方法，读取json文件中的内容（十六进制），将其转换为字符串格式，在转化为。。最终得到的结果为json文件中
    // 的数组对象
     
    //函数封装
    function readJson(resJson,callback){
        fs.readFile(resJson,(err,data)=>{
            if(err){
               return callback(err);
                // console.log('读取文件失败');
            }
            //如果读取成功，
            var jsonData=JSON.parse(data.toString()); //{ todos: [ '吃饭', '睡觉', '打豆豆' ] }
            // console.log(typeof jsonData); //object
            // var jsonData=data.toString();//{"todos": ["吃饭", "睡觉", "打豆豆"]}  //string
            // console.log(typeof jsonData);//string
            // console.log(jsonData);
            // console.log(jsonData.todos);
            callback(null,jsonData.todos);
        });
    }
    //调用函数
    readJson('./02tools.json',(err,data)=>{
        if(err){
            return res.end('文件读取失败kkk');
        }
            res.end('文件读取成功');
            console.log(data);
        
    })
    
});

//绑定端口号，启动服务器
server.listen(3000,()=>{
    console.log('server is running at port 3000');
});