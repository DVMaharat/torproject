(function () {

    var app = angular.module('app', []);



    app.controller('indexCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var html = "https://torapi20180404071944.azurewebsites.net";
        $scope.users = [];
        getAllUsers();

        $scope.addUuser = function (fName) {
            if (fName === null) {
                return false;
            }
            $http.post(html + '/api/home', { fullname: fName }).then(function (success) {
                getAllUsers();
                swal({
                    title: fName + " הצטרפה לתור",
                    text: "You clicked the button!",
                    icon: "success",
                    buttons: false,
                    timer: 3000,
                  });     
                $scope.fullName = null;
                return success;
            });

            
            $scope.fullName = null;
        }
        $scope.nextUser = function (user) {
            if(user == null){
                swal({
                    title: "אין עוד תורים ברשימה",
                    text: "הנה הוסיף תורים לרשימה",
                    icon: "info",
                    buttons: false,
                    timer: 3000,
                }); 
                return null;
            }
            if($scope.users.length === 1) {
                swal({
                    title: "לא נשארו עוד תורים ברשימה",
                    text: "הנה הוסיף תורים לרשימה",
                    icon: "info",
                    buttons: false,
                    timer: 3000,
                });     
            }else{                   
                swal({
                    title: "התור הבאה הוא  : " + $scope.users[1].id ,
                    text: $scope.users[1].fullName,                
                    buttons: false,
                    timer: 3000,
                }); 
            }
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
               
                    if($scope.users.length >= 1){
                        var index = $scope.users.indexOf(user);
                        $scope.users.splice(index, 1); 
                        $scope.next = null;
                        $scope.users[0].status = 1;
                        $scope.next = $scope.users[0];
                        if($scope.users.length == 0)
                            swal({
                                title: "התורים הסתיימו בהצלחה",
                                text: "הנה הוסיף תורים לרשימה",
                                icon: "info",
                                buttons: false,
                                timer: 3000,
                            });     
                       
                    }
                });
        }

        function getAllUsers() {
            $http.get(html + "/api/home")
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var data = new Date(response.data[i].dateCreated);
                        response.data[i].dateCreated = data.getHours() + ":" + data.getMinutes();
                        $scope.users.push(response.data[i]);
                    }
                    if($scope.users.length >= 1){
                        $scope.next = response.data[0];
                        $scope.users = response.data;
                        $scope.users[0].status = 1;
                    }
                });

        }
    }]);

})();