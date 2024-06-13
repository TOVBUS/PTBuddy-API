const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { BlobServiceClient } = require('@azure/storage-blob');

router.get('/:filename', async (req, res) => {
  const blobname = req.params.filename;
  const localFilePath = '../files/' + blobname;
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
    console.log('컨테이너 클라이언트 : ', containerClient.containerName);
    const blobClient = containerClient.getBlobClient(blobname);
    const downloadBlockBlobResponse = await blobClient.download(0);
    downloadBlockBlobResponse.readableStreamBody.pipe(res);

  } catch (error) {
    console.log(error.message);
    res.status(500).send('파일 다운로드 실패 - error');
  }
});

module.exports = router;
