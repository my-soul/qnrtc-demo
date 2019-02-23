import { Controller, Post, BodySchame, Body, ApiDescription, Get, Ctx } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'Koa';
import { ResultUtils } from '../utils/result-utils';
import * as QNRTCAPI from '../service/qnrtc';

@ApiDescription('七牛接口')
@Controller('/qnrtc')
export default class qnrtc {
  @ApiDescription('获取roomToken')
  @Post('/get_room_token')
  @BodySchame(
    joi.object().keys({
      roomName: joi.string().required(),
      userId: joi.string().required(),
      permission: joi.string(),
    }),
  )
  async getRoomToken(@Body() body: any) {
    const roomToken = QNRTCAPI.room.getRoomToken(
      body.roomName,
      body.userId,
      Date.now() + 1000 * 60 * 60 * 3,
      body.permission,
    );
    return ResultUtils.success({ roomToken });
  }

  @ApiDescription('获取当前所有活跃的房间')
  @Post('/get_active_rooms')
  @BodySchame(
    joi.object().keys({
      roomNamePrefix: joi.string(),
      offset: joi.number().default(0),
      limit: joi.number().default(1000),
    }),
  )
  async listActiveRooms(@Body() body: any) {
    try {
      const activeRooms = await QNRTCAPI.room.listActiveRooms(body.roomNamePrefix, body.offset, body.limit);
      return ResultUtils.success(activeRooms);
    } catch (error) {
      return ResultUtils.badRequest(error.message);
    }
  }

  @ApiDescription('列出指定房间下当前所有用户')
  @Post('/get_room_users')
  @BodySchame(
    joi.object().keys({
      roomName: joi.string().required(),
    }),
  )
  async getRoomUsers(@Body() body: any) {
    try {
      const users = await QNRTCAPI.room.listUser(body.roomName);
      return ResultUtils.success({ users });
    } catch (error) {
      return ResultUtils.badRequest(error.message);
    }
  }
}
