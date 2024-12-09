<template>
  <div class="profile">
    <header class="profile-header">
      <div class="header-content">
        <h1 class="welcome-message">
          <span class="Welcometext">Welcome</span>
          <span class="ProfileName">{{ username.name }}!</span>
        </h1>
        <nav class="nav-links-main">
          <router-link to="/" class="nav-links-main">
          </router-link>
          <router-link to="/" class="nav-links-main">
           
          </router-link>
          <router-link to="/myserviceblog" class="nav-links-main">
            <i class="fas fa-pencil-alt"></i> Blogs
          </router-link>
          <router-link to="/contact" class="nav-links-main">
            <i class="fas fa-headset"></i> Support
          </router-link>
          
        </nav>
        <button @click="logout" class="logout-button"><i class="fas fa-sign-out-alt"></i> Logout</button>
        <button class="hamburger" @click="toggleMenu">
          <div :class="{ bar: true, active: isMenuOpen }"></div>
          <div :class="{ bar: true, active: isMenuOpen }"></div>
          <div :class="{ bar: true, active: isMenuOpen }"></div>
        </button>
      </div>
      <nav :class="['nav-links', { 'show': isMenuOpen }]" @click="closeMenu">
        <router-link to="/myserviceblog" class="nav-link">
          <i class="fas fa-pencil-alt"></i> Blogs
        </router-link>
        <router-link to="/Services" class="nav-link">
          <i class="fas fa-concierge-bell"></i> Services
        </router-link>
        <router-link to="/contact" class="nav-link">
          <i class="fas fa-headset"></i> Support
        </router-link>
        <button @click="logout" class="logout-button-hamburger">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </nav>
      <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>
    </header>
    <ImageUpload />
    <BlogsComp />

  </div>
</template>


<script>
import ImageUpload from './ImageUpload.vue';
import BlogsComp from './BlogPage.vue';

export default {
  components: {
    ImageUpload,
    BlogsComp
  },
  data() {
    return {
      username: {}, // Initialize username as an object
      isMenuOpen: false, // State to manage menu open/close
    };
  },
  mounted() {
    // Retrieve username from localStorage when the component is mounted
    const userData = localStorage.getItem('user') || '{"name": "User", "_id": ""}';
    this.username = JSON.parse(userData);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Toggle menu state
    },
    closeMenu() {
      this.isMenuOpen = false; // Close the menu
    },
    logout() {
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('user'); // Remove user data from localStorage
      this.$router.push('/login'); // Redirect to login page
    }
  }
};
</script>

<style scoped>
.profile {
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: #fff;
  position: relative; /* Position for the overlay */
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.welcome-message {
  font-size: 1.2em; /* Responsive font size */
  color: #333;
  flex-grow: 1; /* Allows the welcome message to take up available space */
}

.hamburger {
  display: none; /* Hide by default, show on mobile */
  flex-direction: column;
  cursor: pointer;
  border: none;
  background: none;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: #333;
  margin: 3px 0;
  transition: 0.3s;
}

.bar.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.bar.active:nth-child(2) {
  opacity: 0; /* Hide the middle bar */
}

.bar.active:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.nav-links {
  position: absolute; /* Make it absolute to overlap */
  top: 60px; /* Adjust based on header height */
  right: 0;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: all 0.3s ease;
  z-index: 20; /* Make sure it is above other elements */
  padding: 10px 0;
  display: none; /* Hide by default */
}
.nav-links-main{
  display: flex;
    flex: auto;
    text-decoration: none;
    color: #333;
    gap: 14px;
    transition: opacity 0.3s ease, transform 0.3s ease; /* For animation */

}
.nav-links-main:hover {
  color: #ff4757; /* Change color on hover */
}

.nav-links.show {
  display: flex; /* Show when active */
  flex-direction: column; /* Stack links vertically */
  opacity: 1; /* Ensures it is visible */
  transform: translateY(0); /* Reset position */
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 0.9em; /* Adjust font size for smaller screens */
  padding: 10px 20px;
  transition: color 0.3s ease;
  opacity: 0; /* Hide by default */
  transform: translateY(-10px); /* Start slightly above */
  transition: opacity 0.3s ease, transform 0.3s ease; /* For animation */
}

.nav-link:hover {
  color: #ff4757; /* Change color on hover */
}

/* Show links with animation */
.nav-links.show .nav-link {
  opacity: 1; /* Fade in */
  transform: translateY(0); /* Move to original position */
}
.logout-button{
  background-color: #ff4757; /* Red color for logout button */
  color: white;
  border: none;
  padding: 8px 12px; /* Adjusted padding for mobile */
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em; /* Adjust font size for smaller screens */
  transition: background-color 0.3s ease;
  margin: 10px 20px; /* Margin for the logout button */
}

.logout-button-hamburger {
  background-color: #ff4757; /* Red color for logout button */
  color: white;
  border: none;
  padding: 8px 12px; /* Adjusted padding for mobile */
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em; /* Adjust font size for smaller screens */
  transition: background-color 0.3s ease;
  margin: 10px 20px; /* Margin for the logout button */
}

.logout-button-hamburger:hover {
  background-color: #e84118; /* Darker red on hover */
}

.Welcometext {
  color: #e84118;
  margin-right: 5px; /* Adjusted margin for smaller screens */
}

.ProfileName {
  font-size: 1em; /* Adjust font size for better readability */
  margin-left: 5px; /* Adjusted margin for smaller screens */
}

/* Overlay for outside click */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5; /* Ensure it is below the nav links but above other content */
}
.nav-links-main i{
  position: relative;
  top: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hamburger {
    display: flex; /* Show hamburger on mobile */
  }

  .profile-header {
    justify-content: space-between;
    padding: 10px; /* Keep padding */
  }

  .nav-links {
    display: none; /* Hide by default */
  }
  .logout-button{
   display: none;
  }
  .nav-links-main{
    display: none;
  }
}
</style>
