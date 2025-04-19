import { launchImageLibrary } from "react-native-image-picker";


const options = {
  mediaType: "photo",
  includeBase64: true, // Needed to get base64 string
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 0.8,
};

export const pickImageAsBase64 = async () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log("User canceled image picker");
        resolve(null);
      } else if (response.errorCode) {
        console.error("ImagePicker error:", response.errorMessage);
        reject(response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];

        if (!asset.base64) {
          console.warn("No base64 string found in asset.");
          resolve(null);
        } else {
          resolve(asset.base64);
        }
      } else {
        console.warn("Unexpected response format from image picker.");
        resolve(null);
      }
    });
  });
};