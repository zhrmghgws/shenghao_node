# 超强耗材

## express 是网络框架

npm install express
npm install @types/express --save-dev //安装@types 之后就有了提示

## mysql2 是操作数据库的框架

npm install mysql2
npm install @types/mysql2 --save-dev

## "dotenv": "^8.2.0",

npm install dotenv --save-dev

#### dotenv 作用

会自动读取配置文件.env 中的环境变量到 pricess 中

## prettier

npm

#### prettier 作用

"prettier": "2.1.2",//是格式化代码使用的，会读取配置文件.prettierrc，另外要将设置中的保存时自动格式化勾选。
也可以执行命令： ./node\*modules/.bin/prettier --write \"src/\*\*/\_.ts\"
手动格式化

## tsc-watch 框架

npm install tsc-watch@4.2.3 --save-dev
"tsc-watch": "^4.2.3",

#### tsc-watch 的作用

监听 js 文件发生变化后，自动重启服务
配置的 npm run 命令行
"start:dev": "./node_modules/.bin/tsc-watch --onSuccess \"node dist/main.js\"",

## typescript

npm install typescript
npm install @types/tyepscript

#### 作用

"typescript":是 js 的一个超集，支持 es6 规范，使用的是.ts 文件，读取的配置文件是 tsconfig.json.根据配置文件，会自动将 ts 文件转为 js 文件到 dist 文件目录下

## lodash

npm install lodash
npm install @tyeps/lodash

#### 作用

lodash 是前端很实用的数组各种操作的工具包，第一次使用是在更新数据时，更新表中的单个属性的问题，和更新单个属性会用 null 覆盖其他属性的问题，

## jsonwebtoken

npm install jsonwebtoken@8.5.1
npm install @types/jsonwebtoken@8.3.8 --save-dev

#### 是用来根据制作的公私钥制作 token 令牌的

## multer

npm install multer@1.4.2
npm install @types/multer@1.4.2 --save-dev

#### 作用

用于上传文件的框架

## jimp

npm install jimp@0.10.0

####

处理图片文件的
使用时确保 tsconfig.json 中的下面两个选项设置为 true
"allowSyntheticDefaultImports": true,
"esModuleInterop": true,
