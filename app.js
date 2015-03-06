angular.module('PEPFAR.releases', []);

angular.module('PEPFAR.releases').controller('appController', appController);
function appController(releaseService) {
    var vm = this;

    releaseService.getReleases().then(function (releases) {
        vm.releases = releases;
    });
}

angular.module('PEPFAR.releases').service('releaseService', releaseService);
function releaseService ($http, $q) {
    return {
        getReleases: getReleases
    };

    function getReleases () {
        return loadReleases();
    }

    function loadReleases () {
        var releasesLoaded = $q.defer();

        $http.get('releases.json')
            .then(getDataProperty)
            .then(getReleasesInfo)
            .then(function (releases) {
               releasesLoaded.resolve(releases);
            });

        return releasesLoaded.promise;
    }

    function getDataProperty(item) {
        return item.data;
    }

    function getReleasesInfo(releases) {
        return $q.all(releases.map(function (release) {
            if (release.url) {
                return release;
            }

            return $http.get('https://api.github.com/repos/dhis2/' + release.repoName + '/releases')
                .then(function (releaseInfo) {
                    release.url = releaseInfo.data[0].assets[0].browser_download_url;
                    release.download_count = releaseInfo.data[0].assets[0].download_count;
                    release.version = releaseInfo.data[0].tag_name;

                    return release;
                });
        }));
    }
}

angular.module('PEPFAR.releases').directive('version', versionDirective);
function versionDirective() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            version: '='
        },
        template: '<div class="version">Release version: <span ng-bind="::version"></span></div>'
    };
}