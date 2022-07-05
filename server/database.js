'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

function Database(dbname) {
    this.db = new sqlite.Database(dbname, err => {
        if (err) throw err;
    });

    this.newTableIndovinelli = () => {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS INDOVINELLI(
                ID INTEGER NOT NULL PRIMARY KEY,
                DOMANDA VARCHAR,
                SOLUZIONE VARCHAR,
                SUGG1 VARCHAR,
                SUGG2 VARCHAR,
                DIFFICOLTA VARCHAR,
                TEMPO INTEGER,
                STATO VARCHAR,
                USER INTEGER,
                START_TIME VARCHAR
                );`;

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.newTableUsers = () => {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS USERS(
                ID INTEGER NOT NULL PRIMARY KEY,
                EMAIL VARCHAR, 
                NOME INTEGER,
                HASH VARCHAR,
                SALT VARCHAR,
                PUNTI INTEGER
                );`;

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.newTableRisposte = () => {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RISPOSTE(
                ID INTEGER NOT NULL PRIMARY KEY,
                INDOVINELLO INTEGER, 
                RISPOSTA VARCHAR,
                USER INTEGER
                );`;

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.getIndovinelli = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM INDOVINELLI`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    this.getStartTime = (id) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT START_TIME FROM INDOVINELLI WHERE ID = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
    
    this.getRisposte = (id) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RISPOSTE WHERE INDOVINELLO = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    this.getUsers = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM USERS`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    this.createIndovinello = (data, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO INDOVINELLI(DOMANDA, SOLUZIONE, SUGG1, SUGG2, DIFFICOLTA, TEMPO, STATO, USER) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.domanda, data.soluzione, data.sugg1, data.sugg2, data.difficolta, data.tempo, data.stato, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.createRisposta = (data, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RISPOSTE(INDOVINELLO, RISPOSTA, USER) VALUES(?, ?, ?)';
            this.db.run(sql, [data.indovinello, data.risposta, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.updateStato = (data, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INDOVINELLI SET STATO = ? WHERE ID = ?';
            this.db.run(sql, [data.stato, id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.updateStartTime = (data, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE INDOVINELLI SET START_TIME = ? WHERE ID = ?';
            this.db.run(sql, [data.startTime, id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.updatePoints = (data, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE USERS SET PUNTI = PUNTI + ? WHERE ID = ?';
            this.db.run(sql, [data.punti, id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve("done");
            });
        });
    }

    this.createUser = (data) => {
        return new Promise((resolve, reject) => {
            crypto.scrypt(data.password, data.salt, 32, (err, hash) => {
                if (err) reject(err);
                const sql = 'INSERT INTO USERS(EMAIL, NOME, HASH, SALT) VALUES(?, ?, ?, ?)';
                this.db.run(sql, [data.email, data.nome, hash.toString('hex'), data.salt], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve("done");
                });
            })     
        });
    }

    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE ID = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) 
                    reject(err);
                else if (row === undefined)
                    resolve({error: 'User not found.'});
                else {
                    const user = {id: id, username: row.EMAIL, name: row.NOME}
                    resolve(user);
                }
          });
        });
      };
    
    this.getUser = (email, password) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM USERS WHERE EMAIL = ?';
          this.db.get(sql, [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
              const user = {id: row.ID, username: row.EMAIL, name: row.NOME};
              
              const salt = row.SALT;
              crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                if (err) reject(err);
    
                const passwordHex = Buffer.from(row.HASH, 'hex');
    
                if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
                  resolve(false);
                else resolve(user); 
              });
            }
          });
        });
      };
}
  
module.exports = Database;
  
