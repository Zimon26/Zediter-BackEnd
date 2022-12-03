const express = require('express')
const cors = require('cors')
const e = require('express')

const app = express()

app.use(cors())

// 保存验证码，防止验证码重复
const verifyCodePool = new Set()

//保存验证码和协作组的映射关系
const verifyCodeMap = new Map()

// 记录协作组的数量
let colNum = 0

// 协作组的具体信息，如协作人数组，协作文本
const colPool = []

app.get('/init', (req, res) => {
  res.send('02026')
  console.log('初始化访问')
})

app.get('/launch-col', (req, res) => {
  let code = ''
  console.log(req)
  const username = req.query.username
  while (true) {
    for (let i = 0; i < 5; i++) {
      let num = Math.floor(Math.random() * 10)
      code += num
    }
    if (!verifyCodePool.has(code)) {
      verifyCodePool.add(code)
      verifyCodeMap.set(code, colNum)
      // 同步text，先使用假数据
      colPool[colNum] = {
        collaborators: [username],
        text: ['s', 't', 'a', 'r', 't']
      }
      res.send({
        code: code,
        arrayID: colNum,
        collaborators: [username]
      })
      colNum++
      return
    }
  }
})

app.get('/join-col', (req, res) => {
  const { code, username } = req.query
  if (!verifyCodePool.has(code)) {
    res.send({
      number: 0,
      message: 'Error Code'
    })
  } else {
    const arrayID = verifyCodeMap.get(code)
    // console.log('id' + arrayID)
    colPool[arrayID].collaborators.push(username)
    res.send({
      number: 1,
      arrayID: arrayID,
      message: 'Success',
      collaborators: colPool[arrayID].collaborators,
      text: colPool[arrayID].text
    })
  }
})

app.get('/handle-change', (req, res) => {
  const { arrayID, args } = req.query
  colPool[arrayID].text.splice(...args)
  console.log(colPool[arrayID].text)
  res.send(colPool[arrayID].text)
})

app.listen(8888, () => {
  console.log('listen 8888')
})
