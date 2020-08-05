// const https = require("https");

var verdicts = {};
var tags = {};
var levels = {};
var ratings = {};
var problems = {};
var totalSub = 0;

var req1, req2;

var titleTextStyle = {
  fontSize: 18,
  color: '#393939',
  bold: false
};

google.charts.load('current', { packages: ['corechart', 'calendar'] });

var api_url = 'https://codeforces.com/api/';
var handle = '';
$(document).ready(function() {
    // When the handle form is submitted, this function is called...
    $('#handleform').submit(function(e) {
      e.preventDefault();
      $('#handle').blur();
      resetData(); // When a new submission is made, clear all the previous data and graphs
  
      handle = $('#handle').val().trim();
        console.log(handle);
        // console.log("HDSKJHDKHSD");
        if(!handle)
        {
            return;
        }
  
        var req1 = $.get(api_url + 'user.status', { handle: handle }, function(data,status)
         {
            for (var i = data.result.length - 1; i >= 0; i--) {
                var sub = data.result[i];
                var problemId = sub.problem.contestId + '-' + sub.problem.index;
        
                if (problems[problemId] === undefined) {
                  // first submission of a problem
                  problems[problemId] = {
                    attempts: 1,
                    solved: 0 // We also want to save how many submission got AC, a better name would have been number_of_ac
                  };
                } 
                else 
                {
                  //we want to show how many time a problem was attempted by a user before getting first AC
                  if (problems[problemId].solved === 0) problems[problemId].attempts++;
                }
        
                if (verdicts[sub.verdict] === undefined) verdicts[sub.verdict] = 1;
                else verdicts[sub.verdict]++;
        
        
                if (sub.verdict == 'OK') {
                  problems[problemId].solved++;
                }
        
                if (problems[problemId].solved === 1 && sub.verdict == 'OK') {
                  sub.problem.tags.forEach(function(t) {
                    if (tags[t] === undefined) tags[t] = 1;
                    else tags[t]++;
                  });
        
                  if (levels[sub.problem.index[0]] === undefined)
                    levels[sub.problem.index[0]] = 1;
                  else levels[sub.problem.index[0]]++;
        
                  if (sub.problem.rating) {
                    ratings[sub.problem.rating] = ratings[sub.problem.rating] + 1 || 1;
                  }
                }

              
            }
            if (typeof google.visualization === 'undefined') {
                google.charts.setOnLoadCallback(drawCharts);
               } else {
                drawCharts();
              }
        });
    });
});


function drawCharts() {
    //Plotting the verdicts chart
    console.log(ratings);
    console.log("Vivek");
    $('#verdicts').removeClass('hidden');
   
    var verTable = [['Verdict', 'Count']];
    var verSliceColors = [];
    // beautiful names for the verdicts + colors
    for (var ver in verdicts) {
      if (ver == 'OK') {
        verTable.push(['AC', verdicts[ver]]);
        verSliceColors.push({ color: '#4CAF50' });
      } else if (ver == 'WRONG_ANSWER') {
        verTable.push(['WA', verdicts[ver]]);
        verSliceColors.push({ color: '#f44336' });
      } else if (ver == 'TIME_LIMIT_EXCEEDED') {
        verTable.push(['TLE', verdicts[ver]]);
        verSliceColors.push({ color: '#2196F3' });
      } else if (ver == 'MEMORY_LIMIT_EXCEEDED') {
        verTable.push(['MLE', verdicts[ver]]);
        verSliceColors.push({ color: '#673AB7' });
      } else if (ver == 'RUNTIME_ERROR') {
        verTable.push(['RTE', verdicts[ver]]);
        verSliceColors.push({ color: '#FF5722' });
      } else if (ver == 'COMPILATION_ERROR') {
        verTable.push(['CPE', verdicts[ver]]);
        verSliceColors.push({ color: '#607D8B' });
      } else if (ver == 'SKIPPED') {
        verTable.push(['SKIPPED', verdicts[ver]]);
        verSliceColors.push({ color: '#EEEEEE' });
      } else if (ver == 'CLALLENGED') {
        verTable.push(['CLALLENGED', verdicts[ver]]);
        verSliceColors.push({ color: '#E91E63' });
      } else {
        verTable.push([ver, verdicts[ver]]);
        verSliceColors.push({});
      }
    }
    verdicts = new google.visualization.arrayToDataTable(verTable);
    var verOptions = {
      height: $('#verdicts').width(),
      title: 'Verdicts of ' + handle,
      legend: 'none',
      pieSliceText: 'label',
      slices: verSliceColors,
      fontName: 'Roboto',
      titleTextStyle: titleTextStyle,
      is3D: true
    };
    var verChart = new google.visualization.PieChart(
      document.getElementById('verdicts')
    );
    verChart.draw(verdicts, verOptions);

    $('#tags').removeClass('hidden');
  var tagTable = [];
  for (var tag in tags) {
    tagTable.push([tag + ': ' + tags[tag], tags[tag]]);
  }
  tagTable.sort(function(a, b) {
    return b[1] - a[1];
  });
  tags = new google.visualization.DataTable();
  tags.addColumn('string', 'Tag');
  tags.addColumn('number', 'solved');
  tags.addRows(tagTable);
  var tagOptions = {
    width: Math.max(600, $('#tags').width()),
    height: Math.max(600, $('#tags').width()) * 0.75,
    chartArea: { width: '80%', height: '70%' },
    title: 'Tags of ' + handle,
    pieSliceText: 'none',
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        fontSize: 12,
        fontName: 'Roboto'
      }
    },
    pieHole: 0.5,
    tooltip: {
      text: 'percentage'
    },
    fontName: 'Roboto',
    titleTextStyle: titleTextStyle,
    // colors: colors.slice(0, Math.min(colors.length, tags.getNumberOfRows()))
  };
  var tagChart = new google.visualization.PieChart(
    document.getElementById('tags')
  );
  tagChart.draw(tags, tagOptions);

  $('#ratings').removeClass('hidden');
  var ratingTable = [];
  for (var rating in ratings) {
    ratingTable.push([rating, ratings[rating]]);
  }
  ratingTable.sort(function(a, b) {
    if (parseInt(a[0]) > parseInt(b[0])) return -1;
    else return 1;
  });
  ratings = new google.visualization.DataTable();
  ratings.addColumn('string', 'Rating');
  ratings.addColumn('number', 'solved');
  ratings.addRows(ratingTable);
  var ratingOptions = {
    width: Math.max($('#ratings').width(), ratings.getNumberOfRows() * 50),
    height: 300,
    title: 'Problem ratings of ' + handle,
    legend: 'none',
    fontName: 'Roboto',
    titleTextStyle: titleTextStyle,
    vAxis: { format: '0' },
    colors: ['#3F51B5']
  };
  var ratingChart = new google.visualization.ColumnChart(
    document.getElementById('ratings')
  );
  if (ratingTable.length > 1) ratingChart.draw(ratings, ratingOptions);
  
}

function resetData() {
    // if the requests were already made, abort them
    if (req1) req1.abort();
    if (req2) req2.abort();
    verdicts = {};
    tags = {};
    levels = {};
    problems = {};
    totalSub = 0;
    ratings = {};
    $('.to-clear').empty();
    $('.to-hide').addClass('hidden');
  }
  