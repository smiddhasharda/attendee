const mysql = require('mysql2');
const moment = require('moment');

// Local MySQL database connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootuser",
    database: "attendence_db"
});

// View MySQL database connection
const viewCon = mysql.createConnection({
    host: "35.154.115.237",
    user: "examshedule",
    password: "eX@m@#!@*",
    database: "SHARDA"
});

// Function to fetch data from the view
function fetchDataFromView() {
    return new Promise((resolve, reject) => {
        viewCon.query('SELECT * FROM your_view', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to query local database
function queryLocalDatabase() {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM tbl_user_master', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to update record in local database
function updateRecord(item) {
    return new Promise((resolve, reject) => {
        con.query('UPDATE tbl_user_master SET name = ?, contact_number=?, email_id = ?,isActive=? WHERE username = ?', [item.NAME_PREFIX || '' + item.FIRST_NAME || '' + item.MIDDLE_NAME || '' + item.LAST_NAME ,item.PHONE, item.EMAIL_ADDR, '1', item.EMPLID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to update record status in local database
function updateRecordStatus (item) {
    return new Promise((resolve, reject) => {
        con.query('UPDATE tbl_user_master SET isActive=? WHERE username = ?', ['1', item.EMPLID], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to insert record into local database
function insertRecord(item) {
    return new Promise((resolve, reject) => {
        con.query( `INSERT INTO tbl_user_master (username, name, contact_number, email_id) VALUES (?,?,?,?)`,[item.EMPLID, item.NAME_PREFIX || '' + item.FIRST_NAME || '' + item.MIDDLE_NAME || '' + item.LAST_NAME ,item.PHONE, item.EMAIL_ADDR] , (err, result) => {
            if (err) {
                reject(err);
            } else {
                   con.query( `INSERT INTO tbl_user_role_permission (FK_userId, FK_RoleId) VALUES (?,?)`,[result.insertId] , (err, final) => {
            if (err) {
                reject(err);
            } else {
                resolve(final);
            }
        });
            }
        });
    });
}

// Main function to execute the cron job
async function executeCronJob() {
    try {
        // Fetch data from the view
        const externalData = await fetchDataFromView();

        // Query local database
        const localData = await queryLocalDatabase();

        for (const item of externalData) {
            const localItem = localData.find(localItem => localItem.username === item.username);
            if (localItem) {
                // Check if data has changed
                if (/* Logic to check if data has changed */) {
                    await updateRecord(item);
                }
            } else {
                // Data does not exist in the local database, insert it
                await insertRecord(item);
            }
        }

        // Mark records in local as inactive if they're not in the view
        for (const localItem of localData) {
            const externalItem = externalData.find(externalItem => externalItem.username === localItem.username);
            if (!externalItem) {
                await updateRecordStatus(localItem);
            }
        }

        console.log('Cron job completed successfully');
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
}

// Execute cron job
executeCronJob();
