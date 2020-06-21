import * as argon2 from 'argon2'
import { ObjectId } from 'mongodb'
import withMiddleware from 'middlewares/withMiddleware'
import User from 'models/userModel'

const removeUndefined = obj =>
  Object.keys(obj).forEach(key => (obj[key] === undefined || obj[key] === '') && delete obj[key])

// const generatePassword = (passwordLength = 8, useUpperCase = true, useNumbers = true, useSpecialChars = true) => {
//   const chars = 'abcdefghijklmnopqrstuvwxyz'
//   const numberChars = '0123456789'
//   const specialChars = '!"£$%^&*()'

//   const usableChars =
//     chars +
//     (useUpperCase ? chars.toUpperCase() : '') +
//     (useNumbers ? numberChars : '') +
//     (useSpecialChars ? specialChars : '')

//   let generatedPassword = ''

//   for (let i = 0; i <= passwordLength; i++) {
//     generatedPassword += usableChars[Math.floor(Math.random() * usableChars.length)]
//   }

//   return generatedPassword
// }

const handler = (req, res) => {
  const { userId } = req.session
  const { uid, email, name, mobile, nid, password } = req.body
  const promises: Promise<string>[] = []
  switch (req.method) {
    case 'GET':
      return User.find({
        $or: [{ createdBy: new ObjectId(userId) }, { _id: new ObjectId(userId) }],
      })
        .then(users => {
          res.send({
            status: 'ok',
            users: users.map(user => ({ ...user._doc, self: user._id.equals(userId) })),
            count: users.length,
          })
        })
        .catch(error =>
          res.send({
            status: 'error',
            message: error.toString(),
          })
        )
      break
    case 'POST':
      if (email) {
        promises.push(
          new Promise((resolve, reject) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
              reject('Email address is invalid.')
            } else
              User.countDocuments({ email }).then(emailCount => {
                if (emailCount) {
                  reject('The email has already been used.')
                } else {
                  resolve()
                }
              })
          })
        )
      }
      if (mobile) {
        promises.push(
          new Promise((resolve, reject) => {
            User.countDocuments({ mobile }).then(mobileCount => {
              if (mobileCount) {
                reject('Mobile number has already been used.')
              } else {
                resolve()
              }
            })
          })
        )
      }
      if (nid) {
        promises.push(
          new Promise((resolve, reject) => {
            User.countDocuments({ nid }).then(nidCount => {
              if (nidCount) {
                reject('National ID has already been used.')
              } else {
                resolve()
              }
            })
          })
        )
      }

      if (promises.length == 0) {
        return res.send({
          status: 'error',
          message: 'Please enter at least one of the Email Address, Mobile Number, or National ID.',
        })
      }

      return Promise.all(promises)
        .then(async () => {
          const hashedPassword = password ? await argon2.hash(password) : undefined

          const user = {
            name,
            email,
            mobile,
            nid,
            createdBy: userId,
            enabled: password ? true : undefined, // this can change in future
            password: hashedPassword,
          }

          removeUndefined(user)

          return User.create(user)
            .then(user => {
              if (!userId) {
                req.session.userId = user._id
                res.status(201).send({
                  status: 'ok',
                  type: 'signup',
                  message: 'User signed up successfully',
                })
              } else {
                res.status(201).send({
                  status: 'ok',
                  type: 'adding',
                  message: 'User added successfully',
                })
              }
            })
            .catch(error => {
              // schema validation errors come here
              console.log(error)
              res.send({
                place: 'internal',
                status: 'error',
                message: error.errmsg || error.toString(),
              })
            })
        })
        .catch(error => {
          console.log({ error })
          res.send({
            place: 'external',
            status: 'error',
            message: error,
          })
        })
      break
    case 'PATCH':
      if (!uid) {
        return res.send({
          status: 'error',
          message: 'Whose profile info are you trying to update?',
        })
      }
      if (email) {
        promises.push(
          new Promise((resolve, reject) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
              reject('Email address is invalid.')
            } else
              User.countDocuments({ email }).then(emailCount => {
                if (emailCount) {
                  reject('The email has already been used.')
                } else {
                  resolve()
                }
              })
          })
        )
      }
      if (mobile) {
        promises.push(
          new Promise((resolve, reject) => {
            User.countDocuments({ mobile }).then(mobileCount => {
              if (mobileCount) {
                reject('Mobile number has already been used.')
              } else {
                resolve()
              }
            })
          })
        )
      }
      if (nid) {
        promises.push(
          new Promise((resolve, reject) => {
            User.countDocuments({ nid }).then(nidCount => {
              if (nidCount) {
                reject('National ID has already been used.')
              } else {
                resolve()
              }
            })
          })
        )
      }

      if (promises.length == 0) {
        return res.send({
          status: 'error',
          message: 'Please enter at least one of the Email Address, Mobile Number, or National ID.',
        })
      }

      return Promise.all(promises).then(async () => {
        User.findOne({ _id: new ObjectId(uid) })
          // .then(data => data.json())
          .then(user => {
            console.log(user)
            if (email) user.email = email
            if (nid) {
              user.nid = nid
            }
            if (mobile) {
              user.mobile = mobile
            }
            removeUndefined(user)
            user.save()

            res.status(201).send({
              status: 'ok',
              type: 'updating',
              message: 'User saved successfully',
            })
          })
          .catch(error => {
            // schema validation errors come here
            console.log(error)
            res.send({
              place: 'internal',
              status: 'error',
              message: error.errmsg || error.toString(),
            })
          })
      })
      break
    default:
      return res.status(405).end()
      break
  }
}

// export default handler
export default withMiddleware(handler)
