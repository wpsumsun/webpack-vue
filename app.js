import bar from './bar';
import Vue from 'vue'

var app=new Vue({
    el:'#app',
    data:{
        newTodo:"",
        todoList:[]
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
        }
    }
})