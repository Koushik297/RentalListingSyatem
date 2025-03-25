const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Multer configuration to store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided"));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'wanderLust_DEV',
                resource_type: 'image',
                format: file.mimetype.split('/')[1], // Extracts format (jpg, png, etc.)
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(error);
                }
                console.log("Upload Successful! Cloudinary URL:", result.secure_url);
                resolve(result.secure_url);
            }
        );

        Readable.from(file.buffer).pipe(uploadStream);
    });
};

module.exports = { cloudinary, upload, uploadToCloudinary };