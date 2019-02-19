<template>
  <div id="page-join-room">
    <button @click="joinRoom">joinRoom</button>
    <div id="remotetracks" style="width: 640px;"></div>
  </div>
</template>

<script>
import * as QNRTC from 'pili-rtc-web';

export default {
  name: 'join-room',
  methods: {
    async joinRoom() {
      // 初始化一个房间 Session 对象
      const myRoom = new QNRTC.TrackModeSession();
      // 这里替换成刚刚生成的 RoomToken
      const roomName = this.$route.query.room;
      const { data } = await this.$http.post('/qnrtc/get_room_token', { roomName, userId: 'kunlook', permission: 'user' });
      await myRoom.joinRoomWithToken(data.roomToken);
      console.log('joinRoom success!');

      // 在这里添加
      this.autoSubscribe(myRoom);
    },
    // 这里的参数 myRoom 是指刚刚加入房间时初始化的 Session 对象, 同上
    autoSubscribe(myRoom) {
      const trackInfoList = myRoom.trackInfoList;
      console.log('room current trackInfo list', trackInfoList);

      // 调用我们刚刚编写的 subscribe 方法
      // 注意这里我们没有使用 async/await，而是使用了 Promise，大家可以思考一下为什么
      this.subscribe(myRoom, trackInfoList)
        .then(() => console.log('subscribe success!'))
        .catch(e => console.error('subscribe error', e));

      // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
      myRoom.on('track-add', (trackInfoList) => {
        console.log('get track-add event!', trackInfoList);
        this.subscribe(myRoom, trackInfoList)
          .then(() => console.log('subscribe success!'))
          .catch(e => console.error('subscribe error', e));
      });
      // 就是这样，就像监听 DOM 事件一样通过 on 方法监听相应的事件并给出处理函数即可
    },
    // 这里的参数 myRoom 是指刚刚加入房间时初始化的 Session 对象, 同上
    // trackInfoList 是一个 trackInfo 的列表，订阅支持多个 track 同时订阅。
    async subscribe(myRoom, trackInfoList) {
      // 通过传入 trackId 调用订阅方法发起订阅，成功会返回相应的 Track 对象，也就是远端的 Track 列表了
      const remoteTracks = await myRoom.subscribe(trackInfoList.map(info => info.trackId));

      // 选择页面上的一个元素作为父元素，播放远端的音视频轨
      const remoteElement = document.getElementById('remotetracks');
      // 遍历返回的远端 Track，调用 play 方法完成在页面上的播放
      for (const remoteTrack of remoteTracks) {
        remoteTrack.play(remoteElement);
      }
    }
  }
};
</script>

<style>
</style>
