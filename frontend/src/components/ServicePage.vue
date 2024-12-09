<template>
    <div class="services-page">
      <h1 class="page-title">Services We Provide</h1>
      
      <!-- Web Development Service (Left Layout) -->
      <div class="service-container">
        <div class="service left">
          <div class="service-image">
            <img src="../assets/Service/WeDevlopment.jpg" alt="Web Development" />
          </div>
          <div class="service-content">
            <h2>Web Development</h2>
            <p>We build responsive and modern websites tailored to your needs.</p>
            <p>Our web development services include e-commerce sites, content management systems, and enterprise solutions.</p>
            <p>We use the latest technologies such as HTML5, CSS3, JavaScript, and frameworks like Vue.js, React, and Angular.</p>
            <p>Our websites are optimized for performance, scalability, and user experience.</p>
            <button @click="contact('Web Development')">Contact Us</button>
          </div>
        </div>
      </div>
  
      <!-- Software Development Service (Right Layout) -->
      <div class="service-container">
        <div class="service right">
          <div class="service-image">
            <img src="../assets/Service/4380747.jpg" alt="Software Development" />
          </div>
          <div class="service-content">
            <h2>Software Development</h2>
            <p>Customized software solutions to streamline your business operations.</p>
            <p>Our software development services include custom applications, desktop and mobile apps, and cloud solutions.</p>
            <p>We work closely with you to understand your business needs and develop software that adds value.</p>
            <p>Our team follows agile practices to ensure timely delivery and flexibility in changing requirements.</p>
            <button @click="contact('Software Development')">Contact Us</button>
          </div>
        </div>
      </div>
  
      <!-- HRMS Service (Left Layout) -->
      <div class="service-container">
        <div class="service left">
          <div class="service-image">
            <img src="path/to/hrms.jpg" alt="HRMS" />
          </div>
          <div class="service-content">
            <h2>HRMS</h2>
            <p>Comprehensive HR Management Systems for effective team management.</p>
            <p>Our HRMS solutions include employee onboarding, payroll management, performance tracking, and more.</p>
            <p>We help automate HR processes, reduce manual tasks, and improve employee engagement.</p>
            <p>Our solutions are customizable, scalable, and can integrate with existing business tools.</p>
            <button @click="contact('HRMS')">Contact Us</button>
          </div>
        </div>
      </div>
  
      <!-- File Sharing Service (Right Layout) -->
      <div class="service-container">
        <div class="service right">
          <div class="service-image">
            <img src="../assets/Service/5303874.jpg" alt="File Sharing" />
          </div>
          <div class="service-content">
            <h2>File Sharing</h2>
            <p>Secure and reliable file sharing solutions.</p>
            <p>Our file-sharing service ensures data privacy, fast transfer speeds, and cross-platform compatibility.</p>
            <p>Features include file encryption, user access control, and seamless integration with cloud storage.</p>
            <p>Perfect for teams needing to collaborate on projects without compromising security.</p>
            <button @click="contact('File Sharing')">Contact Us</button>
          </div>
        </div>
      </div>
  
      <!-- Blogs Service (Left Layout) -->
      <div class="service-container">
        <div class="service left">
          <div class="service-image">
            <img src="../assets/Service/blogs.jpg" alt="Blogs" />
          </div>
          <div class="service-content">
            <h2>Blogs</h2>
            <p>Engaging blog platforms for single or multiple page applications.</p>
            <p>Our blogs are SEO-optimized to help you reach a wider audience and rank higher on search engines.</p>
            <p>We provide full customization options, easy-to-use content editors, and secure hosting solutions.</p>
            <p>Our blog solutions help you share insights, updates, and news effectively with your readers.</p>
            <button @click="viewBlog" class="view-blog-button">View Blog</button>
          </div>
        </div>
      </div>
  
      <!-- Single & Multi-Page Applications Service (Right Layout) -->
      <div class="service-container">
        <div class="service right">
          <div class="service-image">
            <img src="path/to/spa-mpa.jpg" alt="Single & Multi-Page Applications" />
          </div>
          <div class="service-content">
            <h2>Single & Multi-Page Applications</h2>
            <p>Dynamic and interactive applications to enhance user experience.</p>
            <p>We specialize in both Single-Page Applications (SPA) and Multi-Page Applications (MPA) using modern frameworks.</p>
            <p>Our apps are responsive, secure, and optimized for performance across devices and platforms.</p>
            <p>We ensure that each application meets industry standards and aligns with your business goals.</p>
            <button @click="contact('Single & Multi-Page Applications')">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
    //   contact(serviceName) {
    //     alert(`Contact us for more information on ${serviceName}`);
    //   },
      contact(serviceName) {
    this.$router.push({ name: 'ContactForm', params: { service: serviceName } });
  },
      viewBlog() {
        this.$router.push('/myserviceblog');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Common styles as before */
  .services-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 2rem;
    text-transform: uppercase;
  }
  
  .service-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .service {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, background 0.3s;
  }
  
  .service:hover {
    transform: scale(1.05);
    background: #eae9e9;
  }
  
  .service.left {
    flex-direction: row;
  }
  
  .service.right {
    flex-direction: row-reverse;
  }
  
  .service-image img {
    width: 300px;
    height: auto;
    border-radius: 10px;
  }
  
  .service-content {
    max-width: 600px;
    text-align: left;
  }
  .service-content h2{
   color: #0056b3;
  }
  
  @media (max-width: 1024px) {
    .service {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  
    .service-image img {
      width: 80%;
    }
  
    .service-content {
      max-width: 90%;
    }
  }
  
  @media (max-width: 768px) {
    .page-title {
      font-size: 1.75rem;
    }
    .service {
      flex-direction: row;
      align-items: center;
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .service {
      flex-direction: row;
      align-items: center;
      text-align: center;
    }
    .page-title {
      font-size: 1.5rem;
    }
    
    .service-container {
      gap: 1rem;
    }
    
    .service-content h2 {
      font-size: 1.2rem;
    }
    
    .service-content p {
      font-size: 0.8rem;
    }
    
    .service-image img {
      width: 100%;
    }
  }
  </style>
  