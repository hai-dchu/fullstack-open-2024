const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const user = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

  response.json(user)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username missing or too short'
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password missing or too short'
    })
  }

  const checkUser = await User.findOne({ username })
  if (checkUser) {
    return response.status(400).json({
      error: 'username already exists'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.delete('/:id', async (request, response) => {
  await User.deleteOne({ _id: request.params.id })
  response.status(204).end()
})

module.exports = userRouter