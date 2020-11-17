const fs=require('fs')
const path=require('path')

const privateKey = fs.readFileSync(path.join('config','private.key'))
const publicKey = fs.readFileSync(path.join('config','public.key'))

/**
 * 转换成base64,就会变成一行，这样就可以在环境变量中配置使用
 */

 const privateKeyBase64=Buffer.from(privateKey).toString('base64')
 const publicKeyBase64=Buffer.from(publicKey).toString('base64')

 console.log('\nPrivate Key:')
 console.log(privateKeyBase64)

 console.log('\nPublic Key:')
 console.log(publicKeyBase64)