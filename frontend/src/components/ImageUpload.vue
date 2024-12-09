<template>
    <div class="image-upload" :style="{ backgroundImage: `url(${backgroundImages[currentBackgroundIndex]})` }">
      <div class="profile-image-container" @click="triggerFileInput">
        <img
          v-if="images.length"
          :src="`http://localhost:5000/${images[0].imagePath}`"
          alt="Profile Image"
          class="profile-image"
        />
        <img
          v-else
          src="../assets/profile/default.jpg"
          alt="Default Profile"
          class="profile-image"
        />
      </div>
      <input
        type="file"
        @change="onFileChange"
        class="file-input"
        ref="fileInput"
      />
      <div v-if="loading" class="loading-message">Uploading...</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        file: null,
        loading: false,
        images: [],
        existingImageId: null,
        backgroundImages: [
          '../assets/background/diwali.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg',
          'https://example.com/image4.jpg'
        ],
        currentBackgroundIndex: 0,
      };
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      onFileChange(event) {
        this.file = event.target.files[0];
        if (this.file) {
          this.uploadImage();
        }
      },
      async uploadImage() {
        const formData = new FormData();
        formData.append('image', this.file);
        formData.append('userId', this.$store.getters.userdetails._id);
  
        if (this.existingImageId) {
          formData.append('imageId', this.existingImageId);
        }
  
        this.loading = true;
  
        try {
          await axios.post('http://localhost:5000/api/auth/uploadImages', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.file = null;
          this.fetchImages();
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          this.loading = false;
        }
      },
      async fetchImages() {
        try {
          const userId = this.$store.getters.userdetails._id;
          const response = await axios.get(`http://localhost:5000/api/auth/getImages?userId=${userId}`);
          this.images = response.data;
  
          if (this.images.length > 0) {
            this.existingImageId = this.images[0]._id;
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      },
      cycleBackgroundImages() {
        setInterval(() => {
          this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length;
        }, 60000); // Change image every 60 seconds (1 minute)
      },
    },
    watch: {
      '$store.getters.userdetails': {
        immediate: true,
        handler(newUserDetails) {
          if (newUserDetails && newUserDetails._id) {
            this.fetchImages();
          }
        },
      },
    },
    mounted() {
      if (this.$store.getters.userdetails && this.$store.getters.userdetails._id) {
        this.fetchImages();
      }
      this.cycleBackgroundImages(); // Start cycling through background images when component mounts
    },
  };
  </script>
  
  <style scoped>
  .image-upload {
    margin-top: 60px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-image: url(../assets/background/diwali.jpg) !important;
    transition: background-image 1s ease-in-out;
  }
  
  .profile-image-container {
    width: 150px;
    height: 150px;
    margin: 6% auto;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 21px inset, rgb(241 237 237 / 90%) 0px 0px 0px 8px;
}
  
  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .file-input {
    display: none;
  }
  
  .loading-message {
    color: #666;
    margin-top: 10px;
  }
  /* Responsive Design */
@media (max-width: 768px) {
    .image-upload {
        margin-top: 0px !important;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-image: url(../assets/background/diwali.jpg) !important;
    transition: background-image 1s ease-in-out;
  }
}
  </style>
  