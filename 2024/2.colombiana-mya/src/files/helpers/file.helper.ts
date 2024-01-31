export const fileFilter = (
  request: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, isFileValid: boolean) => void,
) => {
  const validTypes = ['.webp', '.png', '.jpg'];

  const doesTheFileHaveValidTypes = validTypes.includes(
    file.mimetype.split('/')[1],
  );

  if (file == null || !doesTheFileHaveValidTypes) return callback(null, false);

  callback(null, true);
};
