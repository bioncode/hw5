const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", async function(req, res) {
    
    let imageUrlArray = await getRandomImage("");
    
    let max = imageUrlArray.length - 1;
    let min = 0;
    
    console.log(Math.floor(Math.random() * (max - min) + min));
    
    res.render("index", {"imageUrl": imageUrlArray[Math.floor(Math.random() * (max - min) + min)]});
});

app.get("/search", async function(req, res) {
    
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }

    let keywordCount = await getKeywordCount(keyword);
    
    let imageUrlArray = await getRandomImage(keyword);
    res.render("results", {"imageUrlArray": imageUrlArray, "keywordCount": (keywordCount+1), "keyword": keyword});
});

app.get("/api/updateKeyword", async function(req, res){
    
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    
    let keywordCount = await getKeywordCount(keyword);
    
    if (keywordCount > 0) {
        updateKeywordCount("update", keyword, keywordCount+1);
    } else {
        updateKeywordCount("add", keyword);
    }
});

app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM keywords ORDER BY keyword";
 
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("keywords", {"rows":rows});
  });  
});

app.get("/api/getKeywords", function(req, res){
  let sql = "SELECT * FROM keywords WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
    
});//api/getFavorites



function getRandomImage(keyword) {
    return new Promise (function (resolve, reject) {
        
        let requestUrl = `https://pixabay.com/api/?key=17670090-aae67c940cd9bd6f9bdc02d74&q=${keyword}&image_type=photo`;
    
        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);
                
                let imageUrlArray = [];
                for (let i=0; i<parsedData["hits"].length; i++)
                {
                    imageUrlArray.push(parsedData["hits"][i]["previewURL"]);
                }
                
                resolve(imageUrlArray);
            }
            else {
                console.log("error:", error);
                console.log("statusCode:", response && response.statusCode);
                reject(error);
            }
        });
    });    
}

function getKeywordCount(keyword) {
    return new Promise (function (resolve, reject) {
        let sql = "SELECT * FROM keywords WHERE keyword = ?";
        let sqlParams = [keyword];
        let keywordCount;
        pool.query(sql, sqlParams, function (err, rows, fields) {
            if (err) 
                // throw err;
                reject(err);
            else {
                console.log("Keyword: " + keyword);
                console.log("Length: " + rows.length);
                
                if (rows.length > 0)
                    resolve(rows[0].count);
                else
                    resolve(0);
            }
        }); 
    });    
}

function updateKeywordCount(action, keyword, count) {
    return new Promise (function (resolve, reject) {
        let sql;
        let sqlParams;
        switch (action) {
            case "add": 
                sql = "INSERT INTO keywords (keyword, count) VALUES (?, ?)";
                sqlParams = [keyword, 1];
                console.log(keyword);
                break;
            
            case "update": 
                sql = "UPDATE keywords SET count=? WHERE keyword=?";
                sqlParams = [count, keyword];
                break;    
                    
            case "delete": sql = "DELETE FROM keywords WHERE keyword = ?";
                sqlParams = [keyword];
                break;
        }
        
        pool.query(sql, sqlParams, function (err, rows, fields) {
            if (err) 
                reject(err)
            else
                resolve(true);
        });
    });    
}

//starting server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running...");
});