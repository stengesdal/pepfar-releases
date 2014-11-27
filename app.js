angular.module('PEPFAR.releases', []);

angular.module('PEPFAR.releases').controller('appController', appController);
function appController(releaseService) {
    releaseService.getReleases().then(function (releases) {
        console.log(releases);
    });
}

angular.module('PEPFAR.releases').service('releaseService', releaseService);
function releaseService ($http) {
    return {
        getReleases: getReleases
    };

    function getReleases () {
        return loadReleases()
            .then(function (releases) {
                return loadManifests(releases);
            });
    }

    function loadReleases () {
        return $http.get('releases.json').then(function (releases) {
            if (Array.isArray(releases.data)) {
                return releases.data;
            }
            return [];
        });
    }

    function loadManifests (releases) {
        var promises = [];

        releases.forEach(function (release) {
            promises.push($http.get(release.manifest).then(function (manifest) {
                return manifest.data;
            }));
        });

        return $q.all(promises).then(function (manifests) {
            manifests.forEach(function (manifest, index) {
               releases[index].manifestData = manifest; 
            });

            return releases;
        });
    }
}
