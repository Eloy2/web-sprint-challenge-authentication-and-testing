const router = require('express').Router();
const db = require("./model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body

    const newUser = await db.adduser({
      username,
      //hash the password with a time complexity of 15 (will take around 2 seconds on my current machine)
      password: await bcrypt.hash(password, 15),
    })

    res.status(201).json(newUser)

  } catch(err) {
    console.log(err)
    res.status(500).json({
    message: "Something went wrong"
    })
  }
});

router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body
    const user = await db.findByUsername(username)

    // if user is not in the database
    if(!user) {
        return res.status(401).json({ message: "You shall not pass!"})
    }

    // compare the password the client is sending with the one in the database
    const passwordValid = await bcrypt.compare(password, user.password)

    // if password is WRONG
    if(!passwordValid) {
        return res.status(401).json({ message: "You shall not pass!"})
    }

    const payload = {
        userId: user.id,
        username: user.username,
    }

    // LINE BELOW IS USED WHEN YOU WANT THE TOKEN TO BE SAVED AS A COOKIE
    // res.cookie("token", jwt.sign(payload, process.env.JWT_SECRET))
    res.json({
        message: `Welcome ${user.username}!`,
        token: jwt.sign(payload, "keep is secret") // DELETE THIS FROM RESPONSE BODY IF SENDING IT AS COOKIE
    })

} catch(err) {
  console.log(err)
  res.status(500).json({
  message: "Something went wrong"
  })
}
});

module.exports = router;
