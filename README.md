# ServiceSaver





<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://unpkg.com/tabulator-tables@6.2.1/dist/css/tabulator.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.2.1/dist/js/tabulator.min.js"></script>


</head>
<body>

    <div id="example-table"></div>


    
    

 
</body>
<script>



    

var tableD=
[ 
{ 
"id":1,
"name":"Service A",
"url":"https://hackathon.free.beeceptor.com/health1",
"lastAlert":"2024-06-17 14:06:00",
"alertCount":21,
"isAcknowledged":"0",
"assignedTo":null,
"stakeholders":["debasishmahana49@gmail.com", "shatabhishek@gmail.com"],
"createdAt":"2024-06-16 19:35:14",
"updatedAt":"2024-06-17 14:06:04"
},
{ 
"id":2,
"name":"Service B",
"url":"http://service-c.example.com",
"lastAlert":"2024-06-17 14:06:05",
"alertCount":20,
"isAcknowledged":"0",
"assignedTo":"admin@example.com",
"stakeholders":["debasishmahana49@gmail.com"],
"createdAt":"2024-06-16 19:40:20",
"updatedAt":"2024-06-17 14:06:08"
},
{ 
"id":3,
"name":"Service C",
"url":"http://service-d.example.com",
"lastAlert":"2024-06-17 14:06:08",
"alertCount":21,
"isAcknowledged":"0",
"assignedTo":null,
"stakeholders":["debasishmahana49@gmail.com"],
"createdAt":"2024-06-16 19:40:20",
"updatedAt":"2024-06-17 14:06:12"
},
{ 
"id":4,
"name":"Service D",
"url":"http://service-e.example.com",
"lastAlert":"2024-06-17 14:06:12",
"alertCount":21,
"isAcknowledged":"0",
"assignedTo":null,
"stakeholders":["debasishmahana49@gmail.com", "shatabhishek@gmail.com"],
"createdAt":"2024-06-16 19:40:20",
"updatedAt":"2024-06-17 14:06:17"
}]





    //Build Tabulator
var table = new Tabulator("#example-table", {
    data: tableD,
    layout:"fitColumns",
  //  ajaxURL:"https://app.beeceptor.com/console/serversaver",
    progressiveLoad:"scroll",
    paginationSize:20,
    placeholder:"No Data Set",
    columns:[
        {title:"Server id", field:"id", sorter:"number", width:200},
        {title:"Server Name", field:"name", sorter:"number", },
        {title:"Url", field:"url"},
        {title:"Last Alert", field:"lastAlert", sorter:"date"},
        {title:"Alert count", field:"alertCount", sorter:"number"},
        {title:"Stakeholder email", field:"stakeholders", sorter:"email"},
        {title:"Created at ", field:"createdAt", sorter:"date"},
        {title:"Updated at  ", field:"updatedAt", sorter:"date"},
    ],
});
    console.log(table);
        
    </script>
</html>