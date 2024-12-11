<template>
  <div>
    <!-- Modal for creating a blog -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Create Blog</h2>
        <form @submit.prevent="createBlog" class="blog-form">
          <div class="form-group">
            <label for="blogName">Blog Name:</label>
            <input type="text" id="blogName" v-model="blogName" placeholder="Enter blog name" required />
          </div>
          <div class="form-group">
            <label for="blogImage">Blog Image:</label>
            <input type="file" id="blogImage" @change="onFileChange" required />
          </div>
          <div class="form-group">
            <label for="aboutBlog">About Blog:</label>
            <div id="aboutBlog" ref="aboutBlogEditor"></div>
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>
    </div>

    <!-- Blog list section -->
    <div class="blog-list">
      <div class="top-bar">
        <h2>All Blogs</h2>
        <div class="action-bar">
          <button class="create-blog-btn" @click="openModal">Create Blog</button>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by blog name..."
            class="search-input"
            :class="{'expanded': isSearchFocused}"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
          />
        </div>
      </div>

      <!-- Blogs container -->
      <div class="blogs-container">
        <div v-for="blog in filteredBlogs" :key="blog._id" class="blog-item">
          <img
            src="https://images.unsplash.com/photo-1489176876421-3b720db0fb3d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Blog Image"
            class="blog-image"
          />
          <div class="blog-details">
            <h3>{{ blog.title }}</h3>
            <p v-html="truncateContent(blog.content)"></p>
            <small>By User: {{ blog.userId }}</small>
            <button @click="viewBlog(blog._id)" class="read-blog-btn">Read Blog</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import Quill editor
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // For Snow theme

export default {
  data() {
    return {
      isModalOpen: false,
      blogName: '',
      blogImage: null,
      aboutBlog: '',
      userId: this.$store.getters.userdetails._id,
      blogs: [],
      searchQuery: '',
      isSearchFocused: false,
    };
  },
  async created() {
    await this.fetchBlogs();
  },
  computed: {
    filteredBlogs() {
      return this.blogs.filter((blog) =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    truncateContent(content) {
      const truncated = content.split(' ').slice(0, 10).join(' ') + '...';
      return truncated;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.blogName = '';
      this.blogImage = null;
      this.aboutBlog = '';
    },
    onFileChange(event) {
      this.blogImage = event.target.files[0];
    },
    async createBlog() {
      try {
        const formData = new FormData();
        formData.append('title', this.blogName);
        formData.append('image', this.blogImage);
        formData.append('content', this.aboutBlog);
        formData.append('userId', this.userId);

        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/blog/blogs`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create blog');
        }

        const data = await response.json();
        this.blogs.push(data.blog);
        this.closeModal();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchBlogs() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/blog/allBlogs`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        this.blogs = data;
      } catch (error) {
        console.error(error);
      }
    },
    viewBlog(blogId) {
      this.$router.push({ name: 'BlogDetail', params: { id: blogId } });
    },
    initializeQuillEditor() {
      const quill = new Quill(this.$refs.aboutBlogEditor, {
        theme: 'snow',
        placeholder: 'Write about your blog...',
        modules: {
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ align: [] }],
            ['image', 'video'],
          ],
        },
      });

      quill.on('text-change', () => {
        this.aboutBlog = quill.root.innerHTML;
      });
    },
  },
  watch: {
    isModalOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initializeQuillEditor();
        });
      }
    },
  },
};
</script>

<style scoped>
/* General styles */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* Top bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 2px solid #ccc;
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.create-blog-btn {
  padding: 10px;
  background-color: #ff4757;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.create-blog-btn:hover {
  background-color: #0056b3;
}

.search-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: width 0.3s ease;
  width: 200px;
}

.search-input.expanded {
  width: 300px;
}

/* Blog card styles */
.blogs-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.blog-item {
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  height: 100%; /* Ensures all cards are the same height */
}

.blog-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.blog-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Ensures consistent height */
  justify-content: space-between;
  padding: 10px;
}

.read-blog-btn {
  margin-top: auto; /* Pushes button to the bottom */
  padding: 10px;
  background-color: #ff4757;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.read-blog-btn:hover {
  background-color: #ff4757;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.close:hover {
  color: red;
}

.blog-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.blog-form .form-group label {
  font-weight: bold;
}

.blog-form .form-group input,
.blog-form .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.blog-form .form-group textarea {
  height: 100px;
  resize: none;
}

.blog-form .submit-btn {
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.blog-form .submit-btn:hover {
  background-color: #218838;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .blogs-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .modal-content {
    width: 95%;
  }
}

/* General Enhancements */
body {
  background-color: #f8f9fa;
  padding: 20px;
}

h2, h3 {
  font-weight: bold;
  color: #343a40;
}
  .blog-details h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  min-height: 40px; /* Ensures consistent alignment for titles */
}

.blog-details p {
  font-size: 14px;
  color: #6c757d;
}
</style>
