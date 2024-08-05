DROP TABLE IF EXISTS `tbl_copy_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_copy_master` (
  `PK_CopyId` int NOT NULL AUTO_INCREMENT,
  `FK_ReportId` int DEFAULT NULL,
  `EMPLID` int DEFAULT NULL,
  `copyNumber` varchar(100) DEFAULT NULL,
  `alternateCopyNumber1` varchar(100) DEFAULT NULL,
  `alternateCopyNumber2` varchar(100) DEFAULT NULL,
  `alternateCopyNumber3` varchar(100) DEFAULT NULL,
  `alternateCopyNumber4` varchar(100) DEFAULT NULL,
  `alternateCopyNumber5` varchar(100) DEFAULT NULL,
  `alternateCopyNumber6` varchar(100) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_CopyId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_copy_master`
--

LOCK TABLES `tbl_copy_master` WRITE;
/*!40000 ALTER TABLE `tbl_copy_master` DISABLE KEYS */;
INSERT INTO `tbl_copy_master` VALUES (2,1,2023408405,'1234','1','2',NULL,NULL,NULL,NULL,1,'2024-04-19 11:33:11',NULL,'2024-04-19 11:33:11',NULL);
/*!40000 ALTER TABLE `tbl_copy_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_invigilator_duty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_invigilator_duty` (
  `PK_InvigilatorDutyId` int NOT NULL AUTO_INCREMENT,
  `employeeId` int DEFAULT NULL,
  `invigilatorName` varchar(500) DEFAULT NULL,
  `date` varchar(100) DEFAULT NULL,
  `shift` varchar(100) DEFAULT NULL,
  `room` varchar(100) DEFAULT NULL,
  `duty_status` varchar(100) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_InvigilatorDutyId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_invigilator_duty`
--

LOCK TABLES `tbl_invigilator_duty` WRITE;
/*!40000 ALTER TABLE `tbl_invigilator_duty` DISABLE KEYS */;
INSERT INTO `tbl_invigilator_duty` VALUES (1,201001,'Surabh Middha','45328','0.3958333333333333','RM-202 (BLOCK 4)','primary',1,'2024-05-02 12:28:57',NULL,'2024-05-02 12:28:57',NULL),(2,201002,'Medha Yadav','45328','0.3958333333333333','RM-202 (BLOCK 4)','alternate',1,'2024-05-02 12:28:57',NULL,'2024-05-02 12:28:57',NULL),(3,201003,'Abhishek Thakur','45328','0.3958333333333333','RM-202 (BLOCK 4)','primary',1,'2024-05-02 12:28:57',NULL,'2024-05-02 12:28:57',NULL),(4,201004,'Satyam Singhal','45328','0.3958333333333333','RM-202 (BLOCK 4)','alternate',1,'2024-05-02 12:28:57',NULL,'2024-05-02 12:28:57',NULL);
/*!40000 ALTER TABLE `tbl_invigilator_duty` ENABLE KEYS */;
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
INSERT INTO `tbl_module_master` VALUES (1,'Dashboard','Dashboard Descriptions',1,'2024-01-25 11:05:44',NULL,'2024-02-07 10:39:22',NULL),(2,'RoleScreen','RoleScreen Description',1,'2024-01-30 06:24:29',NULL,'2024-02-07 10:39:22',NULL),(3,'ModuleScreen','ModuleScreen Description',1,'2024-01-30 06:24:47',NULL,'2024-02-07 10:39:22',NULL),(4,'UserScreen','UserScreen Description',1,'2024-01-30 10:05:11',NULL,'2024-02-07 10:39:22',NULL),(5,'ExamScreen','ExamScreen Description',1,'2024-03-05 06:32:38',NULL,'2024-03-05 06:32:55',NULL),(6,'StudentInfo','StudentInfo Description',1,'2024-03-11 04:42:43',NULL,'2024-04-24 11:03:28',NULL),(7,'RoomDetail','RoomDetail Descriptions',1,'2024-04-05 10:29:35',NULL,'2024-04-05 10:29:35',NULL);
/*!40000 ALTER TABLE `tbl_module_master` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tbl_report_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_report_master` (
  `PK_Report_Id` int NOT NULL AUTO_INCREMENT,
  `EMPLID` int DEFAULT NULL,
  `EXAM_DT` varchar(100) DEFAULT NULL,
  `ROOM_NBR` varchar(100) DEFAULT NULL,
  `EXAM_START_TIME` varchar(100) DEFAULT NULL,
  `STRM` int DEFAULT NULL,
  `CATALOG_NBR` varchar(100) DEFAULT NULL,
  `PTP_SEQ_CHAR` int DEFAULT NULL,
  `NAME_FORMAL` varchar(500) DEFAULT NULL,
  `ADM_APPL_NBR` int DEFAULT NULL,
  `DESCR` longtext,
  `DESCR2` longtext,
  `DESCR3` longtext,
  `SU_PAPER_ID` varchar(100) DEFAULT NULL,
  `DESCR100` longtext,
  `Status` varchar(100) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_Report_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_report_master`
--

LOCK TABLES `tbl_report_master` WRITE;
/*!40000 ALTER TABLE `tbl_report_master` DISABLE KEYS */;
INSERT INTO `tbl_report_master` VALUES (1,2023408405,'06-FEB-24','RM-202 (BLOCK 4)','09:30:00.000000000 AM',1501,'BCT112',115,'Dev Saxena',21604,'School of Dental Sciences','Bachelor of Dental Science','Mechanical',NULL,NULL,'Debarred',1,'2024-04-19 09:14:53',NULL,'2024-04-19 09:36:47',NULL),(2,2023408405,'06-FEB-24','RM-202 (BLOCK 4)','02:30:00.000000000 AM',1501,'BCT112',115,'Dev Saxena',21604,'School of Dental Sciences','Bachelor of Dental Science','Mechanical',NULL,NULL,'Debarred',1,'2024-04-19 09:14:53',NULL,'2024-04-19 09:36:47',NULL),(3,2023408405,'06-FEB-24','RM-203 (BLOCK 4)','02:30:00.000000000 AM',1501,'BCT112',115,'Dev Saxena',21604,'School of Dental Sciences','Bachelor of Dental Science','Mechanical',NULL,NULL,'Debarred',1,'2024-04-19 09:14:53',NULL,'2024-04-19 09:36:47',NULL);
/*!40000 ALTER TABLE `tbl_report_master` ENABLE KEYS */;
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
INSERT INTO `tbl_role_master` VALUES (1,'Admin','Admin',1,'2024-01-30 10:28:06',NULL,'2024-04-25 06:12:41',NULL),(2,'Student','Student',1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(3,'New','News',1,'2024-02-01 12:19:35',NULL,'2024-03-19 07:20:51',NULL);
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
  `special` tinyint DEFAULT '0',
  `isActive` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`PK_role_module_permissionId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role_module_permission`
--

LOCK TABLES `tbl_role_module_permission` WRITE;
/*!40000 ALTER TABLE `tbl_role_module_permission` DISABLE KEYS */;
INSERT INTO `tbl_role_module_permission` VALUES (1,1,1,1,1,1,1,1,1,'2024-01-30 10:28:06',NULL,'2024-04-18 08:50:52',NULL),(6,1,4,1,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-04-18 08:50:52',NULL),(7,1,3,1,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-04-18 08:50:52',NULL),(8,1,2,1,1,1,1,1,1,'2024-01-30 10:32:45',NULL,'2024-04-18 08:50:52',NULL),(9,2,1,0,1,1,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-06 04:55:04',NULL),(10,2,2,0,1,0,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(11,2,3,0,1,0,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-01 12:06:09',NULL),(12,2,4,0,1,0,0,0,1,'2024-02-01 12:06:09',NULL,'2024-02-08 10:19:57',NULL),(13,3,1,1,1,0,0,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(14,3,2,0,0,1,0,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(15,3,3,1,0,0,1,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(16,3,4,0,1,0,0,0,1,'2024-02-01 12:19:35',NULL,'2024-02-01 12:19:47',NULL),(17,1,5,1,1,1,1,1,1,'2024-03-05 06:33:15',NULL,'2024-04-18 08:50:52',NULL),(18,2,5,0,1,0,0,0,1,'2024-03-05 06:33:21',NULL,'2024-03-05 06:33:21',NULL),(19,1,6,1,1,1,1,1,1,'2024-03-11 04:44:02',NULL,'2024-04-18 08:50:52',NULL),(20,2,6,0,1,0,0,0,1,'2024-03-11 04:44:07',NULL,'2024-03-11 04:44:07',NULL),(21,2,7,0,1,0,0,0,1,'2024-04-05 10:29:52',NULL,'2024-04-05 10:29:52',NULL),(22,1,7,1,1,1,1,1,1,'2024-04-18 08:50:52',NULL,'2024-04-18 08:50:52',NULL),(23,3,5,0,0,0,0,1,1,'2024-04-18 08:51:11',NULL,'2024-04-18 08:51:11',NULL),(24,3,7,0,0,0,0,1,1,'2024-04-18 08:51:11',NULL,'2024-04-18 08:51:11',NULL),(25,3,6,0,0,1,0,0,1,'2024-04-18 08:51:11',NULL,'2024-04-18 08:51:11',NULL);
/*!40000 ALTER TABLE `tbl_role_module_permission` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_master`
--

LOCK TABLES `tbl_user_master` WRITE;
/*!40000 ALTER TABLE `tbl_user_master` DISABLE KEYS */;
INSERT INTO `tbl_user_master` VALUES (1,'0008564','$Sharda123','Dev Saxena','9520216040','dev.saxena@shardatech.org','profile_pics-1714650671073-backblue.gif','318182','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDI2MzcyMDcsImV4cCI6MTcwMjcyMzYwN30.arDqG-3vvT8u4irRdFo379bmSFIzeLxO-p8QLopObBY','1','1','0',NULL,'2023-12-15 16:16:47','0','0',NULL,'1'),(2,'smrati.saxena@gmail.com','$Sharda123','Smrati SAXENA','+919520216040','smrati.saxena@gmail.com',NULL,NULL,NULL,'0','1','1',NULL,NULL,'0','0',NULL,NULL),(3,'new.user@gmail.com','$Sharda123','New User','9520216040','new.user@gmail.com',NULL,NULL,NULL,'0','1','1',NULL,NULL,'0','0',NULL,NULL);
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
