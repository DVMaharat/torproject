(function () {

    var app = angular.module('app', []);



    app.controller('indexCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var html = "https://torapi20180404071944.azurewebsites.net";

        var absUrl = $location.absUrl();
        $scope.nextUserInServis = {};


        $scope.users = [];
        $scope.serviceUser = {}; 
        getAllUsers();

        $scope.addUuser = function (fName) {
            if (fName === null) {
                return false;
            }
            $http.post(html + '/api/home', { fullname: fName }).then(function (success) {
                getAllUsers();
                $scope.fullName = null;
                return success;
            });
            $scope.fullName = null;
        }
        $scope.nextUser = function (user) {
            $scope.users[0].status = 2;            
            upDateUser(user);       
        }


        function upDateUser(user) {

            $http({
                method: 'PUT',
                url: html + "/api/home/" + user.id,
                data: {
                    fullname: user
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(function (success) {
                $scope.nextUserInServis = "";
                return success;
                });
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1); 
            $scope.users[0].status = 1;
            $scope.next = $scope.users[0];
         
        }

        function getAllUsers() {
            $http.get(html + "/api/home")
                .then(function (response) {

                    for (var i = 0; i < response.data.length; i++) {
                        var data = new Date(response.data[i].dateCreated);
                        response.data[i].dateCreated = data.getHours() + ":" + data.getMinutes();
                        $scope.users.push(response.data[i]);
                    }
                    $scope.next = response.data[0];
                    $scope.users = response.data;
                    $scope.users[0].status = 1;
                });

        }

    }]);

})();