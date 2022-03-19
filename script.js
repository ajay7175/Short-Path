onload = function(){
    var curr_data;
    var cityLength;
    var container=document.getElementById('mynetwork');
    var container2=document.getElementById('mynetwork2');
    var genNew=document.getElementById('generate-graph');
    var newLocation=document.getElementById('newLocation');
    var solve=document.getElementById('solve');
    var temptext2=document.getElementById('temptext2');
    var start=document.getElementById('start');
    var destination=document.getElementById('destination');
    var myForm=document.getElementById('myForm');

    start.addEventListener('input',handleStart);
    destination.addEventListener('input',handleDestination);

    function handleStart(e){
        src=parseInt(e.target.value);
    }
    function handleDestination(e){
        dst=parseInt(e.target.value);
    }

    var options={
        edges:{
            labelHighlighBold: true,
            font:{
                size:20
            }
        },
        nodes:{
            font: "25px opera black",
            scaling: { 
                label: true
            },
            shape:'icon',
            icon:{
                face: 'FontAwesome',
                code: '\uf14e',
                size: 30,
                color: '#000000'
            }
        }
    };
    //intialize your network
    var network= new vis.Network(container);
    network.setOptions(options);
    var network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        cities=['Bengaluru', 'Mysuru','Udupi','Mangaluru','Belgaum','Hubli','Hosapete','Dharwad','Karwar','Bellary','Shivamogga','Bijapur','Haveri','Raichur','Tumkur','Bidar','Gulbarga','Chamarajnagar','Kodagu','Gadag','Chitradurga','Davangere','Kolar'];
        cityLength=cities.length;
        let nodes=[];
        for(let i= 1; i<=cityLength; i++){
            nodes.push({id:i, label: cities[i-1]})
        }
        nodes= new vis.DataSet(nodes);
    
    let edges = [];
    for(let i=2;i<=cityLength;i++){
        let neigh = i - Math.floor(Math.random()*Math.min(i-1,3)+1);
        edges.push({from: i, to: neigh, color: 'pink',label: String(Math.floor(Math.random()*70)+31)});
    }

    let data = {
        nodes: nodes,
        edges:edges
    };
    curr_data=data;
}

genNew.onclick= function(){
    createData();
    network.setData(curr_data);
    temptext2.innerText="Put start and board to find shortest route";
    temptext2.style.display = "inline";
    container2.style.display = "none";
    myForm.style.display = "inline";
    newLocation.style.display = "none";
};

solve.onclick=function(){
    temptext2.style.display="none";
    container2.style.display="inline";
    myForm.style.display="none";
    newLocation.style.display="inline";
    network2.setData(solveData(cityLength));
};

newLocation.onclick=function(){
    temptext2.innerText = "Put start and board to find shortest route";
    temptext2.style.display  = "inline";
    container2.style.display = "none";
    myForm.style.display = "inline";
    newLocation.style.display = "none";
};


function dijkstra(graph, cityLength, src) {
    let vis = Array(cityLength).fill(0);
    let dist = [];
    for(let i=1;i<=cityLength;i++)
        dist.push([10000,-1]);
    dist[src][0] = 0;

    for(let i=0;i<cityLength-1;i++){
        let mn = -1;
        for(let j=0;j<cityLength;j++){
            if(vis[j]===0){
                if(mn===-1 || dist[j][0]<dist[mn][0])
                    mn = j;
            }
        }

        vis[mn] = 1;
        for(let j in graph[mn]){
            let edge = graph[mn][j];
            if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                dist[edge[0]][0] = dist[mn][0]+edge[1];
                dist[edge[0]][1] = mn;
            }
        }
    }

    return dist;
}


function solveData(cityLength) {
    // src = 1;
    // dst = sz;

    let data = curr_data;
    let graph = [];
    for(let i=1;i<=cityLength;i++){
        graph.push([]);
    }

    for(let i=0;i<data['edges'].length;i++) {
        let edge = data['edges'][i];
        graph[edge['to']-1].push([edge['from']-1,parseInt(edge['label'])]);
        graph[edge['from']-1].push([edge['to']-1,parseInt(edge['label'])]);
    }

    let dist1 = dijkstra(graph,cityLength,src-1);

    new_edges = [];
    new_edges.concat(pushEdges(dist1, dst-1));

    data = {
        nodes: data['nodes'],
        edges: new_edges
    };
    return data;
}

function pushEdges(dist, curr) {
    tmp_edges = [];
    while(dist[curr][0]!=0){
        let fm = dist[curr][1];
        new_edges.push({arrows: { to: { enabled: true}},from: fm+1, to: curr+1, color: 'green', label: String(dist[curr][0] - dist[fm][0])});
        curr = fm;
    }
    return tmp_edges;
}

genNew.click();

};
