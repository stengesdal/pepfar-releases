angular.module('PEPFAR.releases', []);

angular.module('PEPFAR.releases').controller('appController', appController);
function appController(releaseService) {
    var vm = this;

    releaseService.getReleases().then(function (releases) {
        vm.releases = releases;
    });
}

angular.module('PEPFAR.releases').service('releaseService', releaseService);
function releaseService ($http) {
    return {
        getReleases: getReleases
    };

    function getReleases () {
        return loadReleases();
    }

    function loadReleases () {
        return $http.get('releases.json').then(function (releases) {
            if (Array.isArray(releases.data)) {
                return releases.data;
            }
            return [];
        });
    }
}
