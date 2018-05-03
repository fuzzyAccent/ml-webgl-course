  function runBenchmark(size, callback){
    let cpu_recs = [];
    let gpu_recs = [];

    for(let i = 3; i <= size; i++){
      computeOnCPU(i, function (dt) {
        cpu_recs.push(dt);
      });
    }

    for(let i = 3; i <= size; i++){
      computeOnGPU(i, function (dt) {
        gpu_recs.push(dt);
      });
    }

    callback(cpu_recs, gpu_recs);
  }

  function drawChart(cpuData, gpuData){
    Highcharts.chart('container', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'CPU vs GPU execution time for a matrix multiplication'
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'linear'
      },
      yAxis: {
        title: {
          text: 'Execution Time in ms'
        }
      },
      legend: {
        enabled: false
      },
      // plotOptions: {
      //   area: {
      //     marker: {
      //       radius: 2
      //     },
      //     lineWidth: 1,
      //     states: {
      //       hover: {
      //         lineWidth: 1
      //       }
      //     },
      //     threshold: null
      //   }
      // },

      series: [{
        name: 'CPU',
        data: cpuData
      },
      {
        // type: 'area',
        name: 'GPU',
        data: gpuData
      }
    ]
  });
}
