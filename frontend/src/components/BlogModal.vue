<template>
    <div class="modal" v-if="isOpen" @click.self="closeModal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>Create Blog Post</h2>
        <form @submit.prevent="submitBlog">
          <div class="form-group">
            <label for="blogName">Blog Name:</label>
            <input type="text" v-model="blogName" required />
          </div>
          <div class="form-group">
            <label for="blogImage">Blog Image URL:</label>
            <input type="url" v-model="blogImage" required />
          </div>
          <div class="form-group">
            <label for="blogContent">Content:</label>
            <textarea v-model="blogContent" required></textarea>
          </div>
          <button type="submit">Create Blog</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        blogName: '',
        blogImage: '',
        blogContent: '',
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      submitBlog() {
        const blogData = {
          name: this.blogName,
          image: this.blogImage,
          content: this.blogContent,
        };
        // Replace with your API call to send data to the database
        this.$emit('submit', blogData);
        this.closeModal(); // Close modal after submission
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 500px;
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
    font-size: 1.5rem;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  