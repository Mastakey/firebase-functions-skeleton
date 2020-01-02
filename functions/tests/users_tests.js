const axios = require("axios");
const {url} = require("./url");

let apiUrl = url;

let signUp = async function() {
  try {
    let res = await axios.post(apiUrl + "/signup", {
      email: "user5@email.com",
      password: "123456",
      confirmPassword: "123456",
      username: "user5"
    });
    //console.log(res);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.data);
  } catch (err) {
    //console.error(err);
    console.error(err.response.status);
    console.error(err.response.statusText);
    console.error(err.response.data);
  }
};

let login = async function() {
  try {
    let res = await axios.post(apiUrl + "/login", {
      email: "user5@email.com",
      password: "123456"
    });
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.data);
  } catch (err) {
    console.error(err.response.status);
    console.error(err.response.statusText);
    console.error(err.response.data);
  }
};

let getAuthUser = async function() {
  try {
    let res = await axios.post(apiUrl + "/login", {
      email: "user5@email.com",
      password: "123456"
    });
    const token = res.data.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
    let user = await axios.get(apiUrl + "/user", { headers: headers });
    console.log(user.status);
    console.log(user.statusText);
    console.log(user.data);
  } catch (err) {
    console.error(err.response.status);
    console.error(err.response.statusText);
    console.error(err.response.data);
  }
};

let getUser = async function(username) {
  try {
    let user = await axios.get(apiUrl + "/user/user5");
    console.log(user.status);
    console.log(user.statusText);
    console.log(user.data);
  } catch (err) {
    console.error(err.response.status);
    console.error(err.response.statusText);
    console.error(err.response.data);
  }
};

let run = async function() {
  console.log("Sign Up Run");
  await signUp();
  console.log("Login Run");
  await login();
  console.log("Get Auth User Run");
  await getAuthUser();
  console.log("Get User Run");
  await getUser("user1");
};

run();
