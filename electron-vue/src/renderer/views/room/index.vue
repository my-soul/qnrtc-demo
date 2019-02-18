<template>
  <div id="page-room">
    <h1>pili-rtc-web-version: {{ v }}</h1>
    <button @click="joinRoom">joinRoom</button>
    <div id="localtracks" style="width: 640px;"></div>
  </div>
</template>

<script>
import * as QNRTC from 'pili-rtc-web';
import { getToken } from '../../common/api';

export default {
  name: 'room',
  data() {
    return {
      v: QNRTC.version
    };
  },
  methods: {
    async joinRoom() {
      console.log(QNRTC);
      // 初始化一个房间 Session 对象
      const myRoom = new QNRTC.TrackModeSession();
      // 这里替换成刚刚生成的 RoomToken
      const token = await getToken('d8lk7l4ed', 'qwejjh88', 'admin');
      await myRoom.joinRoomWithToken(token);
      console.log('joinRoom success!');

      await this.publish(myRoom);
    },
    async publish(myRoom) {
      // 我们打开了 3 个参数，即采集音频，采集视频，采集屏幕共享。
      // 这个函数会返回一个列表，列表中每一项就是一个音视频轨对象
      const localTracks = await QNRTC.deviceManager.getLocalTracks({
        audio: { enabled: false, tag: 'audio' },
        video: { enabled: true, tag: 'video' },
        screen: { enabled: true, tag: 'screen' }
      });
      console.log('my local tracks', localTracks);
      // 将刚刚的 Track 列表发布到房间中
      await myRoom.publish(localTracks);
      console.log('publish success!');

      // 在这里添加
      // 获取页面上的一个元素作为播放画面的父元素
      const localElement = document.getElementById('localtracks');
      // 遍历本地采集的 Track 对象
      for (const localTrack of localTracks) {
        // 如果这是麦克风采集的音频 Track，我们就不播放它。
        if (localTrack.info.tag === 'audio') continue;
        // 调用 Track 对象的 play 方法在这个元素下播放视频轨
        localTrack.play(localElement, true);
      }
    }
  }
};
</script>

<style>
</style>
