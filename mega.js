const mega = require("megajs");
const auth = {
    email: 'sudaramihiranga889@gmail.com',
    password: 'sudara1234@M',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
}

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, () => {
                data.pipe(storage.upload({name: name, allowUploadBuffering: true}));
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) throw err;
                        storage.close()
                        resolve(url);
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { upload };

import * as mega from "megajs";
import fs from "fs";

// Mega authentication credentials
const auth = {
    email: "", // your mega account login email
    password: "", // your mega account login password
    userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
};

export const upload = (filePath, fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const readStream = fs.createReadStream(filePath);

                const uploadStream = storage.upload({
                    name: fileName,
                    allowUploadBuffering: true,
                });

                readStream.pipe(uploadStream);

                uploadStream.on("complete", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            reject(err);
                        } else {
                            storage.close();
                            resolve(url);
                        }
                    });
                });

                uploadStream.on("error", (error) => {
                    reject(error);
                });

                readStream.on("error", (error) => {
                    reject(error);
                });
            });

            storage.on("error", (error) => {
                reject(error);
            });
        } catch (err) {
            reject(err);
        }
    });
};

export const download = (url) => {
    return new Promise((resolve, reject) => {
        try {
            const file = mega.File.fromURL(url);

            file.loadAttributes((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                file.downloadBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};
