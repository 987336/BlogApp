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
