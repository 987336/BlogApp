// import { createRouter, createWebHistory } from 'vue-router'; // For Vue 3
// import MyProjectLogin from '../components/myProjectLogin.vue';
// import MyProjectRegister from '../components/myProjectRegister.vue';
// import MyUsersProfile from '../components/MyUsersProfile.vue'; // Import your profile component
// import MyServiceBlog from '../components/BlogPage.vue'; // Import your Blog component
// import ViewBlog from '../components/BlogDetails.vue'; // Import your Blog Detail Component
// import ServicePage from '../components/ServicePage.vue'; // Import your Blog Detail Component


// const routes = [
//   { path: '/login', component: MyProjectLogin },
//   { path: '/register', component: MyProjectRegister },
//   { path: '/myusersprofile', component: MyUsersProfile }, // Add this route
//   { path: '/myserviceblog', component: MyServiceBlog }, // Add this route
//   { path: '/Services', component: ServicePage }, // Add this route
//   { path: '/', redirect: '/Services' }, // Default route
//   {
//     path: '/blog/:id',
//     name: 'BlogDetail',
//     component: ViewBlog
//   }
  
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });
// // Route guard to check authentication
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('token'); // Check for token in localStorage
//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//     next('/login'); // Redirect to login if not authenticated
//   } else {
//     next(); // Proceed to the route
//   }
// });

// export default router;
import { createRouter, createWebHistory } from 'vue-router'; // For Vue 3
import MyProjectLogin from '../components/myProjectLogin.vue';
import MyProjectRegister from '../components/myProjectRegister.vue';
import MyUsersProfile from '../components/MyUsersProfile.vue'; // Import your profile component
import MyServiceBlog from '../components/BlogPage.vue'; // Import your Blog component
import ViewBlog from '../components/BlogDetails.vue'; // Import your Blog Detail Component
import ServicePage from '../components/ServicePage.vue'; // Import your Service Page Component
import ContactForm from '../components/ContactFForm.vue'; // Import your Service Page Component


const routes = [
  { path: '/login', component: MyProjectLogin },
  { path: '/register', component: MyProjectRegister },
  { path: '/myusersprofile', component: MyUsersProfile, meta: { requiresAuth: true } }, // This route requires authentication
  { path: '/myserviceblog', component: MyServiceBlog, meta: { requiresAuth: true } }, // This route requires authentication
  { path: '/Services', component: ServicePage }, // Default route accessible without login
  { path: '/contact', name: 'ContactForm', component: ContactForm }, // Add this route
  { path: '/', redirect: '/Login',  }, // Default route to Services
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: ViewBlog,
    meta: { requiresAuth: true } // This route requires authentication
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for token in localStorage
  // Only check for routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
