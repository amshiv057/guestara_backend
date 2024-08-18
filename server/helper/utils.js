import cloudinary from "cloudinary";
require("../../config/config");
cloudinary.config({
    cloud_name: global.gConfig.cloudinary.cloud_name,
    api_key: global.gConfig.cloudinary.api_key,
    api_secret: global.gConfig.cloudinary.api_secret
})

module.exports = {
    getSecureUrl: async (files) => {
        var result = await cloudinary.v2.uploader.upload(files.path, { resource_type: "auto" });
        return result.secure_url;
    },
}