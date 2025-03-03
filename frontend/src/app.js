console.log("app.js loaded");
const { createApp } = Vue;

createApp({
    data() {
        return {
            userId: null,
            username: '',
            password: '',
            taskTitle: '',
            tasks: [],
            isLoggedIn: false
        };
    },
    methods: {
        async register() {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            });
            if (res.ok) alert('注册成功');
        },
        async login() {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            });
            const data = await res.json();
            if (res.ok) {
                this.userId = data.user_id;
                this.isLoggedIn = true;
                this.loadTasks();
            }
        },
        async addTask() {
            const res = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: this.taskTitle, user_id: this.userId })
            });
            if (res.ok) {
                this.taskTitle = '';
                this.loadTasks();
            }
        },
        async loadTasks() {
            const res = await fetch(`http://localhost:5000/tasks/${this.userId}`);
            this.tasks = await res.json();
        },
        async toggleTask(task) {
            await fetch(`http://localhost:5000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            });
            this.loadTasks();
        },
        async deleteTask(taskId) {
            await fetch(`http://localhost:5000/tasks/${taskId}`, { method: 'DELETE' });
            this.loadTasks();
        }
    },
    template: `
        <div>
            <div v-if="!isLoggedIn">
                <h2>登录 / 注册</h2>
                <input v-model="username" placeholder="用户名">
                <input v-model="password" type="password" placeholder="密码">
                <button @click="register">注册</button>
                <button @click="login">登录</button>
            </div>
            <div v-else>
                <h2>任务管理</h2>
                <input v-model="taskTitle" placeholder="新任务">
                <button @click="addTask">添加</button>
                <div class="task-list">
                    <div v-for="task in tasks" :key="task.id" class="task-item">
                        <span :class="{ completed: task.completed }" @click="toggleTask(task)">
                            {{ task.title }}
                        </span>
                        <button @click="deleteTask(task.id)">删除</button>
                    </div>
                </div>
            </div>
        </div>
    `
}).mount('#app');