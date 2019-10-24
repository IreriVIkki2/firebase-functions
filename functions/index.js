const functions = require("firebase-functions");
const Busboy = require("busboy");
const cors = require("cors")({ origin: true });
const path = require("path");
const fs = require("fs");
const os = require("os");

// I copy this whenever I'm writing an new function so isikushangaze
exports.sampleHttpFunction = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        return res.json({ message: "Cors enabled https requests work" });
    });
});

/**
|--------------------------------------------------
| HTTPS function endpoint for uploading a single file to google cloud
|--------------------------------------------------
*/
exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            return res.status(500).json({ message: "Not Allowed" });
        }
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const filePath = path.join(
                os.tmpdir(),
                `${fieldname || null}-${Date.now()}`,
            );
            uploadData = { file: filePath, type: mimetype };
            file.pipe(fs.createWriteStream(filePath));
        });

        busboy.on("finish", () => {
            // Initiate a storage client
            const { Storage } = require("@google-cloud/storage");
            const storage = new Storage();
            const bucketName = req.query.bucketName || req.body.bucketName;
            const filename = uploadData.file;
            const mimeType = uploadData.type;

            // Uploads a local file to the bucket
            storage
                .bucket(bucketName)
                .upload(filename, {
                    gzip: true,
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: mimeType,
                        },
                        cacheControl: "public, max-age=31536000",
                    },
                })
                .then(async uploadedFiles => {
                    const file = uploadedFiles[0];
                    await storage
                        .bucket(bucketName)
                        .file(file.name)
                        .makePublic();

                    return res.status(200).json({
                        message: `${file.name} uploaded to ${bucketName}.`,
                        metadata: file.metadata,
                    });
                })
                .catch(err => {
                    console.log("TCL: err", err);
                    return res.status(500).json({ error: err });
                });
        });

        busboy.end(req.rawBody);
    });
});

/**
|--------------------------------------------------
| HTTPS function for getting all files available in google bucket
|--------------------------------------------------
*/
exports.listFiles = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        // Rejects non get requests
        if (req.method !== "GET") {
            return res.status(400).json({ message: "Not Allowed" });
        }

        // Reject request if bucket name is not provided
        const bucketName = req.query.bucketName || req.body.bucketName;
        if (!bucketName) {
            return res.status(400).json({
                message:
                    "Bucket name not provided. add ?bucketName=<Your bucket name> to the request or {bucketName: <Your Bucket name>} to body",
            });
        }
        const { Storage } = require("@google-cloud/storage");
        const storage = new Storage();
        const [data] = await storage.bucket(bucketName).getFiles();
        const files = data.map(file => {
            return file.metadata;
        });
        return res.status(200).json(files);
    });
});
