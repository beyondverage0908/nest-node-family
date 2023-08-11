import * as fs from 'fs';
/**
 * 创建文件夹
 * @param folderPath
 */
export function createFolder(folderPath: string) {
  // 判断文件夹是否存在
  const isFolderExists = fs.existsSync(folderPath);
  // 如果文件夹不存在，则创建目录
  if (!isFolderExists) {
    try {
      fs.mkdirSync(folderPath, { recursive: true });
    } catch (err) {
      throw err;
    }
  }
}
/**
 * 文件是否存在
 * @param filePath
 * @returns
 */
export function fileExist(filePath: string) {
  return new Promise((resolve) => {
    // 使用 fs.stat() 方法检查文件是否存在
    fs.stat(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false);
        } else {
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  });
}
/**
 * 删除文件
 * @param filePath
 */
export function deleteFile(filePath: string) {
  return new Promise((resolve) => {
    // 使用 fs.unlink() 方法删除文件
    fs.unlink(filePath, (err) => {
      if (err) {
        // console.error('Error occurred while deleting file:', err);
        resolve(false);
      } else {
        // console.log('File deleted successfully.');
        resolve(true);
      }
    });
  });
}
