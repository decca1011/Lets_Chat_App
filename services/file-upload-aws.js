
const { config } = require('dotenv');
config(); // Load environment variables from .env file
const multer = require('multer');
const { PutObjectCommand, GetObjectCommand, S3Client,} = require('@aws-sdk/client-s3'); 
const { getSignedUrl }  = require('@aws-sdk/s3-request-presigner')
const crypto = require('crypto')
const sharp = require('sharp');
const { url } = require('inspector');

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
const REGION_NAME = process.env.REGION_NAME;
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const randomImagename = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const s3bucket = new S3Client({
    credentials: {
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    },
    region: REGION_NAME,
  });

const uploadFileToS3 = async (req,res) => {
 const file = req.file;
    const buffer = await sharp(file.buffer).resize({ height: 1920, width: 1080, fit: 'contain' }).toBuffer();
    const imageName = randomImagename();
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3bucket.send(command);

    return imageName;
};

const GetObjectUrl = async (imageName) => {
    try {
        // if (!imageName) {
        //     throw new Error('Image name is missing.');
        // }

        const getObjectParams = {
            Bucket: BUCKET_NAME,
            Key: imageName,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3bucket, command, { expiresIn: 3600 });

        return url;
    } catch (error) {
        console.error('Error getting object URL:', error);
        throw error;
    }
};


module.exports = {
    uploadFileToS3 , GetObjectUrl
};





// Set storage engine
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         // Change the filename to include the original file extension
//         const ext = path.extname(file.originalname);
//         cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//     }
// });