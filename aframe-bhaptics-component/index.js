/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component "bHaptics" attempted to register before AFRAME was available.');
}

/**
 */
/**
 * bHaptics component for A-Frame.
 */
AFRAME.registerComponent('bhaptics', {
    schema: {
        appname: {type: 'string', default: 'myApp'},

        on: {type: 'string', default: 'click'},

        middlewareaddress: {type: 'string', default: ''},
        servicediscoveryaddress: {type: 'string', default: 'https://hmd-link-service.glitch.me'},
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
        let _this = this;
        this._player = null;

        this.middlewarePromise = null;
        if (_this.data.middlewareaddress == '') {
            this.middlewarePromise = _this._findMiddleware(this.data.servicediscoveryaddress);
        } else {
            this.middlewarePromise = Promise.resolve(_this.data.middlewareaddress);
        }

        this.el.addEventListener(this.data.on, function() {
            if(_this._player)
            _this._player.submitDot("dot", 'VestFront', [{index: 10, intensity: 100}, {index: 0, intensity: 100}], 100)
        });

    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) {
        let _this = this;

        this.middlewarePromise
            .then((middlewareAddress) => {
                console.log(middlewareAddress)
                _this._player = new BhapticsPlayer();
                _this._player.initialize(_this.data.appname, _this.data.appname, middlewareAddress + "/v2/feedbacks?");
/*
                setTimeout(function () {
                    console.log("sending")
                    player.submitDot("testKey", 'VestFront', [{index: 0, intensity: 100}], 100)
                }, 10000);
*/
            })
            .catch(error => {
                console.error("Updating component: ", error);
            })
    },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function () {
        let _this = this;

    },

    /**
     * Called on each scene tick.
     */
    tick: function (t) {

    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function () {
        let _this = this;
        this._registeredEventsPromise
            .then(function ([middlewareAddress, simulator, appName]) {
                this._socket.close();
                return _this.stop(middlewareAddress, simulator, appName);
            })
            .then(function ([middlewareAddress, simulator, appName]) {
                _this._ready = false;
            })
            .catch(error => {
                console.error(error);
            });
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function () {
        let _this = this;

    },

    _findMiddleware: function (serviceDiscoveryAddress) {
        return new Promise(function (resolve, reject) {
            let interval = 2;
            console.info("Using Service Discovery: ", serviceDiscoveryAddress)
            setTimeout(search, interval);

            function search() {
                fetch(serviceDiscoveryAddress).then(function (page) {
                    return page.json();
                }).then(function (json) {
                    //console.log(json);
                    if (json.bhapticsmiddleware) {
                        console.info("bHaptics Middleware found through service discovery: ", json.bhapticsmiddleware);
                        console.log(json.bhapticsmiddleware.address)
                        resolve(json.bhapticsmiddleware.address);
                        //begin(middleware.address);
                    } else {
                        interval = Math.min(interval * 2, 30);
                        console.warn("bHaptics middleware not found through service discovery. Trying again in ", interval, " seconds.");
                        setTimeout(search, interval * 1000);
                    }
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            }
        });
    }

});

