/**
 * @file admin_dashboard_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin dashboard operations
 */
angular
    .module('IntrepidJS').controller('AdminDashboardController',
        [
            '$scope',
            'restService',
            'i18n',
            adminDashboardController
        ]
    );
function adminDashboardController ($scope, restService, i18n) {
    restService.get(
        {},
        apiPrefix + '/admin/models',
        function(data, status, headers, config) {
            if (data.success) {
                if (_.isEmpty(data.models)) {
                    $scope.volumeGraph = true;
                } else {
                    moduleVolumeGraph(data.models);
                }
            }
        },
        function(data, status, headers, config) {}
    );
    restService.get(
        {},
        apiPrefix + '/admin/users',
        function(data, status, headers, config) {
            if (data.success) {
                usersEvolutionGraph(data.users);
            }
        },
        function(data, status, headers, config) {}
    );
    function moduleVolumeGraph(data) {
        $(function () {
            var dataParsed = [];            
            _.each(data, function(d) {
                var tmpList = [];
                tmpList.push(_.str.capitalize(d.module));
                var count = 0;
                _.each(d.models, function(m) {
                    count += m.count;
                });
                tmpList.push(count);
                dataParsed.push(tmpList);
            });
            $('#module_volume_graph').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                title: {
                    text: i18n.__('Module volumes')
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '0px 1px 2px black'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                series: [{
                    type: 'pie',
                    name: i18n.__('Module volumes'),
                    innerSize: '50%',
                    data: dataParsed
                }],
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            });
        });
    }
    function usersEvolutionGraph(data) {
        $(function () {
            var currentTmpObj = {
                name: i18n.__('Registered users in the day'),
                data: []
            };
            _.each(data, function(d) {
                var c_d = new Date(d._id);
                currentTmpObj.data.push([Date.UTC(c_d.getFullYear(), c_d.getMonth(), c_d.getDate()), d.current_count]);
            });
            var totalTmpObj = {
                name: i18n.__('Total users'),
                data: []
            };
            _.each(data, function(d) {
                var c_d = new Date(d._id);
                totalTmpObj.data.push([Date.UTC(c_d.getFullYear(), c_d.getMonth(), c_d.getDate()), d.global_count]);
            });
            // Data should be sorted by date already, but if not, uncomment the next.
            // currentTmpObj.data = _.sortBy(currentTmpObj.data, function(o) {return o[0];});
            // totalTmpObj.data = _.sortBy(totalTmpObj.data, function(o) {return o[0];});
            var dataParsed = [
                currentTmpObj,
                totalTmpObj
            ];
            $('#users_evolution_graph').highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: i18n.__('Users info')
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%e. %b',
                        week: '%e. %b',
                        month: '%b \'%y',
                        year: '%Y'
                    },
                    title: {
                        text: i18n.__('Date')
                    }
                },
                yAxis: {
                    title: {
                        text: i18n.__('Users count')
                    },
                    min: 0
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y}'
                },
                series: dataParsed
            });
        });
    }
        }