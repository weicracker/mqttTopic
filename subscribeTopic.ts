/*
 * @Author: jiwei 
 * @Date: 2017-05-11 20:05:15 
 * @Last Modified by: jiwei
 * @Last Modified time: 2017-05-12 17:43:03
 */

interface client{
    subscribe:Function
}
import * as asp_config from "../aspModule/config";
import * as _ from "lodash";
class AspSubscribe{
    private broker:any;
    private topicArray:Array<any>;
    private topicType= {
        baseTopic:asp_config.ASP_BASE_TOPIC
    };
    //初始化客户端 mqtt连接
    constructor(client:client){
        this.broker = client;
        this.topicArray = [];
    }
    //帮助客户端功能模块订阅topic自己需要的topic
    public subscribeTopic(topic:string|[string],callback:Function):void{
        if(typeof topic==="string"&&_.indexOf(this.topicArray,topic)===-1){
            this.broker.subscribe(this.topicType.baseTopic+topic);
            this.subMessageListener(topic,callback);
            Array.prototype.push.call(this.topicArray,topic);
        }else{
            let newTopic:Array<string> = _.difference(<[string]>topic,this.topicArray);
            if(newTopic.length)Array.prototype.push.call(this.topicArray,newTopic); 
            for(let i=0;i<newTopic.length;i++){
                this.broker.subscribe(this.topicType.baseTopic+newTopic[i]);
                this.subMessageListener(newTopic[i],callback);
            }
        }
    }
    //mqtt接收消息，根据不同的topic 分发相应的topic 内容
    private subMessageListener(topic:string,callback:Function):void{
        this.broker.on("message",(remoteTopic:string,data:any)=>{
            if(remoteTopic.search(topic)>-1){
                callback(data);
            }
        })
    }
}
export {AspSubscribe}

