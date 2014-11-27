angular.module('PEPFAR.releases', []);

angular.module('PEPFAR.releases').controller('appController', appController);
function appController(releaseService) {

}

angular.module('PEPFAR.releases').service('releaseService', releaseService);
function releaseService ($http) {
    return $http.get('releases.json').then(function (releases) {
        console.log(releases);
        return releases;
    });
}
