import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../configs/cloudinary.config';
import { SecureRequest } from '../interfaces/general/request.interface';
import KnownError from '../utils/knownError.utils';


/**
 * @description
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express Next Middleware function
 * @returns {Promise<void>} Next middleware function or a response with a message
 */
export function UploadFiles(req: Request, res: Response, next: NextFunction): void {
  const upload = multer().any();

  return upload(req, res, (err): Response | void => {
    if (err) {
      console.log(err)
      return res
        .status(400)
        .send({ message: 'Error uploading one or more files, please try again later.' });
    }

    return next();
  });
}

type AssignSingleFn =
  | { assignFn: (req: Request, file: Express.Multer.File, imageUrl: string) => void }
  | { key: string };
type AssignMultipleFn =
  | { assignFn: (req: Request, data: { file: Express.Multer.File; imageUrl: string }[]) => void }
  | { key: string };

type UploadProviderOptions = ({ multiple: true } & AssignMultipleFn) | ({ multiple?: false } & AssignSingleFn);

/**
 * @description Upload files to provider based on the options provided.
 * @param {UploadProviderOptions} options options that can be used to upload files to provider
 * @returns {AsyncReturnType<Promise<void>>} Returns a middleware function
 */
export function UploadToProvider(options: UploadProviderOptions) {
  return async (req: SecureRequest, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.files) {
      return next();
    }
    try {
      let files: Express.Multer.File[] = [];
      if (!Array.isArray(req.files)) {
        const tmp = Object.values(req.files);
        files = files.concat(tmp.flat(), files);
      } else {
        files = req.files;
      }

      if (files.length === 0) {
        return next();
      }

      if (files.length == 1) {
        cloudinary.uploader.upload_stream({ resource_type: "image" }, (err: unknown, response) => {
          if (!response) { throw new KnownError('cloudinary service timed out.') }
          req.imageUrl = [response.secure_url];
          return next();
        }).end(files[0].buffer)
      }

      if (files.length > 1) {
        const uploadedImageUrls: string[] = [];

        const uploadPromises = files.map(file => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image" }, (err: unknown, response) => {
              if (err) {
                return reject(new KnownError('Failed to upload image to Cloudinary.'));
              }
              if (!response) {
                return reject(new KnownError('Cloudinary service timed out.'));
              }
              uploadedImageUrls.push(response.secure_url);
              resolve(response.secure_url);
            }).end(file.buffer);
          });
        });

        await Promise.all(uploadPromises);

        req.imageUrl = uploadedImageUrls;

        return next();
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

