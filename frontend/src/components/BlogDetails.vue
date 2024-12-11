<template>
  <div class="blog-detail">
    <h2>{{ blog.title }}</h2>
    <img
      src="https://images.unsplash.com/photo-1733173523386-3006dec1a835?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Blog Image"
      class="blog-image"
    />

    <!-- YouTube Video Embed -->
    <div class="youtube-container">
      <iframe
        :src="youtubeUrl"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="youtube-video"
      ></iframe>
      <div class="video-controls">
        <button @click="togglePlayPause" class="play-pause-btn">
          <i :class="isPlaying ? 'fa fa-pause' : 'fa fa-play'"></i>
        </button>
      </div>
    </div>

    <small>By User: {{ blog.userId }} | Posted on: {{ new Date(blog.createdAt).toLocaleString() }}</small>
    
    <div class="content-with-sound">
      <p v-html="blog.content"></p>
      <span @click="speakContent" class="speaker-icon" role="button" aria-label="Speak content">
        <i class="fa fa-volume-up"></i>
      </span>
    </div>

    <div>
      <button @click="likeBlog" v-if="!hasLiked">Like</button>
      <button @click="unlikeBlog" v-if="hasLiked">Unlike</button>
    </div>

    <p>Likes: {{ blog.likes ? blog.likes.length : 0 }}</p>

    <div>
      <h3>Comments</h3>
      <div v-for="comment in comments" :key="comment._id">
        <p><strong>{{ comment.userId }} </strong>: <small>{{ comment.comment }}</small></p>
      </div>

      <textarea v-model="newComment" placeholder="Add a comment..." rows="3"></textarea>
      <button @click="addComment">Submit Comment</button>
    </div>

    <!-- Share Icons -->
    <div class="share-icons">
      <button class="share-btn whatsapp-btn" @click="shareToWhatsApp">
        <i class="fa fa-whatsapp"></i>
      </button>
      <button class="share-btn instagram-btn" @click="shareToInstagram">
        <i class="fa fa-instagram"></i>
      </button>
      <button class="share-btn copy-link-btn" @click="copyLink">
        <i class="fa fa-link"></i>
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
      comments: [],
      newComment: '',
      isPlaying: false,
      youtubeUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with dynamic video ID
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
    togglePlayPause() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        // Play the video or start from paused state (custom logic can be added here)
        console.log('Video playing...');
      } else {
        // Pause the video (custom logic can be added here)
        console.log('Video paused...');
      }
    },
    shareToWhatsApp() {
      const message = `Check out this blog: ${window.location.href}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    },
    shareToInstagram() {
      // Instagram sharing logic (Instagram doesn't have a direct share URL like WhatsApp)
      alert('Share this blog on Instagram!');
    },
    copyLink() {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy link', err);
        });
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
  font-family: Arial, sans-serif;
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

.youtube-container {
  position: relative;
  margin-top: 20px;
}

.youtube-video {
  width: 100%;
  height: 350px;
  border-radius: 8px;
}

.video-controls {
  position: absolute;
  top: 10px;
  left: 10px;
}

.play-pause-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.share-icons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.share-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
}

.whatsapp-btn {
  background-color: #25d366;
}

.instagram-btn {
  background-color: #e4405f;
}

.copy-link-btn {
  background-color: #555;
}
</style>
