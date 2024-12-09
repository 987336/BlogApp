<template>
  <div>
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Create Blog</h2>
        <form @submit.prevent="createBlog" class="blog-form">
          <div class="form-group">
            <label for="blogName">Blog Name:</label>
            <input type="text" v-model="blogName" required />
          </div>
          <div class="form-group">
            <label for="blogImage">Blog Image:</label>
            <input type="file" @change="onFileChange" required />
          </div>
          <div class="form-group">
            <label for="aboutBlog">About Blog:</label>
            <textarea v-model="aboutBlog" required></textarea>
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>
    </div>

    <div class="blog-list">
      <h2>
        All Blogs
        <button class="create-blog-btn" @click="openModal">Create Blog</button>
      </h2>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by blog name..."
          class="search-input"
        />
      </div>
      <br>
      <div class="blogs-container">
        <div v-for="blog in filteredBlogs" :key="blog._id" class="blog-item">
          <h3>{{ blog.title }}</h3>
          <p>{{ blog.content.split(' ').slice(0, 5).join(' ') + '...' }}</p>
          <img
            :src="blog.image ? `http://localhost:5000/${blog.image}` : 'path/to/fallback-image.jpg'"
            alt="Blog Image"
            class="blog-image"
          />
          <small>By User: {{ blog.userId }}</small>
          <button @click="viewBlog(blog._id)" class="read-blog-btn">Read Blog</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalOpen: false,
      blogName: '',
      blogImage: null,
      aboutBlog: '',
      userId: this.$store.getters.userdetails._id,
      blogs: [], // Array to hold the blogs
      searchQuery: '', // Search query for filtering blogs
    };
  },
  async created() {
    await this.fetchBlogs(); // Fetch all blogs when the component is created
  },
  computed: {
    filteredBlogs() {
      return this.blogs.filter(blog => {
        return blog.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
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

        const response = await fetch('http://localhost:5000/api/blog/blogs', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create blog');
        }

        const data = await response.json();
        this.blogs.push(data.blog); // Add the newly created blog to the list
        console.log('Blog created successfully:', data);
        this.closeModal();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchBlogs() {
      try {
        const response = await fetch('http://localhost:5000/api/blog/allBlogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        this.blogs = data; // Set the blogs array with the fetched data
      } catch (error) {
        console.error(error);
      }
    },
    viewBlog(blogId) {
      this.$router.push({ name: 'BlogDetail', params: { id: blogId } });
    },
  },
};
</script>

<style scoped>
.create-blog-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
  float: right;
}

.create-blog-btn:hover {
  background-color: #45a049;
}

.search-container {
  text-align: center;
  margin: 10px 0;
}

.search-input {
  width: 80%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  overflow: auto;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  position: relative;
}

.close {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: #000;
}

.blog-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="file"],
.form-group textarea {
  width: 97%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #45a049;
}

.blog-list h2 {
  font-size: 24px;
  margin-top: 20px;
}

.blogs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.blog-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.blog-item h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.blog-item p {
  font-size: 16px;
  color: #666;
}

.blog-item img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 8px;
}

.blog-item small {
  font-size: 14px;
  color: #999;
  display: block;
  margin-top: 10px;
}

.read-blog-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.read-blog-btn:hover {
  background-color: #0056b3;
}
</style>
