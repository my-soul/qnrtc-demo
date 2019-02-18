import { Controller, Post, BodySchame, Body, ApiDescription } from 'souljs';
import * as joi from 'joi';
import config from '../config';
import { ResultUtils } from '../utils/result-utils';

const qiniu = require('qiniu');

@ApiDescription('七牛接口')
@Controller('/qiniu')
export default class User {

  @ApiDescription('获取roomToken')
  @Post('/get_room_token')
  @BodySchame(
    joi.object().keys({
      roomName: joi.string().required(),
      userId: joi.string().required(),
      permission: joi.string()
    }),
  )
  async getRoomToken(@Body() body: any) {
    const credentials = new qiniu.Credentials(config.qiniu.ak, config.qiniu.sk);
    const roomToken = qiniu.room.getRoomToken({
      appId: config.qiniu.rtc.appId,
      roomName: body.roomName,
      userId: body.userId,
      expireAt: Date.now() + (1000 * 60 * 60 * 3), // token 的过期时间默认为当前时间之后 3 小时
      permission: body.permission === 'admin' ? 'admin' : 'user', // user admin
    }, credentials);
    return ResultUtils.success({ roomToken });
  }

  @ApiDescription('获取当前所有活跃的房间')
  @Post('/get_active_rooms')
  @BodySchame(
    joi.object().keys({
      roomNamePrefix: joi.string().required(),
      offset: joi.number().default(0),
      limit: joi.number().default(1000)
    }),
  )
  async listActiveRooms(@Body() body: any) {
    const credentials = new qiniu.Credentials(config.qiniu.ak, config.qiniu.sk);
    const result = await new Promise((resolve, reject) => {
      qiniu.room.listActiveRooms(config.qiniu.rtc.appId, body.roomNamePrefix, body.offset, body.limit, credentials, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return ResultUtils.success(result);
  }

  @ApiDescription('列出指定房间下当前所有用户')
  @Post('/get_room_users')
  @BodySchame(
    joi.object().keys({
      roomName: joi.string().required()
    }),
  )
  async getRoomUsers(@Body() body: any) {
    const credentials = new qiniu.Credentials(config.qiniu.ak, config.qiniu.sk);
    const users = await new Promise((resolve, reject) => {
      qiniu.room.listUser(config.qiniu.rtc.appId, body.roomName, credentials, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.users);
        }
      });
    });
    return ResultUtils.success({ users });
  }
}
