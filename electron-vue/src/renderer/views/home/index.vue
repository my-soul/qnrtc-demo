<template>
  <div id="page-room">
    <h1>pili-rtc-web-version: {{ v }}</h1>
    <button @click="createRoom">创建房间</button>
    <button @click="getActiveRooms">刷新</button>
    <ul>
      <li v-for="(room, index) in activeRooms" :key="index">
        <button @click="joinRoom(room)">{{ room }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import * as QNRTC from 'pili-rtc-web';

export default {
  name: 'home',
  data() {
    return {
      v: QNRTC.version,
      activeRooms: []
    };
  },
  created() {
    this.getActiveRooms();
  },
  methods: {
    getActiveRooms() {
      this.$http.post('/qnrtc/get_active_rooms').then((result) => {
        this.activeRooms = result.data.rooms;
      });
    },
    createRoom() {
      this.$router.push({ path: '/create-room' });
    },
    joinRoom(room) {
      this.$router.push({ path: '/join-room', query: { room } });
    }
  }
};
</script>

<style>
</style>
