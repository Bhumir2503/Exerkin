import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Alert } from "react-native";

const options = {
  mediaType: "photo",
  includeBase64: true,
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 0.8,
};

export const pickImageAsBase64 = async () => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => {
            launchCamera(options, (response) => {
              handleResponse(response, resolve, reject);
            });
          },
        },
        {
          text: "Choose from Library",
          onPress: () => {
            launchImageLibrary(options, (response) => {
              handleResponse(response, resolve, reject);
            });
          },
        },
        {
          text: "Cancel",
          onPress: () => resolve(null),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  });
};

const handleResponse = (response, resolve, reject) => {
  if (response.didCancel) {
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
};