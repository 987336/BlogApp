<template>
  <div class="blog-detail">
    <h2>{{ blog.title }}</h2>
    <img src="https://images.unsplash.com/photo-1733173523386-3006dec1a835?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image" class="blog-image" />
    
    <div class="content-with-sound">
      <p v-html="blog.content"></p>
      <span @click="toggleSpeech" class="speaker-icon" role="button" aria-label="Play/Pause content">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" :style="iconStyle"></i> <!-- Play/Pause icon -->
      </span>
    </div>
    
    <div class="blog-details">
      <small class="time-details">
        <span>Created At: {{ formattedDate(blog.createdAt) }}</span><br />
        <span>Updated At: {{ formattedDate(blog.updatedAt) }}</span>
      </small>
    </div>
    
    <div class="like-section">
      <button @click="likeBlog" v-if="!hasLiked">Like</button>
      <button @click="unlikeBlog" v-if="hasLiked">Unlike</button>
      <p>Likes: {{ blog.likes ? blog.likes.length : 0 }}</p>
    </div>

    <div class="share-icons">
      <button @click="shareLink" class="share-icon" aria-label="Copy Link">
        <i class="fas fa-link"></i>
      </button>
      <button @click="shareWhatsApp" class="share-icon" aria-label="Share on WhatsApp">
        <i class="fab fa-whatsapp"></i>
      </button>
      <button @click="shareInstagram" class="share-icon" aria-label="Share on Instagram">
        <i class="fab fa-instagram"></i>
      </button>
    </div>

    <div>
      <h3>Comments</h3>
      <div v-for="comment in comments" :key="comment._id">
        <p><strong>{{ comment.userId }} </strong>: <small>{{ comment.comment }}</small></p>
      </div>
  
      <textarea v-model="newComment" placeholder="Add a comment..." rows="3"></textarea>
      <button @click="addComment">Submit Comment</button>
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
      comments: [],
      newComment: '',
      isPlaying: false, // To track whether the speech is playing or paused
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
    async speakContent() {
      const utterance = new SpeechSynthesisUtterance(this.blog.content);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    },
    toggleSpeech() {
      if (this.isPlaying) {
        speechSynthesis.pause();
      } else {
        this.speakContent();
      }
      this.isPlaying = !this.isPlaying;
    },
    formattedDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    },
    shareLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard');
      });
    },
    shareWhatsApp() {
      window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
    },
    shareInstagram() {
      alert('Instagram share functionality is not supported directly in browsers.');
    },
  },
  computed: {
    iconStyle() {
      return {
        backgroundColor: this.isPlaying ? '#FF6347' : '#4CAF50',  // Green for play, red for pause
        borderRadius: '50%',
        padding: '10px',
        color: 'white',
        fontSize: '20px',
      };
    },
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
  justify-content: flex-end; /* Align play/pause button to the right */
}
.speaker-icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 24px; /* Adjust size as needed */
  transition: transform 0.2s; /* Add a transition for animation */
}
.speaker-icon:hover {
  transform: scale(1.1); /* Slightly increase size on hover */
}

.blog-details {
  margin-top: 15px;
}
.time-details {
  font-size: 14px;
  color: #aaa;
}

.like-section {
  margin-top: 20px;
}

.share-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.share-icon {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
