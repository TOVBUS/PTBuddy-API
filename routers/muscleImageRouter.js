const express = require('express');
const router = express.Router();
require('dotenv').config();

// Blob Storage 클라이언트 라이브러리를 가져옵니다.
const { BlobStorageClient } = require('@azure/storage-blob');

// Azure Storage Blob 클라이언트 생성
router.get('/:filename', async (req, res) => {
  const blobname = req.params.filename;
  try {
    // BlobServiceClient를 사용하여 Blob 서비스 클라이언트를 만듭니다.
    const blobServiceClient = BlobStorageClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    // 컨테이너 클라이언트를 가져옵니다.
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
    // 블록 Blob 클라이언트를 가져옵니다. getBlobClient() 메서드를 사용하여 Blob 클라이언트를 가져옵니다.
    const blobClient = containerClient.getBlobClient(blobname);
    // 블록 Blob을 다운로드합니다.
    const downloadBlockBlobResponse = await blobClient.download(0);
    // 응답을 스트림으로 읽습니다. 이 의미는 파일을 읽는다는 뜻입니다.
    const downloadBlockBlobResponse_readableStream = downloadBlockBlobResponse.readableStreamBody;
    // 파일을 다운로드합니다.
    downloadBlockBlobResponse_readableStream.pipe(res);
  } catch (error) {
    console.log(error);
    //res.status(500).json({ success: false, message: '파일 다운로드 실패' });
    console.log(error.message);
    res.status(500).send('파일 다운로드 실패');
  }
});

module.exports = router;
