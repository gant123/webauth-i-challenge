const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  req.session.loggedin = false;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedin = true;
        res
          .status(200)
          .json({ message: `Welcome ${user.username}! Let's turn up!` });
      } else {
        res.status(401).json({ message: 'Nice try. But, no. Try. Try again.' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    console.log(req.session);
    req.session.destroy(err => {
      if (err) {
        res
          .status(400)
          .send('queue the groundhog day trope... you can never leave...');
      } else {
        res.send('you made it out! good job!');
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
