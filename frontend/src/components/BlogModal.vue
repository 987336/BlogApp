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
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>
    </div>

    <!-- Blog list section -->
    <div class="blog-list">
      <h2>
        All Blogs 
        <button class="create-blog-btn" @click="openModal">Create Blog</button>
      </h2>

      <!-- Search bar -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by blog name..."
          class="search-input"
        />
      </div>

      <br />

      <!-- Blogs container -->
      <div class="blogs-container">
        <div v-for="blog in filteredBlogs" :key="blog._id" class="blog-item">
          <h3>{{ blog.title }}</h3>
          <p v-html="truncateContent(blog.content)"></p>

          <img
            src="https://images.unsplash.com/photo-1733778567728-2941850a901c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
      defaultImage:
        'https://images.unsplash.com/photo-1733778567699-292f5e9354d6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };
  },
  async created() {
    await this.fetchBlogs();
  },
  computed: {
    filteredBlogs() {
      return this.blogs.filter(blog =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    truncateContent(content) {
    // Limit the content to the first 5 words, while preserving HTML tags.
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
        formData.append('content', this.aboutBlog); // Send the content as HTML
        formData.append('userId', this.userId);

        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/blogs`, {
          method: 'POST',
          body: formData,
        });

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
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/allBlogs`);
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
        this.aboutBlog = quill.root.innerHTML; // Store the HTML content in the aboutBlog field
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

.form-group input[type='text'],
.form-group input[type='file'],
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.blog-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  align-self: center;
}

.read-blog-btn:hover {
  background-color: #0056b3;
}
</style>
