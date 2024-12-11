<template>
  <div class="blog-detail">
    <h2>{{ blog.title }}</h2>
    <img 
      src="https://images.unsplash.com/photo-1733173523386-3006dec1a835?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
      alt="Blog Image" 
      class="blog-image" 
    />
    
    <!-- YouTube-like Player for Audio -->
    <div class="audio-player">
      <button 
        @click="togglePlayPause" 
        class="play-pause-btn" 
        :aria-label="isPlaying ? 'Pause' : 'Play'">
        <span v-if="isPlaying">⏸️</span>
        <span v-else>▶️</span>
      </button>
      <div class="social-share">
        <a :href="whatsappShareLink" target="_blank" class="share-icon whatsapp">
          <span role="button">📲</span> WhatsApp
        </a>
        <a :href="instagramShareLink" target="_blank" class="share-icon instagram">
          <span role="button">📷</span> Instagram
        </a>
      </div>
    </div>

    <div class="content-with-sound">
      <p v-html="blog.content"></p>
      <span @click="speakContent" class="speaker-icon" role="button" aria-label="Speak content">
        🔊
      </span>
    </div>

    <small>By User: {{ blog.userId }} | Posted on: {{ blog.createdAt }}</small>
    
    <!-- Likes and Comments Section -->
    <div>
      <button @click="likeBlog" v-if="!hasLiked">Like</button>
      <button @click="unlikeBlog" v-if="hasLiked">Unlike</button>
    </div>

    <p>Likes: {{ blog.likes ? blog.likes.length : 0 }}</p>

    <!-- Comments Section -->
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
      isPlaying: false, // Track if the content is playing or paused
      audio: new SpeechSynthesisUtterance(),
      currentIndex: 0, // To keep track of where we left off in content
    };
  },
  computed: {
    // Share Links for WhatsApp and Instagram
    whatsappShareLink() {
      return `https://wa.me/?text=${encodeURIComponent(window.location.href)}`;
    },
    instagramShareLink() {
      return `https://www.instagram.com/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    },
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
    togglePlayPause() {
      if (this.isPlaying) {
        speechSynthesis.pause();
      } else {
        speechSynthesis.resume();
      }
      this.isPlaying = !this.isPlaying;
    },
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
    speakContent() {
      this.audio.text = this.blog.content;
      this.audio.lang = 'en-US';
      speechSynthesis.speak(this.audio);
      this.isPlaying = true;

      // Event listener to track when speech ends and resume if necessary
      this.audio.onend = () => {
        if (this.currentIndex < this.blog.content.length) {
          this.audio.text = this.blog.content.substring(this.currentIndex);
          speechSynthesis.speak(this.audio);
        }
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
}

.speaker-icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 24px; 
  transition: transform 0.2s; 
}

.speaker-icon:hover {
  transform: scale(1.1); 
}

.audio-player {
  display: flex;
  align-items: center;
}

.play-pause-btn {
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
}

.social-share {
  margin-left: 20px;
}

.share-icon {
  display: inline-block;
  margin-right: 15px;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.share-icon.whatsapp {
  background-color: #25d366;
}

.share-icon.instagram {
  background-color: #f10065;
  color: white;
}
</style>
