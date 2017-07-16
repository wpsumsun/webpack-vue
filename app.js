import bar from './bar';
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'DMA6DHsdgOvdC4JtJ25FlyDw-gzGzoHsz';
var APP_KEY = 'LQXyVN6bwHDEkxwvNhGi8hpl';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app=new Vue({
    el:'#app',
    data:{
        actionType:'signUp',
        formData:{
            username:'',
            password:''
        },
        newTodo:'',
        todoList:[],
        currentUser:null,
    },
    created:function(){
        window.onbeforeunload=()=>{
            let dataString=JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos',dataString)

        }

        let oldDataString=window.localStorage.getItem('myTodos')
        let oldData=JSON.parse(oldDataString)
        this.todoList=oldData||[]
    },
    methods:{
        addTodo:function () {
            this.todoList.push({
                title:this.newTodo,
                createAt:new Date(),
                done:false
            })
            this.newTodo=""
        },
        removeTodo:function(todo){
            let index=this.todoList.indexOf(todo)
            this.todoList.splice(index,1)
        },
        signUp:function(){
            var user = new AV.User();
            // 设置用户名
            user.setUsername(this.formData.username);
            // 设置密码
            user.setPassword(this.formData.password);
            // 设置邮箱
            // user.setEmail('tom@leancloud.cn');
            user.signUp().then( (loginedUser)=> {
                this.currentUser=this.getCurrentUser()
            }, function (error) {
                alert('注册失败')
            });

        },
        login:function(){
             AV.User.logIn(this.formData.username, this.formData.password).then( (loginedUser)=> {
                this.currentUser=this.getCurrentUser()
            }, function (error) {
            });
        },
        getCurrentUser:function(){
            let {id,createAt,attributes:{username}}=AV.User.current()

            return {id,username,createAt}
        },
        logout:function(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            this.currentUser = null;
            window.location.reload()
        }
    }
})