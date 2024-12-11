<template>
  <div class="blog-detail">
    <h2>{{ blog.title }}
      <small class="created-date">Created At: {{ formattedDate(blog.createdAt) }}</small>
    </h2>
    <img src="https://images.unsplash.com/photo-1733173523386-3006dec1a835?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image" class="blog-image" />

    <!-- Play/Pause and Share Icons Section -->
    <div class="controls">
      <span @click="toggleSpeech" class="speaker-icon" role="button" aria-label="Play/Pause content">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </span>

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
    </div>

    <div class="content-with-sound">
      <p v-html="blog.content"></p>
    </div>

    <div class="like-section">
      <button @click="likeBlog" v-if="!hasLiked">Like</button>
      <button @click="unlikeBlog" v-if="hasLiked">Unlike</button>
      <p>Likes: {{ blog.likes ? blog.likes.length : 0 }}</p>
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
      isPlaying: false, // To track whether the speech is playing or paused
      utterance: null, // Store the speech instance for pause/resume
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
      } else {
        throw new Error('Failed to fetch blog details');
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    toggleSpeech() {
      if (this.isPlaying) {
        speechSynthesis.pause();
      } else {
        // If speech is paused, we resume from the last point
        if (this.utterance) {
          speechSynthesis.speak(this.utterance);
        } else {
          const newUtterance = new SpeechSynthesisUtterance(this.blog.content);
          newUtterance.lang = 'en-US';
          this.utterance = newUtterance;
          speechSynthesis.speak(this.utterance);
        }
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
    likeBlog() {
      // Like blog functionality (assumed implementation)
      this.hasLiked = true;
      this.blog.likes.push(this.userId);
    },
    unlikeBlog() {
      // Unlike blog functionality (assumed implementation)
      this.hasLiked = false;
      const index = this.blog.likes.indexOf(this.userId);
      if (index !== -1) {
        this.blog.likes.splice(index, 1);
      }
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
  display: inline-block;
}

.created-date {
  font-size: 14px;
  color: #aaa;
  margin-left: 15px;
}

.blog-detail img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin: 15px 0;
}

.content-with-sound {
  margin-top: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.speaker-icon {
  cursor: pointer;
  font-size: 24px;
  padding: 10px;
  border-radius: 50%;
  background-color: #007bff; /* Default background color */
  color: white;
}

.speaker-icon:hover {
  transform: scale(1.1); /* Slightly increase size on hover */
}

/* Change background color based on play/pause state */
.speaker-icon i.fa-play {
  background-color: green;
}
.speaker-icon i.fa-pause {
  background-color: red;
}

.share-icons {
  display: flex;
  gap: 15px;
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

.like-section {
  margin-top: 20px;
}
</style>
