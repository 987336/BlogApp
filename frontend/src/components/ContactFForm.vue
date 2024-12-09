<template>
  <div class="contact-form">
    <h2>Contact Us about {{ service }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" v-model="formData.phone" required placeholder="Enter your phone number" />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="formData.description" required placeholder="Your message here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading || !formData.email || !formData.phone || !formData.description">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Submitting...' : 'Submit' }}
        </button>
        <button type="button" @click="cancel" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        email: '',
        phone: '',
        description: '',
        userId: this.$store.getters.userdetails._id, // Get userId from Vuex store
      },
      loading: false,
      service: this.$route.params.service || 'the service',
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:5000/api/contact/contact', this.formData);
        console.log(response);
        alert('Form submitted successfully');
        // this.$router.push('/services');
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      // this.$router.push('/services');
    },
  },
};
</script>


<style scoped>
.contact-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input,
textarea {
  width: 97%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  resize: vertical; /* Allow vertical resizing */
  min-height: 100px; /* Minimum height for the textarea */
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

button {
  width: 48%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f44336;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 5px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
