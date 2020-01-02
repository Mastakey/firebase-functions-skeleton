const { admin, db } = require("../util/admin");
const firebaseConfig = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

exports.signUp = async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };
  //Validate data
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }
  const noImg = "no-img.png";
  try {
    //Check username
    let doc = await db.doc(`/users/${newUser.username}`).get();
    if (doc.exists) {
      return res.status(400).json({ username: "username is already taken" });
    }
    let data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    let userId = data.user.uid;
    let tokenId = await data.user.getIdToken();
    const userCredentials = {
      username: newUser.username,
      email: newUser.email,
      createdAt: new Date().toUTCString(),
      imageUrl: noImg,
      userId: userId
    };
    //Create /users/ collection doc
    await db.doc(`/users/${newUser.username}`).set(userCredentials);
    return res.status(201).json({ tokenId: tokenId });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      return res.status(400).json({ email: "Email is already in use" });
    } else if (err.code === "auth/weak-password") {
      return res.status(400).json({ password: err.message });
    } else {
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    }
  }
};

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    let data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    let token = await data.user.getIdToken();
    return res.json({ token });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/wrong-password") {
      return res.status(403).json({ general: "wrong credentials" });
    }
    return res.status(500).json({ error: err.code });
  }
};

//Get user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
      }
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Get any user details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
      }
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
