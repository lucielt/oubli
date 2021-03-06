function random(min, max) {
  return min <= max ? min + Math.round(Math.random() * (max - min)) : null;
}


var Life = {
    waitTime: 50,
    generation: 0,

    running: false,
    autoplay: false,
    // Average execution times
    times: {
        algorithm: 0,
        gui: 0
    },
    // Initial state
    initialState: '[{"90":[160]},{"91":[162]},{"92":[159,160,163,164,165]},{"20":[260]},{"21":[262]},{"22":[259,260,263,264,265]}]',
    // Trail state
    trail: {
        current: false,
        schedule: false
    },
    // Grid style
    grid: {
        current: 0,
        schemes: [{
            color: 'rgba(250,250,250,0)' // Special case: 0px grid
        }]
    },

    // Zoom level
    zoom: {
        current: 0,
        schedule: false,
        schemes: [{
            columns: window.innerWidth/4,
            rows: window.innerHeight/4,
            cellSize: 4
        }]
    },

    // Cell colors
    colors: {
        current: 0,
        schedule: false,
        schemes: [
            {
            dead: 'rgba(250,250,250,0)',
            trail: ['rgba(250,250,250,0)'],
            alive: ['#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', '#fafafa', '#f0f0f0', '#f1f1f1', '#f2f2f2', '#f3f3f3', '#f4f4f4', '#f5f5f5', '#f6f6f6', '#f7f7f7', '#f8f8f8', '#f9f9f9']
        },
        {
            dead: 'rgba(250,250,250,0)',
            trail: ['rgba(250,250,250,0)'],
            alive: ['#000000']
        },
        {
            dead: 'rgba(250,250,250,0)',
            trail: ['rgba(250,250,250,0)'],
            alive: ['#FFFFFF']
        },
        {
            dead: 'rgba(250,250,250,0)',
            trail: ['rgba(250,250,250,0)'],
            alive: ['#FDF2FF', '#FFF2F2', '#EFEDFC', '#F2FFEA', '#F2FFFE', '#FCFCE9']
        }]
    },
    row: 0,
    colums: 0,

    /**
     * On Load Event
     */
    init: function() {
        try {
            this.listLife.init(); // Reset/init algorithm
            this.rows = this.zoom.schemes[this.zoom.current].rows;
            this.columns = this.zoom.schemes[this.zoom.current].columns;
            //this.randomState();
            this.loadState();
            this.canvas.init(); // Init canvas GUI
            this.prepare();
            this.run();

        } catch (e) {
            alert("Error: " + e);
        }
    },
    /**
    /**
         * Load world state from URL parameter
         */
    loadState : function() {
      var state, i, j, y, s = this.initialState;

        state = jsonParse(decodeURI(s));

        for (i = 0; i < state.length; i++) {
          for (y in state[i]) {
            for (j = 0 ; j < state[i][y].length ; j++) {
              this.listLife.addCell(state[i][y][j], parseInt(y, 10), this.listLife.actualState);
            }
          }
        }
    },
        /**
         * Create a random pattern

        randomState : function() {
          var i, liveCells = (this.rows * this.columns) * 0.12;

          for (i = 0; i < liveCells; i++) {
            this.listLife.addCell(random(0, this.columns - 1), random(0, this.rows - 1), this.listLife.actualState);
          }

          this.listLife.nextGeneration();
        },*/
    /**
     * Prepare DOM elements and Canvas for a new run
     */
    prepare: function() {
        this.generation = this.times.algorithm = this.times.gui = 0;

        this.canvas.clearWorld(); // Reset GUI
        this.canvas.drawWorld(); // Draw State

    },

    run: function() {

        Life.running = !Life.running;
        if (Life.running) {
            Life.nextStep();
        }
    },
    /**
     * Run Next Step
     */
    nextStep: function() {
        var i, x, y, r, liveCellNumber, algorithmTime, guiTime;

        // Algorithm run

        algorithmTime = (new Date());

        liveCellNumber = this.listLife.nextGeneration();

        algorithmTime = (new Date()) - algorithmTime;


        // Canvas run

        guiTime = (new Date());

        for (i = 0; i < this.listLife.redrawList.length; i++) {
            x = this.listLife.redrawList[i][0];
            y = this.listLife.redrawList[i][1];

            if (this.listLife.redrawList[i][2] === 1) {
                this.canvas.changeCelltoAlive(x, y);
            } else if (this.listLife.redrawList[i][2] === 2) {
                this.canvas.keepCellAlive(x, y);
            } else {
                this.canvas.changeCelltoDead(x, y);
            }
        }

        guiTime = (new Date()) - guiTime;

        // Pos-run updates

        // Clear Trail
        if (this.trail.schedule) {
            this.trail.schedule = false;
            this.canvas.drawWorld();
        }

        // Change Grid
        if (this.grid.schedule) {
            this.grid.schedule = false;
            this.canvas.drawWorld();
        }

        // Change Colors
        if (this.colors.schedule) {
            this.colors.schedule = false;
            this.canvas.drawWorld();
        }

        // Running Information
        this.generation++;

        r = 1.0 / this.generation;
        this.times.algorithm = (this.times.algorithm * (1 - r)) + (algorithmTime * r);
        this.times.gui = (this.times.gui * (1 - r)) + (guiTime * r);

        // Flow Control
        if (this.running) {
            setTimeout(function() {
                Life.nextStep();
            }, this.waitTime);
        } else {
            if (this.clear.schedule) {
                this.cleanUp();
            }
        }
    },

    /** ****************************************************************************************************************************
     *
     */
    canvas: {

        context: null,
        width: null,
        height: null,
        age: null,
        cellSize: null,
        cellSpace: null,

        /**
         * init
         */
        init: function() {

            this.canvas = document.getElementById('canvasGameOfLife');
            this.context = this.canvas.getContext('2d');
            this.cellSize = Life.zoom.schemes[Life.zoom.current].cellSize;
            this.cellSpace = 0;

            this.clearWorld();
        },
        /**
         * clearWorld
         */
        clearWorld: function() {
            var i, j;

            // Init ages (Canvas reference)
            this.age = [];
            for (i = 0; i < Life.columns; i++) {
                this.age[i] = [];
                for (j = 0; j < Life.rows; j++) {
                    this.age[i][j] = 0; // Dead
                }
            }
        },
        /**
         * drawWorld
         */
        drawWorld: function() {
            var i, j;

            // Special no grid case
            //this.setNoGridOn();
            this.width = this.height = 0;

            // Dynamic canvas size
            this.width = this.width + (this.cellSpace * Life.columns) + (this.cellSize * Life.columns);
            this.canvas.setAttribute('width', this.width);

            this.height = this.height + (this.cellSpace * Life.rows) + (this.cellSize * Life.rows);
            this.canvas.getAttribute('height', this.height);

            // Fill background
            this.context.fillStyle = Life.grid.schemes[Life.grid.current].color;
            this.context.fillRect(0, 0, this.width, this.height);

            for (i = 0; i < Life.columns; i++) {
                for (j = 0; j < Life.rows; j++) {
                    if (Life.listLife.isAlive(i, j)) {
                        this.drawCell(i, j, true);
                    } else {
                        this.drawCell(i, j, false);
                    }
                }
            }
        },
        /**
         * setNoGridOn
         */
        setNoGridOn: function() {
            this.cellSize = Life.zoom.schemes[Life.zoom.current].cellSize + 1;
            this.cellSpace = 0;
        },
        /**
         * drawCell
         */
        drawCell: function(i, j, alive) {

            if (alive) {

                if (this.age[i][j] > -1)
                    this.context.fillStyle = Life.colors.schemes[Life.colors.current].alive[this.age[i][j] % Life.colors.schemes[Life.colors.current].alive.length];
            } else {
                if (Life.trail.current && this.age[i][j] < 0) {
                    this.context.fillStyle = Life.colors.schemes[Life.colors.current].trail[(this.age[i][j] * -1) % Life.colors.schemes[Life.colors.current].trail.length];
                } else {
                    this.context.fillStyle = Life.colors.schemes[Life.colors.current].dead;
                }
            }

            this.context.fillRect(this.cellSpace + (this.cellSpace * i) + (this.cellSize * i), this.cellSpace + (this.cellSpace * j) + (this.cellSize * j), this.cellSize, this.cellSize);

        },
        /**
         * switchCell
         */
        switchCell: function(i, j) {
            if (Life.listLife.isAlive(i, j)) {
                this.changeCelltoDead(i, j);
                Life.listLife.removeCell(i, j, Life.listLife.actualState);
            } else {
                this.changeCelltoAlive(i, j);
                Life.listLife.addCell(i, j, Life.listLife.actualState);
            }
        },
        /**
         * keepCellAlive
         */
        keepCellAlive: function(i, j) {
            if (i >= 0 && i < Life.columns && j >= 0 && j < Life.rows) {
                this.age[i][j]++;
                this.drawCell(i, j, true);
            }
        },
        /**
         * changeCelltoAlive
         */
        changeCelltoAlive: function(i, j) {
            if (i >= 0 && i < Life.columns && j >= 0 && j < Life.rows) {
                this.age[i][j] = 1;
                this.drawCell(i, j, true);
            }
        },
        /**
         * changeCelltoDead
         */
        changeCelltoDead: function(i, j) {
            if (i >= 0 && i < Life.columns && j >= 0 && j < Life.rows) {
                this.age[i][j] = -this.age[i][j]; // Keep trail
                this.drawCell(i, j, false);
            }
        }

    },

    /** ****************************************************************************************************************************
     *
     */
    listLife: {
        actualState: [],
        redrawList: [],
        /**
         *
         */
        init: function() {
            this.actualState = [];
        },

        nextGeneration: function() {
            var x, y, i, j, m, n, key, t1, t2, alive = 0,
                neighbours, deadNeighbours, allDeadNeighbours = {},
                newState = [];
            this.redrawList = [];

            for (i = 0; i < this.actualState.length; i++) {
                this.topPointer = 1;
                this.bottomPointer = 1;

                for (j = 1; j < this.actualState[i].length; j++) {
                    x = this.actualState[i][j];
                    y = this.actualState[i][0];

                    // Possible dead neighbours
                    deadNeighbours = [
                        [x - 1, y - 1, 1],
                        [x, y - 1, 1],
                        [x + 1, y - 1, 1],
                        [x - 1, y, 1],
                        [x + 1, y, 1],
                        [x - 1, y + 1, 1],
                        [x, y + 1, 1],
                        [x + 1, y + 1, 1]
                    ];

                    // Get number of live neighbours and remove alive neighbours from deadNeighbours
                    neighbours = this.getNeighboursFromAlive(x, y, i, deadNeighbours);

                    // Join dead neighbours to check list
                    for (m = 0; m < 8; m++) {
                        if (deadNeighbours[m] !== undefined) {
                            key = deadNeighbours[m][0] + ',' + deadNeighbours[m][1]; // Create hashtable key

                            if (allDeadNeighbours[key] === undefined) {
                                allDeadNeighbours[key] = 1;
                            } else {
                                allDeadNeighbours[key]++;
                            }
                        }
                    }

                    if (!(neighbours === 0 || neighbours === 1 || neighbours > 3)) {
                        this.addCell(x, y, newState);
                        alive++;
                        this.redrawList.push([x, y, 2]); // Keep alive
                    } else {
                        this.redrawList.push([x, y, 0]); // Kill cell
                    }
                }
            }

            // Process dead neighbours
            for (key in allDeadNeighbours) {
                if (allDeadNeighbours[key] === 3) { // Add new Cell
                    key = key.split(',');
                    t1 = parseInt(key[0], 10);
                    t2 = parseInt(key[1], 10);

                    this.addCell(t1, t2, newState);
                    alive++;
                    this.redrawList.push([t1, t2, 1]);
                }
            }

            this.actualState = newState;

            return alive;
        },

        topPointer: 1,
        middlePointer: 1,
        bottomPointer: 1,

        /****/
        getNeighboursFromAlive: function(x, y, i, possibleNeighboursList) {
            var neighbours = 0,
                k;

            // Top
            if (this.actualState[i - 1] !== undefined) {
                if (this.actualState[i - 1][0] === (y - 1)) {
                    for (k = this.topPointer; k < this.actualState[i - 1].length; k++) {

                        if (this.actualState[i - 1][k] >= (x - 1)) {

                            if (this.actualState[i - 1][k] === (x - 1)) {
                                possibleNeighboursList[0] = undefined;
                                this.topPointer = k + 1;
                                neighbours++;
                            }

                            if (this.actualState[i - 1][k] === x) {
                                possibleNeighboursList[1] = undefined;
                                this.topPointer = k;
                                neighbours++;
                            }

                            if (this.actualState[i - 1][k] === (x + 1)) {
                                possibleNeighboursList[2] = undefined;

                                if (k == 1) {
                                    this.topPointer = 1;
                                } else {
                                    this.topPointer = k - 1;
                                }

                                neighbours++;
                            }

                            if (this.actualState[i - 1][k] > (x + 1)) {
                                break;
                            }
                        }
                    }
                }
            }

            // Middle
            for (k = 1; k < this.actualState[i].length; k++) {
                if (this.actualState[i][k] >= (x - 1)) {

                    if (this.actualState[i][k] === (x - 1)) {
                        possibleNeighboursList[3] = undefined;
                        neighbours++;
                    }

                    if (this.actualState[i][k] === (x + 1)) {
                        possibleNeighboursList[4] = undefined;
                        neighbours++;
                    }

                    if (this.actualState[i][k] > (x + 1)) {
                        break;
                    }
                }
            }

            // Bottom
            if (this.actualState[i + 1] !== undefined) {
                if (this.actualState[i + 1][0] === (y + 1)) {
                    for (k = this.bottomPointer; k < this.actualState[i + 1].length; k++) {
                        if (this.actualState[i + 1][k] >= (x - 1)) {

                            if (this.actualState[i + 1][k] === (x - 1)) {
                                possibleNeighboursList[5] = undefined;
                                this.bottomPointer = k + 1;
                                neighbours++;
                            }

                            if (this.actualState[i + 1][k] === x) {
                                possibleNeighboursList[6] = undefined;
                                this.bottomPointer = k;
                                neighbours++;
                            }

                            if (this.actualState[i + 1][k] === (x + 1)) {
                                possibleNeighboursList[7] = undefined;

                                if (k == 1) {
                                    this.bottomPointer = 1;
                                } else {
                                    this.bottomPointer = k - 1;
                                }

                                neighbours++;
                            }

                            if (this.actualState[i + 1][k] > (x + 1)) {
                                break;
                            }
                        }
                    }
                }
            }

            return neighbours;
        },

        /****/
        isAlive: function(x, y) {
            var i, j;

            for (i = 0; i < this.actualState.length; i++) {
                if (this.actualState[i][0] === y) {
                    for (j = 1; j < this.actualState[i].length; j++) {
                        if (this.actualState[i][j] === x) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        /****/
        removeCell: function(x, y, state) {
            var i, j;

            for (i = 0; i < state.length; i++) {
                if (state[i][0] === y) {

                    if (state[i].length === 2) { // Remove all Row
                        state.splice(i, 1);
                    } else { // Remove Element
                        for (j = 1; j < state[i].length; j++) {
                            if (state[i][j] === x) {
                                state[i].splice(j, 1);
                            }
                        }
                    }
                }
            }
        },


        /**
         *
         */
        addCell: function(x, y, state) {
            if (state.length === 0) {
                state.push([y, x]);
                return;
            }

            var k, n, m, tempRow, newState = [],
                added;

            if (y < state[0][0]) { // Add to Head
                newState = [
                    [y, x]
                ];
                for (k = 0; k < state.length; k++) {
                    newState[k + 1] = state[k];
                }

                for (k = 0; k < newState.length; k++) {
                    state[k] = newState[k];
                }

                return;

            } else if (y > state[state.length - 1][0]) { // Add to Tail
                state[state.length] = [y, x];
                return;

            } else { // Add to Middle

                for (n = 0; n < state.length; n++) {
                    if (state[n][0] === y) { // Level Exists
                        tempRow = [];
                        added = false;
                        for (m = 1; m < state[n].length; m++) {
                            if ((!added) && (x < state[n][m])) {
                                tempRow.push(x);
                                added = !added;
                            }
                            tempRow.push(state[n][m]);
                        }
                        tempRow.unshift(y);
                        if (!added) {
                            tempRow.push(x);
                        }
                        state[n] = tempRow;
                        return;
                    }

                    if (y < state[n][0]) { // Create Level
                        newState = [];
                        for (k = 0; k < state.length; k++) {
                            if (k === n) {
                                newState[k] = [y, x];
                                newState[k + 1] = state[k];
                            } else if (k < n) {
                                newState[k] = state[k];
                            } else if (k > n) {
                                newState[k + 1] = state[k];
                            }
                        }

                        for (k = 0; k < newState.length; k++) {
                            state[k] = newState[k];
                        }

                        return;
                    }
                }
            }
        }
    },


};

$(window).load(function() {
    Life.init();
});
