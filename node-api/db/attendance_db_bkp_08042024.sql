DROP TABLE IF EXISTS `tbl_exam_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_exam_master` (
  `PK_ExamId` int NOT NULL AUTO_INCREMENT,
  `examName` varchar(500) DEFAULT NULL,
  `description` longtext,
  `examCode` varchar(500) DEFAULT NULL,
  `examType` varchar(500) DEFAULT NULL,
  `examSubType` varchar(500) DEFAULT NULL,
  `examStartFrom` varchar(500) DEFAULT NULL,
  `examEndTo` varchar(500) DEFAULT NULL,
  `examTimeCode` varchar(500) DEFAULT NULL,
  `examController` varchar(500) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_ExamId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_exam_master`
--

LOCK TABLES `tbl_exam_master` WRITE;
/*!40000 ALTER TABLE `tbl_exam_master` DISABLE KEYS */;
INSERT INTO `tbl_exam_master` VALUES (1,'First Exam','Bla Bla ',NULL,NULL,NULL,'2024-03-07T07:00:00.321Z','2024-03-07T08:00:00.334Z',NULL,'Dev Saxena',1,'2024-03-07 06:48:41',NULL,'2024-03-07 06:48:41',NULL);
/*!40000 ALTER TABLE `tbl_exam_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_module_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_module_master` (
  `PK_ModuleId` int NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(225) DEFAULT NULL,
  `description` longtext,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_ModuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_module_master`
--

LOCK TABLES `tbl_module_master` WRITE;
/*!40000 ALTER TABLE `tbl_module_master` DISABLE KEYS */;
INSERT INTO `tbl_module_master` VALUES (1,'Dashboard','Dashboard Descriptions',1,'2024-01-25 11:05:44',NULL,'2024-02-07 10:39:22',NULL),(2,'RoleScreen','RoleScreen Description',1,'2024-01-30 06:24:29',NULL,'2024-02-07 10:39:22',NULL),(3,'ModuleScreen','ModuleScreen Description',1,'2024-01-30 06:24:47',NULL,'2024-02-07 10:39:22',NULL),(4,'UserScreen','UserScreen Description',1,'2024-01-30 10:05:11',NULL,'2024-02-07 10:39:22',NULL),(5,'ExamScreen','ExamScreen Description',1,'2024-03-05 06:32:38',NULL,'2024-03-05 06:32:55',NULL),(6,'StudentScreen','StudentScreen Description',1,'2024-03-11 04:42:43',NULL,'2024-03-11 04:42:43',NULL),(7,'RoomDetail','RoomDetail Descriptions',1,'2024-04-05 10:29:35',NULL,'2024-04-05 10:29:35',NULL);
/*!40000 ALTER TABLE `tbl_module_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_role_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role_master` (
  `PK_RoleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(225) DEFAULT NULL,
  `description` longtext,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role_master`
--

LOCK TABLES `tbl_role_master` WRITE;
/*!40000 ALTER TABLE `tbl_role_master` DISABLE KEYS */;
INSERT INTO `tbl_role_master` VALUES (1,'Admin','Admin',1,'2024-01-30 10:28:06',NULL,'2024-01-30 10:47:32',NULL),(2,'Student','Student',1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(3,'New','News',1,'2024-02-01 12:19:35',NULL,'2024-03-19 07:20:51',NULL);
/*!40000 ALTER TABLE `tbl_role_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_role_module_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role_module_permission` (
  `PK_role_module_permissionId` int NOT NULL AUTO_INCREMENT,
  `FK_RoleId` int DEFAULT NULL,
  `FK_ModuleId` int DEFAULT NULL,
  `create` tinyint DEFAULT '0',
  `read` tinyint DEFAULT '0',
  `update` tinyint DEFAULT '0',
  `delete` tinyint DEFAULT '0',
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_role_module_permissionId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role_module_permission`
--

LOCK TABLES `tbl_role_module_permission` WRITE;
/*!40000 ALTER TABLE `tbl_role_module_permission` DISABLE KEYS */;
INSERT INTO `tbl_role_module_permission` VALUES (1,1,1,1,1,1,1,1,'2024-01-30 10:28:06',NULL,'2024-02-08 10:19:26',NULL),(6,1,4,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-01-30 10:32:45',NULL),(7,1,3,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-01-30 10:32:45',NULL),(8,1,2,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-02-08 10:19:26',NULL),(9,2,1,0,1,1,0,1,'2024-02-01 12:06:09',NULL,'2024-02-06 04:55:04',NULL),(10,2,2,0,1,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(11,2,3,0,1,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(12,2,4,0,1,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-08 10:19:57',NULL),(13,3,1,1,1,0,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(14,3,2,0,0,1,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(15,3,3,1,0,0,1,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(16,3,4,0,1,0,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(17,1,5,1,1,1,1,1,'2024-03-05 06:33:15',NULL,'2024-03-05 06:33:15',NULL),(18,2,5,0,1,0,0,1,'2024-03-05 06:33:21',NULL,'2024-03-05 06:33:21',NULL),(19,1,6,1,1,1,1,1,'2024-03-11 04:44:02',NULL,'2024-03-11 04:44:02',NULL),(20,2,6,0,1,0,0,1,'2024-03-11 04:44:07',NULL,'2024-03-11 04:44:07',NULL),(21,2,7,0,1,0,0,1,'2024-04-05 10:29:52',NULL,'2024-04-05 10:29:52',NULL);
/*!40000 ALTER TABLE `tbl_role_module_permission` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_student_exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_student_exam` (
  `PK_StudentExamId` int NOT NULL AUTO_INCREMENT,
  `systemId` varchar(100) DEFAULT NULL,
  `rollNumber` varchar(100) DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `universityCode` varchar(100) DEFAULT NULL,
  `schoolCode` varchar(100) DEFAULT NULL,
  `schoolName` varchar(500) DEFAULT NULL,
  `academicCode` varchar(100) DEFAULT NULL,
  `academicCareer` varchar(500) DEFAULT NULL,
  `programCode` varchar(100) DEFAULT NULL,
  `programName` varchar(500) DEFAULT NULL,
  `planCode` varchar(100) DEFAULT NULL,
  `planName` varchar(500) DEFAULT NULL,
  `programActionCode` varchar(100) DEFAULT NULL,
  `programAction` varchar(100) DEFAULT NULL,
  `admitTerm` int DEFAULT NULL,
  `currentTerm` int DEFAULT NULL,
  `officialEmailId` varchar(100) DEFAULT NULL,
  `personalEmailId` varchar(100) DEFAULT NULL,
  `phoneNumber` int DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `dateOfBirth` varchar(45) DEFAULT NULL,
  `address` longtext,
  `countryCode` varchar(100) DEFAULT NULL,
  `countryName` varchar(500) DEFAULT NULL,
  `stateCode` varchar(100) DEFAULT NULL,
  `stateName` varchar(500) DEFAULT NULL,
  `cityCode` varchar(100) DEFAULT NULL,
  `cityName` varchar(500) DEFAULT NULL,
  `attendencePercentage` int DEFAULT NULL,
  `attendenceCriteria` int DEFAULT NULL,
  `roomNumber` varchar(500) DEFAULT NULL,
  `seatNumber` varchar(100) DEFAULT NULL,
  `examCode` varchar(100) DEFAULT NULL,
  `examName` varchar(500) DEFAULT NULL,
  `examType` varchar(100) DEFAULT NULL,
  `examSubType` varchar(100) DEFAULT NULL,
  `examStartFrom` varchar(250) DEFAULT NULL,
  `examEndTo` varchar(250) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_StudentExamId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_student_exam`
--

LOCK TABLES `tbl_student_exam` WRITE;
/*!40000 ALTER TABLE `tbl_student_exam` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_student_exam` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_user_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_master` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(500) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email_id` varchar(500) DEFAULT NULL,
  `profile_image_url` longtext,
  `otp` varchar(100) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `isVerified` enum('0','1') DEFAULT '0',
  `isActive` enum('1','0') NOT NULL DEFAULT '1',
  `firstLoginStatus` enum('0','1') DEFAULT '1',
  `createdDate` datetime DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `isDeleted` enum('0','1') NOT NULL DEFAULT '0',
  `isSuspended` enum('1','0') DEFAULT '0',
  `createdBy` varchar(200) DEFAULT NULL,
  `updatedBy` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_master`
--

LOCK TABLES `tbl_user_master` WRITE;
/*!40000 ALTER TABLE `tbl_user_master` DISABLE KEYS */;
INSERT INTO `tbl_user_master` VALUES (1,'dev.saxena@shardatech.org','$Sharda123','Dev Saxena','9520216040','dev.saxena@shardatech.org','profile_pic-1701930552998-newFile.jpeg','366660','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDI2MzcyMDcsImV4cCI6MTcwMjcyMzYwN30.arDqG-3vvT8u4irRdFo379bmSFIzeLxO-p8QLopObBY','1','1','0',NULL,'2023-12-15 16:16:47','0','0',NULL,'1');
/*!40000 ALTER TABLE `tbl_user_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_user_role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_role_permission` (
  `PK_user_role_permissionId` int NOT NULL AUTO_INCREMENT,
  `FK_userId` int DEFAULT NULL,
  `FK_RoleId` int DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_user_role_permissionId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_role_permission`
--

LOCK TABLES `tbl_user_role_permission` WRITE;
/*!40000 ALTER TABLE `tbl_user_role_permission` DISABLE KEYS */;
INSERT INTO `tbl_user_role_permission` VALUES (1,1,2,0,'2024-02-01 12:27:56',NULL,'2024-02-01 12:32:09',NULL),(2,1,1,1,'2024-02-01 12:27:56',NULL,'2024-02-01 12:27:56',NULL),(3,1,3,0,'2024-02-01 12:30:57',NULL,'2024-02-01 12:32:09',NULL),(4,2,3,1,'2024-02-01 12:32:23',NULL,'2024-02-01 12:32:23',NULL),(5,2,1,1,'2024-02-01 12:32:23',NULL,'2024-02-01 12:32:23',NULL),(6,2,2,1,'2024-02-01 12:32:23',NULL,'2024-02-01 12:32:23',NULL),(7,3,3,1,'2024-02-01 12:33:02',NULL,'2024-02-01 12:33:02',NULL);
/*!40000 ALTER TABLE `tbl_user_role_permission` ENABLE KEYS */;
UNLOCK TABLES;