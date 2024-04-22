const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const upload = require('./middlewares/multer.js');

const dotenv = require("dotenv");
dotenv.config(); // Load variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

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

  try {
    // Create a promise-based pool
    const pool = await mysql.createPool(dbConfig);

    // Set group_concat_max_len
    await pool.query('SET SESSION group_concat_max_len = 4294967295');

    // Handle database connection errors
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database:", process.env.DB_DATABASE);
    connection.release();

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

    function sendOTP(otp, userData) {
      // Email message options
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: userData?.email_id,
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

    // Email Verified
    app.post("/api/emailVerify", async (req, res) => {
      try {
        const { tblName, conditionString } = req.body;
        const [rows] = await pool.query(
          `SELECT * FROM ${tblName} WHERE ${conditionString}`
        );
        if (rows.length > 0) {
          const userData = rows[0];
          const otp = Math.floor(100000 + Math.random() * 900000);
          const [updateRows] = await pool.query(
            `UPDATE ${tblName} SET otp = ?  WHERE user_id = ?`,
            [otp, userData?.user_id]
          );
          if (updateRows?.affectedRows > 0) {
            sendOTP(otp, userData);
            res.json({ message: "Email Sent Successfully" });
          } else {
            res.status(401).json({ error: "Email Not Send" });
          }
        } else {
          res.status(401).json({ error: "Invalid Email Id" });
        }
      } catch (error) {
        console.error("Login error:", error.message || error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // login API
    app.post("/api/login", async (req, res) => {
      try {
        const { tblName, conditionString } = req.body;
        const [rows] = await pool.query(
          `SELECT * FROM ${tblName} WHERE ${conditionString}`
        );
        if (rows.length > 0) {
          const userData = rows[0];
          const [UserRole] = await pool.query(
          `SELECT JSON_ARRAYAGG( JSON_OBJECT( 'FK_userId', p.FK_userId, 'FK_RoleId', p.FK_RoleId, 'rolePermission', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_RoleId', r.PK_RoleId, 'roleName', r.roleName ) ORDER BY r.PK_RoleId ASC ), ']' ) AS JSON ) FROM tbl_role_master r WHERE r.PK_RoleId = p.FK_RoleId ), 'modulePermission', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_role_module_permissionId', q.PK_role_module_permissionId, 'FK_RoleId', q.FK_RoleId, 'FK_ModuleId', q.FK_ModuleId, 'create', q.create, 'read', q.read, 'update', q.update, 'delete', q.delete, 'moduleMaster', ( SELECT CAST( CONCAT( '[', GROUP_CONCAT( JSON_OBJECT( 'PK_ModuleId', s.PK_ModuleId, 'moduleName', s.moduleName ) ), ']' ) AS JSON ) FROM tbl_module_master s WHERE s.PK_ModuleId = q.FK_ModuleId ) ) ORDER BY q.FK_ModuleId ASC ), ']' ) AS JSON ) FROM tbl_role_module_permission q WHERE q.FK_RoleId = p.FK_RoleId ) ) ) AS UserRoleData FROM tbl_user_role_permission p WHERE p.FK_userId = ${userData.user_id} ORDER BY p.FK_RoleId ASC;`
          );
          const expirationTimestamp =
            Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours expiry
          const token = jwt.sign(
            {
              id: userData.user_id,
              username: userData.username,
              exp: expirationTimestamp,
            },
            secretKey
          );
          const userRole = UserRole?.[0]?.UserRoleData;
          res.json({ token, expirationTimestamp, userRole, userData });
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
          res.json({ message: "Registration successful" });
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
                res.json({ message: "Insert successful", data: insertResults });
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
                res.json({ message: "Insert successful", data: insertRows });
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
                return res.json({ message: "Update successful" });
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
                return res.json({ message: "Update successful" });
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
              res.json({ message: "Deletion successful" });
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
            res.json({ message: "Fetch successful", data: selectRows });
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
            res.json({ message: "Custom query successful", data: customRows });
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
        const { operation, tblName, data, conditionString, checkAvailability, customQuery, } = req.body;
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
                res.json({ message: "Insert successful", data: insertResults });
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
                res.json({ message: "Insert successful", data: insertRows });
              } else {
                res.status(401).json({ error: "Insert failed" });
              }
            }
            break;

          case "custom":
            const [customRows] = await pool.query(customQuery);
            res.json({ message: "Custom query successful", data: customRows });
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
                return { message: "Insert successful", data: insertRows };
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

          return res.json({ message: "All operations successful" });
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
                return res.json({ message: "Update successful" });
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
                return res.json({ message: "Update successful" });
              } else {
                return res.status(500).json({ error: "Update failed" });
              }
            }
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
            return res.json({
              message: "Custom query successful",
              data: customRows,
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
            return res.json({ message: "Fetch successful", data: selectRows });
          case "custom":
            const [customRows] = await pool.query(customQuery);
            return res.json({
              message: "Custom query successful",
              data: customRows,
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
              res.json({ message: "Deletion successful" });
            } else {
              res.status(401).json({ error: "Deletion failed" });
            }
            break;
          case "custom":
            const [customRows] = await pool.query(customQuery);
            res.json({ message: "Custom query successful", data: customRows });
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
      res.json({ message: "This is a protected route!" });
    });

    // For Multer Api  

  app.post("/api/multer", upload.single('profile_pics'), authenticateToken, async (req, res) => {
    try {
      const { tblName, data, conditionString,fileParam } = req.body;
      const file = req?.file?.filename;
      if (!tblName) {
        return res
          .status(400)
          .json({ error: "Operation and table are required" });
      }
      if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const [checkRows] = await pool.query( `SELECT * FROM ${tblName} WHERE ${conditionString}`);

    if (checkRows.length > 0) {
      const [updateRows] = await pool.query(`UPDATE ${tblName} SET ${fileParam} = ?,? WHERE ${conditionString}`, [file,data] );
      if (updateRows.affectedRows > 0) {
        return { message: "Update successful" };
      } else {
        return { error: "Update failed" };
      }
    } else {
      const [insertRows] = await pool.query(`INSERT INTO ${tblName} SET ${fileParam} = ?, ?`,[file,data]);
      if (insertRows.affectedRows > 0) {
        return { message: "Insert successful", data: insertRows };
      } else {
        return { error: "Insert failed" };
      }
    }
    } catch (error) {
      console.error("Error:", error.message || error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });


    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message || error);
    process.exit(1); // Exit the process in case of a connection error
  }
})();
