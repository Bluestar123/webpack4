#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const pkg = require('./package.json')

let questions = [
{
  type:'input',
  name:'username',
  message:'请输入姓名',
  default:'wanzi',
  validate(val){
    if(val.trim()==''){
      return '应用名称不能为空'
    }else{
      return true
    }
  },
  //对用户输入的数据或选择的数据进行过滤
  filter(val){
    return val.toLowerCase()
  }
},
{
  type:'confirm',
  name:'xingbie',
  message:'是否同性恋',
  default:false
},{
  type:'list',
  name:'gongzi',
  message:'你的工资范围',
  choices:[
    '100-1000',
    '1000-2000'
  ],
  default:1
},{
  type:'rawlist',
  name:'gongzi2',
  message:'你的工资范围',
  choices:[
    '100-1000',
    '1000-2000'
  ],
  default:1
},{
  type:'checkbox',
  name:'tools',
  message:'你感兴趣的话题',
  choices:[{
    name:'美妆',
    value:'meizhuang',
    checked:true
  },{
    name:'明星',
    value:'mingxing'
  },{
    name:'八卦',
    value:'bagua'
  }]
}
]
program
	.version(pkg.version, '-v, --version')
	.option('-p, --path [path]', '设置要显示的目录', __dirname)
	.option('-l, -list [path]', '以列表形式显示', __dirname)
	.description(pkg.dependencies)
	
program
	.command('init')
	.alias('i')
	.description('请选择初始化工程')
	.action(function() {
		require('figlet')('W A N G', function(err, data) {
			console.log('实现了')
		})
	})
	
program
	.on('--help', function() {`这里插入代码片`
		console.log('')
		console.log('Examples:')
		console.log('')
	})
	
program.command('test')
	.action(function() {
		inquirer.prompt(questions).then(answers => {
			setTimeout(() => {
				console.log(chalk.green('success'))
				console.log(JSON.stringify(answers))
			}, 3000)
		})
	})
	
program.action((t) => {
	console.log(111, t)
	console.log(program.path)
})

program.parse(process.argv)