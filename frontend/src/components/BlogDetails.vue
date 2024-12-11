<template>
  <div class="blog-detail">
    <h2>{{ blog.title }}</h2>
    <img src="https://images.unsplash.com/photo-1733173523386-3006dec1a835?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image" class="blog-image" />
    
    <div class="content-with-sound">
      <p v-html="blog.content"></p>
      <span @click="toggleSpeech" class="play-pause-icon" role="button" aria-label="Play/Pause content">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </span>
    </div>
    
    <small>By User: {{ blog.userId }}</small>
    <div>
      <button @click="likeBlog" v-if="!hasLiked">Like</button>
      <button @click="unlikeBlog" v-if="hasLiked">Unlike</button>
    </div>
    
    <p>Likes: {{ blog.likes ? blog.likes.length : 0 }}</p>
    
    <p><strong>Created At: </strong>{{ formatDate(blog.createdAt) }}</p>
    <p><strong>Updated At: </strong>{{ formatDate(blog.updatedAt) }}</p>
    
    <div>
      <h3>Comments</h3>
      <div v-for="comment in comments" :key="comment._id">
        <p><strong>{{ comment.userId }} </strong>: <small>{{ comment.comment }}</small></p>
      </div>
  
      <textarea v-model="newComment" placeholder="Add a comment..." rows="3"></textarea>
      <button @click="addComment">Submit Comment</button>
    </div>
    
    <div class="share-buttons">
      <button @click="shareOnWhatsApp" class="share-btn">
        <i class="fab fa-whatsapp"></i> Share on WhatsApp
      </button>
      <button @click="shareOnInstagram" class="share-btn">
        <i class="fab fa-instagram"></i> Share on Instagram
      </button>
      <button @click="copyLink" class="share-btn">
        <i class="fas fa-link"></i> Copy Link
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blog: {},
      userId: this.$store.getters.userdetails._id,
      hasLiked: false,
      isPlaying: false,
      comments: [],
      newComment: '',
      speechSynthesis: null,
    };
  },
  async created() {
    const blogId = this.$route.params.id;
    try {
      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/allBlogs/${blogId}`);
      if (response.ok) {
        this.blog = await response.json();
        this.blog.likes = this.blog.likes || [];
        this.hasLiked = this.blog.likes.includes(this.userId);
        
        // Fetch comments
        const commentsResponse = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/blogs/${blogId}/comments`);
        if (commentsResponse.ok) {
          this.comments = await commentsResponse.json();
        } else {
          throw new Error('Failed to fetch comments');
        }
      } else {
        throw new Error('Failed to fetch blog details');
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async likeBlog() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/blogs/${this.blog._id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: this.userId }),
        });
        if (response.ok) {
          this.blog.likes.push(this.userId);
          this.hasLiked = true;
        } else {
          throw new Error('Failed to like the blog');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async unlikeBlog() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/blogs/${this.blog._id}/unlike`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: this.userId }),
        });
        if (response.ok) {
          const index = this.blog.likes.indexOf(this.userId);
          if (index > -1) {
            this.blog.likes.splice(index, 1);
          }
          this.hasLiked = false;
        } else {
          throw new Error('Failed to unlike the blog');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addComment() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/blog/blogs/${this.blog._id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: this.userId, comment: this.newComment }),
        });
        if (response.ok) {
          const commentData = await response.json();
          this.comments = commentData.comments;
          this.newComment = '';
        } else {
          throw new Error('Failed to add comment');
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    toggleSpeech() {
      if (this.isPlaying) {
        speechSynthesis.cancel();
      } else {
        const utterance = new SpeechSynthesisUtterance(this.blog.content);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
      }
      this.isPlaying = !this.isPlaying;
    },
    shareOnWhatsApp() {
      const url = window.location.href;
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
    },
    shareOnInstagram() {
      const url = window.location.href;
      window.open(`https://www.instagram.com/?url=${encodeURIComponent(url)}`, '_blank');
    },
    copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  },
};
</script>
<style scoped>
/* Styles for the blog detail page */
.blog-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.blog-detail h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}
.blog-detail img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin: 15px 0;
}
.blog-detail p {
  font-size: 18px;
  color: #555;
}
.blog-detail textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.blog-detail button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.content-with-sound {
  display: flex;
  align-items: center;
}
.play-pause-icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
}
.play-pause-icon:hover {
  transform: scale(1.1);
}
.share-buttons {
  margin-top: 20px;
}
.share-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  margin: 5px 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
}
.share-btn i {
  margin-right: 10px;
}
</style>
