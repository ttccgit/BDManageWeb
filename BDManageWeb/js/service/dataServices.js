app.factory('httpRequest', ['$http', '$q', '$log', function ($http, $q, $log) {
    return {
        Request: function (requestType, api, requestData, header) {
            var d = $q.defer();
            //requestType 'GET'
            url = serviceUrl + api;
            showLoading();
            if (header) {
                $http.defaults.headers.common = header;
            }
            $http({ method: requestType, url: url, data: requestData }).
                success(
                function (data, status, headers, config) {
                    hideLoading();
                    d.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    hideLoading();
                    $log.error("Error: ", headers);
                    d.reject(data);
                });
            return d.promise;
        },
        Get: function (api, header) {
            return this.Request("GET", api, "", header);
        },
        POST: function (api, requestData, header) {
            return this.Request("POST", api, requestData, header);
        },
        PUT: function (api, requestData, header) {
            return this.Request("PUT", api, requestData, header);
        },
        DELETE: function (api, header) {
            return this.Request("DELETE", api, "", header);
        }
    };
} ]); 