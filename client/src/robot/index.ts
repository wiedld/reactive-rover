const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];


enum Terrian {P = 'Plains', M = 'Mountains', C = 'Crevasse'};
type Command = 'L' | 'R' | 'F' | 'B';
type Direction = 'N' | 'S' | 'E' | 'W';
type Location = [number,number];
type World = Array<Array<Terrian>>;

class PhysicalWorld {
    // top left corner is (X:0, Y:0)
    // bottom right is (X:4, Y:4)
    static WORLD: World = [
        [Terrian.P, Terrian.P, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P]
    ];

    static TERRAIN_TYPES = {
        [Terrian.P]: {
          obstacle: false,
          description: 'plains'
        },
        [Terrian.M]: {
          obstacle: true,
          description: 'mountains'
        },
        [Terrian.C]: {
          obstacle: true,
          description: 'crevasse'
        }
      };

    static getTerrain ([x,y]: Location) {
        return PhysicalWorld.WORLD[y] && PhysicalWorld.WORLD[y][x];
    }

    static isOffWorld ([x,y]: Location) {
        return x < 0 || y < 0 || y >= PhysicalWorld.WORLD.length || x >= PhysicalWorld.WORLD[0].length;
    }

    static isSameLoc (loc1: Location, loc2: Location) {
        return loc1[0] == loc2[0] && loc1[1] == loc2[1];
    }

    _objects: Array<Array<number>>;

    removeLocation ([x,y]: Location) {
        !(PhysicalWorld.isOffWorld([x,y])) && this._objects[y][x]--;
    }

    setLocation ([x,y]: Location) {
        !(PhysicalWorld.isOffWorld([x,y])) && this._objects[y][x]++;
    }

    constructor () {
        this._objects = Array(5).fill(0)
            .map((_) => Array(5).fill(0))
    }

    isObstacle (targetLoc: Location, currLoc: Location) {
        const [x,y] = targetLoc;
        const terrain = PhysicalWorld.getTerrain([x,y]);
        const numOtherObjectsAtLoc = this._objects[y][x] - (PhysicalWorld.isSameLoc(currLoc, [x,y]) ? 1 : 0);

        return PhysicalWorld.TERRAIN_TYPES[terrain].obstacle || 0 != numOtherObjectsAtLoc;
    }
}

class Robot {
    static ObstacleException = 1;
    static InvalidCmdException = 2;
    // ordered for mod math (rotating robot)
    static orderedDir: Array<Direction> = [
        'N',
        'E',
        'S',
        'W'
    ];

    static isKnownWorld ([x,y]: Location, knownWorld: World) {
        return !!knownWorld[y] && !!knownWorld[y][x];
    }

    _location: Location;
    _direction: number;
    _commands: Array<Command>;
    _physicalWorld: PhysicalWorld;

    setLocation (loc: Location) {
        this._physicalWorld.removeLocation(this._location);
        this._physicalWorld.setLocation(loc);
        this._location = loc;
    }
    get location () { return this._location; }

    setDirection (dir: number) { this._direction = dir; }
    get direction () { return Robot.orderedDir[this._direction]; }

    addCommand (c: Command) { this._commands.push(c); }
    addCommands (cs: Array<Command>) { this._commands.push(...cs); }
    get commands () { return this._commands; }

    constructor (physicalWorld: PhysicalWorld, location: Location, direction: Direction) {
        this._commands = [];
        this._physicalWorld = physicalWorld;
        this._physicalWorld.setLocation(location);
        this._location = location;
        this._direction = Robot.orderedDir.indexOf(direction);
    }

    command (commands: Array<Command>) {
        try {
            commands.forEach(cmd => this._move(cmd));
            return this._status(0);
        } catch (e) {
            return this._status(e);
        }
    }

    _move (cmd: Command) {
        this.addCommand(cmd);

        const mvtAlongXaxis = (cmd: Command) =>
            (cmd == 'F' && this.direction == 'W') || (cmd == 'B' && this.direction == 'E')
                ? - 1
                : + 1;
        
        const mvtAlongYaxis = (cmd: Command) =>
            (cmd == 'F' && this.direction == 'N') || (cmd == 'B' && this.direction == 'S')
                ? - 1
                : 1;

        switch (cmd) {
            case 'L':
                this.setDirection(this._direction == 0 ? 3 : this._direction - 1);
                break;
            case 'R':
                this.setDirection((this._direction + 1) % 4);
                break;
            case 'F':
            case 'B':
                let [x,y] = this.location;
                if (['W', 'E'].includes(this.direction)) {
                    x = x + mvtAlongXaxis(cmd);
                } else {
                    y = y + mvtAlongYaxis(cmd);
                }
                this.setLocation([x,y]);
                break;
            default:
                throw Robot.InvalidCmdException;
        }
        this._assessOutcome(cmd);
    }

    _assessOutcome (cmd: Command) {
        const reverseCmd: {[cmd: string]: Command } = {
            'L': 'R',
            'R': 'L',
            'F': 'B',
            'B': 'F'
        };
        const loc = this.location;
        if (PhysicalWorld.isOffWorld(loc) || this._physicalWorld.isObstacle(loc, loc)) {
            // Note: could input a special error code into commands (history)
            this._move(reverseCmd[cmd]);
            throw Robot.ObstacleException;
        }
    }

    _status (status: number) {
        return {
            dir: this.direction,
            loc: [...this.location],
            status: STATUS_CODES[status]
        };
    }

    /*
        Use cases:
            - pre-planning:
                - when already aware of the terrian map.
                    --> nextTileOkay() can lookahead at the terrian.
                - plan optimal path first. then move.
            - physical exploration:
                - when unaware of terrian.
                    --> nextTileOkay() only knows the edge of the world.
                - note: physical exploration will backtrack over known terrian
                    --> recursive call to the pre-planning path.
    */
    moveTo (location: Location, prePlan = false, knownWorld = PhysicalWorld.WORLD) {
        try {
            if (prePlan) {
                this.command(this._buildPlan(location, knownWorld))
            } else
                this._physicalExploration(location);

            return this._status(0);
        } catch (e) {
            return this._status(e);
        }     
    }

    /*
        Takes:
            - goalLoc [x,y]
            - knownWorld (known terrian map)
        Returns:
            - an array of directions [N, W, W, S, S]
    */
    _buildPlan (goalLoc: Location, knownWorld: World): Array<Command> {
        const nextTileIsOkay = (loc: Location) => Robot.isKnownWorld(loc, knownWorld)
            && !PhysicalWorld.isOffWorld(loc)
            && !this._physicalWorld.isObstacle(loc, this.location);

        const planningOnly = true;

        return this._aStar(goalLoc, nextTileIsOkay, planningOnly);
    }

    /*
        Takes:
            - goalLoc [x,y]
        Returns:
            - true
    */
    _physicalExploration (goalLoc: Location) {
        // only know size of world.
        const nextTileIsOkay = (loc: Location) => !PhysicalWorld.isOffWorld(loc);

        return this._aStar(goalLoc, nextTileIsOkay, false);
    }

    /*
        Implement version of A*.
            - common algorithmic function used by planning & exploration.
        Takes:
            - `goal` target location.
            - `planningOnly` bool, determines if rover moves after each planning step.
            - `nextTileOkay` function, restricts what parts of the world can be planned.
        Returns:
            - an array of directions [N, W, W, S, S], or bool true.
    */
    _aStar (goal: Location, nextTileIsOkay: (x: Location) => boolean, planningOnly: boolean) {
        // Array<Array<typeof visitedNode>>
        const visited: Array<Array<typeof visitedNode>> = [...Array(PhysicalWorld.WORLD.length)]
            .map(_ => Array(PhysicalWorld.WORLD[0].length));

        // cost gets stringified (on key creation)
        const toVisit: {[cost: string]: Array<Location> } = {}; // will be keyed by [estimatedCostToGoal]

        const notYetVisited = ([x,y]: Location) => visited[y][x] == undefined;
        const estimateBtwnLoc = ([x,y]: Location, [x1,y1]: Location) => Math.abs(x1-x) + Math.abs(y1-y);
        
        // start node
        let loc: Location = this.location;
        let [x,y] = loc;
        let cost = estimateBtwnLoc([x,y], goal);

        // visited
        const visitedNode: { cost: number, path: Array<Command>, dir: Direction }
            = { cost, path: [], dir: this.direction };
        visited[y][x] = visitedNode;

        // toVisit
        toVisit[cost] = [loc];

        let curr: typeof visitedNode;
        let currDir: Direction;

        while (estimateBtwnLoc(loc, goal) !== 0) {
            curr = visited[y][x];
            currDir = planningOnly ? visited[y][x].dir : this.direction;

            const makeNext = (locN: Location, dir: Direction) => {
                if (nextTileIsOkay(locN)) {
                        let [x,y] = locN;

                        if (notYetVisited(locN)) {
                            const cost = estimateBtwnLoc(locN, goal);
                            const { dir: resultDir, cmds } = this._convertDirToCmd([dir], currDir);

                            visited[y][x] = { cost, dir: resultDir, path: curr.path.concat(cmds) };
                            toVisit[cost] = toVisit.hasOwnProperty(cost)
                                ? toVisit[cost].concat([locN])
                                : [locN];
                        }
                }
            };
            // calc N
            makeNext([x,y-1], 'N');
            // calc S
            makeNext([x,y+1], 'S');
            // calc W
            makeNext([x-1,y], 'W');
            // calc E
            makeNext([x+1,y], 'E');

            // pick next move based on:
            //      - edge-cost = est cost to move (e.g. backtracking)
            //      - g-cost = already traveled node cost = path length on next node.
            //      - h-cost = next node cost = est distance to goal (of next node). i.e. benefit gained.
            const calcCost = (nodeLoc: Location, currLoc: Location): number => {
                // geo distances
                const estimateBtwnLoc = ([x,y]: Location, [x1,y1]: Location) => Math.abs(x1-x) + Math.abs(y1-y);
                const nodeToGoal = estimateBtwnLoc(nodeLoc, goal);
                const currToNode = estimateBtwnLoc(currLoc, nodeLoc);
                const startToNode = visited[y][x].path.length;

                // weights
                const e = 1;
                const g = planningOnly ? 1 : 0;
                const h = 1;

                return e * currToNode + g * startToNode + h * nodeToGoal;
            };

            const pickMin = (): Location | null => {
                const options = Object.keys(toVisit);
                if (options.length == 0) return null;

                const toFind: { minCost: number, toVisitKey: string | null, nextLoc: Location | null }
                     = { minCost: Infinity, toVisitKey: null, nextLoc: null };

                const { toVisitKey, nextLoc } = options.sort((a,b) => a < b ? -1 : 1)
                    .reduce((acc, nodeToGoal) => {
                        toVisit[nodeToGoal].forEach(locN => {
                            let [x,y] = locN;
                            const totalCost = calcCost(locN, loc);
                            if (acc.minCost > totalCost) {
                                acc.minCost = totalCost;
                                acc.nextLoc = locN;
                                acc.toVisitKey = nodeToGoal;
                            }
                        });
                        return acc;
                    }, toFind);
                
                if (!toVisitKey || !nextLoc) return null;

                // remove node from toVisit
                toVisit[toVisitKey] = toVisit[toVisitKey].filter(l => l !== nextLoc);
                if (toVisit[toVisitKey].length == 0)
                    delete toVisit[toVisitKey];

                return nextLoc;
            };
            let next = pickMin();

            // no solution
            if (!next)
                throw Robot.InvalidCmdException;
            else
                loc = next;

            // if planning only, do not move Robot.
            if (!planningOnly) {
                // @ts-ignore
                this.moveTo(loc, true, visited);
                loc = this.location;
            }

            x = loc[0];
            y = loc[1];
        }
        return planningOnly ? visited[y][x].path : [];
    }

    /*  Takes:
            - an array of directions [N,W,E,S,E,E]
            - a starting direction
        Returns:
            - an object: {
                cmd: array of rover commands,
                dir: final direction   
            }
    */
    _convertDirToCmd (directions: Array<Direction>, startDir = this.direction) {
        const cmds: Array<Command> = [];

        return [directions.reduce(({dir, ...acc}, d) => {
            const goal: number = Robot.orderedDir.indexOf(d);
            const cmds: Array<Command> = [];

            // rotate
            while (dir !== goal) {
                if (dir < goal) {
                    cmds.push('R');
                    dir++;
                } else {
                    cmds.push('L');
                    dir--;
                }
            }
            // advance
            cmds.push('F');

            return {
                dir,
                cmds: acc.cmds.concat(cmds)
            };
        }, { dir: Robot.orderedDir.indexOf(startDir), cmds })]
        .map(x => ({ ...x, dir: Robot.orderedDir[x.dir] }))[0];
    }
}

export { PhysicalWorld, Robot };