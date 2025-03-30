<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <NotificationBanner v-if="notification" :message="notification.message" :type="notification.type" @close="clearNotification" />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import NotificationBanner from '@/components/common/NotificationBanner.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    NotificationBanner
  },
  computed: {
    ...mapState({
      notification: state => state.notification
    })
  },
  methods: {
    ...mapActions(['clearNotification'])
  },
  created() {
    // Check for authentication token on app start
    this.$store.dispatch('auth/checkAuthState');
  }
};
</script>

<style lang="scss">
// Global styles could also be imported here or in main.js
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Open Sans', Arial, sans-serif;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>