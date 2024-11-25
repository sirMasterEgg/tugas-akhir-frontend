export default function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      if (reader.result) {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export function fileToBase64Display(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      if (reader.result) {
        const base64String = reader.result as string;
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export function filesToBase64Display(files: FileList | null) {
  if (!files) {
    return [];
  }

  return Array.from(files).map((file) => fileToBase64Display(file));
}
