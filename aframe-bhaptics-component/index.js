/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component "bHaptics" attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('bhaptics', {
    schema: {
        appname: {type: 'string', default: 'myApp'},
        middlewareaddress: {type: 'string', default: ''},
        servicediscoveryaddress: {type: 'string', default: 'https://hmd-link-service.glitch.me'},

        files: {type: 'array'}
    },  // System schema. Parses into `this.data`.

    init: function () {

        console.log("Initing system: bHaptics")
        let _this = this;
        this.player = null;
        this.middlewarePromise = null;
        if (this.data.middlewareaddress == '') {
            this.middlewarePromise = this._findMiddleware(this.data.servicediscoveryaddress);
        } else {
            this.middlewarePromise = Promise.resolve(this.data.middlewareaddress);
        }

        this.middlewarePromise.then(() => {
            console.log("Files to register in bHaptics: ")
            console.log(this.data.files);

        });

        this.middlewarePromise
            .then((middlewareAddress) => {
                console.log(middlewareAddress)
                _this.player = new BhapticsPlayer();
                _this.player.initialize(_this.data.appname, _this.data.appname, middlewareAddress + "/v2/feedbacks?");
                _this.player.socket.connect();

                console.log("Adding listaner:")
                let registered = false;
                _this.player.socket.addListener(f=>{
                    if (registered) return;

                    console.log("listened: ", f)
                    registered = true;
                    if (f.status === "Connected" && _this.data.files) {
                        _this.data.files.forEach(file => {
                            console.log("Registering ", file);
                            fetch(file)
                                .then((response) => response.text())
                                .then((json) => {

                                    let error = _this.player.registerFile(file, json);
                                    if (error !== 0) registered = false;
                                    console.log("Registered ", file, " with error code: ", error);
                                });
                        });

                    }

                })
                /*
                _this.player.submitDot("key", 'VestFront', [{
                    index: 10,
                    intensity: 100
                }], 20);

*/

            })
            .catch(error => {
                console.error("Updating component: ", error);
            })
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

/**
 */
/**
 * bHaptics component for A-Frame.
 */
AFRAME.registerComponent('bhaptics', {
    schema: {
        on: {type: 'string', default: 'click'},

        type: {type: 'string', default: 'dot'}, // path, file

        position: {type: 'string', default: 'VestFront'}, //position: 'VestFront' | 'VestBack' | 'Head' | 'ForearmL' | 'ForearmR' | 'GloveL' | 'GloveR'
        points: {type: 'array', default: [1]},
        x: {type: 'array', default: [0]},
        y: {type: 'array', default: [0]},
        intensities: {type: 'array', default: [100]},
        duration: {type: 'int', default: 500},

        file: {type: 'string'}
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


        this.el.addEventListener(this.data.on, function () {
            let points = null;
            let player = _this.system.player;

            if (player) {
                switch (_this.data.type) {
                    case 'dot':
                        console.log(_this.data.points)
                        points = _this.data.points.map(function (point, i) {
                            return {index: point, intensity: _this.data.intensities[i]};
                        });
                        console.log(points)
                        player.submitDot("dot", _this.data.position,
                            points, _this.data.duration);
                        break;
                    case 'path':
                        console.log(_this.data.x)
                        points = _this.data.x.map(function (x, i) {
                            return {
                                x: Number(x),
                                y: Number(_this.data.y[i]),
                                intensity: Number(_this.data.intensities[i])
                            };
                        });
                        console.log(points)
                        player.submitPath("mypath", _this.data.position,
                            points, _this.data.duration);
                        break;
                    case 'file':
                        console.log(_this.data.file)

                        player.submitRegistered(_this.data.file);
                        break;
                }
            }

        });

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
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function () {
        let _this = this;

    },


});

