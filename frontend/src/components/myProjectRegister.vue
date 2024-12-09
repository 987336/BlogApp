<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Create an Account</h2>
      <form @submit.prevent="registerUser" class="register-form">
        <div class="input-group">
          <input v-model="name" type="text" placeholder="Name" required />
        </div>
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class="register-button">Register</button>
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/auth/register`, {
          name: this.name,
          email: this.email,
          password: this.password
        });
        console.log('Registration successful:', response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error.response.data);
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
}

.register-box {
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
  font-size: 1.8rem;
}

.register-form {
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

.register-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #0056b3;
}

.login-link {
  margin-top: 1rem;
  color: #007BFF;
}

.login-link a {
  color: #007BFF;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 600px) {
  .register-box {
    padding: 1.5rem;
    width: 90%;
  }

  h2 {
    font-size: 1.5rem;
  }

  .register-button {
    font-size: 0.9rem;
  }
}
</style>
