$(document).ready(function() {
    $(".search-button").on("click", function() {
        updateKeyword("add", $(".search-input").val());
    });
    
    function updateKeyword(action, keyword) {
        
        $.ajax({
            method: "get",
            url: "/api/updateKeyword",
            data: {
                "action": action,
                "keyword": keyword
            },
            success: function(data, status) {
            }
        });
    }
    
    $(".keywordLink").on("click", function() {
        let keyword = $(this).html().trim();  
        $("#keywordSelected").val(keyword);
        
        $.ajax({
            method: "get",
            url: "/api/getKeywords",
            data: {
                "keyword": keyword
                },
            success: function(data, status) {
                $("#keywords").html("");
                 let htmlString = "";
                 data.forEach(function(row){
                    // htmlString += "<img class='image' src='"+row.imageURL+"' width='200' height='200'>";
                    htmlString += "Keyword: "+row.keyword+" Count: "+row.count +"<br>";
                    });
                      
               $("#keywords").append(htmlString);
            }
        });//ajax
    
    });//keywordLink

});