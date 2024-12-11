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
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          Login
        </button>
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
      password: '',
      isLoading: false  // Add isLoading to manage the button state
    };
  },
  methods: {
    async loginUser() {
      this.isLoading = true; // Start loading animation

      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/auth/login`, {
          email: this.email,
          password: this.password,
        });

        console.log('Login successful:', response.data.user);
        alert("Login Successful");

        // Store token, username, and userId
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        this.$router.push('/myusersprofile');
      } catch (error) {
        console.error('Login failed:', error.response.data);
        alert("Login failed, please try again.");
      } finally {
        this.isLoading = false;  // Stop loading animation
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
  background-color: #ff4757;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #e84118;
}

.login-button:disabled {
  background-color: #dfe4ea;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
@media (max-width: 1024px) {
  .login-box {
    padding: 1.5rem;
    width: 80%;
  }

  h2 {
    font-size: 1.75rem;
  }

  .login-button {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .login-box {
    padding: 1rem;
    width: 90%;
  }

  h2 {
    font-size: 1.5rem;
  }

  .login-button {
    font-size: 0.9rem;
    padding: 0.7rem;
  }

  .input-group input {
    padding: 0.65rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 400px) {
  .login-box {
    padding: 1rem;
    width: 100%;
  }

  h2 {
    font-size: 1.25rem;
  }

  .login-button {
    font-size: 0.85rem;
    padding: 0.6rem;
  }

  .input-group input {
    padding: 0.6rem;
  }

  .spinner {
    width: 15px;
    height: 15px;
  }
}
</style>
