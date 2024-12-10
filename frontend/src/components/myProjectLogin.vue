<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="loginUser" class="login-form">
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p class="register-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/auth/login`, {
          email: this.email,
          password: this.password,
        });
        console.log('Login successful:', response.data.user);
        alert("Login Successfull");

        // Store token, username, and userId
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Ensure this matches your API response

        this.$router.push('/myusersprofile');
      } catch (error) {
        console.error('Login failed:', error.response.data);
      }
    }
  }
};
</script>



<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
}

.login-box {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;
}

.input-group input:focus {
  border-color: #007BFF;
  outline: none;
}

.login-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.register-link {
  margin-top: 1rem;
  color: #007BFF;
}

.register-link a {
  color: #007BFF;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 600px) {
  .login-box {
    padding: 1.5rem;
    width: 90%;
  }

  h2 {
    font-size: 1.5rem;
  }

  .login-button {
    font-size: 0.9rem;
  }
}
</style>
