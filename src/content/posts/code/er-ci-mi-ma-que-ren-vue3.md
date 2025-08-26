---
title: 假如项目里的一些按钮功能需要进行密码二次确认（旧版，基于 Vue3）
type: Post
slug: 'er-ci-mi-ma-que-ren-vue3'
status: published
date: 2025-05-04
category: Code
tags: [步骤, Vue]
summary:
---


## 需求说明

### 最近要实现一个需求

项目里某些按钮点击后弹出密码二次确认窗口，输入密码确认后再继续原有代码逻辑。

基本效果是：有一个配置按钮点击是否需要二次密码确认的页面 `PasswordConfig.vue`，页面包含一个树形结构，两个按钮「恢复默认值」、「保存」。树形结构存储着所有按钮以及是否需要二次验证。

### 几点思考

其一，如果每次点击按钮先查询后端是否需要二次点击，着实浪费网络资源，所以设定刚登录系统时就查询出这个树形数据存储与 Vuex store 里，其名 `safe.js` 。如果在配置页面修改了，就需要在点击保存并成功后将查出新的树形数据更新 store 。这样不需要每次请求后端，而且这个 store 定义时还可以提供封装一些验证的方法。

其二，为什么不用统一的拦截方法，例如使用 Vue 自定义指令。这个有考虑过，但是不够灵活，甚至某些场景下无法使用。比如方法有一些前端前置验证性的代码，比如列表选中删除功能，总不能先弹出二次密码验证窗口，输入完密码，点击确认，这时候弹出个 Toast 「请至少选中一行数据」，人傻了。这种开发一定会被产品经理暴打！举一个具体例子。假如有个用户管理页面，内容为用户列表的增删改查，列表上方有「删除」按钮，列表操作栏也有「删除」按钮。我们很容易想象这个按钮的实现逻辑大概如下：

```jsx
// 列表上方的，可以算批量删除，不需要方法传参
onDeleteUserBatch() {
	if(this.selection.length === 0) {
		// Toast 简单封装了 Message
		Toast.warning('请至少选中一行数据')
	}
	
	// doSomething
}

// 列表操作栏的，一般传一个 row 参数
onDeleteUser(row) {
	// doSomething
}
```

很容易就看出两者差别，批量删除会多一些前端验证性代码。这只是最简单的例子，复杂点的还可以包括选择数据是否能删等判断。总之，这就说明方法有差异，不能粗暴拦截方法，在方法第一行代码执行前就出发二次密码验证弹窗，除非你做好了被产品经理暴打的准备。

其三，分析下需要二次确认密码的按钮功能，有触发页面跳转的，有触发弹窗操作的，以及其它简单调用后端接口的三种类型。无法在路由跳转拦截的方向上做文章，这条路走不通。

其四，由于产品经理设计的密码配置原型里采用的是树组件来操作每个按钮设置是否二次验证，所有的按钮均需要分配一个唯一标识。参照树形组件所需的数据结构，设计如下结构：

```jsx
const treeData = [
	{
		id: '1',
		name: '用户',
		isLeaf: false,
		children: [
			{ id: '1-1', name: '用户添加', children: null, checked: false, isLeaf: true },
			{ id: '1-2', name: '用户修改', children: null, checked: true, isLeaf: true },
			{ id: '1-3', name: '用户删除', children: null, checked: true, isLeaf: true },
		]
	},
	{
		id: '2',
		name: '角色',
		isLeaf: false,
		children: [
			{ id: '2-1', name: '角色添加', children: null, checked: false, isLeaf: true },
			{ id: '2-3', name: '角色修改', children: null, checked: true, isLeaf: true },
			{ 
				id: '2-3', 
				name: '高级操作', 
				checked: false, 
				isLeaf: false,
				children: [
					{ id: '2-3-1', name: '分配权限', children: null, checked: true, isLeaf: true },
					{ id: '2-3-2', name: '分配用户', children: null, checked: true, isLeaf: true },
				], 
			},
		]
	},
]
```

## 目前实现逻辑如下

### 第一步：基于 Pinia 封装验证树形数据的存储与校验

```jsx
export const useSafeStore = defineStore('safe', () => {
	const verifyTree = ref([])
	
	// 更新需要二次验证树数据
	function updateVerifyTree(val) => {
		verifyTree.value = val	
	}
	
	// 提供一个便捷查询是否需要密码的方法，需要传入按钮指定的唯一 key
	// 此处未使用 computed 是因为需要传参
	function needVerify(btnKey) {
		return flatTree(state.verifyTree).find(item => item.id === btnKey).checked
	}
	
	return {verifyTree, updateVerifyTree, needVerify}
})

// 将密码验证树数据摊平，此为定制方法，不通用
export const flatTree = treeData => {
	const flatArr = []
	treeData.forEach(l1 => {
		flatArr.push(l1)
		if(l1.children && l1.children.length > 0) {
			l1.children.forEach(l2 => {
				flatArr.push(l2)
				if(l2.children && l2.children.length > 0) {
					l2.children.forEach(l3 => {
						flatArr.push(l3)
					})
				}
			})
		}
	})
	return flatArr
}
```

这个树结构里的数据需要在项目刚登录或页面刷新时请求后端更新数据。这个过程可以放在登录后获取当前系统登录用户信息的接口里。

### 第二步：简单实现密码验证配置页面（重点是树形结构的数据）

```html
<script setup>
// ……省略其余导入
import { flatTree, useSafeStore } from '@/store/safe.js' 

const	ready = ref(false) // 页面是否加载完成
const treeData = ref([]) // 树数据

// 过滤出当前已选中的树节点
const defaultCheckedKeys = computed(() => {
	return flatTree(this.treeData)
		.filter(item => item.isLeaf && item.checked)
		.map(item => item.id)
})
		
async onMounted() {
	await initTree()
}

// 保存
const treeRef = useTemplateRef('treeRef')
const confirmLoading = ref(false)
async function save() {
	try {
		confirmLoading.value = true
		
		// 这里仅获取选中的按钮的 id 与后端交互
		await reqEditVerifyTreeData(treeRef.value.getCheckedKeys(true))
		await initTree()
		Toast.success('保存成功')
		
		confirmLoading.value = false
	} catch (err) {
		confirmLoading.value = false
		Toast.error(err)
	}
}

const safeStore = useSafeStore()

// 请求后端，恢复默认值，更新 safe 模块数据
async function resetDefault() {
	ready.value = false
	treeData.value = await reqDefaultVerifyTree()
	safeStore.updateVerifyTree(data)
	ready.value = true
}

async function initTree() {
	// 初始化时，请求验证树渲染页面，同时将数据更新到 Pinia 的 safe 模块
	try {
	  ready.value = false
	  
		const { data } = await reqVerifyTreeData()
		
		treeData.value = data
		safeStore.updateVerifyTree(data)
		
		ready.value = true
	} catch (err) {
		Toast.error(err)
	}
}
</script>

<template>
	<el-tree
		ref="treeRef"
		v-loading="!ready"
		node-key="id"
		:data="treeData"
		:props="{ label: 'name', children: 'children', isLeaf: 'isLeaf' }"
		show-checkbox
		default-expand-all
		:default-checked-keys="defaultCheckedKeys"
	/>
	<div>
		<el-button @click=resetDefault>恢复默认值</el-button>
		<el-button type="primary" @click=save>保存</el-button>
	</div>
</template>
```

### 第三步：封装密码验证响应式状态中心

控制二次密码验证弹窗是否显示、密码二次验证后需要执行的真正函数以及参数

```jsx
import { useSafeStore } from '@/store/safe.js'

/**
 * 密码验证响应式状态中心
 * show 密码验证弹窗显隐
 * callback 真实父组件事件回调函数
 * params 回调函数参数，数组
 */
export const verificationStore = reactive(
	show: false,
	callback: null,
	params: null,
	
	async init(key, callback, params = [])  {
		this.callback = callback
		this.params = params
		
		// 判断是否需要二次密码验证
		const safeStore = useSafeStore()
		
		if(safeStore.needVerify(key)) {
			this.show = true
		} else {
			await this.handle()
		}
	},
	
	async handle() {
		await this.callback(...params)
	}
)
```

### 第四步：封装这个二次密码输入组件 `PasswordVerification`

```html
<script setup>
import { verificationStore } from '@/store/mini/verification.js'

defineOptions({ name: 'PasswordVerification' })

const {show} =  toRefs(verificationStore)
		
const userStore = useUserStore()
const userForm = ref({
	username: userStore.username,
	password: ''
})
		
const rules = reactive({
	password: [{required: true, trigger : 'blur', message: '密码不能为空'}]
})

const userFormRef = useTemplateRef('userFormRef')
const verifying = ref(false)

// 验证方法，请求后端接口，验证成功则回调父组件的指定方法
function onVerify() {
	userFormRef.value.validate(async (valid) => {
		if(valid) {
			try {
				verifying.value = true
				await reqVerifyPassword(userForm.value)
				await verificationStore.handle()
				show.value = false
			} catch (e) {
				verifying.value = false
			}
		}
	})
}

function init() {
	userForm.value = {
		username: userStore.username,
		password: ''
	}
	verifying.value = true
}

function onCancel() {
	show.value = false
}
</script>

<template>
	<el-dialog
		title="用户密码验证"
		width="400px"
		:model-value="show"
		@close="show = false"
		@open="init"
		destroy-on-close
		:close-on-click-model="false"
	>
		<el-form ref="userFormRef" label-width="80px" :rules="rules" :model="userForm">
			<el-form-item label="用户名" prop="username">
		    <el-input v-model="userForm.username" disabled />
		  </el-form-item>
		  <el-form-item label="密码" prop="password">
		    <el-input type="password" v-model="userForm.password" />
		  </el-form-item>
		</el-form>
		<div #footer>
			<el-button @click="cancel">取消</el-button>
			<el-button type="primary" @click="verify">确定</el-button>
		</div>
	</el-dialog>
</template>
```

### 第五步：如何在页面使用，以上文 JSON 树形数据里的用户管理为例

不含有二次密码验证的页面按钮逻辑大致如下：

```html
<script setup>
const selection = ref([])
	
function addUser() {
	// open 用户添加弹窗
}
		
function delUserBatch() {
	if (selection.value.length === 0) {
		Toast.warning('请至少勾选一行数据')
		return
	}
	// 请求后端批量删除用户
}
		
function delUser(row) {
	// 请求后端删除用户
}
</script>

<tempalte>
	<div>
		<el-button @click="addUser">添加</el-button>
		<el-button type="danger" @click="delUserBatch">删除</el-button>
		
		<el-table>
			<!-- 省略其它 -->
			<el-table-item
				label="操作"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-button type="danger" @click="delUser(scope.row)">删除</el-button>
				</tempalte>
			</el-table-item>
		</el-table>
	</div>
</tempalte>
```

添加完二次验证逻辑的页面代码。

按钮逻辑修改本质上一样，都是将原来的方法一分为二个方法，第一个方法还用原来的方法名，但是方法内容改成调用二次密码判断逻辑，第二个方法是原来方法的执行逻辑。因为拆分成两个方法，且中间经过一次弹窗确认事件，所以请注意当前按钮方法如何回调以及参数是如何传递的。参照下文。

```html
<script setup>
import { verificationStore } from '@/store/mini/verification.js'

const selection = ref([])

async function addUser() {
	await verificationStore.init('1-1', realAddUser)
}

// 这里存放原来 addUser 方法真正干的事情
realAddUser() {}

function delUserBatch() {
	if (selection.value.length === 0) {
		Toast.warning('请至少勾选一行数据')
		return
	}
	
	const ids = selection.value.map(item => item.id)
	await verificationStore.init('1-3', realDelUserBatch, [ids])
}

// 这里存放原来 delUserBatch 方法真正干的事情，但是需要注意并不包括一些前端校验
realDelUserBatch(ids) { }
		
function delUser(row) {
	await verificationStore.init('1-3', realDelUser, [row.id])
}

// 这里存放原来 delUser 方法真正干的事情，但是需要注意并不包括一些前端校验
function realDelUser(id) {  }
</script>

<template>
	<div>
		<el-button @click="addUser">添加</el-button>
		<el-button type="danger" @click="delUserBatch">删除</el-button>
		
		<el-table>
			<!-- 省略其它 -->
			<el-table-item
				label="操作"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-button type="danger" @click="delUser(scope.row)">删除</el-button>
				</tempalte>
			</el-table-item>
		</el-table>
	</div>
</template>
```

## 后续优化

……