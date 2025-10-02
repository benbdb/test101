Assignment 2 - Cloud Services Exercises - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Bennette Benoy
- **Student number:** n10795766
- **Partner name (if applicable):** Jithin Cyriac (n10797441)
- **Application name:** Video Transcoder
- **Two line description:** Upload & Transcode Videos
- **EC2 instance name or ID:** a2-pair91

------------------------------------------------

### Core - First data persistence service

- **AWS service name:** S3
- **What data is being stored?:** Video Files (both uploaded original videos and transcoded MP4 files)
- **Why is this service suited to this data?:** S3 is perfect for storing video files because it can handle large files, has unlimited storage space, and is very reliable. It's also cost-effective and works well with other AWS services.
- **Why is are the other services used not suitable for this data?:** DynamoDB can only store small files (under 400KB), so it can't handle videos. RDS would be too expensive and slow for storing video files. S3 is specifically made for storing files like videos.
- **Bucket/instance/table name:** Configured via Parameter Store parameter `/cab432/n10795766/a2`
- **Video timestamp:** 00:50
- **Relevant files:**
    - server/lib/s3.js
    - server/routes/videos.routes.js

### Core - Second data persistence service

- **AWS service name:** DynamoDB
- **What data is being stored?:** Video metadata (userId, videoId, filename) for tracking uploaded videos and managing user video lists
- **Why is this service suited to this data?:** DynamoDB is great for storing video information like user IDs and filenames because it's fast and can handle lots of users. It's perfect for quickly finding all videos belonging to a specific user.
- **Why is are the other services used not suitable for this data?:** S3 is only for storing files, not for searching through data. RDS would be too complicated and expensive for just storing simple video information. DynamoDB is simple and automatically handles scaling.
- **Bucket/instance/table name:** a2-pair91
- **Video timestamp:** 00:55
- **Relevant files:**
    - server/lib/dynamodb.js
    - server/routes/videos.routes.js

### Third data service

- **AWS service name:**  []
- **What data is being stored?:** []
- **Why is this service suited to this data?:** []
- **Why is are the other services used not suitable for this data?:** []
- **Bucket/instance/table name:**
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names:** a2-pair91
- **Video timestamp:** 01:05, 01:39
- **Relevant files:**
    - server/lib/s3.js (createPresignedUploadURL, createPresignedDownloadURL functions)
    - server/routes/videos.routes.js
    - frontend/src/api.js

### In-memory cache

- **ElastiCache instance name:**
- **What data is being cached?:** []
- **Why is this data likely to be accessed frequently?:** []
- **Video timestamp:**
- **Relevant files:**
    -

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** Temporary video files while they're being processed.
- **Why is this data not considered persistent state?:** The temporary files are just copies that can be recreated from the original video. 
- **How does your application ensure data consistency if the app suddenly stops?:** The app saves all important video information in DynamoDB.
- **Relevant files:**
    - server/routes/videos.routes.js (transcoding workflow)
    - server/lib/s3.js (file cleanup)
    - server/lib/dynamodb.js (metadata tracking)

### Graceful handling of persistent connections

- **Type of persistent connection and use:** []
- **Method for handling lost connections:** []
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** A2 Pairs 91-2
- **How are authentication tokens handled by the client?:** The app uses server-side sessions to keep users logged in. When users log in, the server creates a session cookie that remembers who they are. The app also supports API access using Bearer tokens in the Authorization header.
- **Video timestamp:** 01:56
- **Relevant files:**
    - server/lib/cognito.js
    - server/routes/auth.routes.js
    - server/middleware/auth.js

### Cognito multi-factor authentication

- **What factors are used for authentication:** Email & Authenicator Apps
- **Video timestamp:** 02:44
- **Relevant files:**
    -

### Cognito federated identities

- **Identity providers used:**Google
- **Video timestamp:** 03:08
- **Relevant files:**
    -

### Cognito groups

- **How are groups used to set permissions?:** Free tier users can only upload one video, while paid tier users can upload unlimited videos. The app checks the user's group membership and blocks free users from uploading additional videos if they already have one.
- **Video timestamp:** 03:30
- **Relevant files:**
    - server/routes/videos.routes.js

### Core - DNS with Route53

- **Subdomain**:https://a2-pairs-91.cab432.com/
- **Video timestamp:** 04:00

### Parameter store

- **Parameter names:** /cab432/n10795766/a2 {
  "ISSUER_URL": "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_HQ9GOrpwf",
  "CLIENT_ID": "385441kci1td1l7p2h2c36e2dv",
  "REDIRECT_URI": "https://a2-pairs-91.cab432.com/callback",
  "LOGOUT_URL": "https://ap-southeast-2hq9gorpwf.auth.ap-southeast-2.amazoncognito.com/logout?client_id=385441kci1td1l7p2h2c36e2dv&logout_uri=https://a2-pairs-91.cab432.com",
  "OAUTH_SCOPES": "email openid phone",
  "PORT": "3000",
  "BUCKET_NAME": "a2-pair91",
  "S3_UPLOAD_EXPIRY": "6000",
  "S3_DOWNLOAD_EXPIRY": "600"
}
- **Video timestamp:** 06:14
- **Relevant files:**
    - server/config.js

### Secrets manager

- **Secrets names:** n10795766-a2-secret
- **Video timestamp:** 07:10
- **Relevant files:**
    - server/secrets.js

### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -