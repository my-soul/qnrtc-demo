import config from '../../config';

const qiniu = require('qiniu');

const credentials = new qiniu.Credentials(config.qiniu.ak, config.qiniu.sk);

/**
 * 生成roomToken
 * @param roomName 房间名称，需满足规格 ^[a-zA-Z0-9_-]{3,64}$
 * @param userId 请求加入房间的用户 ID，需满足规格 ^[a-zA-Z0-9_-]{3,50}$
 * @param expireAt 鉴权的有效时间，传入以秒为单位的 64 位 Unix 绝对时间，token 将在该时间后失效
 * @param permission "admin" 或 "user" 当权限角色为 "admin" 时，拥有将其他用户移除出房间等特权
 */
export function getRoomToken(roomName: string, userId: string, expireAt: number, permission: string): string {
  const roomToken = qiniu.room.getRoomToken(
    {
      appId: config.qiniu.rtc.appId,
      roomName,
      userId,
      expireAt,
      permission: permission === 'admin' ? 'admin' : 'user',
    },
    credentials,
  );
  return roomToken;
}

/**
 * 获取当前所有活跃的房间
 * @param roomNamePrefix 所查询房间名的前缀索引，可以为空
 * @param offset 类型，分页查询的位移标记
 * @param limit 类型，此次查询的最大长度
 */
interface IListActiveRooms {
  rooms: any[];
  end: number;
  offset: number;
}
export async function listActiveRooms(
  roomNamePrefix: string,
  offset: number,
  limit: number,
): Promise<IListActiveRooms> {
  const result: IListActiveRooms = await new Promise((resolve, reject) => {
    qiniu.room.listActiveRooms(
      config.qiniu.rtc.appId,
      roomNamePrefix,
      offset,
      limit,
      credentials,
      (err: Error, res: IListActiveRooms) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      },
    );
  });
  return result;
}

/**
 * 列出指定房间下当前所有用户
 * @param roomName 操作所查询的连麦房间。
 */
export async function listUser(roomName: string): Promise<[]> {
  const users: [] = await new Promise((resolve, reject) => {
    qiniu.room.listUser(config.qiniu.rtc.appId, roomName, credentials, (err: Error, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.users);
      }
    });
  });
  return users;
}
