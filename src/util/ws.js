import SockJS from  'sockjs-client';
import Stomp from 'stompjs';

let WS = {
    stompClient:null,
};
WS.install = function(Vue){
       
    Vue.prototype.$ws = {
        
        connection: (user,token,SUCCESS,ERROR)=> {
            // 建立连接对象
            
            let cid =  localStorage.getItem("cid");
           
            let socket = new SockJS('/ws/rainbow-ws?sid='+token+"&cid="+cid);
            // 获取STOMP子协议的客户端对象
            WS.stompClient = Stomp.over(socket);
            // 定义客户端的认证信息,按需求配置
            this.stompClient.debug = null;
            // 向服务器发起websocket连接
            WS.stompClient.connect({server:"Apache/1.3.9"},() => {

                let userId = user.userId;
                let sub = '/user/'+userId+'/message';
                WS.stompClient.subscribe(sub, (msg) => { // 订阅服务端提供的某个topic
                    let body = JSON.parse(msg.body)
                    SUCCESS(body);
                });
              
            }, (err) => {
                // 连接发生错误时的处理函数
                ERROR(err);
            });
        },
        disConnection: () => {
            if (WS.stompClient) {
                WS.stompClient.disconnect();
            }
        },
        send: (msg) => {
            WS.stompClient.send("/app/message",
            // headers,
            {}, 

            JSON.stringify(msg)
            );
        }
    }


}

export default WS
