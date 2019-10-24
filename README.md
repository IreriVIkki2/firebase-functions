**#My Firebase functions**
---

This is a collection of firebase functions I use to make my work easier when building websites on a daily basis.

##List all files in a bucket
*description*: This endpoint gets all the files available in a bucket.
*url*: [https://us-central1-functions-c9cb3.cloudfunctions.net/listFiles](https://us-central1-functions-c9cb3.cloudfunctions.net/listFiles)  
*method*: GET
*params*: The name of the bucket must be provided either in the **body** of the request or **query params**

##Uploading a single file
*description*: This endpoint uploads a single file to a bucket, NOTE, uploading more than one file to this endpoint will result in an error, for multiple files, see the next endpoint.
*url*: [https://us-central1-functions-c9cb3.cloudfunctions.net/uploadFile](https://us-central1-functions-c9cb3.cloudfunctions.net/uploadFile)  
*method*: POST
*params*: The name of the bucket must be provided either in the **body** of the request or **query params**


##Uploading a single file
*description*: This endpoint uploads a single file to a bucket, NOTE, uploading more than one file to this endpoint will result in an error, for multiple files, see the next endpoint.
*url*: [https://us-central1-functions-c9cb3.cloudfunctions.net/uploadFile](https://us-central1-functions-c9cb3.cloudfunctions.net/uploadFile)  
*method*: POST
*params*: The name of the bucket must be provided either in the **body** of the request or **query params**
