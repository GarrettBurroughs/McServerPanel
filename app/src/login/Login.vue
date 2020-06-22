

<template>
  <div id="login">
    <h1>Welcome to Mc Sever Panel</h1>
    <div id="form">
      <h3>Login</h3>
      <form action="/login" method="post">
        <div>
          Username
          <input type="text" name="Username" id="username" v-model="username" />
        </div>
        <div>
          Password
          <input type="password" name="Password" id="password" v-model="password" />
        </div>
        <div>
          <input type="submit" value="Log In" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      serverUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "http://localhost:3000/"
    };
  },
  methods: {
    login() {
      console.log(this.serverUrl + "login");
      fetch(this.serverUrl + "login", {
        method: "POST",
        body: JSON.stringify({
          username: this.username,
          password: this.password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
};
</script>

<style>
#login {
  width: 100%;
}
#form input {
  width: 300px;
  display: block;
}
#form {
  width: 350px;
  margin: auto;
}

#form div {
  display: block;
  margin: auto;
}
</style>