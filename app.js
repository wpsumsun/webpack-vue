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
        this.currentUser=this.getCurrentUser()
        if(this.currentUser){
            var query = new AV.Query('AllTodos');
            query.find()
                .then( (todos)=>{
                let avAllTodos=todos[0]
                let id=avAllTodos.id
                this.todoList=JSON.parse(avAllTodos.attributes.content)
                this.todoList.id=id
                }, function(error){
                console.error(error) 
                })
            }
    },
    methods:{
        updateTodos:function(){
            let dataString=JSON.stringify(this.todoList)
            let avTodos=AV.Object.createWithoutData('AllTodos',this.todoList.id)
            avTodos.set('content',dataString)
            avTodos.save().then(()=>{
                console.log('更新成功')
            })
        },
        saveTodos:function(){
            let dataString=JSON.stringify(this.todoList)
            var AVTodos=AV.Object.extend('AllTodos')
            var avTodos=new AVTodos()
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(),true) // 只有这个 user 能读
            acl.setWriteAccess(AV.User.current(),true) // 只有这个 user 能写
        
            avTodos.set('content', dataString);
            avTodos.setACL(acl) // 设置访问控制

            avTodos.save().then((todo)=> {
                // 成功
                this.todoList.id=todo.id
                console.log('保存成功')
            }, function(error) {
                // 失败
                console.error('保存失败')
            });
        },
        saveOrUpdateTodos: function(){
            if(this.todoList.id){
                this.updateTodos()
            }else{
                this.saveTodos()
            }
        },
        addTodo:function () {
            this.todoList.push({
                title:this.newTodo,
                createAt:new Date(),
                done:false
            })
            this.newTodo=""
            this.saveOrUpdateTodos()
        },
        removeTodo:function(todo){
            let index=this.todoList.indexOf(todo)
            this.todoList.splice(index,1)
            this.saveOrUpdateTodos()
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
                console.error('注册失败')
            });

        },
        login:function(){
             AV.User.logIn(this.formData.username, this.formData.password).then( (loginedUser)=> {
                this.currentUser=this.getCurrentUser()
                window.location.reload()
            }, function (error) {
            });
            
        },
        getCurrentUser:function(){
            let current=AV.User.current()
            if(current){
                let {id,createAt,attributes:{username}}=current;
                return {id,username,createAt}
            }else{
                return null
            }
        },
        logout:function(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            this.currentUser = null;
            window.location.reload()
        }
    }
})