export const AzureBlobStorageServiceMock = {
  uploadFile: jest.fn().mockResolvedValue('uploaded'),
  downloadFile: jest.fn().mockImplementationOnce(() => Promise.resolve()),
  deleteFile: jest.fn().mockImplementationOnce(() => Promise.resolve()),
};
