<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Welcome Back!</h2>
      <p class="subheading">Please log in to continue</p>
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
          <span v-if="isLoading" class="spinner"></span>Login
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
  background: linear-gradient(135deg, rgba(255, 71, 87, 0.8), rgba(255, 105, 135, 0.8)), url('https://source.unsplash.com/1600x900/?technology') no-repeat center center/cover;
  position: relative;
  color: white;
  text-align: center;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency */
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
}

.subheading {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;
}

.input-group input:focus {
  border-color: #ff4757;
  outline: none;
}

.login-button {
  background-color: #ff4757;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-button:hover {
  background-color: #e84118;
  transform: scale(1.05);
}

.login-button:disabled {
  background-color: #dfe4ea;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 24px;
  height: 24px;
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
  margin-top: 1.5rem;
  color: #ff4757;
}

.register-link a {
  color: #ff4757;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-box {
    padding: 2rem;
    width: 80%;
  }

  h2 {
    font-size: 2rem;
  }

  .login-button {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .login-box {
    padding: 1.5rem;
    width: 90%;
  }

  h2 {
    font-size: 1.75rem;
  }

  .login-button {
    font-size: 1rem;
    padding: 0.9rem;
  }

  .input-group input {
    padding: 0.85rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 400px) {
  .login-box {
    padding: 1rem;
    width: 100%;
  }

  h2 {
    font-size: 1.5rem;
  }

  .login-button {
    font-size: 0.9rem;
    padding: 0.85rem;
  }

  .input-group input {
    padding: 0.8rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
  }
}
</style>
