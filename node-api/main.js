const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const upload = require("./middlewares/multer.js");
const path = require("path");
const oracledb = require("oracledb");
const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middlewares/credentials.js");
const { logger } = require("./middlewares/logEvents.js");
//const { parse, format } = require('date-fns');
//const { utcToZonedTime } = require('date-fns-tz');
// const { parseISO, format } = require('date-fns');
// const { utcToZonedTime, formatToTimeZone } = require('date-fns-tz');
// const { parse, formatISO, addMinutes } = require('date-fns');
const { parse, formatISO, addMinutes } = require('date-fns');
const XLSX = require("xlsx");

const dotenv = require("dotenv");
dotenv.config(); // Load variables from .env file

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

global.__basedir = __dirname;

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false, limit: "100mb" }));

// built-in middleware for json
app.use(express.json({ limit: "100mb" }));

// custom middleware logger
// app.use(logger);

// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// JWT Secret Key
const secretKey = process.env.SECRET_KEY || null;

if (!secretKey) {
  console.error(
    "JWT secret key is missing. Set it in the environment variable (SECRET_KEY) or provide a default."
  );
  process.exit(1);
}

// Configure nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

(async () => {
  // MySQL database configuration
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  const viewCampusConfig = {
    user: process.env.VIEW_CAMPUS_USER,
    password: process.env.VIEW_CAMPUS_PASSWORD,
    connectString: "35.154.115.237:9999/SHARDA",
  };

  const viewCampus2Config = {
    user: process.env.VIEW_CAMPUS2_USER,
    password: process.env.VIEW_CAMPUS2_PASSWORD,
    connectString: "35.154.115.237:9999/SHARDA",
  };

  const viewHRMSConfig = {
    user: process.env.VIEW_HRMS_USER,
    password: process.env.VIEW_HRMS_PASSWORD,
    connectString: "35.154.115.237:9999/SHARDA",
  };

  const viewIdCardConfig = {
    user: 'CELECT',
    password: 'BTfdar!Y5',
    connectString: "35.154.115.237:9999/SHARDA",
  };

  try {
    // Create a promise-based pool
    const pool = await mysql.createPool(dbConfig);
    await oracledb.initOracleClient({ libDir: process.env.OCI_HOME });

    // Set group_concat_max_len
    await pool.query("SET SESSION group_concat_max_len = 4294967295");

    // // Handle database connection errors
    // const connection = await pool.getConnection();
    // console.log("Local Connected to MySQL database:", process.env.DB_DATABASE);
    // connection.release();

    // // Oracle Campus Connection
    // const viewCampusPool = await oracledb.getConnection(viewCampusConfig);
    // console.log(
    //   "Successfully Connected to to Oracle database Campus View : ",
    //   process.env.VIEW_DATABASE
    // );

    // // Oracle FCM Connection
    // const viewCampus2Pool = await oracledb.getConnection(viewCampus2Config);
    // console.log(
    //   "Successfully Connected to to Oracle database FCM View : ",
    //   process.env.VIEW_DATABASE
    // );

    // // Oracle HRMS Connection
    // const viewHRMSPool = await oracledb.getConnection(viewHRMSConfig);
    // console.log(
    //   "Successfully Connected to to Oracle database HRMS View : ",
    //   process.env.VIEW_DATABASE
    // );


    try {
      // Handle MySQL connection
      const connection = await pool.getConnection();
      console.log("Local Connected to MySQL database:", process.env.DB_DATABASE);
      connection.release();
    } catch (err) {
      console.error("Error connecting to MySQL database:", err.message);
    }
    let viewCampusPool;
    let viewCampus2Pool;
    let viewHRMSPool;
    
    try {
      // Oracle Campus Connection
      viewCampusPool = await oracledb.getConnection(viewCampusConfig);
      console.log(
        "Successfully Connected to Oracle database Campus View : ",
        process.env.VIEW_DATABASE
      );
    } catch (err) {
      console.error("Error connecting to Oracle Campus database:", err.message);
    }
    
    try {
      // Oracle HRMS Connection
      viewHRMSPool = await oracledb.getConnection(viewHRMSConfig);
      console.log(
        "Successfully Connected to Oracle database HRMS View : ",
        process.env.VIEW_DATABASE
      );
    } catch (err) {
      console.error("Error connecting to Oracle HRMS database:", err.message);
    }

    try {
      // Oracle Campus 2nd Connection
      viewCampus2Pool = await oracledb.getConnection(viewCampus2Config);
      console.log(
        "Successfully Connected to Oracle database FCM View : ",
        process.env.VIEW_DATABASE
      );
    } catch (err) {
      console.error("Error connecting to Oracle Campus2 database:", err.message);
    }
    
    try {
      // Oracle HRMS Connection
      viewIdCardPool = await oracledb.getConnection(viewIdCardConfig);
      console.log(
        "Successfully Connected to Oracle database Id Card View : ",
        process.env.VIEW_DATABASE
      );
    } catch (err) {
      console.error("Error connecting to Oracle Id Card database:", err.message);
    }
   
    
    

    // Middleware to authenticate JWT token
    function authenticateToken(req, res, next) {
      const token = req.header("Authorization");
      if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const actualToken = token.split(" ")[1];

      jwt.verify(actualToken, secretKey, (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired" });
          } else {
            console.error("Token verification error:", err);
            return res.status(403).json({ error: "Forbidden" });
          }
        }
        req.user = user;
        next();
      });
    }

    function sendOTP(otp, userData,view) {
      // Email message options
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: view ? userData?.EMAILID :  userData?.email_id,
        subject: "Your OTP to Login",
        text: `Your OTP is: ${otp}`,
      };
      console.log("Mail Option", mailOptions);
      // Send email with OTP
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return;
        } else {
          console.log("Email sent: " + info.response);
          return;
        }
      });
    }

    app.use( "/userImg", express.static(path.join(__dirname, "./resources/assets/ProfilePics")) );
    app.use( "/invigilatorDoc", express.static(path.join(__dirname, "./resources/local-assets/BulkuploadDocs")) );


    // Email Verified
    app.post("/api/emailVerify", async (req, res) => {
      try {
        const { tblName, conditionString,viewTblName,viewConditionString } = req.body;
    
        // Query user data from the main table
        const [rows] = await pool.query(`SELECT * FROM ?? WHERE ${conditionString}`, [tblName]);
        
        if (rows.length > 0) {
          const userData = rows[0];
          if(userData.isActive === 0){
            res.status(500).json({ error: "Email Id Not Allowed" });
          }
          else{
            const otp = Math.floor(100000 + Math.random() * 900000);
            // Update the OTP for the user
            const [updateRows] = await pool.query(
              `UPDATE ?? SET otp = ? WHERE user_id = ?`,
              [tblName, otp, userData.user_id]
            );
      
            if (updateRows.affectedRows > 0) {
              sendOTP(otp, userData);
              res.status(200).json({ message: "Email Sent Successfully" });
            } else {
              res.status(500).json({ error: "Failed to send email" });
            }
          }    
        } else {
          // If user is not found, check the view table
          const viewRows = await viewHRMSPool.execute( `SELECT * FROM ${viewTblName} WHERE ${viewConditionString}`,
             {},
              { outFormat: oracledb.OUT_FORMAT_OBJECT } )
              .catch((error) => {
                console.error(
                  "Error checking availability:",
                  error.message || error
                );
                throw error;
              });
    
          if (viewRows.rows.length > 0 ) {
            console.log(viewRows.rows[0])
            const viewUserData = viewRows.rows[0];
            const otp = Math.floor(100000 + Math.random() * 900000);
    
            // Insert new user into main table
            const [insertResult] = await pool.query(
              `INSERT INTO ?? SET username = ?, name = ?, contact_number = ?, email_id = ?, isVerified = '1', otp = ?`,
              [
                tblName,
                viewUserData.EMPLID,
                viewUserData.DISPLAY_NAME,
                viewUserData.PHONE,
                viewUserData.EMAILID,
                otp
              ]
            );
    
            if (insertResult.affectedRows > 0) {
              const userId = insertResult.insertId;
    
              // Assign default role to the new user
              const [insertRoleResult] = await pool.query(
                `INSERT INTO tbl_user_role_permission SET FK_userId = ?, FK_RoleId = '2'`,
                [userId]
              );
    
              if (insertRoleResult.affectedRows > 0) {
                sendOTP(otp, viewUserData,"view");
                res.status(200).json({ message: "Email Sent Successfully" });
              } else {
                res.status(500).json({ error: "Failed to assign role to new user" });
              }
    
            } else {
              res.status(500).json({ error: "Failed to create new user" });
            }
    
          } else {
            res.status(401).json({ error: "Invalid Email Id" });
          }
        }
      } catch (error) {
        console.error("Email verification error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    

    // // login API
    // app.post("/api/login", async (req, res) => {
    //   try {
    //     const { tblName, conditionString } = req.body;
    //     const [rows] = await pool.query(
    //       `SELECT * FROM ${tblName} WHERE ${conditionString}`
    //     );
    //     if (rows.length > 0) {
    //       console.log(rows)
    //       const userData = rows[0];
    //       const [UserRole] = await pool.query(
    //         `SELECT JSON_ARRAYAGG( JSON_OBJECT( 'FK_userId', p.FK_userId, 'FK_RoleId', p.FK_RoleId, 'rolePermission', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_RoleId', r.PK_RoleId, 'roleName', r.roleName ) ORDER BY r.PK_RoleId ASC ), ']' ) AS JSON ) FROM tbl_role_master r WHERE r.PK_RoleId = p.FK_RoleId ), 'modulePermission', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_role_module_permissionId', q.PK_role_module_permissionId, 'FK_RoleId', q.FK_RoleId, 'FK_ModuleId', q.FK_ModuleId, 'create', q.create, 'read', q.read, 'update', q.update, 'delete', q.delete, 'moduleMaster', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_ModuleId', s.PK_ModuleId, 'moduleName', s.moduleName ) ), ']' ) AS JSON ) FROM tbl_module_master s WHERE s.PK_ModuleId = q.FK_ModuleId ) ) ORDER BY q.FK_ModuleId ASC ), ']' ) AS JSON ) FROM tbl_role_module_permission q WHERE q.FK_RoleId = p.FK_RoleId ) ) ) AS UserRoleData FROM tbl_user_role_permission p WHERE p.FK_userId = ${userData.user_id} ORDER BY p.FK_RoleId ASC;`
    //       );
    //       // const expirationTimestamp =
    //       // Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours expiry
    //       // Math.floor((Date.now() / 1000 + 60 * 60 * 24) / 60) // 1 minutes expiry
    //       const token = jwt.sign(
    //         {
    //           id: userData.user_id,
    //           username: userData.username,
    //           // exp: expirationTimestamp,
    //         },
    //         secretKey
    //       );
    //       const userRole = UserRole?.[0]?.UserRoleData;

    //       //  res.status(200).json({ token, expirationTimestamp, userRole, userData });
    //        res.status(200).json({ token, userRole, userData });
    //     } else {
    //       res.status(401).json({ error: "Invalid credentials" });
    //     }
    //   } catch (error) {
    //     console.error("Login error:", error.message || error);
    //     res.status(500).json({ error: "Internal server error" });
    //   }
    // });

    app.post("/api/login", async (req, res) => {
      try {
        const { tblName, conditionString } = req.body;
        // Log the incoming request for debugging
        console.log("Login Request:", req.body);
    
        // Use parameterized queries to avoid SQL injection
        const [rows] = await pool.query(
          `SELECT * FROM ?? WHERE ${conditionString}`, [tblName]
        );
    
        if (rows.length > 0) {
          const userData = rows[0];
    
          // Simplify and log the user role query for debugging
          const userRoleQuery = ` SELECT JSON_ARRAYAGG( JSON_OBJECT( 'FK_userId', p.FK_userId, 'FK_RoleId', p.FK_RoleId, 'rolePermission', ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'PK_RoleId', r.PK_RoleId, 'roleName', r.roleName ) ) FROM tbl_role_master r WHERE r.PK_RoleId = p.FK_RoleId ), 'modulePermission', ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'PK_role_module_permissionId', q.PK_role_module_permissionId, 'FK_RoleId', q.FK_RoleId, 'FK_ModuleId', q.FK_ModuleId, 'create', q.create, 'read', q.read, 'update', q.update, 'delete', q.delete, 'special', q.special, 'moduleMaster', ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'PK_ModuleId', s.PK_ModuleId, 'moduleName', s.moduleName ) ) FROM tbl_module_master s WHERE s.PK_ModuleId = q.FK_ModuleId ) ) ) FROM tbl_role_module_permission q WHERE q.FK_RoleId = p.FK_RoleId ) ) ) AS UserRoleData FROM tbl_user_role_permission p WHERE p.FK_userId = ? ORDER BY p.FK_RoleId ASC; `;
    
          const [UserRole] = await pool.query(userRoleQuery, [userData.user_id]);
    
          const token = jwt.sign(
            {
              id: userData.user_id,
              username: userData.username,
            },
            secretKey
          );
    
          const userRole = UserRole?.[0]?.UserRoleData;
    
          res.status(200).json({ token, userRole, userData });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Login error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    

    // register API
    app.post("/api/register", async (req, res) => {
      try {
        const { tblName } = req.body;
        const [rows] = await pool.query("INSERT INTO ?? SET ?", [
          tblName,
          req.body,
        ]);
        if (rows.affectedRows > 0) {
           res.status(200).json({ message: "Registration successful" });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Register error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // common API for all operations
    app.post("/api/common", authenticateToken, async (req, res) => {
      try {
        const {
          operation,
          tblName,
          data,
          conditionString,
          checkAvailability,
          customQuery,
        } = req.body;

        if (operation === undefined || tblName === undefined) {
          return res
            .status(400)
            .json({ error: "Operation and table are required" });
        }

        if (checkAvailability) {
          const [checkRows] = await pool.query(
            `SELECT * FROM ${tblName} WHERE ${conditionString}`
          );
          if (checkRows.length > 0) {
            return res.status(400).json({ error: "Data already exists" });
          }
        }

        switch (operation) {
          case "insert":
            if (Array.isArray(data)) {
              // for multiple data
              const insertResults = await Promise.all(
                data.map(async (item) => {
                  const [insertRows] = await pool.query(
                    `INSERT INTO ${tblName} SET ?`,
                    item
                  );
                  return insertRows;
                })
              );

              const allSuccessful = insertResults.every(
                (result) => result.affectedRows > 0
              );

              if (allSuccessful) {
                 res.status(200).json({ message: "Insert successful", receivedData: insertResults });
              } else {
                res.status(401).json({ error: "Insert failed" });
              }
            } else {
              // for single data
              const [insertRows] = await pool.query(
                `INSERT INTO ${tblName} SET ?`,
                data
              );
              if (insertRows.affectedRows > 0) {
                 res.status(200).json({ message: "Insert successful", receivedData: insertRows });
              } else {
                res.status(401).json({ error: "Insert failed" });
              }
            }
            break;

          case "update":
            if (Array.isArray(data)) {
              // for multiple data
              const updateRows = await Promise.all(
                data.map(async (item) => {
                  const { Id, ...itemWithoutId } = item;
                  const [updateRows] = await pool.query(
                    `UPDATE ${tblName} SET ? WHERE ${conditionString}`,
                    [itemWithoutId, Id]
                  );
                  return updateRows;
                })
              );

              const allSuccessful = updateRows.every(
                (result) => result.affectedRows > 0
              );

              if (allSuccessful) {
                return  res.status(200).json({ message: "Update successful" });
              } else {
                return res.status(500).json({ error: "Update failed" });
              }
            } else {
              // for single data
              const [updateRows] = await pool.query(
                `UPDATE ${tblName} SET ? WHERE ${conditionString}`,
                data
              );
              if (updateRows.affectedRows > 0) {
                return  res.status(200).json({ message: "Update successful" });
              } else {
                return res.status(500).json({ error: "Update failed" });
              }
            }
            break;

          case "delete":
            const [deleteRows] = await pool.query(
              `DELETE FROM ${tblName} WHERE ${conditionString}`
            );
            if (deleteRows.affectedRows > 0) {
               res.status(200).json({ message: "Deletion successful" });
            } else {
              res.status(401).json({ error: "Deletion failed" });
            }
            break;
          case "fetch":
            const [selectRows] = await pool.query(
              `SELECT * FROM ${tblName} ${
                conditionString ? "WHERE " + conditionString : ""
              }`
            );
             res.status(200).json({ message: "Fetch successful", receivedData: selectRows });
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
             res.status(200).json({ message: "Custom query successful", receivedData: customRows });
            break;
          default:
            res.status(400).json({ error: "Invalid operation type" });
        }
      } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // insert operation API
    app.post("/api/insert", authenticateToken, async (req, res) => {
      try {
        const {
          operation,
          tblName,
          data,
          conditionString,
          checkAvailability,
          customQuery,
        } = req.body;
        if (operation === undefined || tblName === undefined) {
          return res
            .status(400)
            .json({ error: "Operation and table are required" });
        }
        if (checkAvailability) {
          const [checkRows] = await pool.query(
            `SELECT * FROM ${tblName} WHERE ${conditionString}`
          );
          if (checkRows.length > 0) {
            return res.status(400).json({ error: "Data already exists" });
          }
        }

        switch (operation) {
          case "insert":
            if (Array.isArray(data)) {
              // for multiple data
              const insertResults = await Promise.all(
                data.map(async (item) => {
                  const [insertRows] = await pool.query(
                    `INSERT INTO ${tblName} SET ?`,
                    item
                  );
                  return insertRows;
                })
              );

              const allSuccessful = insertResults.every(
                (result) => result.affectedRows > 0
              );

              if (allSuccessful) {
                 res.status(200).json({ message: "Insert successful", receivedData: insertResults });
              } else {
                res.status(401).json({ error: "Insert failed" });
              }
            } else {
              // for single data
              const [insertRows] = await pool.query(
                `INSERT INTO ${tblName} SET ?`,
                data
              );
              if (insertRows.affectedRows > 0) {
                 res.status(200).json({ message: "Insert successful", receivedData: insertRows });
              } else {
                res.status(401).json({ error: "Insert failed" });
              }
            }
            break;

          case "custom":
            const [customRows] = await pool.query(customQuery);
             res.status(200).json({ message: "Custom query successful", receivedData: customRows });
            break;

          default:
            res.status(400).json({ error: "Invalid operation type" });
        }
      } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // update operation API
    app.put("/api/update", authenticateToken, async (req, res) => {
      try {
        const {
          operation,
          tblName,
          data,
          conditionString,
          checkAvailability,
          customQuery,
        } = req.body;
        if (!operation || !tblName) {
          return res
            .status(400)
            .json({ error: "Operation and table are required" });
        }
        if (checkAvailability) {
          const promises = data.map(async (item) => {
            const { Id, ...itemWithoutId } = item;
            const [checkRows] = await pool.query(
              `SELECT * FROM ${tblName} WHERE ${conditionString}`,
              [Id]
            );

            if (checkRows.length > 0) {
              const [updateRows] = await pool.query(
                `UPDATE ${tblName} SET ? WHERE ${conditionString}`,
                [itemWithoutId, Id]
              );

              if (updateRows.affectedRows > 0) {
                return { message: "Update successful" };
              } else {
                return { error: "Update failed" };
              }
            } else {
              const [insertRows] = await pool.query(
                `INSERT INTO ${tblName} SET ?`,
                itemWithoutId
              );

              if (insertRows.affectedRows > 0) {
                return { message: "Insert successful", receivedData: insertRows };
              } else {
                return { error: "Insert failed" };
              }
            }
          });

          const results = await Promise.all(promises);
          const hasError = results.some((result) => result.error);

          if (hasError) {
            return res
              .status(500)
              .json({ error: "One or more operations failed" });
          }

          return  res.status(200).json({ message: "All operations successful" });
        }

        switch (operation) {
          case "update":
            if (Array.isArray(data)) {
              // for multiple data
              const updateRows = await Promise.all(
                data.map(async (item) => {
                  const { Id, ...itemWithoutId } = item;
                  const [updateRows] = await pool.query(
                    `UPDATE ${tblName} SET ? WHERE ${conditionString}`,
                    [itemWithoutId, Id]
                  );
                  return updateRows;
                })
              );

              const allSuccessful = updateRows.every(
                (result) => result.affectedRows > 0
              );

              if (allSuccessful) {
                return  res.status(200).json({ message: "Update successful" });
              } else {
                return res.status(500).json({ error: "Update failed" });
              }
            } else {
              // for single data
              const [updateRows] = await pool.query(
                `UPDATE ${tblName} SET ? WHERE ${conditionString}`,
                [data]
              );

              if (updateRows.affectedRows > 0) {
                return  res.status(200).json({ message: "Update successful" });
              } else {
                return res.status(500).json({ error: "Update failed" });
              }
            }
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
            return  res.status(200).json({
              message: "Custom query successful",
              receivedData: customRows,
            });
          default:
            return res.status(400).json({ error: "Invalid operation type" });
        }
      } catch (error) {
        console.error("Error:", error.message || error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    // fetch operation API
    app.get("/api/fetch", authenticateToken, async (req, res) => {
      try {
        const {
          operation,
          tblName,
          data,
          conditionString,
          checkAvailability,
          customQuery,
        } = req.query;
        if (!operation || !tblName) {
          return res
            .status(400)
            .json({ error: "Operation and table are required" });
        }

        if (checkAvailability) {
          const [checkRows] = await pool.query(
            `SELECT * FROM ${tblName} WHERE ${conditionString}`
          );
          if (checkRows.length > 0) {
            return res.status(400).json({ error: "Data already exists" });
          }
        }
        switch (operation) {
          case "fetch":
            const [selectRows] = await pool.query(
              `SELECT * FROM ${tblName} ${
                conditionString ? "WHERE " + conditionString : ""
              }`
            );
            return  res.status(200).json({ message: "Fetch successful", receivedData: selectRows });
          case "custom":
            const [customRows] = await pool.query(customQuery);
            return  res.status(200).json({
              message: "Custom query successful",
              receivedData: customRows,
            });
          default:
            return res.status(400).json({ error: "Invalid operation type" });
        }
      } catch (error) {
        console.error("Error in fetch:", error.message || error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    // delete operation API
    app.delete("/api/remove", authenticateToken, async (req, res) => {
      try {
        const {
          operation,
          tblName,
          data,
          conditionString,
          checkAvailability,
          customQuery,
        } = req.body;
        if (operation === undefined || tblName === undefined) {
          return res
            .status(400)
            .json({ error: "Operation and table are required" });
        }

        if (checkAvailability) {
          const [checkRows] = await pool.query(
            `SELECT * FROM ${tblName} WHERE ${conditionString}`
          );
          if (checkRows.length > 0) {
            return res.status(400).json({ error: "Data already exists" });
          }
        }

        switch (operation) {
          case "delete":
            const [deleteRows] = await pool.query(
              `DELETE FROM ${tblName} WHERE ${conditionString}`
            );
            if (deleteRows.affectedRows > 0) {
               res.status(200).json({ message: "Deletion successful" });
            } else {
              res.status(401).json({ error: "Deletion failed" });
            }
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
             res.status(200).json({ message: "Custom query successful", receivedData: customRows });
            break;
          default:
            res.status(400).json({ error: "Invalid operation type" });
        }
      } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Sample protected route API
    app.get("/api/protected", authenticateToken, (req, res) => {
       res.status(200).json({ message: "This is a protected route!" });
    });

    // For Multer Api
    app.post(
      "/api/multer",
      upload.single("profile_pics"),
      authenticateToken,
      async (req, res) => {
        try {
          const { tblName, data, conditionString, fileParam } = req.body;
          const file = req.file?.filename;

          if (!tblName) {
            return res
              .status(400)
              .json({ error: "Operation and table are required" });
          }

          if (!file) {
            return res.status(400).send("No files were uploaded.");
          }

          const [checkRows] = await pool.query(
            `SELECT * FROM ${tblName} WHERE ${conditionString}`
          );

          if (checkRows.length > 0) {
            const [updateRows] = await pool.query(
              `UPDATE ${tblName} SET ${fileParam} = ? WHERE ${conditionString}`,
              [file]
            );
            if (updateRows.affectedRows > 0) {
              return  res.status(200).json({ message: "Update successful" });
            } else {
              return res.status(500).json({ error: "Update failed" });
            }
          } else {
            const [insertRows] = await pool.query(
              `INSERT INTO ${tblName} SET ${fileParam} = ?, data = ?`,
              [file, data]
            );
            if (insertRows.affectedRows > 0) {
              return  res.status(200).json({
                message: "Insert successful",
                receivedData: insertRows,
              });
            } else {
              return res.status(500).json({ error: "Insert failed" });
            }
          }
        } catch (error) {
          console.error("Error:", error.message || error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );


    // app.get("/api/view", authenticateToken, async (req, res) => {
    //   try {
    //     const {
    //       operation,
    //       tblName,
    //       data,
    //       conditionString,
    //       checkAvailability,
    //       customQuery,
    //       viewType,
    //     } = req.query;
    //     let viewSetup;

    //     if (!operation || !tblName) {
    //       return res
    //         .status(400)
    //         .json({ error: "Operation and table are required" });
    //     }

    //     if (viewType === "CAMPUS2_View") {
    //       viewSetup = viewCampus2Pool;
    //     } else if (viewType === "HRMS_View") {
    //       viewSetup = viewHRMSPool;
    //     } else {
    //       viewSetup = viewCampusPool;
    //     }

    //     if (checkAvailability) {
    //       const checkRows = await viewSetup
    //         .execute(`SELECT * FROM ${tblName} WHERE ${conditionString}`)
    //         .catch((error) => {
    //           console.error(
    //             "Error checking availability:",
    //             error.message || error
    //           );
    //           throw error;
    //         });
    //       if (checkRows && checkRows.rows.length > 0) {
    //         return res.status(400).json({ error: "Data already exists" });
    //       }
    //     }

    //     switch (operation) {
    //       case "fetch":
    //         console.log(
    //           `SELECT * FROM ${tblName} ${
    //             conditionString ? `WHERE ${conditionString}` : ""
    //           }`
    //         );
    //         const selectRows = await viewSetup
    //           .execute(
    //             `SELECT * FROM ${tblName} ${
    //               conditionString ? `WHERE ${conditionString}` : ""
    //             }`,
    //             {},
    //             { outFormat: oracledb.OUT_FORMAT_OBJECT }
    //           )
    //           .catch((error) => {
    //             console.error("Error fetching data:", error.message || error);
    //             throw error;
    //           });
    //         return  res.status(200).json({
    //           message: "Fetch successful",
    //           receivedData: selectRows?.rows,
    //         });

    //       case "custom":
    //         console.log(customQuery);
    //         const customRows = await viewSetup
    //           .execute(
    //             customQuery,
    //             {},
    //             { outFormat: oracledb.OUT_FORMAT_OBJECT }
    //           )
    //           .catch((error) => {
    //             console.error(
    //               "Error executing custom query:",
    //               error.message || error
    //             );
    //             throw error;
    //           });
    //         return  res.status(200).json({
    //           message: "Fetch successful",
    //           receivedData: customRows?.rows,
    //         });

    //       default:
    //         return res.status(400).json({ error: "Invalid operation type" });
    //     }
    //   } catch (error) {
    //     console.error("Error in view fetch:", error.message || error);
    //     return res.status(500).json({ error: "Internal server error" });
    //   }
    // });

    // For Bulkupload Api
    // app.post(
    //   "/api/bulkupload",
    //   upload.single("bulkupload_doc"),
    //   authenticateToken,
    //   async (req, res) => {
    //     try {
    //       const { tblName, conditionString, checkAvailability, checkColumn } =
    //         req.body;
    //       const file = req.file;
    //       if (tblName === undefined) {
    //         return res.status(400).json({ error: "Table are required" });
    //       }

    //       const workbook = XLSX.readFile(file.path);
    //       const sheetName = workbook.SheetNames?.[0];
    //       const worksheet = workbook.Sheets[sheetName];
    //       const excelData = XLSX.utils.sheet_to_json(worksheet);
    //       const existingData = [];
    //       const newData = [];
    //       if (checkAvailability === "true") {
    //         for (const item of excelData) {
    //           let Data = item[checkColumn];
    //           const [checkRows] = await pool.query(
    //             `SELECT * FROM ${tblName} WHERE ${conditionString}`,
    //             [Data]
    //           );
    //           if (checkRows.length > 0) {
    //             existingData.push(checkRows[0]);
    //           } else {
    //             newData.push(item);
    //           }
    //         }
    //       } else {
    //         newData.push(...excelData);
    //       }

    //       const insertResults = await Promise.all(
    //         newData.map(async (item) => {
    //           const [insertRows] = await pool.query(
    //             `INSERT INTO ${tblName} SET ?`,
    //             item
    //           );
    //           return insertRows;
    //         })
    //       );

    //       //   const allData = existingData.concat(insertResults);
    //       if (existingData.length > 0) {
    //         res.status(202).json({
    //           message: "Some rows already exist and were not inserted",
    //           existingRows: existingData,
    //           insertResults: insertResults,
    //         });
    //       } else {
    //          res.status(200).json({
    //           message: "Data inserted successfully",
    //           insertResults: insertResults,
    //         });
    //       }
    //       //  res.status(200).json({ message: "Bulk upload completed", receivedData: allData });
    //     } catch (error) {
    //       console.error("Error:", error.message || error);
    //       res.status(500).json({ error: "Internal server error" });
    //     }
    //   }
    // );


    const parseExcelDate = (excelDate) => {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(epoch.getTime() + (excelDate * 86400 * 1000));
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
function parseShiftTime(timeString) {
    // Remove spaces and split the time string into hours, minutes, and period (AM/PM)
    const cleanedTimeString = timeString.replace(/\s/g, ''); // Remove all spaces
    const [timePart, period] = cleanedTimeString.split(/(AM|PM)/i);
    const [hoursStr, minutesStr] = timePart.split(':');

    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr.replace(/[^\d]/g, ''), 10); // Remove non-numeric characters

    // Adjust hours based on AM/PM
    if (/PM/i.test(period) && hours < 12) {
        hours += 12;
    } else if (/AM/i.test(period) && hours === 12) {
        hours = 0;
    }

    // Create a new Date object and set the time
    let date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Set the date to "1900-01-01"
    date.setFullYear(1900);
    date.setMonth(0); // January (0-indexed)
    date.setDate(1); // 1st day of the month

    // Convert to UTC and format to ISO 8601
    const isoString = date.toISOString();

    return isoString;
}

    app.post(
      '/api/bulkupload',
      upload.single('bulkupload_doc'),
      authenticateToken,
      async (req, res) => {
        try {
          const { tblName, conditionString, checkAvailability, checkColumn } = req.body;
          const file = req.file;
          if (!tblName) {
            return res.status(400).json({ error: 'Table name is required' });
          }
    
          const workbook = XLSX.readFile(file.path);
          const sheetName = workbook.SheetNames?.[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);
    
          // Ensure dates are in 'YYYY-MM-DD' format
          excelData.forEach((row) => {
            if (row.date) {
              row.date = parseExcelDate(row.date);
            }
            if (row.shift) {
              row.shift = parseShiftTime(row.shift);
            }
          });
    
          const existingData = [];
          const newData = [];
    
          if (checkAvailability === 'true') {
            const checkColumns = JSON.parse(checkColumn);
    
            for (const item of excelData) {
              const dataValues = await checkColumns.map(col => item[col]);
              const [checkRows] = await pool.query(
                `SELECT * FROM ${tblName} WHERE ${conditionString}`,
                dataValues
              );
              if (checkRows.length > 0) {
                existingData.push(checkRows[0]);
              } else {
                newData.push(item);
              }
            }
          } else {
            newData.push(...excelData);
          }
    
          const insertResults = await Promise.all(
            newData.map(async (item) => {
              const [insertRows] = await pool.query(
                `INSERT INTO ${tblName} SET ?`,
                item
              );
              return insertRows;
            })
          );
    
          if (existingData.length > 0) {
            res.status(202).json({
              message: 'Some rows already exist and were not inserted',
              existingRows: existingData,
              insertResults,
            });
          } else {
            res.status(200).json({
              message: 'Data inserted successfully',
              insertResults,
            });
          }
        } catch (error) {
          console.error('Error:', error.message || error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    );

    app.get("/api/view", authenticateToken, async (req, res) => {
      try {
        const { operation, tblName, data, conditionString, checkAvailability, customQuery, viewType } = req.query;
        let viewSetup;
    
        if (!operation || !tblName) {
          return res.status(400).json({ error: "Operation and table are required" });
        }
    
        if (viewType === "CAMPUS2_View") {
          viewSetup = viewCampus2Pool;
        } else if (viewType === "HRMS_View") {
          viewSetup = viewHRMSPool;
        } else if(viewType === "IDCARD_View"){
          viewSetup = viewIdCardPool;
        }
         else {
          viewSetup = viewCampusPool;
        }
    
        if (checkAvailability) {
          const checkRows = await viewSetup.execute(`SELECT * FROM ${tblName} WHERE ${conditionString}`)
            .catch((error) => {
              console.error("Error checking availability:", error.message || error);
              throw error;
            });
          if (checkRows && checkRows.rows.length > 0) {
            return res.status(400).json({ error: "Data already exists" });
          }
        }
    
        switch (operation) {
          case "fetch":
            const selectRows = await viewSetup.execute(
              `SELECT * FROM ${tblName} ${conditionString ? `WHERE ${conditionString}` : ""}`,
              {},
              { outFormat: oracledb.OUT_FORMAT_OBJECT }
            ).catch((error) => {
              console.error("Error fetching data:", error.message || error);
              throw error;
            });
            return res.status(200).json({
              message: "Fetch successful",
              receivedData: selectRows?.rows,
            });
    
          case "custom":
            const customRows = await viewSetup.execute(
              customQuery,
              {},
              { outFormat: oracledb.OUT_FORMAT_OBJECT }
            ).catch((error) => {
              console.error("Error executing custom query:", error.message || error);
              throw error;
            });
            return res.status(200).json({
              message: "Fetch successful",
              receivedData: customRows?.rows,
            });
    
            case "blobFromOracle":
                const result = await viewSetup.execute(
                  customQuery,
                  {},
                  { 
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    fetchInfo: { 
                      "DERIVED_STUPHOTO": { type: oracledb.BUFFER },
                      "EMPLOYEE_PHOTO": { type: oracledb.BUFFER }
                    }
                  }
                );
            
                const processedRows = result.rows.map(row => {
                  let photoEmployeeBuffer = row.EMPLOYEE_PHOTO;
                  let photoSignBuffer = row.DERIVED_STUPHOTO;
                  
                  let base64EmployeePhoto = null;
                  let base64SignPhoto = null;
            
                  if (photoEmployeeBuffer) {
                    base64EmployeePhoto = photoEmployeeBuffer.toString('base64');
                  }
            
                  if (photoSignBuffer) {
                    base64SignPhoto = photoSignBuffer.toString('base64');
                  }
            
                  return {
                    ...row,
                    EMPLOYEE_PHOTO: base64EmployeePhoto,
                    DERIVED_STUPHOTO: base64SignPhoto
                  };
                });
            
                return res.status(200).json({
                  message: "Fetch successful",
                  receivedData: processedRows,
                })
}
      } catch (error) {
        console.error("Error in view fetch:", error.message || error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on SERVER_PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message || error);
    process.exit(1); // Exit the process in case of a connection error
  }
})();
