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
            <input type="text" id="blogName" v-model="blogName" required />
          </div>
          <div class="form-group">
            <label for="blogImage">Blog Image:</label>
            <input type="file" id="blogImage" @change="onFileChange" required />
          </div>
          <div class="form-group">
            <label for="aboutBlog">About Blog:</label>
            <div id="aboutBlog" ref="aboutBlogEditor"></div>
          </div>
          <button type="submit" class="btn">Submit</button>
        </form>
      </div>
    </div>

    <!-- Blog list section -->
    <div class="blog-list">
      <div class="header">
        <h2>All Blogs</h2>
        <button class="btn" @click="openModal">Create Blog</button>
      </div>

      <!-- Search bar -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by blog name..."
          class="search-input"
        />
      </div>

      <!-- Blogs container -->
      <div class="blogs-container">
        <div v-for="blog in filteredBlogs" :key="blog._id" class="blog-item">
          <h3>{{ blog.title }}</h3>
          <p v-html="truncateContent(blog.content)"></p>
          <img
            src="https://images.unsplash.com/photo-1489176876421-3b720db0fb3d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Blog Image"
            class="blog-image"
          />
          <small>By User: {{ blog.userId }}</small>
          <button @click="viewBlog(blog._id)" class="btn">Read Blog</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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
      const truncated = content.split(' ').slice(0, 5).join(' ') + '...';
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
body {
  margin: 0;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}

.search-container {
  text-align: center;
  margin: 20px;
}

.search-input {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.blogs-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px;
}

.blog-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.blog-item img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .blog-item {
    padding: 15px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
