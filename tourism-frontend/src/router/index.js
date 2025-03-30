import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Route components
import Home from '@/views/Home.vue';
import DestinationsList from '@/views/DestinationsList.vue';
import DestinationDetails from '@/views/DestinationDetails.vue';
import BookingPage from '@/views/BookingPage.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import UserProfilePage from '@/views/UserProfilePage.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/destinations',
    name: 'Destinations',
    component: DestinationsList,
    meta: { title: 'Explore Destinations' }
  },
  {
    path: '/destinations/:id',
    name: 'DestinationDetails',
    component: DestinationDetails,
    props: true,
    meta: { title: 'Destination Details' }
  },
  {
    path: '/destinations/:id/book',
    name: 'BookingPage',
    component: BookingPage,
    props: true,
    meta: { title: 'Book Your Trip', requiresAuth: true }
  },
  {
    path: '/payment/:bookingId',
    name: 'PaymentPage',
    component: PaymentPage,
    props: true,
    meta: { title: 'Complete Payment', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Login', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { title: 'Create Account', guest: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfilePage,
    meta: { title: 'Your Profile', requiresAuth: true },
    children: [
      {
        path: 'bookings',
        name: 'UserBookings',
        component: () => import('@/components/user/UserBookings.vue'),
        meta: { title: 'Your Bookings', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'UserSettings',
        component: () => import('@/components/user/UserSettings.vue'),
        meta: { title: 'Account Settings', requiresAuth: true }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: 'About Us' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: { title: 'Contact Us' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} | ${process.env.VUE_APP_TITLE}` 
    : process.env.VUE_APP_TITLE;
  
  // Check for protected routes
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
  // Don't allow logged in users to access login/register pages
  else if (to.meta.guest && isAuthenticated) {
    next({ name: 'Home' });
  } 
  else {
    next();
  }
});

export default router;