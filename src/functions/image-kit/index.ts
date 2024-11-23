const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: 'public_JCxCGw8zqXg0IfqdHmyRNCbb2HM=',
  privateKey: 'private_BkdC3TtLFKR7bdHuaCgR6T565WQ=',
  urlEndpoint: 'https://ik.imagekit.io/epbtkdzri1',
});

export const uploadImage = async (
  file: string,
  fileName: string,
  folder: string,
): Promise<{ url: string; fileId: string }> => {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      tags: [fileName],
    });

    console.log(response);

    return { url: response.url, fileId: response.fileId };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to delete an image
export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    await imagekit.deleteFile(fileId);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
