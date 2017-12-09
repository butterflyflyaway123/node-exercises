
//已知 fs.readFile 可以读取文件，fs.writeFile 可以写文件。请帮我封装一个方法：copy。要求调用方式如下：

// copy('被复制文件', '复制到的目标文件', function (err) {
    // err 成功是 null 错误是一个 错误对象
//   })

//加载模块
const fs=require('fs');
const http=require('http');
//创建服务器，并获取实例对象,
const server=http.createServer();
//监听客户端的request时间，并设置请求处理函数、
server.on('request',(req,res)=>{

// res.end('收到请求了');
//封装copy函数
    function copy(res,dist,callback){
        
            //读取被复制的文件
            fs.readFile(res,(err,data)=>{
                //读取失败
                if(err){
                    return callback(err);
                }
                //读取成功
                //读取被复制文件的内容(十六进制)，转化为字符串
                const resData=data.toString();
        
                //将读取的内容写入复制的目标文件中
                fs.writeFile(dist,resData,err=>{
                    if(err){
                        return callback(err);
                    }
                    callback(null);
                })  //end writeFile
            })
        }  //end copy 

 //调用函数 
copy('./a.txt','./b.txt',function(err){
    //发送响应头，处理自定义文件的编码格式，解决浏览器端的乱码问题
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    if(err){
        return res.end('复制文件失败')
    }
   res.end('复制文件成功');
   console.log('复制文件成功');
})


});   //end 监听时间
//绑定端口，
server.listen('3000',()=>{
    console.log('server is running at port 3000');
});


