import type { Response, NextFunction } from 'express';
import UAParser, { IResult } from 'ua-parser-js';
import { LoginRequest } from '../interfaces/general/request.interface';
import KnownError from '../utils/knownError.utils';


interface ICustomDeviceInfo {
  device: {
    type: string;
    vendor: string;
  }
}
export const recentDeviceMiddleware = async (req: LoginRequest, _res: Response, next: NextFunction) => {
  try {
    const userAgent = req.headers['user-agent'];
    if (!userAgent) {
      throw new KnownError("Please provide a valid user-agent");
    }

    let deviceInfo: IResult | ICustomDeviceInfo = {
      device: {
        type: '',
        vendor: ''
      }
    };

    if (userAgent.includes('custom:')) {
      const deviceDetailsData = userAgent.split(":");
      deviceInfo.device.vendor = deviceDetailsData[1];
      deviceInfo.device.type = deviceDetailsData[2];
    } else {
      const parser = new UAParser(userAgent);
      deviceInfo = parser.getResult();
    }

    if (!deviceInfo.device) {
      throw new KnownError('Can not detect your device type, please try again later.');
    }

    req.deviceInfo = {
      deviceName: `${deviceInfo.device.type} ${deviceInfo.device.vendor}` || 'Unknown Device',
      oneSignalId: req.body.oneSignalId
    };
    next();
  } catch (error) {
    console.error('Error in recentDeviceMiddleware:', error);
    next(error);
  }
};
