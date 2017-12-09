

//加载http核心模块，
const http=require('http');

//创建服务器，得到server实例
const server=http.createServer();

//监听客户端的request请求，设置请求处理函数
server.on('request',(req,res)=>{

    // res.write('hello');
    //结束响应的同时发送数据
    // res.end('第一次发送数据');
    console.log('收到客户端的请求了');

});
//绑定端口号，启动服务器
server.listen(3000,()=>{
    console.log('server is running at port 3000');
})